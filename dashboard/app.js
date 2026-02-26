const DEFAULT_DATA_PATH = "../examples/sample_stage2_full_detail_output.json";
const DEFAULT_RATES_PATH = "./config/manual_rates.tr.json";
const PLACEHOLDER_THUMB =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 72 72'%3E%3Crect width='72' height='72' fill='%23131f26'/%3E%3Cpath d='M10 54l14-16 10 12 8-10 20 24H10z' fill='%23385a66'/%3E%3Ccircle cx='26' cy='24' r='6' fill='%23618a98'/%3E%3C/svg%3E";
const FAVORITES_STORAGE_KEY = "scraper_favorites_v1";
const COMPARE_STORAGE_KEY = "scraper_compare_v1";
const DESI_OVERRIDE_STORAGE_KEY = "scraper_desi_override_v1";
const PROFIT_SETTINGS_STORAGE_KEY = "scraper_profit_settings_v1";
const PURCHASE_OVERRIDE_STORAGE_KEY = "scraper_purchase_override_v1";
const UI_STATE_STORAGE_KEY = "scraper_ui_state_v1";

const QUICK_NUMERIC_DEFS = [
  { key: "price", label: "Fiyat" },
  { key: "purchase_price_tl", label: "Alis Fiyati" },
  { key: "max_buy_price_for_target_profit_tl", label: "Maks Alis Fiyati" },
  { key: "net_after_fee_tl", label: "Net Kalan" },
  { key: "net_profit_after_purchase_tl", label: "Net Kar (Alis Sonrasi)" },
  { key: "profit_ratio_pct", label: "Kar Orani (%)" },
  { key: "shipping_estimated_tl", label: "Tahmini Kargo" },
  { key: "commission_amount_tl", label: "Komisyon Tutar" },
  { key: "estimated_desi", label: "Tahmini Desi" },
  { key: "sales_signal_value", label: "Satis Sinyal Degeri" },
  { key: "rating_score", label: "Yildiz Puani" },
  { key: "other_seller_count", label: "Diger Satici Sayisi" },
  { key: "seller_score", label: "Satici Skoru" },
];

const DEFAULT_VISIBLE_COLUMNS = [
  "source",
  "title",
  "badges_text",
  "price",
  "purchase_price_tl",
  "estimated_desi",
  "shipping_estimated_tl",
  "commission_rate_pct",
  "commission_amount_tl",
  "net_after_fee_tl",
  "net_profit_after_purchase_tl",
  "profit_ratio_pct",
  "net_positive_after_purchase",
  "max_buy_price_for_target_profit_tl",
  "profit_floor_pass_target",
  "sales_signal_type",
  "sales_signal_value",
  "currency",
  "rating_score",
  "review_count",
  "seller_name",
  "seller_score",
  "other_seller_count",
  "is_on_sale",
  "url",
];

const COLUMN_LABELS = {
  source: "Kaynak",
  page: "Sayfa",
  title: "Urun Basligi",
  title_hint: "Baslik Ipuclari",
  price: "Fiyat",
  currency: "Para Birimi",
  availability: "Stok Durumu (Schema)",
  in_stock: "Stokta",
  is_on_sale: "Satista",
  rating_score: "Yildiz Puani",
  rating_count: "Puanlama Sayisi",
  review_count: "Yorum Sayisi",
  favorite_count: "Favori Sayisi",
  seller_name: "Ana Satici",
  seller_id: "Ana Satici ID",
  seller_score: "Ana Satici Skoru",
  other_seller_count: "Diger Satici Sayisi",
  other_sellers_names: "Diger Satici Isimleri",
  other_sellers_min_price: "Diger Satici Min Fiyat",
  other_sellers_max_price: "Diger Satici Max Fiyat",
  other_sellers_avg_score: "Diger Satici Ortalama Skor",
  thumbnail_url: "Urun Gorseli",
  badges_text: "Badge",
  badges_count: "Badge Sayisi",
  official_supplier_warning: "Resmi Satici/Tedarikci",
  official_supplier_text: "Resmi Satici/Tedarikci Uyarisi",
  estimated_desi: "Tahmini Desi",
  desi_confidence: "Desi Guven Seviyesi",
  shipping_estimated_tl: "Tahmini Kargo (TL)",
  commission_category_key: "Komisyon Kategori Anahtari",
  commission_rate_pct: "Komisyon Orani (%)",
  commission_amount_tl: "Komisyon Tutari (TL)",
  other_fee_tl: "Ek Kesinti (TL)",
  net_after_fee_tl: "Kesinti Sonrasi Net (TL)",
  purchase_price_tl: "Alis Fiyati (TL)",
  net_profit_after_purchase_tl: "Alis Sonrasi Net Kar (TL)",
  profit_ratio_pct: "Alis Sonrasi Kar Orani (%)",
  net_positive_after_purchase: "Alis Sonrasi Net Pozitif",
  target_profit_pct: "Hedef Kar (%)",
  max_buy_price_for_target_profit_tl: "Hedef Kara Gore Maks Alis (TL)",
  profit_floor_pass_target: "Hedef Kar Gecti",
  sales_signal_type: "Satis Sinyali Tipi",
  sales_signal_value: "Satis Sinyali Degeri",
  sales_signal_note: "Satis Sinyali Notu",
  is_favorite: "Favori",
  is_selected_compare: "Karsilastirmada",
  url: "Urun URL",
  status: "HTTP Status",
  error: "Hata",
};

const FILTER_BLOCKLIST_EXACT = new Set([
  "row_id",
  "title_hint",
  "url",
  "thumbnail_url",
  "seller_id",
  "error",
  "status",
  "availability",
  "badges_index",
  "row_key",
]);

const FILTER_BLOCKLIST_PATTERNS = [
  /__json$/i,
  /__list$/i,
  /\.id$/i,
  /\.url$/i,
  /filterablelabelids/i,
  /classificationgroupid/i,
  /propertyurl/i,
  /tagid/i,
  /stickerids/i,
  /registeredemailaddress/i,
  /taxnumber/i,
  /canonical/i,
  /barcode/i,
  /sku/i,
  /slugname/i,
  /logo/i,
  /imageurl/i,
  /media\[\]\.url/i,
];

const FILTER_DETAIL_ALLOW =
  /(brand\.name|category\.name|campaign|badge|instock|stock|shipment|delivery|freeshipping|fastshipping|isfulfilled|discountrate|rating|review|merchant\.(name|city|country|labelname)|iscampaign|dealoftheday|isbundle|ispreorder|isproductlive|isclosedproduct|hasmorelistings|taglabelpaymentoptions\[\]\.tagname|winnercampaignname|paymenttag)/i;

const state = {
  datasetName: "",
  rows: [],
  filteredRows: [],
  columns: [],
  columnMeta: {},
  filterColumns: [],
  sourceOptions: [],
  selectedSources: new Set(),
  badgeOptions: [],
  selectedBadges: new Set(),
  searchText: "",
  quickNumeric: {},
  filters: [],
  visibleColumns: [],
  sort: { column: null, direction: null },
  page: 1,
  pageSize: 40,
  nextFilterId: 1,
  ratesConfig: null,
  profitSettings: {
    targetProfitPct: 50,
    extraFeeTl: 0,
    fallbackCommissionPct: 18,
    fallbackShippingTl: 39,
    onlyPositiveNet: false,
  },
  favorites: new Set(),
  compareSelection: new Set(),
  manualDesiOverrides: {},
  purchasePriceOverrides: {},
  uiSnapshot: {},
};

const el = {};

window.addEventListener("DOMContentLoaded", () => {
  void initializeApp();
});

async function initializeApp() {
  cacheElements();
  hydratePersistentState();
  bindEvents();
  await loadManualRates();
  renderProfitControls();
  renderComparePanel();
  void loadDefaultData();
}

function cacheElements() {
  el.stats = document.getElementById("stats");
  el.datasetInfo = document.getElementById("datasetInfo");
  el.searchInput = document.getElementById("searchInput");
  el.sourceFilters = document.getElementById("sourceFilters");
  el.badgeFilters = document.getElementById("badgeFilters");
  el.clearBadgeFilterBtn = document.getElementById("clearBadgeFilterBtn");
  el.quickNumericFilters = document.getElementById("quickNumericFilters");
  el.advancedFilters = document.getElementById("advancedFilters");
  el.addFilterBtn = document.getElementById("addFilterBtn");
  el.columnPicker = document.getElementById("columnPicker");
  el.addVisibleColumnBtn = document.getElementById("addVisibleColumnBtn");
  el.visibleColumns = document.getElementById("visibleColumns");
  el.resetFiltersBtn = document.getElementById("resetFiltersBtn");
  el.exportCsvBtn = document.getElementById("exportCsvBtn");
  el.resultSummary = document.getElementById("resultSummary");
  el.pager = document.getElementById("pager");
  el.tableWrap = document.getElementById("tableWrap");
  el.comparePanel = document.getElementById("comparePanel");
  el.reloadDefaultBtn = document.getElementById("reloadDefaultBtn");
  el.fileInput = document.getElementById("fileInput");
  el.targetProfitInput = document.getElementById("targetProfitInput");
  el.extraFeeInput = document.getElementById("extraFeeInput");
  el.fallbackCommissionInput = document.getElementById("fallbackCommissionInput");
  el.fallbackShippingInput = document.getElementById("fallbackShippingInput");
  el.profitOnlyToggle = document.getElementById("profitOnlyToggle");
  el.ratesInfo = document.getElementById("ratesInfo");

  el.detailModal = document.getElementById("detailModal");
  el.closeModalBtn = document.getElementById("closeModalBtn");
  el.detailSummary = document.getElementById("detailSummary");
  el.otherSellersWrap = document.getElementById("otherSellersWrap");
  el.detailJson = document.getElementById("detailJson");
  el.detailTitle = document.getElementById("detailTitle");
}

function bindEvents() {
  el.reloadDefaultBtn.addEventListener("click", () => {
    void loadDefaultData();
  });

  el.fileInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || ""));
        ingestDataset(parsed, file.name);
      } catch (error) {
        setDatasetInfo(`JSON okunamadi: ${String(error)}`);
      }
    };
    reader.onerror = () => {
      setDatasetInfo("Dosya okunamadi.");
    };
    reader.readAsText(file, "utf-8");
  });

  el.searchInput.addEventListener("input", (event) => {
    state.searchText = String(event.target.value || "").trim().toLowerCase();
    state.page = 1;
    applyFilters();
  });

  el.targetProfitInput.addEventListener("input", () => {
    const next = toNumber(el.targetProfitInput.value);
    state.profitSettings.targetProfitPct = clampNumber(next ?? 50, 1, 400);
    persistProfitSettings();
    recomputeDerivedAndRefresh();
  });

  el.extraFeeInput.addEventListener("input", () => {
    const next = toNumber(el.extraFeeInput.value);
    state.profitSettings.extraFeeTl = clampNumber(next ?? 0, 0, 1000000);
    persistProfitSettings();
    recomputeDerivedAndRefresh();
  });

  el.fallbackCommissionInput.addEventListener("input", () => {
    const next = toNumber(el.fallbackCommissionInput.value);
    state.profitSettings.fallbackCommissionPct = clampNumber(next ?? 0, 0, 100);
    persistProfitSettings();
    recomputeDerivedAndRefresh();
  });

  el.fallbackShippingInput.addEventListener("input", () => {
    const next = toNumber(el.fallbackShippingInput.value);
    state.profitSettings.fallbackShippingTl = clampNumber(next ?? 0, 0, 1000000);
    persistProfitSettings();
    recomputeDerivedAndRefresh();
  });

  el.profitOnlyToggle.addEventListener("change", () => {
    state.profitSettings.onlyPositiveNet = Boolean(el.profitOnlyToggle.checked);
    persistProfitSettings();
    state.page = 1;
    applyFilters();
  });

  el.clearBadgeFilterBtn.addEventListener("click", () => {
    if (state.selectedBadges.size === 0) return;
    state.selectedBadges.clear();
    state.page = 1;
    renderBadgeFilters();
    applyFilters();
  });

  el.addFilterBtn.addEventListener("click", () => {
    addAdvancedFilter();
  });

  el.addVisibleColumnBtn.addEventListener("click", () => {
    const column = el.columnPicker.value;
    if (!column) return;
    if (!state.visibleColumns.includes(column)) {
      state.visibleColumns.push(column);
      renderVisibleColumns();
      renderTable();
      persistUiState();
    }
  });

  el.resetFiltersBtn.addEventListener("click", () => {
    resetFilters();
  });

  el.exportCsvBtn.addEventListener("click", () => {
    exportFilteredCsv();
  });

  el.closeModalBtn.addEventListener("click", closeModal);
  el.detailModal.addEventListener("click", (event) => {
    if (event.target === el.detailModal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !el.detailModal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

function hydratePersistentState() {
  state.favorites = new Set(readArrayFromStorage(FAVORITES_STORAGE_KEY));
  state.compareSelection = new Set(readArrayFromStorage(COMPARE_STORAGE_KEY));
  state.manualDesiOverrides = readObjectFromStorage(DESI_OVERRIDE_STORAGE_KEY);
  state.purchasePriceOverrides = readObjectFromStorage(PURCHASE_OVERRIDE_STORAGE_KEY);
  state.uiSnapshot = readObjectFromStorage(UI_STATE_STORAGE_KEY);

  const savedSettings = readObjectFromStorage(PROFIT_SETTINGS_STORAGE_KEY);
  if (isPlainObject(savedSettings)) {
    state.profitSettings.targetProfitPct = clampNumber(toNumber(savedSettings.targetProfitPct) ?? 50, 1, 400);
    state.profitSettings.extraFeeTl = clampNumber(toNumber(savedSettings.extraFeeTl) ?? 0, 0, 1000000);
    state.profitSettings.fallbackCommissionPct = clampNumber(toNumber(savedSettings.fallbackCommissionPct) ?? 18, 0, 100);
    state.profitSettings.fallbackShippingTl = clampNumber(toNumber(savedSettings.fallbackShippingTl) ?? 39, 0, 1000000);
    state.profitSettings.onlyPositiveNet = Boolean(savedSettings.onlyPositiveNet);
  }
}

function readArrayFromStorage(key) {
  if (!key || typeof localStorage === "undefined") return [];
  try {
    const parsed = JSON.parse(String(localStorage.getItem(key) || "[]"));
    if (!Array.isArray(parsed)) return [];
    return parsed.map((entry) => String(entry)).filter(Boolean);
  } catch {
    return [];
  }
}

function readObjectFromStorage(key) {
  if (!key || typeof localStorage === "undefined") return {};
  try {
    const parsed = JSON.parse(String(localStorage.getItem(key) || "{}"));
    if (!isPlainObject(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

function persistFavorites() {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...state.favorites]));
  } catch {}
}

function persistCompareSelection() {
  try {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify([...state.compareSelection]));
  } catch {}
}

function persistDesiOverrides() {
  try {
    localStorage.setItem(DESI_OVERRIDE_STORAGE_KEY, JSON.stringify(state.manualDesiOverrides || {}));
  } catch {}
}

function persistPurchasePriceOverrides() {
  try {
    localStorage.setItem(PURCHASE_OVERRIDE_STORAGE_KEY, JSON.stringify(state.purchasePriceOverrides || {}));
  } catch {}
}

function persistProfitSettings() {
  try {
    localStorage.setItem(PROFIT_SETTINGS_STORAGE_KEY, JSON.stringify(state.profitSettings));
  } catch {}
}

function persistUiState() {
  try {
    localStorage.setItem(UI_STATE_STORAGE_KEY, JSON.stringify(buildUiSnapshot()));
  } catch {}
}

function buildUiSnapshot() {
  return {
    searchText: state.searchText || "",
    selectedSources: [...state.selectedSources],
    selectedBadges: [...state.selectedBadges],
    quickNumeric: Object.fromEntries(
      Object.entries(state.quickNumeric).map(([key, range]) => [
        key,
        {
          from: range?.from ?? null,
          to: range?.to ?? null,
        },
      ]),
    ),
    filters: state.filters.map((filter) => ({
      column: filter.column,
      kind: filter.kind,
      min: filter.min ?? null,
      max: filter.max ?? null,
      selected: [...(filter.selected || new Set())],
      optionSearch: filter.optionSearch || "",
    })),
    visibleColumns: [...state.visibleColumns],
    sort: state.sort && state.sort.column ? { column: state.sort.column, direction: state.sort.direction } : { column: null, direction: null },
    pageSize: state.pageSize,
  };
}

function applyUiSnapshotAfterIngest() {
  const snapshot = state.uiSnapshot;
  if (!isPlainObject(snapshot)) return;

  if (typeof snapshot.searchText === "string") {
    state.searchText = snapshot.searchText.trim().toLowerCase();
    el.searchInput.value = snapshot.searchText;
  }

  if (Array.isArray(snapshot.selectedSources)) {
    const nextSources = new Set(snapshot.selectedSources.filter((source) => state.sourceOptions.includes(source)));
    if (snapshot.selectedSources.length === 0 || nextSources.size > 0) {
      state.selectedSources = nextSources;
    }
  }

  if (Array.isArray(snapshot.selectedBadges)) {
    const availableBadgeKeys = new Set(state.badgeOptions.map((badge) => badge.key));
    state.selectedBadges = new Set(snapshot.selectedBadges.filter((badge) => availableBadgeKeys.has(badge)));
  }

  if (isPlainObject(snapshot.quickNumeric)) {
    for (const [key, savedRange] of Object.entries(snapshot.quickNumeric)) {
      if (!state.quickNumeric[key]) continue;
      if (!isPlainObject(savedRange)) continue;
      const from = toNumber(savedRange.from);
      const to = toNumber(savedRange.to);
      state.quickNumeric[key].from = from !== null ? from : null;
      state.quickNumeric[key].to = to !== null ? to : null;
    }
  }

  if (Array.isArray(snapshot.filters)) {
    const restoredFilters = [];
    for (const rawFilter of snapshot.filters) {
      if (!isPlainObject(rawFilter)) continue;
      const column = String(rawFilter.column || "");
      if (!column || !state.filterColumns.includes(column)) continue;
      const filter = createFilter(column);
      filter.min = rawFilter.min !== null && rawFilter.min !== undefined ? toNumber(rawFilter.min) : null;
      filter.max = rawFilter.max !== null && rawFilter.max !== undefined ? toNumber(rawFilter.max) : null;
      filter.optionSearch = String(rawFilter.optionSearch || "");

      if (Array.isArray(rawFilter.selected) && filter.kind === "category") {
        const validTokens = new Set((state.columnMeta[column]?.options || []).map((option) => option.value));
        filter.selected = new Set(rawFilter.selected.filter((token) => validTokens.has(token)));
      } else {
        filter.selected = new Set();
      }
      restoredFilters.push(filter);
    }
    state.filters = restoredFilters;
  }

  if (Array.isArray(snapshot.visibleColumns) && snapshot.visibleColumns.length) {
    const visible = snapshot.visibleColumns.filter((column) => state.columns.includes(column));
    if (visible.length) state.visibleColumns = visible;
  }

  if (isPlainObject(snapshot.sort)) {
    const sortColumn = String(snapshot.sort.column || "");
    const sortDir = snapshot.sort.direction === "desc" ? "desc" : "asc";
    if (sortColumn && state.columns.includes(sortColumn)) {
      state.sort = { column: sortColumn, direction: sortDir };
    }
  }

  const savedPageSize = toNumber(snapshot.pageSize);
  if (savedPageSize !== null && [20, 40, 80, 120].includes(savedPageSize)) {
    state.pageSize = savedPageSize;
  }
}

async function loadManualRates() {
  let payload = null;
  try {
    const response = await fetch(`${DEFAULT_RATES_PATH}?t=${Date.now()}`, { cache: "no-store" });
    if (response.ok) {
      payload = await response.json();
    }
  } catch {}
  state.ratesConfig = normalizeRatesConfig(payload);
  renderRatesInfo();
}

function defaultRatesConfig() {
  return {
    version: "1.0.0",
    effective_date: "2026-02-25",
    sources: ["trendyol", "hepsiburada"],
    references: [
      {
        title: "Hepsiburada - Komisyon Bilgisi Sorgulama",
        url: "https://developers.hepsiburada.com/hepsiburada/reference/komisyon-bilgisi-sorgulama",
      },
      {
        title: "Trendyol - Current Account Statement Integration",
        url: "https://developers.trendyol.com/v2.0/docs/current-account-statement-integration",
      },
      {
        title: "Trendyol - Cargo Invoice Details",
        url: "https://developers.trendyol.com/v2.0/docs/cargo-invoice-details",
      },
      {
        title: "Hepsiburada - Order Integration",
        url: "https://developers.hepsiburada.com/hepsiburada/reference/order-list",
      },
    ],
    defaults: {
      target_profit_pct: 50,
      commission_rate_pct: 18,
      shipping_tl: 39,
      other_fee_tl: 0,
    },
    commission_rates: [
      { source: "trendyol", category_key: "kozmetik", rate_pct: 18 },
      { source: "trendyol", category_key: "sac-bakim", rate_pct: 17 },
      { source: "trendyol", category_key: "dermokozmetik", rate_pct: 18 },
      { source: "hepsiburada", category_key: "kozmetik", rate_pct: 20 },
      { source: "hepsiburada", category_key: "sac-bakim", rate_pct: 19 },
      { source: "hepsiburada", category_key: "dermokozmetik", rate_pct: 20 },
    ],
    shipping_rates: [
      { source: "trendyol", desi_min: 0, desi_max: 1, price_tl: 39 },
      { source: "trendyol", desi_min: 1.01, desi_max: 2, price_tl: 49 },
      { source: "trendyol", desi_min: 2.01, desi_max: 3, price_tl: 59 },
      { source: "trendyol", desi_min: 3.01, desi_max: 5, price_tl: 69 },
      { source: "hepsiburada", desi_min: 0, desi_max: 1, price_tl: 42 },
      { source: "hepsiburada", desi_min: 1.01, desi_max: 2, price_tl: 52 },
      { source: "hepsiburada", desi_min: 2.01, desi_max: 3, price_tl: 62 },
      { source: "hepsiburada", desi_min: 3.01, desi_max: 5, price_tl: 74 },
    ],
  };
}

function normalizeRatesConfig(payload) {
  const fallback = defaultRatesConfig();
  if (!isPlainObject(payload)) return fallback;

  const normalized = {
    version: String(payload.version || fallback.version),
    effective_date: String(payload.effective_date || fallback.effective_date),
    sources: Array.isArray(payload.sources) ? payload.sources : fallback.sources,
    references: Array.isArray(payload.references) ? payload.references : fallback.references,
    defaults: isPlainObject(payload.defaults) ? payload.defaults : fallback.defaults,
    commission_rates: Array.isArray(payload.commission_rates) ? payload.commission_rates : fallback.commission_rates,
    shipping_rates: Array.isArray(payload.shipping_rates) ? payload.shipping_rates : fallback.shipping_rates,
  };

  const defaultProfit = toNumber(normalized.defaults?.target_profit_pct);
  const defaultCommission = toNumber(normalized.defaults?.commission_rate_pct);
  const defaultShipping = toNumber(normalized.defaults?.shipping_tl);
  const defaultOtherFee = toNumber(normalized.defaults?.other_fee_tl);

  if (!Number.isFinite(state.profitSettings.targetProfitPct)) {
    state.profitSettings.targetProfitPct = defaultProfit ?? 50;
  }
  if (!Number.isFinite(state.profitSettings.fallbackCommissionPct)) {
    state.profitSettings.fallbackCommissionPct = defaultCommission ?? 18;
  }
  if (!Number.isFinite(state.profitSettings.fallbackShippingTl)) {
    state.profitSettings.fallbackShippingTl = defaultShipping ?? 39;
  }
  if (!Number.isFinite(state.profitSettings.extraFeeTl)) {
    state.profitSettings.extraFeeTl = defaultOtherFee ?? 0;
  }
  return normalized;
}

function renderRatesInfo() {
  if (!el.ratesInfo) return;
  const cfg = state.ratesConfig;
  if (!cfg) {
    el.ratesInfo.textContent = "Oran tablosu yuklenemedi.";
    return;
  }
  const sourceCount = Array.isArray(cfg.sources) ? cfg.sources.length : 0;
  const commissionCount = Array.isArray(cfg.commission_rates) ? cfg.commission_rates.length : 0;
  const shippingCount = Array.isArray(cfg.shipping_rates) ? cfg.shipping_rates.length : 0;
  el.ratesInfo.textContent = `Oran seti: ${cfg.effective_date} | Kaynak: ${sourceCount} | Komisyon kaydi: ${commissionCount} | Kargo bandi: ${shippingCount}`;
}

function renderProfitControls() {
  if (!el.targetProfitInput) return;
  el.targetProfitInput.value = String(state.profitSettings.targetProfitPct);
  el.extraFeeInput.value = String(state.profitSettings.extraFeeTl);
  el.fallbackCommissionInput.value = String(state.profitSettings.fallbackCommissionPct);
  el.fallbackShippingInput.value = String(state.profitSettings.fallbackShippingTl);
  el.profitOnlyToggle.checked = Boolean(state.profitSettings.onlyPositiveNet);
  renderRatesInfo();
}

function recomputeDerivedAndRefresh() {
  if (!state.rows.length) {
    renderProfitControls();
    return;
  }

  const currentQuick = state.quickNumeric;
  const currentVisible = state.visibleColumns.slice();
  const currentFilters = state.filters;

  applyDerivedMetrics(state.rows);
  state.columns = collectColumns(state.rows);
  state.columnMeta = buildColumnMeta(state.rows, state.columns);
  state.filterColumns = buildFilterColumns(state.columns, state.columnMeta);
  state.quickNumeric = initQuickNumericRanges(currentQuick);
  state.visibleColumns = currentVisible.filter((column) => state.columns.includes(column));
  if (!state.visibleColumns.length) {
    state.visibleColumns = defaultVisibleColumns();
  }
  state.filters = currentFilters
    .filter((filter) => state.filterColumns.includes(filter.column))
    .map((filter) => refreshFilterByColumnMeta(filter));

  renderProfitControls();
  renderColumnPicker();
  renderVisibleColumns();
  renderQuickNumericFilters();
  renderAdvancedFilters();
  renderComparePanel();
  applyFilters();
}

function refreshFilterByColumnMeta(filter) {
  const meta = state.columnMeta[filter.column];
  if (!meta) return filter;
  if (meta.kind === "number") {
    return { ...filter, kind: "number" };
  }
  const nextSelected = new Set();
  for (const token of filter.selected || []) {
    if (meta.options.some((option) => option.value === token)) {
      nextSelected.add(token);
    }
  }
  return {
    ...filter,
    kind: "category",
    selected: nextSelected,
  };
}

async function loadDefaultData() {
  setDatasetInfo("Varsayilan dosya yukleniyor...");
  try {
    const response = await fetch(`${DEFAULT_DATA_PATH}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const parsed = await response.json();
    ingestDataset(parsed, `varsayilan: ${DEFAULT_DATA_PATH}`);
  } catch (error) {
    setDatasetInfo(`Varsayilan dosya acilamadi (${String(error)}). JSON Dosyasi Sec ile manuel yukleyebilirsin.`);
    clearDashboard();
  }
}

function ingestDataset(payload, datasetName) {
  const items = extractItems(payload);
  if (!items.length) {
    setDatasetInfo("Veri setinde urun bulunamadi.");
    clearDashboard();
    return;
  }

  state.datasetName = datasetName;
  state.rows = buildRows(items);
  applyDerivedMetrics(state.rows);
  state.columns = collectColumns(state.rows);
  state.columnMeta = buildColumnMeta(state.rows, state.columns);
  state.filterColumns = buildFilterColumns(state.columns, state.columnMeta);
  state.sourceOptions = [...new Set(state.rows.map((row) => String(row.source || "bilinmiyor")))].sort();
  state.selectedSources = new Set(state.sourceOptions);
  state.badgeOptions = buildBadgeOptions(state.rows);
  state.selectedBadges = new Set();
  state.quickNumeric = initQuickNumericRanges();
  state.filters = [];
  state.nextFilterId = 1;
  state.visibleColumns = defaultVisibleColumns();
  state.sort = { column: null, direction: null };
  state.page = 1;
  state.searchText = "";
  el.searchInput.value = "";

  applyUiSnapshotAfterIngest();

  renderProfitControls();
  renderSourceFilters();
  renderBadgeFilters();
  renderQuickNumericFilters();
  renderColumnPicker();
  renderVisibleColumns();
  renderAdvancedFilters();
  renderComparePanel();

  applyFilters();
  setDatasetInfo(
    `${datasetName} | Toplam urun: ${formatNumber(state.rows.length)} | Tum kolon: ${formatNumber(
      state.columns.length,
    )} | Filtre kolonu: ${formatNumber(state.filterColumns.length)}`,
  );
}

function extractItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.on_sale_products)) return payload.on_sale_products;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return [];
}

function buildRows(items) {
  return items.map((item, index) => {
    const row = {
      row_id: index + 1,
    };

    for (const [key, value] of Object.entries(item || {})) {
      if (key === "detail_columns" || key === "other_sellers") continue;
      if (isScalar(value)) {
        row[key] = value;
      }
    }

    const otherSellers = Array.isArray(item?.other_sellers) ? item.other_sellers : [];
    row.other_seller_count = typeof item?.other_seller_count === "number" ? item.other_seller_count : otherSellers.length;

    if (otherSellers.length) {
      const sellerNames = otherSellers
        .map((seller) => (seller && seller.seller_name ? String(seller.seller_name) : ""))
        .filter(Boolean);
      if (sellerNames.length) {
        row.other_sellers_names = sellerNames.join(" | ");
      }

      const prices = otherSellers
        .map((seller) => toNumber(seller?.price))
        .filter((value) => value !== null);
      if (prices.length) {
        row.other_sellers_min_price = Math.min(...prices);
        row.other_sellers_max_price = Math.max(...prices);
      }

      const sellerScores = otherSellers
        .map((seller) => toNumber(seller?.seller_score))
        .filter((value) => value !== null);
      if (sellerScores.length) {
        row.other_sellers_avg_score = average(sellerScores);
      }
    }

    const detailColumns = item?.detail_columns;
    if (detailColumns && typeof detailColumns === "object" && !Array.isArray(detailColumns)) {
      for (const [key, value] of Object.entries(detailColumns)) {
        const colKey = `dc.${key}`;
        if (isScalar(value)) {
          row[colKey] = value;
          continue;
        }

        if (Array.isArray(value)) {
          row[`${colKey}.__count`] = value.length;
          if (value.length > 0 && value.length <= 8 && value.every((x) => isScalar(x))) {
            row[`${colKey}.__list`] = value.map((x) => scalarToString(x)).join(" | ");
          }
          continue;
        }

        if (value && typeof value === "object") {
          row[`${colKey}.__json`] = safeJsonSnippet(value, 400);
        }
      }
    }

    const thumbnail = extractThumbnailUrl(detailColumns || {});
    if (thumbnail) {
      row.thumbnail_url = thumbnail;
    }

    const badges = extractBadges(item, detailColumns || {});
    row.badges_text = badges.map((badge) => badge.label).join(" | ");
    row.badges_count = badges.length;
    row.badges_index = badges.map((badge) => badge.key).join("|");
    row.__badgeItems = badges;
    row.__badgeKeys = badges.map((badge) => badge.key);
    row.official_supplier_warning = badges.some((badge) => badge.key === "official_supplier_warning");
    row.official_supplier_text = row.official_supplier_warning ? "UYARI: RESMI SATICI / TEDARIKCI" : "";

    row.row_key = buildRowKey(item, row);
    row.__raw = item;
    return row;
  });
}

function applyDerivedMetrics(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return;

  let minScore = Infinity;
  let maxScore = -Infinity;

  for (const row of rows) {
    const detailStrings = extractStringValues(row?.__raw?.detail_columns || {}).slice(0, 280);
    row.__detail_strings = detailStrings;

    row.is_favorite = state.favorites.has(row.row_key);
    row.is_selected_compare = state.compareSelection.has(row.row_key);

    const categoryKey = deriveCommissionCategoryKey(row);
    row.commission_category_key = categoryKey;

    const desiInfo = estimateDesiForRow(row, detailStrings);
    row.estimated_desi = desiInfo.desi;
    row.desi_confidence = desiInfo.confidence;

    const commissionRatePct = resolveCommissionRatePct(row.source, categoryKey);
    const shippingPriceTl = resolveShippingPriceTl(row.source, row.estimated_desi);

    row.commission_rate_pct = commissionRatePct;
    row.shipping_estimated_tl = shippingPriceTl;
    row.other_fee_tl = state.profitSettings.extraFeeTl;
    row.target_profit_pct = state.profitSettings.targetProfitPct;

    const salePrice = toNumber(row.price);
    const currency = String(row.currency || "").toUpperCase();
    const purchasePrice = toNumber(state.purchasePriceOverrides?.[row.row_key]);
    row.purchase_price_tl = purchasePrice !== null && purchasePrice >= 0 ? purchasePrice : null;
    if (salePrice !== null && (!currency || currency === "TRY")) {
      row.commission_amount_tl = salePrice * (commissionRatePct / 100);
      row.net_after_fee_tl = salePrice - row.commission_amount_tl - shippingPriceTl - state.profitSettings.extraFeeTl;
      const targetMultiplier = 1 + state.profitSettings.targetProfitPct / 100;
      row.max_buy_price_for_target_profit_tl = row.net_after_fee_tl > 0 ? row.net_after_fee_tl / targetMultiplier : 0;
      if (row.purchase_price_tl !== null && row.purchase_price_tl > 0) {
        row.net_profit_after_purchase_tl = row.net_after_fee_tl - row.purchase_price_tl;
        row.profit_ratio_pct = (row.net_profit_after_purchase_tl / row.purchase_price_tl) * 100;
        row.net_positive_after_purchase = row.net_profit_after_purchase_tl >= 0;
        row.profit_floor_pass_target = row.profit_ratio_pct >= state.profitSettings.targetProfitPct;
      } else {
        row.net_profit_after_purchase_tl = null;
        row.profit_ratio_pct = null;
        row.net_positive_after_purchase = row.net_after_fee_tl >= 0;
        row.profit_floor_pass_target = row.max_buy_price_for_target_profit_tl > 0;
      }
    } else {
      row.commission_amount_tl = null;
      row.net_after_fee_tl = null;
      row.max_buy_price_for_target_profit_tl = null;
      row.net_profit_after_purchase_tl = null;
      row.profit_ratio_pct = null;
      row.net_positive_after_purchase = false;
      row.profit_floor_pass_target = false;
    }

    const officialSales = parseOfficialMonthlySales(row, detailStrings);
    const stockRange = parseStockRangeUpperBound(row, detailStrings);
    if (officialSales !== null) {
      row.sales_signal_type = "official_monthly_sales";
      row.sales_signal_value = officialSales;
      row.sales_signal_note = "Resmi aylik satis verisi";
    } else if (stockRange !== null) {
      row.sales_signal_type = "stock_range";
      row.sales_signal_value = stockRange;
      row.sales_signal_note = "Stok adedi metni";
    } else {
      row.sales_signal_type = "estimated_score";
      row.sales_signal_value = null;
      row.sales_signal_note = "Yorum/favori/yildizdan tahmin";
    }

    row.__sales_score_raw = buildSalesScoreRaw(row);
    if (Number.isFinite(row.__sales_score_raw)) {
      minScore = Math.min(minScore, row.__sales_score_raw);
      maxScore = Math.max(maxScore, row.__sales_score_raw);
    }
  }

  for (const row of rows) {
    if (row.sales_signal_type !== "estimated_score") continue;
    if (!Number.isFinite(row.__sales_score_raw)) {
      row.sales_signal_value = 0;
      continue;
    }
    row.sales_signal_value = normalizeToRange(row.__sales_score_raw, minScore, maxScore, 0, 100);
  }
}

function buildRowKey(item, row) {
  const source = normalizeMarketplaceSource(item?.source || row?.source || "");
  const url = String(item?.url || row?.url || "").trim();
  if (url) return `${source}|${url}`;
  return `${source}|${item?.id || row?.row_id || Math.random()}`;
}

function deriveCommissionCategoryKey(row) {
  const raw = row?.__raw || {};
  const detail = isPlainObject(raw.detail_columns) ? raw.detail_columns : {};
  const categoryCandidates = [];

  categoryCandidates.push(detail["product.category.name"]);
  categoryCandidates.push(detail["product.category.hierarchy"]);
  categoryCandidates.push(detail["product.categories[].categoryName"]);
  categoryCandidates.push(row?.["dc.product.category.name"]);
  categoryCandidates.push(row?.["dc.product.categories[].categoryName.__list"]);

  for (const candidate of categoryCandidates) {
    const values = extractStringValues(candidate);
    for (const token of values) {
      const normalized = slugifyCategoryKey(token);
      if (normalized) return normalized;
    }
  }

  const titleFallback = slugifyCategoryKey(row?.title || "");
  return titleFallback || "genel";
}

function slugifyCategoryKey(value) {
  const normalized = normalizeSearchText(value);
  if (!normalized) return "";
  return normalized.replace(/\s+/g, "-");
}

function resolveCommissionRatePct(source, categoryKey) {
  const sourceToken = normalizeMarketplaceSource(source);
  const rates = Array.isArray(state.ratesConfig?.commission_rates) ? state.ratesConfig.commission_rates : [];
  const sourceRates = rates.filter((entry) => normalizeMarketplaceSource(entry?.source) === sourceToken);
  const normalizedCategory = slugifyCategoryKey(categoryKey || "");

  for (const rate of sourceRates) {
    const key = slugifyCategoryKey(rate?.category_key || "");
    if (!key || !normalizedCategory) continue;
    if (normalizedCategory.includes(key) || key.includes(normalizedCategory)) {
      const pct = toNumber(rate?.rate_pct);
      if (pct !== null) return clampNumber(pct, 0, 100);
    }
  }

  const defaults = state.ratesConfig?.defaults || {};
  const fallback = toNumber(defaults.commission_rate_pct);
  if (fallback !== null) return clampNumber(fallback, 0, 100);
  return clampNumber(state.profitSettings.fallbackCommissionPct, 0, 100);
}

function resolveShippingPriceTl(source, desi) {
  const sourceToken = normalizeMarketplaceSource(source);
  const desiValue = toNumber(desi);
  if (desiValue === null) {
    return clampNumber(state.profitSettings.fallbackShippingTl, 0, 1000000);
  }

  const rates = Array.isArray(state.ratesConfig?.shipping_rates) ? state.ratesConfig.shipping_rates : [];
  const sourceRates = rates.filter((entry) => normalizeMarketplaceSource(entry?.source) === sourceToken);
  for (const rate of sourceRates) {
    const min = toNumber(rate?.desi_min);
    const max = toNumber(rate?.desi_max);
    const price = toNumber(rate?.price_tl);
    if (min === null || max === null || price === null) continue;
    if (desiValue >= min && desiValue <= max) return clampNumber(price, 0, 1000000);
  }

  const defaults = state.ratesConfig?.defaults || {};
  const fallback = toNumber(defaults.shipping_tl);
  if (fallback !== null) return clampNumber(fallback, 0, 1000000);
  return clampNumber(state.profitSettings.fallbackShippingTl, 0, 1000000);
}

function estimateDesiForRow(row, detailStrings = null) {
  const manual = toNumber(state.manualDesiOverrides?.[row.row_key]);
  if (manual !== null && manual > 0) {
    return { desi: roundTo(manual, 2), confidence: "manual" };
  }

  const volumeMl = extractVolumeEquivalentMl(row, detailStrings);
  if (volumeMl !== null) {
    return { desi: mlToDesi(volumeMl), confidence: "high" };
  }

  const source = normalizeSearchText(row?.source || "");
  if (source.includes("hepsiburada")) {
    return { desi: 1.5, confidence: "low" };
  }
  return { desi: 1, confidence: "low" };
}

function extractVolumeEquivalentMl(row, detailStrings = null) {
  const detail = row?.__raw?.detail_columns || {};
  const sourceText = [];

  const expNames = detail["product.expends[].properties[].name"];
  const expValues = detail["product.expends[].properties[].property"];
  if (Array.isArray(expNames) && Array.isArray(expValues)) {
    for (let i = 0; i < Math.min(expNames.length, expValues.length); i++) {
      const names = Array.isArray(expNames[i]) ? expNames[i] : [];
      const values = Array.isArray(expValues[i]) ? expValues[i] : [];
      for (let j = 0; j < Math.min(names.length, values.length); j++) {
        const nameToken = normalizeSearchText(names[j]);
        if (nameToken.includes("hacim") || nameToken.includes("miktar") || nameToken.includes("gramaj") || nameToken.includes("agirlik")) {
          sourceText.push(String(values[j]));
        }
      }
    }
  }

  sourceText.push(String(row?.title || ""));
  sourceText.push(...(Array.isArray(detailStrings) ? detailStrings.slice(0, 180) : extractStringValues(detail).slice(0, 180)));

  const candidates = [];
  for (const text of sourceText) {
    const parsed = parseVolumeFromText(text);
    if (parsed !== null) candidates.push(parsed);
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => a - b);
  return candidates[Math.floor(candidates.length / 2)];
}

function parseVolumeFromText(text) {
  const input = String(text || "");
  if (!input) return null;

  const regex = /(\d+(?:[.,]\d+)?)\s*(ml|l|lt|litre|liter|gr|g|kg)\b/gi;
  let match = regex.exec(input);
  if (!match) return null;

  const num = parseLocalizedNumber(match[1]);
  const unit = String(match[2] || "").toLowerCase();
  if (num === null || num <= 0) return null;
  if (unit === "ml") return num;
  if (unit === "l" || unit === "lt" || unit === "litre" || unit === "liter") return num * 1000;
  if (unit === "gr" || unit === "g") return num;
  if (unit === "kg") return num * 1000;
  return null;
}

function mlToDesi(volumeMl) {
  const ml = toNumber(volumeMl);
  if (ml === null || ml <= 0) return 1;
  if (ml <= 100) return 0.5;
  if (ml <= 250) return 1;
  if (ml <= 500) return 1.5;
  if (ml <= 1000) return 2;
  if (ml <= 2000) return 3;
  return 5;
}

function parseOfficialMonthlySales(row, detailStrings = null) {
  const detail = row?.__raw?.detail_columns || {};
  const values = Array.isArray(detailStrings) ? detailStrings : extractStringValues(detail).slice(0, 220);
  const regexes = [/(\d+(?:[.,]\d+)?)\s*adet\s*\/\s*ay/i, /aylik\s*(\d+(?:[.,]\d+)?)\s*adet/i];
  for (const text of values) {
    for (const regex of regexes) {
      const match = String(text).match(regex);
      if (!match) continue;
      const num = parseLocalizedNumber(match[1]);
      if (num !== null) return Math.max(0, num);
    }
  }
  return null;
}

function parseStockRangeUpperBound(row, detailStrings = null) {
  const detail = row?.__raw?.detail_columns || {};
  const values = Array.isArray(detailStrings) ? detailStrings : extractStringValues(detail).slice(0, 260);
  const regex = /(\d+(?:[.,]\d+)?)\s*adetten\s*az/i;
  for (const text of values) {
    const match = String(text).match(regex);
    if (!match) continue;
    const num = parseLocalizedNumber(match[1]);
    if (num !== null) return num;
  }
  return null;
}

function buildSalesScoreRaw(row) {
  const reviewCount = Math.max(0, toNumber(row.review_count) ?? 0);
  const favoriteCount = Math.max(0, toNumber(row.favorite_count) ?? 0);
  const ratingScore = Math.max(0, toNumber(row.rating_score) ?? 0);
  return Math.log1p(reviewCount) * 45 + Math.log1p(favoriteCount) * 35 + ratingScore * 20;
}

function normalizeToRange(value, min, max, outMin, outMax) {
  const val = toNumber(value);
  if (val === null) return outMin;
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
    return roundTo((outMin + outMax) / 2, 2);
  }
  const ratio = (val - min) / (max - min);
  const scaled = outMin + ratio * (outMax - outMin);
  return roundTo(clampNumber(scaled, outMin, outMax), 2);
}
function collectColumns(rows) {
  const colSet = new Set();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!key.startsWith("__")) {
        colSet.add(key);
      }
    }
  }

  const cols = [...colSet].sort((a, b) => a.localeCompare(b));
  const preferred = [
    "source",
    "title",
    "badges_text",
    "badges_count",
    "price",
    "purchase_price_tl",
    "estimated_desi",
    "shipping_estimated_tl",
    "commission_rate_pct",
    "commission_amount_tl",
    "net_after_fee_tl",
    "net_profit_after_purchase_tl",
    "profit_ratio_pct",
    "net_positive_after_purchase",
    "max_buy_price_for_target_profit_tl",
    "profit_floor_pass_target",
    "sales_signal_type",
    "sales_signal_value",
    "currency",
    "in_stock",
    "is_on_sale",
    "rating_score",
    "review_count",
    "seller_name",
    "seller_score",
    "other_seller_count",
    "thumbnail_url",
    "url",
  ];

  const preferredExisting = preferred.filter((col) => cols.includes(col));
  const rest = cols.filter((col) => !preferredExisting.includes(col));
  return [...preferredExisting, ...rest];
}

function buildColumnMeta(rows, columns) {
  const meta = {};
  for (const col of columns) {
    meta[col] = {
      count: 0,
      numberCount: 0,
      booleanCount: 0,
      min: Infinity,
      max: -Infinity,
      freq: new Map(),
    };
  }

  for (const row of rows) {
    for (const col of columns) {
      const value = row[col];
      if (value === undefined || value === null || value === "") continue;

      const slot = meta[col];
      slot.count += 1;

      if (typeof value === "number" && Number.isFinite(value)) {
        slot.numberCount += 1;
        slot.min = Math.min(slot.min, value);
        slot.max = Math.max(slot.max, value);
        continue;
      }

      if (typeof value === "boolean") {
        slot.booleanCount += 1;
      }

      const token = scalarToString(value);
      slot.freq.set(token, (slot.freq.get(token) || 0) + 1);
    }
  }

  const normalized = {};
  for (const [key, slot] of Object.entries(meta)) {
    const numericShare = slot.count === 0 ? 0 : slot.numberCount / slot.count;
    const kind = numericShare >= 0.8 ? "number" : "category";

    const options = [...slot.freq.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 500)
      .map(([value, count]) => ({ value, count }));

    normalized[key] = {
      kind,
      min: Number.isFinite(slot.min) ? slot.min : null,
      max: Number.isFinite(slot.max) ? slot.max : null,
      count: slot.count,
      options,
    };
  }

  return normalized;
}

function buildFilterColumns(columns, meta) {
  const always = [
    "source",
    "badges_text",
    "price",
    "purchase_price_tl",
    "estimated_desi",
    "shipping_estimated_tl",
    "commission_rate_pct",
    "commission_amount_tl",
    "net_after_fee_tl",
    "net_profit_after_purchase_tl",
    "profit_ratio_pct",
    "net_positive_after_purchase",
    "max_buy_price_for_target_profit_tl",
    "profit_floor_pass_target",
    "sales_signal_type",
    "sales_signal_value",
    "is_favorite",
    "is_selected_compare",
    "currency",
    "in_stock",
    "is_on_sale",
    "rating_score",
    "review_count",
    "seller_name",
    "seller_score",
    "other_seller_count",
    "badges_count",
    "other_sellers_min_price",
    "other_sellers_max_price",
  ].filter((column) => columns.includes(column));

  const candidates = [...always];

  for (const column of columns) {
    if (candidates.includes(column)) continue;
    if (FILTER_BLOCKLIST_EXACT.has(column)) continue;
    if (FILTER_BLOCKLIST_PATTERNS.some((regex) => regex.test(column))) continue;

    const info = meta[column];
    if (!info) continue;

    if (column.startsWith("dc.") && !FILTER_DETAIL_ALLOW.test(column)) continue;

    if (info.kind === "category") {
      if (info.options.length <= 1) continue;
      if (info.options.length > 80 && !["source", "currency", "seller_name", "badges_text"].includes(column)) {
        continue;
      }
    } else if (info.kind === "number") {
      if (info.min !== null && info.max !== null && info.min === info.max) continue;
    }

    candidates.push(column);
  }

  const byLabel = new Map();
  for (const column of candidates) {
    const labelKey = normalizeSearchText(getColumnLabel(column));
    if (!labelKey) continue;

    if (!byLabel.has(labelKey)) {
      byLabel.set(labelKey, column);
      continue;
    }

    const existing = byLabel.get(labelKey);
    if (existing.startsWith("dc.") && !column.startsWith("dc.")) {
      byLabel.set(labelKey, column);
      continue;
    }

    if (column.length < existing.length) {
      byLabel.set(labelKey, column);
    }
  }

  return [...byLabel.values()].sort((a, b) => getColumnLabel(a).localeCompare(getColumnLabel(b), "tr"));
}

function buildBadgeOptions(rows) {
  const counts = new Map();
  const labels = new Map();
  const tones = new Map();

  for (const row of rows) {
    const items = Array.isArray(row.__badgeItems) ? row.__badgeItems : [];
    for (const badge of items) {
      counts.set(badge.key, (counts.get(badge.key) || 0) + 1);
      if (!labels.has(badge.key)) labels.set(badge.key, badge.label);
      if (!tones.has(badge.key)) tones.set(badge.key, badge.tone);
    }
  }

  return [...counts.entries()]
    .map(([key, count]) => ({
      key,
      count,
      label: labels.get(key) || key,
      tone: tones.get(key) || "neutral",
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "tr"));
}

function initQuickNumericRanges(previous = {}) {
  const ranges = {};
  for (const def of QUICK_NUMERIC_DEFS) {
    const meta = state.columnMeta[def.key];
    if (!meta || meta.kind !== "number") continue;

    ranges[def.key] = {
      label: def.label,
      min: meta.min,
      max: meta.max,
      from: previous?.[def.key]?.from ?? null,
      to: previous?.[def.key]?.to ?? null,
    };
  }
  return ranges;
}

function defaultVisibleColumns() {
  const defaults = DEFAULT_VISIBLE_COLUMNS.filter((column) => state.columns.includes(column));
  if (defaults.length) return defaults;
  return state.columns.slice(0, 12);
}

function renderSourceFilters() {
  if (!state.sourceOptions.length) {
    el.sourceFilters.innerHTML = '<p class="muted">Kaynak yok</p>';
    return;
  }

  el.sourceFilters.innerHTML = state.sourceOptions
    .map((source) => {
      const checked = state.selectedSources.has(source) ? "checked" : "";
      return `
        <label class="source-option">
          <input type="checkbox" data-source="${escapeHtml(source)}" ${checked} />
          <span>${escapeHtml(source)}</span>
        </label>
      `;
    })
    .join("");

  el.sourceFilters.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.addEventListener("change", () => {
      const source = String(input.getAttribute("data-source") || "");
      if (input.checked) {
        state.selectedSources.add(source);
      } else {
        state.selectedSources.delete(source);
      }
      state.page = 1;
      applyFilters();
    });
  });
}

function renderBadgeFilters() {
  if (!state.badgeOptions.length) {
    el.badgeFilters.innerHTML = '<p class="muted">Badge bulunamadi.</p>';
    el.clearBadgeFilterBtn.disabled = true;
    return;
  }

  const maxItems = 60;
  const visible = state.badgeOptions.slice(0, maxItems);
  const extraCount = Math.max(0, state.badgeOptions.length - visible.length);

  el.badgeFilters.innerHTML = visible
    .map((badge) => {
      const active = state.selectedBadges.has(badge.key) ? "active" : "";
      const toneHint = getBadgeToneHint(badge.tone);
      return `
        <button
          type="button"
          class="badge-filter-chip badge-tone-${escapeHtml(badge.tone)} ${active}"
          data-badge-key="${escapeHtml(badge.key)}"
          title="${escapeHtml(`${badge.label} | ${toneHint}`)}"
        >
          ${escapeHtml(badge.label)} (${formatNumber(badge.count)})
        </button>
      `;
    })
    .join("");

  if (extraCount > 0) {
    const info = document.createElement("div");
    info.className = "muted";
    info.textContent = `+${formatNumber(extraCount)} badge daha var. En sik kullanilanlar gosteriliyor.`;
    el.badgeFilters.appendChild(info);
  }

  el.badgeFilters.querySelectorAll("button[data-badge-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = String(button.getAttribute("data-badge-key") || "");
      if (!key) return;
      if (state.selectedBadges.has(key)) {
        state.selectedBadges.delete(key);
      } else {
        state.selectedBadges.add(key);
      }
      state.page = 1;
      renderBadgeFilters();
      applyFilters();
    });
  });

  el.clearBadgeFilterBtn.disabled = state.selectedBadges.size === 0;
}

function renderQuickNumericFilters() {
  const keys = Object.keys(state.quickNumeric);
  if (!keys.length) {
    el.quickNumericFilters.innerHTML = '<p class="muted">Sayisal hizli filtre bulunamadi.</p>';
    return;
  }

  el.quickNumericFilters.innerHTML = keys
    .map((key) => {
      const filter = state.quickNumeric[key];
      return `
        <div class="quick-row" data-key="${escapeHtml(key)}">
          <div class="quick-row-head">
            <strong>${escapeHtml(filter.label)}</strong>
            <span class="muted">${formatNumber(filter.min)} - ${formatNumber(filter.max)}</span>
          </div>
          <div class="quick-range">
            <input type="number" step="any" placeholder="Min" value="${filter.from ?? ""}" data-role="min" />
            <input type="number" step="any" placeholder="Max" value="${filter.to ?? ""}" data-role="max" />
          </div>
        </div>
      `;
    })
    .join("");

  el.quickNumericFilters.querySelectorAll(".quick-row").forEach((rowNode) => {
    const key = String(rowNode.getAttribute("data-key") || "");
    const minInput = rowNode.querySelector("input[data-role='min']");
    const maxInput = rowNode.querySelector("input[data-role='max']");

    const apply = () => {
      const slot = state.quickNumeric[key];
      if (!slot) return;
      slot.from = emptyToNull(minInput.value);
      slot.to = emptyToNull(maxInput.value);
      if (slot.from !== null) slot.from = Number(slot.from);
      if (slot.to !== null) slot.to = Number(slot.to);
      state.page = 1;
      applyFilters();
    };

    minInput.addEventListener("input", apply);
    maxInput.addEventListener("input", apply);
  });
}

function addAdvancedFilter() {
  if (!state.filterColumns.length) return;
  const column = state.filterColumns[0];
  state.filters.push(createFilter(column));
  renderAdvancedFilters();
  applyFilters();
}

function createFilter(column) {
  const meta = state.columnMeta[column] || { kind: "category" };
  return {
    id: state.nextFilterId++,
    column,
    kind: meta.kind,
    min: null,
    max: null,
    selected: new Set(),
    optionSearch: "",
  };
}
function renderAdvancedFilters() {
  if (!state.filters.length) {
    el.advancedFilters.innerHTML = '<p class="muted">Filtre ekle butonuyla kolon filtresi ekleyebilirsin.</p>';
    return;
  }

  el.advancedFilters.innerHTML = "";

  for (const filter of state.filters) {
    const card = document.createElement("div");
    card.className = "filter-card";

    const head = document.createElement("div");
    head.className = "filter-head";

    const select = document.createElement("select");
    for (const column of state.filterColumns) {
      const option = document.createElement("option");
      option.value = column;
      option.title = column;
      option.textContent = getColumnLabel(column);
      if (column === filter.column) option.selected = true;
      select.appendChild(option);
    }

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-mini";
    removeBtn.textContent = "Sil";

    head.appendChild(select);
    head.appendChild(removeBtn);
    card.appendChild(head);

    const body = document.createElement("div");
    body.className = "filter-body";

    if (filter.kind === "number") {
      const rangeWrap = document.createElement("div");
      rangeWrap.className = "quick-range";

      const minInput = document.createElement("input");
      minInput.type = "number";
      minInput.step = "any";
      minInput.placeholder = "Min";
      minInput.value = filter.min ?? "";

      const maxInput = document.createElement("input");
      maxInput.type = "number";
      maxInput.step = "any";
      maxInput.placeholder = "Max";
      maxInput.value = filter.max ?? "";

      rangeWrap.appendChild(minInput);
      rangeWrap.appendChild(maxInput);
      body.appendChild(rangeWrap);

      const meta = state.columnMeta[filter.column];
      const hint = document.createElement("div");
      hint.className = "muted";
      hint.textContent = `${getColumnLabel(filter.column)} araligi: ${formatNumber(meta?.min)} - ${formatNumber(meta?.max)}`;
      body.appendChild(hint);

      minInput.addEventListener("input", () => {
        filter.min = emptyToNull(minInput.value);
        if (filter.min !== null) filter.min = Number(filter.min);
        state.page = 1;
        applyFilters();
      });

      maxInput.addEventListener("input", () => {
        filter.max = emptyToNull(maxInput.value);
        if (filter.max !== null) filter.max = Number(filter.max);
        state.page = 1;
        applyFilters();
      });
    } else {
      const searchInput = document.createElement("input");
      searchInput.type = "search";
      searchInput.placeholder = "Deger ara...";
      searchInput.value = filter.optionSearch;
      body.appendChild(searchInput);

      const optionsBox = document.createElement("div");
      optionsBox.className = "option-box";

      const meta = state.columnMeta[filter.column];
      const options = Array.isArray(meta?.options) ? meta.options : [];
      const normalizedSearch = filter.optionSearch.trim().toLowerCase();
      const filteredOptions = options
        .filter((option) => option.value.toLowerCase().includes(normalizedSearch))
        .slice(0, 140);

      if (!filteredOptions.length) {
        optionsBox.innerHTML = '<p class="muted">Deger bulunamadi.</p>';
      } else {
        for (const option of filteredOptions) {
          const token = option.value;
          const row = document.createElement("label");
          row.className = "option-row";
          row.innerHTML = `
            <input type="checkbox" value="${escapeHtml(token)}" ${filter.selected.has(token) ? "checked" : ""} />
            <span>${escapeHtml(prettyOptionValue(token))} <small class="muted">(${formatNumber(option.count)})</small></span>
          `;

          const checkbox = row.querySelector("input");
          checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
              filter.selected.add(token);
            } else {
              filter.selected.delete(token);
            }
            state.page = 1;
            applyFilters();
          });

          optionsBox.appendChild(row);
        }
      }

      body.appendChild(optionsBox);

      const selectedHint = document.createElement("div");
      selectedHint.className = "muted";
      selectedHint.textContent = `Secili deger: ${formatNumber(filter.selected.size)}`;
      body.appendChild(selectedHint);

      searchInput.addEventListener("input", () => {
        filter.optionSearch = searchInput.value;
        renderAdvancedFilters();
      });
    }

    card.appendChild(body);

    select.addEventListener("change", () => {
      const newColumn = select.value;
      const meta = state.columnMeta[newColumn] || { kind: "category" };
      filter.column = newColumn;
      filter.kind = meta.kind;
      filter.min = null;
      filter.max = null;
      filter.selected = new Set();
      filter.optionSearch = "";
      renderAdvancedFilters();
      state.page = 1;
      applyFilters();
    });

    removeBtn.addEventListener("click", () => {
      state.filters = state.filters.filter((entry) => entry.id !== filter.id);
      renderAdvancedFilters();
      state.page = 1;
      applyFilters();
    });

    el.advancedFilters.appendChild(card);
  }
}

function renderColumnPicker() {
  const sortedColumns = [...state.columns].sort((a, b) => getColumnLabel(a).localeCompare(getColumnLabel(b), "tr"));
  el.columnPicker.innerHTML = sortedColumns
    .map((column) => `<option value="${escapeHtml(column)}" title="${escapeHtml(column)}">${escapeHtml(getColumnLabel(column))}</option>`)
    .join("");
}

function renderVisibleColumns() {
  if (!state.visibleColumns.length) {
    el.visibleColumns.innerHTML = '<p class="muted">Kolon sec.</p>';
    return;
  }

  el.visibleColumns.innerHTML = state.visibleColumns
    .map((column) => {
      return `
        <span class="chip" data-col="${escapeHtml(column)}" title="${escapeHtml(column)}">
          ${escapeHtml(getColumnLabel(column))}
          <button type="button" title="Kaldir">x</button>
        </span>
      `;
    })
    .join("");

  el.visibleColumns.querySelectorAll(".chip button").forEach((button) => {
    button.addEventListener("click", () => {
      const parent = button.closest(".chip");
      const column = String(parent?.getAttribute("data-col") || "");
      state.visibleColumns = state.visibleColumns.filter((entry) => entry !== column);
      renderVisibleColumns();
      renderTable();
      persistUiState();
    });
  });
}

function applyFilters() {
  const search = state.searchText;
  const quickEntries = Object.entries(state.quickNumeric);

  const filtered = state.rows.filter((row) => {
    if (state.selectedSources.size === 0) return false;
    const source = String(row.source || "bilinmiyor");
    if (!state.selectedSources.has(source)) return false;

    if (state.selectedBadges.size > 0) {
      const rowBadgeKeys = Array.isArray(row.__badgeKeys) ? row.__badgeKeys : [];
      let badgeMatched = false;
      for (const badgeKey of rowBadgeKeys) {
        if (state.selectedBadges.has(badgeKey)) {
          badgeMatched = true;
          break;
        }
      }
      if (!badgeMatched) return false;
    }

    if (state.profitSettings.onlyPositiveNet && !row.net_positive_after_purchase) {
      return false;
    }

    if (search) {
      const haystack = [row.title, row.title_hint, row.url, row.seller_name, row.source, row.badges_text]
        .map((entry) => (entry === undefined || entry === null ? "" : String(entry).toLowerCase()))
        .join(" ");
      if (!haystack.includes(search)) return false;
    }

    for (const [key, range] of quickEntries) {
      const value = toNumber(row[key]);
      if (range.from !== null && (value === null || value < range.from)) return false;
      if (range.to !== null && (value === null || value > range.to)) return false;
    }

    for (const filter of state.filters) {
      if (!isAdvancedFilterActive(filter)) continue;

      const value = row[filter.column];
      if (filter.kind === "number") {
        const num = toNumber(value);
        if (num === null) return false;
        if (filter.min !== null && num < filter.min) return false;
        if (filter.max !== null && num > filter.max) return false;
      } else {
        const token = scalarToString(value);
        if (!filter.selected.has(token)) return false;
      }
    }

    return true;
  });

  state.filteredRows = applySorting(filtered);

  const pageCount = Math.max(1, Math.ceil(state.filteredRows.length / state.pageSize));
  if (state.page > pageCount) state.page = pageCount;
  if (state.page < 1) state.page = 1;

  renderStats();
  renderResultSummary();
  renderPager();
  renderTable();
  renderComparePanel();
  persistUiState();
}

function applySorting(rows) {
  if (!state.sort.column || !state.sort.direction) {
    return [...rows];
  }

  const direction = state.sort.direction === "asc" ? 1 : -1;
  const sortColumn = state.sort.column;

  return [...rows].sort((a, b) => {
    const compared = compareForSort(a[sortColumn], b[sortColumn], sortColumn);
    if (compared !== 0) return compared * direction;
    return Number(a.row_id || 0) - Number(b.row_id || 0);
  });
}

function compareForSort(aValue, bValue, column) {
  const aEmpty = aValue === null || aValue === undefined || aValue === "";
  const bEmpty = bValue === null || bValue === undefined || bValue === "";
  if (aEmpty && bEmpty) return 0;
  if (aEmpty) return 1;
  if (bEmpty) return -1;

  if (column === "badges_text") {
    return String(aValue).localeCompare(String(bValue), "tr", { sensitivity: "base", numeric: true });
  }

  const aNum = toNumber(aValue);
  const bNum = toNumber(bValue);
  if (aNum !== null && bNum !== null) {
    return aNum - bNum;
  }

  if (typeof aValue === "boolean" || typeof bValue === "boolean") {
    return Number(Boolean(aValue)) - Number(Boolean(bValue));
  }

  return String(aValue).localeCompare(String(bValue), "tr", { sensitivity: "base", numeric: true });
}

function toggleSort(column) {
  if (!column) return;

  if (state.sort.column !== column) {
    state.sort = { column, direction: "asc" };
  } else if (state.sort.direction === "asc") {
    state.sort = { column, direction: "desc" };
  } else if (state.sort.direction === "desc") {
    state.sort = { column: null, direction: null };
  } else {
    state.sort = { column, direction: "asc" };
  }

  state.page = 1;
  applyFilters();
}

function renderStats() {
  const activeCount = getActiveFilterCount();
  const favoritesCount = state.rows.filter((row) => row.is_favorite).length;
  const compareCount = state.rows.filter((row) => row.is_selected_compare).length;
  const items = [
    { label: "Toplam Urun", value: state.rows.length },
    { label: "Filtreli Sonuc", value: state.filteredRows.length },
    { label: "Toplam Kolon", value: state.columns.length },
    { label: "Aktif Filtre", value: activeCount },
    { label: "Favoriler", value: favoritesCount },
    { label: "Karsilastirma", value: compareCount },
  ];

  el.stats.innerHTML = items
    .map((item) => {
      return `
        <article class="stat-card">
          <div class="stat-label">${escapeHtml(item.label)}</div>
          <div class="stat-value">${formatNumber(item.value)}</div>
        </article>
      `;
    })
    .join("");
}

function renderResultSummary() {
  const pageCount = Math.max(1, Math.ceil(state.filteredRows.length / state.pageSize));
  const start = state.filteredRows.length ? (state.page - 1) * state.pageSize + 1 : 0;
  const end = Math.min(state.filteredRows.length, state.page * state.pageSize);

  const sortText = state.sort.column
    ? `${getColumnLabel(state.sort.column)} (${state.sort.direction === "asc" ? "artan" : "azalan"})`
    : "Yok";

  el.resultSummary.textContent = `${formatNumber(state.filteredRows.length)} sonuc | ${formatNumber(
    start,
  )}-${formatNumber(end)} gosteriliyor | Sayfa ${state.page}/${pageCount} | Siralama: ${sortText}`;
}

function renderPager() {
  const pageCount = Math.max(1, Math.ceil(state.filteredRows.length / state.pageSize));

  el.pager.innerHTML = `
    <button class="btn btn-mini" data-pager="prev" ${state.page <= 1 ? "disabled" : ""}>Geri</button>
    <span class="badge">${state.page} / ${pageCount}</span>
    <button class="btn btn-mini" data-pager="next" ${state.page >= pageCount ? "disabled" : ""}>Ileri</button>
    <select id="pageSizeSelect" style="width:auto;min-width:80px;">
      ${[20, 40, 80, 120]
        .map((size) => `<option value="${size}" ${size === state.pageSize ? "selected" : ""}>${size}/sf</option>`)
        .join("")}
    </select>
  `;

  const prevBtn = el.pager.querySelector("button[data-pager='prev']");
  const nextBtn = el.pager.querySelector("button[data-pager='next']");
  const pageSizeSelect = el.pager.querySelector("#pageSizeSelect");

  prevBtn.addEventListener("click", () => {
    state.page = Math.max(1, state.page - 1);
    renderResultSummary();
    renderPager();
    renderTable();
  });

  nextBtn.addEventListener("click", () => {
    const maxPage = Math.max(1, Math.ceil(state.filteredRows.length / state.pageSize));
    state.page = Math.min(maxPage, state.page + 1);
    renderResultSummary();
    renderPager();
    renderTable();
  });

  pageSizeSelect.addEventListener("change", () => {
    state.pageSize = Number(pageSizeSelect.value);
    state.page = 1;
    renderResultSummary();
    renderPager();
    renderTable();
    persistUiState();
  });
}
function renderTable() {
  if (!state.visibleColumns.length) {
    el.tableWrap.innerHTML = '<p class="muted" style="padding:12px;">Gosterilecek kolon sec.</p>';
    return;
  }

  if (!state.filteredRows.length) {
    el.tableWrap.innerHTML = '<p class="muted" style="padding:12px;">Sonuc yok.</p>';
    return;
  }

  const start = (state.page - 1) * state.pageSize;
  const pageRows = state.filteredRows.slice(start, start + state.pageSize);

  const headHtml = state.visibleColumns
    .map((column) => {
      const isSorted = state.sort.column === column && !!state.sort.direction;
      const indicator = !isSorted ? "<>" : state.sort.direction === "asc" ? "^" : "v";
      return `
        <th class="sortable-th">
          <button class="th-sort-btn ${isSorted ? "sorted" : ""}" data-sort-col="${escapeHtml(column)}" title="${escapeHtml(column)}">
            <span>${escapeHtml(getColumnLabel(column))}</span>
            <span class="th-sort-indicator">${indicator}</span>
          </button>
        </th>
      `;
    })
    .join("");

  const bodyHtml = pageRows
    .map((row) => {
      const favoriteActive = row.is_favorite ? "active" : "";
      const purchaseValue = row.purchase_price_tl !== null && row.purchase_price_tl !== undefined ? String(row.purchase_price_tl) : "";
      const actions = `
        <td>
          <div class="row-actions">
            <div class="row-actions-top">
              <button type="button" class="favorite-btn ${favoriteActive}" data-fav-row="${row.row_id}" title="Favori">
                ${row.is_favorite ? "*" : "+"}
              </button>
              <input type="checkbox" class="compare-check" data-compare-row="${row.row_id}" ${row.is_selected_compare ? "checked" : ""} title="Karsilastirmaya ekle" />
              <button class="btn btn-mini" data-detail-row="${row.row_id}">Detay</button>
            </div>
            <label class="buy-input-wrap">
              <span>Alis</span>
              <input
                type="number"
                step="0.01"
                min="0"
                class="buy-input"
                data-buy-row="${row.row_id}"
                value="${escapeHtml(purchaseValue)}"
                placeholder="TL"
              />
            </label>
          </div>
        </td>
      `;
      const cells = state.visibleColumns
        .map((column) => `<td>${formatCell(row[column], column, row)}</td>`)
        .join("");
      return `<tr>${actions}${cells}</tr>`;
    })
    .join("");

  el.tableWrap.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Aksiyon</th>
          ${headHtml}
        </tr>
      </thead>
      <tbody>${bodyHtml}</tbody>
    </table>
  `;

  el.tableWrap.querySelectorAll("button[data-detail-row]").forEach((button) => {
    button.addEventListener("click", () => {
      const rowId = Number(button.getAttribute("data-detail-row"));
      const row = state.rows.find((entry) => entry.row_id === rowId);
      if (row) openDetailModal(row);
    });
  });

  el.tableWrap.querySelectorAll("button[data-sort-col]").forEach((button) => {
    button.addEventListener("click", () => {
      const column = String(button.getAttribute("data-sort-col") || "");
      toggleSort(column);
    });
  });

  el.tableWrap.querySelectorAll("button[data-fav-row]").forEach((button) => {
    button.addEventListener("click", () => {
      const rowId = Number(button.getAttribute("data-fav-row"));
      const row = state.rows.find((entry) => entry.row_id === rowId);
      if (!row) return;
      toggleFavorite(row);
    });
  });

  el.tableWrap.querySelectorAll("input[data-compare-row]").forEach((input) => {
    input.addEventListener("change", () => {
      const rowId = Number(input.getAttribute("data-compare-row"));
      const row = state.rows.find((entry) => entry.row_id === rowId);
      if (!row) return;
      toggleCompareSelection(row, Boolean(input.checked));
    });
  });

  el.tableWrap.querySelectorAll("button[data-desi-row]").forEach((button) => {
    button.addEventListener("click", () => {
      const rowId = Number(button.getAttribute("data-desi-row"));
      const row = state.rows.find((entry) => entry.row_id === rowId);
      if (!row) return;
      promptManualDesi(row);
    });
  });

  el.tableWrap.querySelectorAll("input[data-buy-row]").forEach((input) => {
    const commit = () => {
      const rowId = Number(input.getAttribute("data-buy-row"));
      const row = state.rows.find((entry) => entry.row_id === rowId);
      if (!row) return;
      setPurchasePriceForRow(row, input.value);
    };

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        commit();
        input.blur();
      } else if (event.key === "Escape") {
        event.preventDefault();
        const rowId = Number(input.getAttribute("data-buy-row"));
        const row = state.rows.find((entry) => entry.row_id === rowId);
        const resetValue =
          row && row.purchase_price_tl !== null && row.purchase_price_tl !== undefined ? String(row.purchase_price_tl) : "";
        input.value = resetValue;
        input.blur();
      }
    });

    input.addEventListener("blur", commit);
  });
}

function toggleFavorite(row) {
  if (!row?.row_key) return;
  if (state.favorites.has(row.row_key)) {
    state.favorites.delete(row.row_key);
  } else {
    state.favorites.add(row.row_key);
  }
  persistFavorites();
  recomputeDerivedAndRefresh();
}

function toggleCompareSelection(row, checked) {
  if (!row?.row_key) return;
  if (checked) {
    state.compareSelection.add(row.row_key);
  } else {
    state.compareSelection.delete(row.row_key);
  }
  persistCompareSelection();
  recomputeDerivedAndRefresh();
}

function setPurchasePriceForRow(row, rawValue) {
  if (!row?.row_key) return;
  const trimmed = String(rawValue ?? "").trim();
  const hasCurrent = Object.prototype.hasOwnProperty.call(state.purchasePriceOverrides || {}, row.row_key);
  const currentValue = toNumber(state.purchasePriceOverrides?.[row.row_key]);

  if (!trimmed) {
    if (!hasCurrent) return;
    delete state.purchasePriceOverrides[row.row_key];
  } else {
    const parsed = toNumber(trimmed);
    if (parsed === null || parsed < 0) return;
    const rounded = roundTo(parsed, 2);
    if (currentValue !== null && roundTo(currentValue, 2) === rounded) return;
    state.purchasePriceOverrides[row.row_key] = rounded;
  }
  persistPurchasePriceOverrides();
  recomputeDerivedAndRefresh();
}

function promptManualDesi(row) {
  const current = toNumber(state.manualDesiOverrides?.[row.row_key]);
  const initial = current !== null ? String(current) : String(toNumber(row.estimated_desi) ?? "");
  const answer = window.prompt("Bu urun icin manuel desi gir (silmek icin bos birak):", initial);
  if (answer === null) return;
  const trimmed = String(answer).trim();
  if (!trimmed) {
    delete state.manualDesiOverrides[row.row_key];
  } else {
    const parsed = toNumber(trimmed);
    if (parsed === null || parsed <= 0) {
      window.alert("Gecerli bir desi gir.");
      return;
    }
    state.manualDesiOverrides[row.row_key] = roundTo(parsed, 2);
  }
  persistDesiOverrides();
  recomputeDerivedAndRefresh();
}

function renderComparePanel() {
  if (!el.comparePanel) return;
  const selectedRows = state.rows.filter((row) => state.compareSelection.has(row.row_key));
  if (!selectedRows.length) {
    el.comparePanel.classList.add("hidden");
    el.comparePanel.innerHTML = "";
    return;
  }

  const limitedRows = selectedRows.slice(0, 8);
  const cards = limitedRows
    .map((row) => {
      const purchasePriceTl = toNumber(row.purchase_price_tl);
      const profitRatioPct = toNumber(row.profit_ratio_pct);
      const targetProfitPct = toNumber(row.target_profit_pct) ?? state.profitSettings.targetProfitPct;
      const hasPurchasePrice = purchasePriceTl !== null && purchasePriceTl > 0;
      const targetPassed = hasPurchasePrice ? Boolean(row.profit_floor_pass_target) : false;
      const targetTag = hasPurchasePrice
        ? `<span class="profit-tag ${targetPassed ? "ok" : "bad"}">${targetPassed ? "Hedef OK" : "Hedef Alti"}</span>`
        : '<span class="profit-tag bad">Alis girilmedi</span>';
      const salePriceText =
        toNumber(row.price) !== null ? `${formatNumber(row.price)} ${escapeHtml(String(row.currency || "TRY"))}` : "-";
      const purchasePriceText = hasPurchasePrice ? `${formatNumber(purchasePriceTl)} TL` : "Girilmedi";
      const commissionText =
        toNumber(row.commission_rate_pct) !== null
          ? `%${formatNumber(row.commission_rate_pct)} (${formatNumber(row.commission_amount_tl)} TL)`
          : "-";
      const netAfterFeeText = toNumber(row.net_after_fee_tl) !== null ? `${formatNumber(row.net_after_fee_tl)} TL` : "-";
      const netProfitText =
        toNumber(row.net_profit_after_purchase_tl) !== null ? `${formatNumber(row.net_profit_after_purchase_tl)} TL` : "-";
      const profitRatioText = profitRatioPct !== null ? `%${formatNumber(profitRatioPct)}` : "-";

      return `
        <article class="compare-card">
          <div class="compare-title">${escapeHtml(shorten(String(row.title || "Urun"), 95))}</div>
          <div class="compare-kv"><small>Kaynak</small><span>${escapeHtml(String(row.source || "-"))}</span></div>
          <div class="compare-kv"><small>Satis Fiyati</small><span>${salePriceText}</span></div>
          <div class="compare-kv"><small>Alis Fiyati</small><span>${purchasePriceText}</span></div>
          <div class="compare-kv"><small>Komisyon</small><span>${commissionText}</span></div>
          <div class="compare-kv"><small>Kargo</small><span>${formatNumber(row.shipping_estimated_tl)} TL</span></div>
          <div class="compare-kv"><small>Net (kesinti sonrasi)</small><span>${netAfterFeeText}</span></div>
          <div class="compare-kv"><small>Alis sonrasi net kar</small><span>${netProfitText}</span></div>
          <div class="compare-kv"><small>Kar Orani</small><span>${profitRatioText}</span></div>
          <div class="compare-kv"><small>Hedef Kar</small><span>%${formatNumber(targetProfitPct)} | ${targetTag}</span></div>
          <div class="compare-kv"><small>Maks Alis</small><span>${formatNumber(row.max_buy_price_for_target_profit_tl)} TL</span></div>
          <div class="compare-kv"><small>Satis Sinyali</small><span>${escapeHtml(getSalesSignalLabel(row.sales_signal_type))}: ${formatNumber(row.sales_signal_value)}</span></div>
          <button type="button" class="btn btn-mini" data-compare-remove="${row.row_id}">Cikar</button>
        </article>
      `;
    })
    .join("");

  const extra = selectedRows.length > limitedRows.length ? `<span class="muted">+${selectedRows.length - limitedRows.length} urun daha secili</span>` : "";

  el.comparePanel.innerHTML = `
    <div class="compare-head">
      <strong>Karsilastirma Panosu (${formatNumber(selectedRows.length)})</strong>
      <div>
        <button type="button" class="btn btn-mini" id="clearCompareBtn">Secimi Temizle</button>
        <button type="button" class="btn btn-mini" id="exportCompareBtn">Secili CSV</button>
      </div>
    </div>
    ${extra}
    <div class="compare-grid">${cards}</div>
  `;
  el.comparePanel.classList.remove("hidden");

  const clearBtn = document.getElementById("clearCompareBtn");
  const exportBtn = document.getElementById("exportCompareBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      state.compareSelection.clear();
      persistCompareSelection();
      recomputeDerivedAndRefresh();
    });
  }
  if (exportBtn) {
    exportBtn.addEventListener("click", exportComparedCsv);
  }

  el.comparePanel.querySelectorAll("button[data-compare-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const rowId = Number(button.getAttribute("data-compare-remove"));
      const row = state.rows.find((entry) => entry.row_id === rowId);
      if (!row) return;
      state.compareSelection.delete(row.row_key);
      persistCompareSelection();
      recomputeDerivedAndRefresh();
    });
  });
}

function exportComparedCsv() {
  const selectedRows = state.rows.filter((row) => state.compareSelection.has(row.row_key));
  if (!selectedRows.length) return;
  const columns = [
    "source",
    "title",
    "price",
    "currency",
    "purchase_price_tl",
    "estimated_desi",
    "shipping_estimated_tl",
    "commission_rate_pct",
    "commission_amount_tl",
    "net_after_fee_tl",
    "net_profit_after_purchase_tl",
    "profit_ratio_pct",
    "target_profit_pct",
    "profit_floor_pass_target",
    "net_positive_after_purchase",
    "max_buy_price_for_target_profit_tl",
    "sales_signal_type",
    "sales_signal_value",
    "url",
  ];
  const lines = [columns.join(";")];
  for (const row of selectedRows) {
    lines.push(columns.map((column) => csvSafe(row[column])).join(";"));
  }
  const csvContent = `\uFEFF${lines.join("\n")}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `compare_selected_${new Date().toISOString().replace(/[:.]/g, "-")}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function openDetailModal(row) {
  const raw = row.__raw || {};
  const summaryFields = [
    { label: "Gorsel", key: "thumbnail_url", value: row.thumbnail_url },
    { label: "Baslik", key: "title", value: row.title },
    { label: "Badge", key: "badges_text", value: row.badges_text },
    { label: "Kaynak", key: "source", value: row.source },
    { label: "Fiyat", key: "price", value: row.price },
    { label: "Para", key: "currency", value: row.currency },
    { label: "Tahmini Desi", key: "estimated_desi", value: row.estimated_desi },
    { label: "Tahmini Kargo", key: "shipping_estimated_tl", value: row.shipping_estimated_tl },
    { label: "Komisyon %", key: "commission_rate_pct", value: row.commission_rate_pct },
    { label: "Komisyon", key: "commission_amount_tl", value: row.commission_amount_tl },
    { label: "Net", key: "net_after_fee_tl", value: row.net_after_fee_tl },
    { label: "Maks Alis", key: "max_buy_price_for_target_profit_tl", value: row.max_buy_price_for_target_profit_tl },
    { label: "Satis Sinyali", key: "sales_signal_type", value: row.sales_signal_type },
    { label: "Sinyal Degeri", key: "sales_signal_value", value: row.sales_signal_value },
    { label: "Yildiz", key: "rating_score", value: row.rating_score },
    { label: "Yorum", key: "review_count", value: row.review_count },
    { label: "Satici", key: "seller_name", value: row.seller_name },
    { label: "Satici Skoru", key: "seller_score", value: row.seller_score },
    { label: "Diger Satici", key: "other_seller_count", value: row.other_seller_count },
    { label: "URL", key: "url", value: row.url },
  ];

  el.detailSummary.innerHTML = summaryFields
    .map((entry) => {
      return `
        <div class="detail-kv">
          <small>${escapeHtml(entry.label)}</small>
          <div>${formatCell(entry.value, entry.key, row)}</div>
        </div>
      `;
    })
    .join("");

  const otherSellers = Array.isArray(raw.other_sellers) ? raw.other_sellers : [];
  if (!otherSellers.length) {
    el.otherSellersWrap.innerHTML = '<p class="muted" style="padding:10px;">Diger satici yok.</p>';
  } else {
    const sellerCols = [
      "seller_name",
      "seller_score",
      "price",
      "currency",
      "free_cargo",
      "free_shipping",
      "rush_delivery",
      "fast_shipping",
      "shipment_day",
    ];

    const sellerHead = sellerCols.map((column) => `<th>${escapeHtml(getSellerColumnLabel(column))}</th>`).join("");
    const sellerRows = otherSellers
      .map((seller) => {
        const tds = sellerCols.map((column) => `<td>${formatCell(seller?.[column], column, row)}</td>`).join("");
        return `<tr>${tds}</tr>`;
      })
      .join("");

    el.otherSellersWrap.innerHTML = `
      <table>
        <thead><tr>${sellerHead}</tr></thead>
        <tbody>${sellerRows}</tbody>
      </table>
    `;
  }

  el.detailJson.textContent = JSON.stringify(raw.detail_columns || {}, null, 2);
  el.detailTitle.textContent = row.title ? `Urun Detayi: ${row.title}` : "Urun Detayi";

  el.detailModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  el.detailModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function resetFilters() {
  state.searchText = "";
  el.searchInput.value = "";
  state.selectedSources = new Set(state.sourceOptions);
  state.selectedBadges.clear();

  for (const key of Object.keys(state.quickNumeric)) {
    state.quickNumeric[key].from = null;
    state.quickNumeric[key].to = null;
  }

  state.filters = [];
  state.sort = { column: null, direction: null };
  state.profitSettings.onlyPositiveNet = false;
  persistProfitSettings();
  state.page = 1;

  renderProfitControls();
  renderSourceFilters();
  renderBadgeFilters();
  renderQuickNumericFilters();
  renderAdvancedFilters();
  applyFilters();
}

function exportFilteredCsv() {
  if (!state.filteredRows.length) return;

  const cols = [...state.visibleColumns];
  const lines = [];
  lines.push(cols.join(";"));

  for (const row of state.filteredRows) {
    const line = cols.map((column) => csvSafe(row[column])).join(";");
    lines.push(line);
  }

  const csvContent = `\uFEFF${lines.join("\n")}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  anchor.href = url;
  anchor.download = `scraper_filtered_${stamp}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function getActiveFilterCount() {
  let count = 0;

  if (state.searchText) count += 1;
  if (state.selectedSources.size !== state.sourceOptions.length) count += 1;
  if (state.selectedBadges.size > 0) count += 1;
  if (state.profitSettings.onlyPositiveNet) count += 1;

  for (const slot of Object.values(state.quickNumeric)) {
    if (slot.from !== null || slot.to !== null) count += 1;
  }

  for (const filter of state.filters) {
    if (isAdvancedFilterActive(filter)) count += 1;
  }

  return count;
}

function isAdvancedFilterActive(filter) {
  if (!filter) return false;
  if (filter.kind === "number") return filter.min !== null || filter.max !== null;
  return filter.selected.size > 0;
}

function setDatasetInfo(text) {
  el.datasetInfo.textContent = text;
}

function clearDashboard() {
  state.rows = [];
  state.filteredRows = [];
  state.columns = [];
  state.columnMeta = {};
  state.filterColumns = [];
  state.sourceOptions = [];
  state.selectedSources = new Set();
  state.badgeOptions = [];
  state.selectedBadges = new Set();
  state.quickNumeric = {};
  state.filters = [];
  state.visibleColumns = [];
  state.sort = { column: null, direction: null };
  state.page = 1;

  renderStats();
  el.sourceFilters.innerHTML = "";
  el.badgeFilters.innerHTML = "";
  el.quickNumericFilters.innerHTML = "";
  el.advancedFilters.innerHTML = "";
  el.columnPicker.innerHTML = "";
  el.visibleColumns.innerHTML = "";
  el.resultSummary.textContent = "Veri bekleniyor...";
  el.pager.innerHTML = "";
  el.comparePanel.innerHTML = "";
  el.comparePanel.classList.add("hidden");
  el.tableWrap.innerHTML = '<p class="muted" style="padding:12px;">Veri yuklenmedi.</p>';
}

function formatCell(value, key, row) {
  if (key === "title" && row) {
    return renderTitleCell(row);
  }

  if (key === "badges_text" && row) {
    return renderBadgePills(row.__badgeItems, 6);
  }

  if (key === "thumbnail_url") {
    return renderThumbnailCell(value, row?.title || "Urun");
  }

  if (key === "estimated_desi" && row) {
    const confidence = row.desi_confidence ? ` (${escapeHtml(String(row.desi_confidence))})` : "";
    const formatted = value === null || value === undefined ? "-" : formatNumber(value);
    return `<span class="cell-number">${formatted}${confidence}</span><button type="button" class="desi-edit-btn" data-desi-row="${row.row_id}">Desi</button>`;
  }

  if (key === "profit_floor_pass_target") {
    const ok = Boolean(value);
    return `<span class="profit-tag ${ok ? "ok" : "bad"}">${ok ? "Pozitif" : "Zayif"}</span>`;
  }

  if (key === "net_positive_after_purchase") {
    const ok = Boolean(value);
    return `<span class="profit-tag ${ok ? "ok" : "bad"}">${ok ? "Net +" : "Net -"}</span>`;
  }

  if (key === "profit_ratio_pct") {
    const num = toNumber(value);
    if (num === null) return '<span class="muted">-</span>';
    const cls = num >= state.profitSettings.targetProfitPct ? "ok" : "bad";
    return `<span class="profit-tag ${cls}">%${formatNumber(num)}</span>`;
  }

  if (key === "sales_signal_type" && row) {
    const token = String(value || "none");
    const cls = token === "official_monthly_sales" ? "official" : token === "stock_range" ? "stock" : token === "estimated_score" ? "estimate" : "";
    const label = getSalesSignalLabel(token);
    const withValue = row.sales_signal_value !== null && row.sales_signal_value !== undefined ? `${label}: ${formatNumber(row.sales_signal_value)}` : label;
    return `<span class="sales-chip ${cls}">${escapeHtml(withValue)}</span>`;
  }

  if (key === "commission_rate_pct") {
    const num = toNumber(value);
    if (num === null) return '<span class="muted">-</span>';
    return `<span class="cell-number">%${formatNumber(num)}</span>`;
  }

  if (value === null || value === undefined || value === "") {
    return '<span class="muted">-</span>';
  }

  if (key === "source") {
    const source = String(value).toLowerCase();
    const cls =
      source.includes("trendyol")
        ? "badge-source-trendyol"
        : source.includes("hepsiburada")
        ? "badge-source-hepsiburada"
        : "";
    return `<span class="badge ${cls}">${escapeHtml(String(value))}</span>`;
  }

  if (typeof value === "boolean") {
    const cls = value ? "cell-bool-true" : "cell-bool-false";
    return `<span class="${cls}">${value ? "Evet" : "Hayir"}</span>`;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return `<span class="cell-number">${formatNumber(value)}</span>`;
  }

  const text = String(value);
  if (text.startsWith("http://") || text.startsWith("https://")) {
    return `<a href="${escapeHtml(text)}" target="_blank" rel="noopener noreferrer">${escapeHtml(shorten(text, 90))}</a>`;
  }

  if (text.length > 120) {
    return `<span class="cell-ellipsis" title="${escapeHtml(text)}">${escapeHtml(shorten(text, 118))}</span>`;
  }

  return escapeHtml(text);
}

function renderTitleCell(row) {
  const title = row?.title ? escapeHtml(String(row.title)) : '<span class="muted">-</span>';
  const source = row?.source ? escapeHtml(String(row.source)) : "";
  const seller = row?.seller_name ? `Satici: ${escapeHtml(String(row.seller_name))}` : "";
  const price =
    row?.price !== null && row?.price !== undefined
      ? `Fiyat: ${formatNumber(row.price)} ${escapeHtml(String(row.currency || ""))}`.trim()
      : "";
  const officialAlert = row?.official_supplier_warning ? '<div class="title-alert">UYARI: RESMI SATICI / TEDARIKCI</div>' : "";

  const subLine = [source, seller, price].filter(Boolean).join(" | ");

  return `
    <div class="title-cell">
      ${renderThumbnailCell(row?.thumbnail_url, row?.title || "Urun")}
      <div>
        <div class="title-main">${title}</div>
        ${officialAlert}
        ${subLine ? `<div class="title-sub">${subLine}</div>` : ""}
      </div>
    </div>
  `;
}

function renderThumbnailCell(url, altText) {
  if (!isLikelyImageUrl(url)) {
    return '<div class="thumb-frame"><div class="thumb-fallback">Yok</div></div>';
  }

  return `
    <div class="thumb-frame">
      <img
        class="thumb-image"
        src="${escapeHtml(String(url))}"
        alt="${escapeHtml(String(altText || "Urun"))}"
        loading="lazy"
        referrerpolicy="no-referrer"
        onerror="this.onerror=null;this.src=&quot;${PLACEHOLDER_THUMB}&quot;"
      />
    </div>
  `;
}

function renderBadgePills(items, maxItems = 6) {
  const badgeItems = Array.isArray(items) ? items : [];
  if (!badgeItems.length) return '<span class="muted">-</span>';

  const visible = badgeItems.slice(0, maxItems);
  const extraCount = Math.max(0, badgeItems.length - visible.length);

  const chips = visible
    .map((badge) => `<span class="badge-pill badge-tone-${escapeHtml(badge.tone)}">${escapeHtml(badge.label)}</span>`)
    .join("");

  const moreChip = extraCount > 0 ? `<span class="badge-pill badge-tone-neutral">+${formatNumber(extraCount)}</span>` : "";
  return `<div class="badge-pill-wrap">${chips}${moreChip}</div>`;
}
function getColumnLabel(column) {
  if (COLUMN_LABELS[column]) return COLUMN_LABELS[column];

  let text = String(column || "");
  if (text.startsWith("dc.")) {
    text = text.slice(3);
  }

  text = text
    .replace(/\.\[\]\./g, " ")
    .replace(/\[\]/g, " listesi ")
    .replace(/\.__count/g, " sayisi ")
    .replace(/__/g, " ")
    .replace(/[._]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const replacements = [
    [/^product /i, "Urun "],
    [/^campaigndetail /i, "Kampanya Detay "],
    [/^campaigns /i, "Kampanyalar "],
    [/ merchant /gi, " satici "],
    [/seller/gi, "satici"],
    [/rating/gi, "puan"],
    [/review/gi, "yorum"],
    [/price/gi, "fiyat"],
    [/discount/gi, "indirim"],
    [/shipment/gi, "kargo"],
    [/delivery/gi, "teslimat"],
    [/stock/gi, "stok"],
    [/brand/gi, "marka"],
    [/category/gi, "kategori"],
    [/badge/gi, "badge"],
    [/count/gi, "sayi"],
    [/name/gi, "ad"],
    [/is /gi, ""],
    [/has /gi, ""],
  ];

  for (const [regex, replacement] of replacements) {
    text = text.replace(regex, replacement);
  }

  text = text.replace(/\s+/g, " ").trim();
  const titled = text
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  if (!titled) return column;
  return titled.length > 68 ? `${titled.slice(0, 65)}...` : titled;
}

function prettyOptionValue(value) {
  if (value === "(bos)") return "Bos";
  return value;
}

function getSalesSignalLabel(type) {
  const map = {
    official_monthly_sales: "Resmi Aylik Satis",
    stock_range: "Stok Araligi",
    estimated_score: "Tahmini Satis Skoru",
    none: "Yok",
  };
  return map[type] || type || "Yok";
}

function getSellerColumnLabel(column) {
  const map = {
    seller_name: "Satici",
    seller_score: "Satici Skoru",
    price: "Fiyat",
    currency: "Para",
    free_cargo: "Kargo Bedava",
    free_shipping: "Ucretsiz Kargo",
    rush_delivery: "Hizli Teslimat",
    fast_shipping: "Hizli Kargo",
    shipment_day: "Kargo Gunu",
  };
  return map[column] || column;
}

function extractThumbnailUrl(detailColumns) {
  const primary = extractStringValues(detailColumns?.["product.images"]);
  const secondary = extractStringValues(detailColumns?.["product.media[].url"]);
  const candidates = [...primary, ...secondary].filter((entry) => isLikelyImageUrl(entry));
  if (!candidates.length) return null;

  const nonPlaceholder = candidates.find((entry) => !String(entry).toLowerCase().includes("placeholder"));
  return nonPlaceholder || candidates[0];
}

function extractBadges(item, detailColumns) {
  const candidateValues = [];
  const keys = [
    "product.badges[].name",
    "product.merchant.labelName",
    "campaignDetail.winnerCampaignName",
    "product.merchantListing.campaign.name",
    "product.merchantListing.promotions[].name",
    "product.merchantListing.promotions[].shortName",
    "product.variants[].tagDetails[].displayName",
    "product.merchantListing.variants[].tagDetails[].displayName",
    "product.listings[].campaignText",
    "product.listings[].merchantInfo.merchantLabels",
  ];

  for (const key of keys) {
    candidateValues.push(...extractStringValues(detailColumns?.[key]));
  }

  const sourceBadge = sourceToBadge(item?.source);
  if (sourceBadge) {
    candidateValues.push(sourceBadge);
  }

  const deduped = new Map();
  for (const rawValue of candidateValues) {
    const cleaned = cleanBadgeLabel(rawValue);
    if (!cleaned) continue;
    const normalized = normalizeBadge(cleaned);
    if (isDiscountBadge(normalized.label, normalized.key, normalized.tone)) continue;
    if (!deduped.has(normalized.key)) {
      deduped.set(normalized.key, normalized);
    }
  }

  const badges = [...deduped.values()];
  if (hasOfficialSupplierSignal(candidateValues, badges, detailColumns)) {
    badges.push({
      key: "official_supplier_warning",
      label: "UYARI: RESMI SATICI / TEDARIKCI",
      tone: "official",
    });
  }

  return badges;
}

function sourceToBadge(source) {
  const token = normalizeSearchText(source);
  if (!token) return "";
  if (token.includes("trendyol")) return "Trendyol";
  if (token.includes("hepsiburada")) return "Hepsiburada";
  return "";
}

function cleanBadgeLabel(value) {
  if (value === null || value === undefined) return "";
  let text = String(value).replace(/\s+/g, " ").trim();
  if (!text) return "";
  if (text === "-" || text.toLowerCase() === "null") return "";
  if (text.length > 90) text = `${text.slice(0, 90).trim()}...`;
  if (looksTechnicalBadge(text)) return "";
  return text;
}

function isDiscountBadge(label, key, tone) {
  const token = `${normalizeSearchText(label)} ${normalizeSearchText(key)} ${normalizeSearchText(tone)}`;
  if (!token) return false;
  return token.includes("indirim") || token.includes("discount");
}

function getBadgeToneHint(tone) {
  const token = normalizeSearchText(tone);
  if (token === "trust") return "Yesil: guven / oncelikli";
  if (token === "deal") return "Turuncu: firsat / opsiyonel";
  if (token === "official") return "Kirmizi: resmi satici / tedarikci uyarisi";
  if (token === "shipping") return "Mavi-yesil: kargo / teslimat bilgisi";
  return "Gri: bilgilendirici";
}

function hasOfficialSupplierSignal(candidateValues, normalizedBadges, detailColumns) {
  const badgeTexts = Array.isArray(candidateValues) ? candidateValues : [];
  const normalizedBadgeValues = Array.isArray(normalizedBadges) ? normalizedBadges.map((entry) => entry?.label || "") : [];
  const detailValues = extractStringValues(detailColumns || {}).slice(0, 220);
  const haystack = [...badgeTexts, ...normalizedBadgeValues, ...detailValues];

  for (const value of haystack) {
    const token = normalizeSearchText(value);
    if (!token) continue;
    if (
      token.includes("yetkili satici") ||
      token.includes("resmi satici") ||
      token.includes("resmi tedarikci") ||
      token.includes("official seller") ||
      token.includes("authorized seller") ||
      token.includes("tedarikci")
    ) {
      return true;
    }
  }
  return false;
}

function looksTechnicalBadge(text) {
  const raw = String(text).trim();
  if (!raw) return true;
  if (/^https?:\/\//i.test(raw)) return true;
  if (/^[0-9a-z_-]{10,}$/i.test(raw) && !raw.includes(" ")) return true;
  if (/^\d{4,}[-_][0-9a-z_-]+$/i.test(raw)) return true;
  if (/^[a-f0-9-]{16,}$/i.test(raw)) return true;
  if (raw.includes("{size}") || raw.includes("cdn.")) return true;
  return false;
}

function normalizeBadge(label) {
  let normalized = normalizeSearchText(label);
  let canonical = label;

  if (normalized.includes("yetkili satici")) {
    canonical = "Yetkili Satici";
  } else if (normalized.includes("flas indirim") || normalized.includes("flash indirim")) {
    canonical = "Flas Indirim";
  } else if (normalized.includes("hesapli urun")) {
    canonical = "Hesapli Urun";
  } else if (normalized.includes("en dusuk fiyat")) {
    canonical = "En Dusuk Fiyat";
  } else if (normalized.includes("kargo bedava")) {
    canonical = "Kargo Bedava";
  } else if (normalized.includes("hizli teslimat")) {
    canonical = "Hizli Teslimat";
  }

  normalized = normalizeSearchText(canonical);
  return {
    key: normalized,
    label: canonical,
    tone: classifyBadgeTone(normalized),
  };
}

function classifyBadgeTone(normalizedBadge) {
  const token = normalizeSearchText(normalizedBadge);
  if (!token) return "neutral";
  if (token.includes("official_supplier_warning")) return "official";
  if (token.includes("yetkili") || token.includes("guven") || token.includes("orijinal")) return "trust";
  if (
    token.includes("flas") ||
    token.includes("indirim") ||
    token.includes("kampanya") ||
    token.includes("kupon") ||
    token.includes("firsat") ||
    token.includes("hesapli") ||
    token.includes("en dusuk fiyat")
  ) {
    return "deal";
  }
  if (token.includes("kargo") || token.includes("teslimat") || token.includes("hizli")) return "shipping";
  return "neutral";
}

function extractStringValues(value, out = [], depth = 0) {
  if (depth > 6 || value === null || value === undefined) return out;

  if (typeof value === "string") {
    const text = value.trim();
    if (text) out.push(text);
    return out;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      extractStringValues(entry, out, depth + 1);
    }
    return out;
  }

  if (typeof value === "object") {
    for (const entry of Object.values(value)) {
      extractStringValues(entry, out, depth + 1);
    }
  }

  return out;
}

function isLikelyImageUrl(value) {
  if (!value) return false;
  const text = String(value).trim().toLowerCase();
  if (!text.startsWith("http://") && !text.startsWith("https://") && !text.startsWith("data:image/")) return false;
  return true;
}

function normalizeSearchText(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .toLowerCase()
    .replace(/\u00e7/g, "c")
    .replace(/\u00f0/g, "g")
    .replace(/\u011f/g, "g")
    .replace(/\u0131/g, "i")
    .replace(/\u0130/g, "i")
    .replace(/\u00f6/g, "o")
    .replace(/\u015f/g, "s")
    .replace(/\u00fc/g, "u")
    .replace(/\u00c3\u00a7/g, "c")
    .replace(/\u00c4\u00b1/g, "i")
    .replace(/\u00c4\u00b0/g, "i")
    .replace(/\u00c3\u00b6/g, "o")
    .replace(/\u00c5\u009f/g, "s")
    .replace(/\u00c3\u00bc/g, "u")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(Number(value));
}

function average(values) {
  if (!values.length) return null;
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

function scalarToString(value) {
  if (value === null || value === undefined || value === "") return "(bos)";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return String(value);
}

function isScalar(value) {
  if (value === null) return true;
  const type = typeof value;
  return type === "string" || type === "number" || type === "boolean";
}

function toNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return parseLocalizedNumber(value);
}

function parseLocalizedNumber(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const raw = String(value).trim();
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d.,-]/g, "");
  if (!cleaned) return null;

  const comma = cleaned.lastIndexOf(",");
  const dot = cleaned.lastIndexOf(".");
  let normalized = cleaned;
  if (comma > -1 && dot > -1) {
    if (comma > dot) {
      normalized = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = cleaned.replace(/,/g, "");
    }
  } else if (comma > -1) {
    if (/^\d{1,3}(,\d{3})+$/.test(cleaned)) {
      normalized = cleaned.replace(/,/g, "");
    } else {
      normalized = cleaned.replace(/\./g, "").replace(",", ".");
    }
  } else if (dot > -1) {
    if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) {
      normalized = cleaned.replace(/\./g, "");
    } else {
      const parts = cleaned.split(".");
      if (parts.length > 2) {
        const decimal = parts.pop();
        normalized = `${parts.join("")}.${decimal}`;
      }
    }
  }

  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}

function clampNumber(value, min, max) {
  const num = toNumber(value);
  if (num === null) return min;
  return Math.min(max, Math.max(min, num));
}

function roundTo(value, digits = 2) {
  const num = toNumber(value);
  if (num === null) return null;
  const factor = 10 ** digits;
  return Math.round(num * factor) / factor;
}

function isPlainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function normalizeMarketplaceSource(source) {
  const token = normalizeSearchText(source);
  if (token.includes("trendyol")) return "trendyol";
  if (token.includes("hepsiburada")) return "hepsiburada";
  return token || "bilinmiyor";
}
function safeJsonSnippet(value, maxLen) {
  try {
    const text = JSON.stringify(value);
    if (text.length <= maxLen) return text;
    return `${text.slice(0, maxLen)}...`;
  } catch {
    return "[json-error]";
  }
}

function shorten(text, maxLen) {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, Math.max(0, maxLen - 3))}...`;
}

function emptyToNull(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed === "" ? null : trimmed;
}

function csvSafe(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[,;"\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
