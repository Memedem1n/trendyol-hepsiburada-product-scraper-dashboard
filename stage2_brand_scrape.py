import argparse
import json
import logging
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, quote_plus, urljoin, urlparse

from scrapling.fetchers import Fetcher


NEGATIVE_STOCK_KEYWORDS = (
    "tukendi",
    "stokta yok",
    "satista yok",
    "out of stock",
)

WINDOW_JSON_RE = re.compile(
    r'^window\[(?P<q>["\'])(?P<name>.+?)(?P=q)\]\s*=\s*(?P<json>[\[{].*)$',
    re.S,
)

TRENDYOL_PRODUCT_PROP_PRIORITY = (
    "__envoy_product-detail__PROPS",
    "__envoy_product-actions__PROPS",
    "__envoy_product-info__PROPS",
    "__envoy_product-info-preview__PROPS",
    "__envoy_product-image-gallery__PROPS",
)

HEPSIBURADA_CURRENCY_MAP = {
    0: "TRY",
    1: "USD",
    2: "EUR",
}


@dataclass
class ListingItem:
    source: str
    page: int
    title_hint: str
    url: str
    dedupe_key: str


@dataclass
class ProductDetail:
    source: str
    page: int
    url: str
    title_hint: str
    status: int
    title: str
    price: float | None
    currency: str | None
    availability: str | None
    in_stock: bool | None
    is_on_sale: bool
    rating_score: float | None = None
    rating_count: int | None = None
    review_count: int | None = None
    favorite_count: int | None = None
    seller_name: str | None = None
    seller_id: str | None = None
    seller_score: float | None = None
    other_seller_count: int = 0
    other_sellers: list[dict[str, Any]] | None = None
    detail_columns: dict[str, Any] | None = None
    error: str | None = None


def _slug_to_title(url: str) -> str:
    path = urlparse(url).path.strip("/")
    if not path:
        return ""
    last = path.split("/")[-1]
    for token in ("-pm-", "-p-"):
        if token in last:
            last = last.split(token)[0]
            break
    return last.replace("-", " ").strip()


def _clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def _try_parse_price(value: Any) -> float | None:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)

    s = str(value).strip()
    if not s:
        return None

    s = s.replace("TL", "").replace("₺", "").strip()
    s = re.sub(r"[^0-9,.\-]", "", s)
    if not s:
        return None

    if "," in s and "." in s:
        if s.rfind(",") > s.rfind("."):
            s = s.replace(".", "").replace(",", ".")
        else:
            s = s.replace(",", "")
    elif "," in s:
        parts = s.split(",")
        if len(parts) == 2 and len(parts[-1]) in (1, 2):
            s = parts[0].replace(".", "") + "." + parts[1]
        else:
            s = s.replace(",", "")
    elif "." in s:
        parts = s.split(".")
        if len(parts) >= 2 and len(parts[-1]) in (1, 2):
            s = "".join(parts[:-1]) + "." + parts[-1]
        else:
            s = "".join(parts)

    s = re.sub(r"[^0-9.\-]", "", s)
    if not s:
        return None
    try:
        return float(s)
    except ValueError:
        return None


def _to_float(value: Any) -> float | None:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    try:
        return float(str(value).strip())
    except Exception:
        return None


def _to_int(value: Any) -> int | None:
    if value is None:
        return None
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return int(value)
    s = str(value).strip()
    if not s:
        return None
    s = re.sub(r"[^\d\-]", "", s)
    if not s:
        return None
    try:
        return int(s)
    except Exception:
        return None


def _normalize_currency(value: Any, source: str | None = None) -> str | None:
    if value is None:
        return None

    if isinstance(value, str):
        token = value.strip().upper()
        if not token:
            return None
        if token in {"TL", "TRY", "₺"}:
            return "TRY"
        return token

    if isinstance(value, (int, float)):
        code = int(value)
        if source == "hepsiburada":
            return HEPSIBURADA_CURRENCY_MAP.get(code, str(code))
        return str(code)

    return str(value).strip().upper() or None


def _get_nested(data: Any, path: list[Any], default: Any = None) -> Any:
    current = data
    for key in path:
        if isinstance(current, dict):
            if key not in current:
                return default
            current = current[key]
            continue
        if isinstance(current, list) and isinstance(key, int):
            if key < 0 or key >= len(current):
                return default
            current = current[key]
            continue
        return default
    return current


def _parse_window_json_payloads(page) -> dict[str, Any]:
    payloads: dict[str, Any] = {}
    for script_text in page.css("script::text").getall():
        text = str(script_text).strip()
        if not text:
            continue
        match = WINDOW_JSON_RE.match(text)
        if not match:
            continue
        body = match.group("json").strip()
        if body.endswith(";"):
            body = body[:-1]
        try:
            payloads[match.group("name")] = json.loads(body)
        except Exception:
            continue
    return payloads


def _parse_inline_json_blocks(page) -> list[Any]:
    blocks: list[Any] = []
    for script_text in page.css("script::text").getall():
        text = str(script_text).strip()
        if not text:
            continue
        if not (text.startswith("{") or text.startswith("[")):
            continue
        try:
            blocks.append(json.loads(text))
        except Exception:
            continue
    return blocks


def _flatten_for_columns(value: Any, prefix: str, out: dict[str, Any]) -> None:
    if isinstance(value, dict):
        if not value and prefix:
            out[prefix] = {}
            return
        for key, nested in value.items():
            key_str = str(key)
            next_prefix = f"{prefix}.{key_str}" if prefix else key_str
            _flatten_for_columns(nested, next_prefix, out)
        return

    if isinstance(value, list):
        key = prefix or "items"
        out[f"{key}.__count"] = len(value)
        if not value:
            return

        if all(not isinstance(item, (dict, list)) for item in value):
            out[key] = value
            return

        aggregated: dict[str, list[Any]] = {}
        for item in value:
            if isinstance(item, (dict, list)):
                nested_out: dict[str, Any] = {}
                _flatten_for_columns(item, "", nested_out)
                for nested_key, nested_value in nested_out.items():
                    list_key = f"{key}[].{nested_key}" if nested_key else f"{key}[]"
                    aggregated.setdefault(list_key, []).append(nested_value)
            else:
                aggregated.setdefault(f"{key}[]", []).append(item)
        out.update(aggregated)
        return

    if prefix:
        out[prefix] = value


def _price_from_trendyol_price_obj(price_obj: Any) -> tuple[float | None, str | None]:
    if not isinstance(price_obj, dict):
        return None, None

    currency = _normalize_currency(price_obj.get("currency"), "trendyol")
    for key in (
        "discountedPrice",
        "sellingPrice",
        "originalPrice",
        "buyingPrice",
        "couponApplicablePrice",
        "tyPlusCouponApplicablePrice",
        "discountedPriceAfterNoLimitPromotions",
        "rrp",
    ):
        node = price_obj.get(key)
        candidate = None
        if isinstance(node, dict):
            candidate = _try_parse_price(node.get("value"))
            if candidate is None:
                candidate = _try_parse_price(node.get("text"))
        else:
            candidate = _try_parse_price(node)
        if candidate is not None:
            return candidate, currency
    return None, currency


def _price_from_hepsiburada_prices(price_list: Any) -> tuple[float | None, str | None]:
    if not isinstance(price_list, list):
        return None, None

    for row in price_list:
        if not isinstance(row, dict):
            continue
        price_value = _try_parse_price(row.get("value"))
        if price_value is None:
            price_value = _try_parse_price(row.get("formattedPrice"))
        currency = _normalize_currency(row.get("currency"), "hepsiburada")
        if price_value is not None:
            return price_value, currency

    return None, None


def _extract_trendyol_other_sellers(other_merchants: Any) -> list[dict[str, Any]]:
    sellers: list[dict[str, Any]] = []
    if not isinstance(other_merchants, list):
        return sellers

    for merchant in other_merchants:
        if not isinstance(merchant, dict):
            continue

        price_value, currency = _price_from_trendyol_price_obj(merchant.get("price"))
        sellers.append(
            {
                "seller_id": merchant.get("id"),
                "seller_name": merchant.get("name"),
                "seller_score": _to_float(_get_nested(merchant, ["sellerScore", "value"])),
                "free_cargo": merchant.get("freeCargo"),
                "rush_delivery": merchant.get("rushDelivery"),
                "corporate_invoice_applicable": merchant.get("corporateInvoiceApplicable"),
                "url": merchant.get("url"),
                "price": price_value,
                "currency": currency,
                "discount_percentage": _to_float(_get_nested(merchant, ["price", "discountPercentage"])),
            }
        )

    return sellers


def _extract_hepsiburada_other_sellers(product: dict[str, Any]) -> list[dict[str, Any]]:
    sellers: list[dict[str, Any]] = []
    listings = product.get("listings")
    if not isinstance(listings, list):
        return sellers

    main_listing_id = str(product.get("listingId") or "")
    for listing in listings:
        if not isinstance(listing, dict):
            continue
        if main_listing_id and str(listing.get("listingId")) == main_listing_id:
            continue

        price_value, currency = _price_from_hepsiburada_prices(listing.get("prices"))
        sellers.append(
            {
                "seller_id": listing.get("merchantId"),
                "seller_name": listing.get("merchantName"),
                "seller_score": _to_float(_get_nested(listing, ["ratingSummary", "lifetimeRating"])),
                "seller_rating_count": _to_int(_get_nested(listing, ["ratingSummary", "ratingQuantity"])),
                "free_shipping": listing.get("freeShipping"),
                "fast_shipping": listing.get("fastShipping"),
                "shipment_day": listing.get("shipmentDay"),
                "is_fulfilled_by_hb": listing.get("isFulfilledByHB"),
                "url_postfix": _get_nested(listing, ["merchantInfo", "urlPostfix"]),
                "price": price_value,
                "currency": currency,
                "discount_rate": _to_float(listing.get("discountRate")),
            }
        )

    return sellers


def _empty_full_detail_bundle() -> dict[str, Any]:
    return {
        "fallback_price": None,
        "fallback_currency": None,
        "in_stock": None,
        "rating_score": None,
        "rating_count": None,
        "review_count": None,
        "favorite_count": None,
        "seller_name": None,
        "seller_id": None,
        "seller_score": None,
        "other_sellers": [],
        "detail_columns": {},
    }


def _extract_trendyol_full_detail(page) -> dict[str, Any]:
    payloads = _parse_window_json_payloads(page)

    product_container: dict[str, Any] | None = None
    for key in TRENDYOL_PRODUCT_PROP_PRIORITY:
        candidate = payloads.get(key)
        if isinstance(candidate, dict) and isinstance(candidate.get("product"), dict):
            product_container = candidate
            break

    if product_container is None:
        for candidate in payloads.values():
            if isinstance(candidate, dict) and isinstance(candidate.get("product"), dict):
                product_container = candidate
                break

    if not product_container:
        return _empty_full_detail_bundle()

    product = product_container.get("product")
    if not isinstance(product, dict):
        return _empty_full_detail_bundle()

    merchant_listing = product.get("merchantListing")
    if not isinstance(merchant_listing, dict):
        merchant_listing = {}

    winner_price, winner_currency = _price_from_trendyol_price_obj(_get_nested(merchant_listing, ["winnerVariant", "price"]))
    if winner_price is None:
        winner_price, winner_currency = _price_from_trendyol_price_obj(_get_nested(merchant_listing, ["otherMerchants", 0, "price"]))

    in_stock = None
    if isinstance(product.get("inStock"), bool):
        in_stock = product.get("inStock")
    else:
        winner_in_stock = _get_nested(merchant_listing, ["winnerVariant", "inStock"])
        if isinstance(winner_in_stock, bool):
            in_stock = winner_in_stock

    highlighted_review = payloads.get("__envoy_highlighted-review__PROPS")
    detail_source: dict[str, Any] = {"product": product}
    if isinstance(highlighted_review, dict):
        detail_source["highlighted_review"] = {
            "hasReview": highlighted_review.get("hasReview"),
            "hasSizeExpectation": highlighted_review.get("hasSizeExpectation"),
        }

    product_detail_props = payloads.get("__envoy_product-detail__PROPS")
    if isinstance(product_detail_props, dict) and product_detail_props.get("priceChanges") is not None:
        detail_source["price_changes"] = product_detail_props.get("priceChanges")

    detail_columns: dict[str, Any] = {}
    _flatten_for_columns(detail_source, "", detail_columns)

    return {
        "fallback_price": winner_price,
        "fallback_currency": winner_currency,
        "in_stock": in_stock,
        "rating_score": _to_float(product.get("ratingScore")),
        "rating_count": None,
        "review_count": None,
        "favorite_count": _to_int(product.get("favoriteCount")),
        "seller_name": _get_nested(merchant_listing, ["merchant", "name"]),
        "seller_id": _get_nested(merchant_listing, ["merchant", "id"]),
        "seller_score": _to_float(_get_nested(merchant_listing, ["merchant", "sellerScore", "value"])),
        "other_sellers": _extract_trendyol_other_sellers(merchant_listing.get("otherMerchants")),
        "detail_columns": detail_columns,
    }


def _extract_hepsiburada_full_detail(page) -> dict[str, Any]:
    inline_blocks = _parse_inline_json_blocks(page)

    largest_state: dict[str, Any] | None = None
    largest_size = -1
    for block in inline_blocks:
        if not isinstance(block, dict):
            continue
        product_state = block.get("productState")
        if not isinstance(product_state, dict):
            continue
        size = len(json.dumps(product_state, ensure_ascii=False))
        if size > largest_size:
            largest_size = size
            largest_state = block

    if not largest_state:
        return _empty_full_detail_bundle()

    product_state = largest_state.get("productState")
    if not isinstance(product_state, dict):
        return _empty_full_detail_bundle()

    product = product_state.get("product")
    if not isinstance(product, dict):
        return _empty_full_detail_bundle()

    price_value, currency = _price_from_hepsiburada_prices(product.get("prices"))

    seller_score = _to_float(_get_nested(product, ["merchant", "lifetimeRating"]))
    if seller_score is None:
        listing_id = str(product.get("listingId") or "")
        listings = product.get("listings")
        if isinstance(listings, list):
            for listing in listings:
                if isinstance(listing, dict) and str(listing.get("listingId")) == listing_id:
                    seller_score = _to_float(_get_nested(listing, ["ratingSummary", "lifetimeRating"]))
                    break

    detail_source: dict[str, Any] = {"product": product}
    for key in (
        "campaignDetail",
        "campaigns",
        "bundleCampaign",
        "otherSellersCampaigns",
        "otherSellerCoupon",
        "otherSellerCampaign",
        "allOtherSellerCampaign",
        "fashionReviewSummary",
        "deliveryTooltips",
        "activeVariant",
        "allVariantCombinations",
    ):
        if key in product_state:
            detail_source[key] = product_state.get(key)

    detail_columns: dict[str, Any] = {}
    _flatten_for_columns(detail_source, "", detail_columns)

    in_stock = product.get("isInStock") if isinstance(product.get("isInStock"), bool) else None

    reviews = product.get("reviews")
    review_score = _to_float(_get_nested(reviews, ["customerReviewScore"]))
    review_count = _to_int(_get_nested(reviews, ["customerReviewCount"]))

    return {
        "fallback_price": price_value,
        "fallback_currency": currency,
        "in_stock": in_stock,
        "rating_score": review_score,
        "rating_count": review_count,
        "review_count": review_count,
        "favorite_count": None,
        "seller_name": product.get("merchantName") or _get_nested(product, ["merchant", "name"]),
        "seller_id": product.get("merchantId") or _get_nested(product, ["merchant", "id"]),
        "seller_score": seller_score,
        "other_sellers": _extract_hepsiburada_other_sellers(product),
        "detail_columns": detail_columns,
    }


def _brand_matches(detail: ProductDetail, query: str) -> bool:
    token = query.strip().lower()
    if not token:
        return True

    haystacks = [
        detail.title.lower() if detail.title else "",
        detail.title_hint.lower() if detail.title_hint else "",
        urlparse(detail.url).path.lower(),
    ]
    return any(token in h for h in haystacks)


def _search_url(source: str, query: str, page: int) -> str:
    q = quote_plus(query.strip())
    if source == "trendyol":
        base = f"https://www.trendyol.com/sr?q={q}"
        return base if page == 1 else f"{base}&pi={page}"
    if source == "hepsiburada":
        base = f"https://www.hepsiburada.com/ara?q={q}"
        return base if page == 1 else f"{base}&sayfa={page}"
    raise ValueError(f"Unknown source: {source}")


def _paginate_url(base_url: str, key: str, page: int) -> str:
    if page == 1:
        return base_url
    sep = "&" if "?" in base_url else "?"
    return f"{base_url}{sep}{key}={page}"


def _extract_redirect_if_adservice(raw_href: str) -> str:
    parsed = urlparse(raw_href)
    if parsed.netloc != "adservice.hepsiburada.com":
        return raw_href

    query = parse_qs(parsed.query)
    redirect_url = query.get("redirect", [""])[0]
    return redirect_url or raw_href


def _is_product_url(source: str, parsed) -> bool:
    host = parsed.netloc.lower()
    path = parsed.path.lower()

    if source == "trendyol":
        if "trendyol.com" not in host:
            return False
        if "-p-" not in path:
            return False
        if "/kampanyalar/" in path:
            return False
        return True

    if source == "hepsiburada":
        if "hepsiburada.com" not in host:
            return False
        if "-pm-" not in path and "-p-" not in path:
            return False
        if "/ara" in path:
            return False
        return True

    return False


def _dedupe_key(source: str, parsed) -> str:
    path = parsed.path
    if source == "trendyol":
        q = parse_qs(parsed.query)
        merchant = q.get("merchantId", [""])[0]
        boutique = q.get("boutiqueId", [""])[0]
        return f"{parsed.netloc}{path}|m={merchant}|b={boutique}"
    return f"{parsed.netloc}{path}"


def _extract_listing_items(source: str, page_no: int, page_url: str, page) -> list[ListingItem]:
    items: list[ListingItem] = []
    seen: set[str] = set()

    for node in page.css("a"):
        href = node.attrib.get("href", "")
        if not href:
            continue

        href = _extract_redirect_if_adservice(href)
        abs_url = urljoin(page_url, href)
        parsed = urlparse(abs_url)
        if not _is_product_url(source, parsed):
            continue

        key = _dedupe_key(source, parsed)
        if key in seen:
            continue
        seen.add(key)

        title_hint = _clean_text(str(node.get_all_text(strip=True).clean(remove_entities=True)))
        if not title_hint or len(title_hint) > 120 or "ï¿½" in title_hint or "Ã„" in title_hint:
            title_hint = _slug_to_title(abs_url)

        items.append(
            ListingItem(
                source=source,
                page=page_no,
                title_hint=title_hint,
                url=abs_url,
                dedupe_key=key,
            )
        )

    return items


def collect_all_listing_items(
    source: str,
    query: str,
    max_pages: int,
    verify_ssl: bool,
    empty_page_stop: int = 2,
) -> list[ListingItem]:
    all_items: list[ListingItem] = []
    global_seen: set[str] = set()
    empty_streak = 0

    for page_no in range(1, max_pages + 1):
        url = _search_url(source, query, page_no)
        page = Fetcher.get(
            url,
            timeout=30,
            retries=2,
            retry_delay=1,
            verify=verify_ssl,
            follow_redirects=True,
            stealthy_headers=True,
        )
        if page.status >= 400:
            break

        page_items = _extract_listing_items(source, page_no, url, page)
        new_items = [item for item in page_items if item.dedupe_key not in global_seen]
        for item in new_items:
            global_seen.add(item.dedupe_key)

        if new_items:
            all_items.extend(new_items)
            empty_streak = 0
        else:
            empty_streak += 1

        if empty_streak >= empty_page_stop:
            break

    return all_items


def collect_from_brand_url(
    source: str,
    brand_url: str,
    max_pages: int,
    verify_ssl: bool,
    page_key: str,
    empty_page_stop: int = 2,
) -> list[ListingItem]:
    all_items: list[ListingItem] = []
    global_seen: set[str] = set()
    empty_streak = 0

    for page_no in range(1, max_pages + 1):
        url = _paginate_url(brand_url, page_key, page_no)
        page = Fetcher.get(
            url,
            timeout=30,
            retries=2,
            retry_delay=1,
            verify=verify_ssl,
            follow_redirects=True,
            stealthy_headers=True,
        )
        if page.status >= 400:
            break

        page_items = _extract_listing_items(source, page_no, url, page)
        new_items = [item for item in page_items if item.dedupe_key not in global_seen]
        for item in new_items:
            global_seen.add(item.dedupe_key)

        if new_items:
            all_items.extend(new_items)
            empty_streak = 0
        else:
            empty_streak += 1

        if empty_streak >= empty_page_stop:
            break

    return all_items


def _iter_jsonld_objects(page) -> list[dict[str, Any]]:
    scripts = page.css('script[type*="ld+json"]::text').getall()
    objects: list[dict[str, Any]] = []

    def push_obj(value: Any) -> None:
        if isinstance(value, dict):
            objects.append(value)
            graph = value.get("@graph")
            if isinstance(graph, list):
                for node in graph:
                    if isinstance(node, dict):
                        objects.append(node)
        elif isinstance(value, list):
            for x in value:
                push_obj(x)

    for script in scripts:
        text = str(script).strip()
        if not text:
            continue
        try:
            parsed = json.loads(text)
        except Exception:
            continue
        push_obj(parsed)

    return objects


def _extract_product_info_from_jsonld(page) -> tuple[str | None, float | None, str | None, str | None]:
    title = None
    price = None
    currency = None
    availability = None

    for obj in _iter_jsonld_objects(page):
        typ = obj.get("@type")
        if isinstance(typ, list):
            typ_set = set(str(x) for x in typ)
        else:
            typ_set = {str(typ)} if typ is not None else set()

        if "Product" not in typ_set and "ProductGroup" not in typ_set:
            continue

        if not title and obj.get("name"):
            title = _clean_text(str(obj.get("name")))

        offers = obj.get("offers")
        offer_obj = None
        if isinstance(offers, dict):
            offer_obj = offers
        elif isinstance(offers, list) and offers:
            first_offer = offers[0]
            if isinstance(first_offer, dict):
                offer_obj = first_offer

        if offer_obj:
            if price is None:
                price = _try_parse_price(offer_obj.get("price"))
            if not currency:
                currency = _normalize_currency(offer_obj.get("priceCurrency"))
            if not availability:
                availability = offer_obj.get("availability")

        if price is not None and availability:
            break

    return title, price, currency, availability


def _extract_aggregate_rating_from_jsonld(page) -> tuple[float | None, int | None]:
    for obj in _iter_jsonld_objects(page):
        typ = obj.get("@type")
        if isinstance(typ, list):
            typ_set = set(str(x) for x in typ)
        else:
            typ_set = {str(typ)} if typ is not None else set()

        if "Product" not in typ_set and "ProductGroup" not in typ_set:
            continue

        aggregate = obj.get("aggregateRating")
        if not isinstance(aggregate, dict):
            continue

        rating_score = _to_float(aggregate.get("ratingValue"))
        rating_count = _to_int(aggregate.get("ratingCount"))
        if rating_score is not None or rating_count is not None:
            return rating_score, rating_count

    return None, None


def _is_in_stock(availability: str | None, page_text_lower: str) -> bool:
    if availability:
        a = availability.lower()
        if "instock" in a:
            return True
        if "outofstock" in a:
            return False
        if "soldout" in a:
            return False

    for kw in NEGATIVE_STOCK_KEYWORDS:
        if kw in page_text_lower:
            return False
    return True


def fetch_product_detail(item: ListingItem, verify_ssl: bool, full_detail: bool) -> ProductDetail:
    try:
        page = Fetcher.get(
            item.url,
            timeout=30,
            retries=2,
            retry_delay=1,
            verify=verify_ssl,
            follow_redirects=True,
            stealthy_headers=True,
        )
    except Exception as exc:
        return ProductDetail(
            source=item.source,
            page=item.page,
            url=item.url,
            title_hint=item.title_hint,
            status=0,
            title=item.title_hint,
            price=None,
            currency=None,
            availability=None,
            in_stock=None,
            is_on_sale=False,
            other_sellers=[],
            detail_columns={},
            error=f"{type(exc).__name__}: {exc}",
        )

    title, price, currency, availability = _extract_product_info_from_jsonld(page)
    jsonld_rating_score, jsonld_rating_count = _extract_aggregate_rating_from_jsonld(page)

    page_title = _clean_text(str(page.css("title::text").get("") or ""))
    if not title:
        title = item.title_hint or _slug_to_title(item.url) or page_title

    bundle = _empty_full_detail_bundle()
    if full_detail:
        if item.source == "trendyol":
            bundle = _extract_trendyol_full_detail(page)
        elif item.source == "hepsiburada":
            bundle = _extract_hepsiburada_full_detail(page)

    if price is None and bundle["fallback_price"] is not None:
        price = bundle["fallback_price"]
    if not currency and bundle["fallback_currency"]:
        currency = bundle["fallback_currency"]
    currency = _normalize_currency(currency, item.source)

    rating_score = bundle["rating_score"] if bundle["rating_score"] is not None else jsonld_rating_score
    rating_count = bundle["rating_count"] if bundle["rating_count"] is not None else jsonld_rating_count
    review_count = bundle["review_count"] if bundle["review_count"] is not None else rating_count

    body_text = _clean_text(str(page.get_all_text(strip=True))).lower()
    stock_from_page = _is_in_stock(availability, body_text)
    in_stock = bundle["in_stock"] if bundle["in_stock"] is not None else stock_from_page
    is_on_sale = page.status == 200 and bool(in_stock) and (price is not None)

    other_sellers = bundle["other_sellers"] if full_detail else []
    detail_columns = bundle["detail_columns"] if full_detail else {}

    return ProductDetail(
        source=item.source,
        page=item.page,
        url=item.url,
        title_hint=item.title_hint,
        status=page.status,
        title=title,
        price=price,
        currency=currency,
        availability=availability,
        in_stock=in_stock,
        is_on_sale=is_on_sale,
        rating_score=rating_score,
        rating_count=rating_count,
        review_count=review_count,
        favorite_count=bundle["favorite_count"],
        seller_name=bundle["seller_name"],
        seller_id=bundle["seller_id"],
        seller_score=bundle["seller_score"],
        other_seller_count=len(other_sellers),
        other_sellers=other_sellers,
        detail_columns=detail_columns,
    )


def run_details(items: list[ListingItem], verify_ssl: bool, workers: int, full_detail: bool) -> list[ProductDetail]:
    if not items:
        return []

    details: list[ProductDetail] = []
    with ThreadPoolExecutor(max_workers=max(1, workers)) as executor:
        futures = [executor.submit(fetch_product_detail, item, verify_ssl, full_detail) for item in items]
        for fut in as_completed(futures):
            details.append(fut.result())
    return details


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Stage-2 scrape: list urunleri topla, urun sayfasindan fiyat/stok/detay cek, satista olanlari filtrele."
    )
    parser.add_argument("--query", default="sample-brand", help="Marka veya arama kelimesi (varsayilan: sample-brand)")
    parser.add_argument("--max-pages-trendyol", type=int, default=40)
    parser.add_argument("--max-pages-hepsiburada", type=int, default=20)
    parser.add_argument(
        "--trendyol-brand-url",
        default="",
        help="Trendyol marka URL'si (ornek: https://www.trendyol.com/sample-brand-x-b000)",
    )
    parser.add_argument(
        "--hepsiburada-brand-url",
        default="",
        help="Hepsiburada magaza URL'si (ornek: https://www.hepsiburada.com/magaza/sample-brand)",
    )
    parser.add_argument("--workers", type=int, default=8, help="Ikinci asama urun fetch paralelligi")
    parser.add_argument(
        "--verify-ssl",
        action="store_true",
        default=False,
        help="SSL sertifika dogrulamasini ac (bu ortamda kapali tutmak gerekebilir)",
    )
    parser.add_argument(
        "--full-detail",
        action="store_true",
        default=False,
        help="Detay kolonlari, diger saticilar ve yildiz/yorum verilerini cikar",
    )
    parser.add_argument("--output", default="stage2_brand_output.json", help="JSON cikti dosyasi")
    args = parser.parse_args()
    logging.getLogger("scrapling").setLevel(logging.ERROR)

    collected: dict[str, list[ListingItem]] = {}
    if args.trendyol_brand_url:
        collected["trendyol"] = collect_from_brand_url(
            "trendyol",
            args.trendyol_brand_url,
            max_pages=max(1, args.max_pages_trendyol),
            verify_ssl=args.verify_ssl,
            page_key="pi",
        )
    else:
        collected["trendyol"] = collect_all_listing_items(
            "trendyol",
            args.query,
            max(1, args.max_pages_trendyol),
            verify_ssl=args.verify_ssl,
        )

    if args.hepsiburada_brand_url:
        collected["hepsiburada"] = collect_from_brand_url(
            "hepsiburada",
            args.hepsiburada_brand_url,
            max_pages=max(1, args.max_pages_hepsiburada),
            verify_ssl=args.verify_ssl,
            page_key="sayfa",
        )
    else:
        collected["hepsiburada"] = collect_all_listing_items(
            "hepsiburada",
            args.query,
            max(1, args.max_pages_hepsiburada),
            verify_ssl=args.verify_ssl,
        )

    seeds = collected["trendyol"] + collected["hepsiburada"]
    details = run_details(seeds, verify_ssl=args.verify_ssl, workers=args.workers, full_detail=args.full_detail)
    on_sale = [d for d in details if d.is_on_sale and _brand_matches(d, args.query)]

    schema_columns = sorted({k for d in on_sale for k in (d.detail_columns or {}).keys()})
    products_with_other_sellers = len([d for d in on_sale if d.other_seller_count > 0])
    other_seller_rows = sum(d.other_seller_count for d in on_sale)

    payload = {
        "query": args.query,
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "settings": {
            "verify_ssl": args.verify_ssl,
            "workers": args.workers,
            "max_pages_trendyol": args.max_pages_trendyol,
            "max_pages_hepsiburada": args.max_pages_hepsiburada,
            "trendyol_brand_url": args.trendyol_brand_url,
            "hepsiburada_brand_url": args.hepsiburada_brand_url,
            "full_detail": args.full_detail,
        },
        "listing_totals": {
            "trendyol": len(collected["trendyol"]),
            "hepsiburada": len(collected["hepsiburada"]),
            "all": len(seeds),
        },
        "detail_totals": {
            "fetched": len(details),
            "on_sale": len(on_sale),
            "failed": len([d for d in details if d.error or d.status >= 400]),
        },
        "detail_schema": {
            "column_count": len(schema_columns),
            "columns": schema_columns,
        },
        "other_seller_totals": {
            "products_with_other_sellers": products_with_other_sellers,
            "other_seller_rows": other_seller_rows,
        },
        "on_sale_products": [asdict(d) for d in on_sale],
    }

    output_path = Path(args.output)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"query={args.query}")
    print(f"listing: trendyol={len(collected['trendyol'])} hepsiburada={len(collected['hepsiburada'])} all={len(seeds)}")
    print(
        f"details: fetched={len(details)} on_sale={len(on_sale)} "
        f"failed={len([d for d in details if d.error or d.status >= 400])} full_detail={args.full_detail}"
    )
    print(f"schema_columns={len(schema_columns)} other_seller_rows={other_seller_rows}")
    print(f"saved={output_path.resolve()}")


if __name__ == "__main__":
    main()
