import argparse
import json
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable
from urllib.parse import urljoin, urlparse

from scrapling.fetchers import Fetcher


@dataclass
class Product:
    title: str
    url: str
    source: str


@dataclass
class ScrapeResult:
    source: str
    url: str
    status: int
    total_links: int
    products: list[Product]


def _slug_to_title(url: str) -> str:
    path = urlparse(url).path.strip("/")
    if not path:
        return ""
    last = path.split("/")[-1]
    if "-p-" in last:
        last = last.split("-p-")[0]
    return last.replace("-", " ").strip()


def _to_absolute(base_url: str, href: str) -> str:
    return urljoin(base_url, href)


def _is_product_link(url: str, host: str) -> bool:
    parsed = urlparse(url)
    if not parsed.netloc.endswith(host):
        return False
    path = parsed.path.lower()
    if "-p-" not in path:
        return False
    if "/kampanyalar/" in path:
        return False
    if "/adservice/" in path:
        return False
    return True


def _iter_product_nodes(page, base_url: str, host: str) -> Iterable[tuple[str, str]]:
    seen: set[str] = set()
    for node in page.css('a[href*="-p-"]'):
        href = node.attrib.get("href", "")
        if not href:
            continue

        abs_url = _to_absolute(base_url, href)
        parsed = urlparse(abs_url)
        normalized_url = parsed._replace(query="", fragment="").geturl()
        if normalized_url in seen:
            continue

        if not _is_product_link(abs_url, host):
            continue

        seen.add(normalized_url)
        raw_title = node.get_all_text(strip=True).clean(remove_entities=True)
        title = str(raw_title).strip() if raw_title else ""
        slug_title = _slug_to_title(abs_url)
        if len(title) < 8 or len(title) > 100 or "Ä" in title or "�" in title:
            title = slug_title
        yield normalized_url, title


def scrape_search_page(source: str, search_url: str, host: str, limit: int, verify: bool) -> ScrapeResult:
    page = Fetcher.get(
        search_url,
        timeout=30,
        retries=2,
        retry_delay=1,
        verify=verify,
        follow_redirects=True,
        stealthy_headers=True,
    )

    products: list[Product] = []
    total_links = 0
    for product_url, title in _iter_product_nodes(page, search_url, host):
        total_links += 1
        if len(products) < limit:
            products.append(Product(title=title, url=product_url, source=source))

    return ScrapeResult(
        source=source,
        url=search_url,
        status=page.status,
        total_links=total_links,
        products=products,
    )


def build_urls(query: str) -> dict[str, tuple[str, str]]:
    encoded = query.strip().replace(" ", "+")
    return {
        "trendyol": (f"https://www.trendyol.com/sr?q={encoded}", "trendyol.com"),
        "hepsiburada": (f"https://www.hepsiburada.com/ara?q={encoded}", "hepsiburada.com"),
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Scrapling PoC: Trendyol + Hepsiburada arama sayfalarindan urun linkleri ve basliklari cek."
    )
    parser.add_argument("--query", default="iphone", help="Arama kelimesi (varsayilan: iphone)")
    parser.add_argument("--limit", type=int, default=20, help="Site basi dondurulecek maksimum urun sayisi")
    parser.add_argument(
        "--verify-ssl",
        action="store_true",
        default=False,
        help="SSL sertifika dogrulamasi acik olsun (bu ortamda kapali tutmak gerekebilir)",
    )
    parser.add_argument("--output", default="scrape_output.json", help="JSON cikti dosyasi")
    args = parser.parse_args()

    urls = build_urls(args.query)
    results: list[ScrapeResult] = []
    for source, (url, host) in urls.items():
        result = scrape_search_page(
            source=source,
            search_url=url,
            host=host,
            limit=max(1, args.limit),
            verify=args.verify_ssl,
        )
        results.append(result)

    payload = {
        "query": args.query,
        "sites": [
            {
                "source": r.source,
                "url": r.url,
                "status": r.status,
                "total_links": r.total_links,
                "returned": len(r.products),
                "products": [asdict(p) for p in r.products],
            }
            for r in results
        ],
    }

    output_path = Path(args.output)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    for site in payload["sites"]:
        print(f"{site['source']}: status={site['status']} returned={site['returned']} total_links={site['total_links']}")
    print(f"Saved: {output_path.resolve()}")


if __name__ == "__main__":
    main()
