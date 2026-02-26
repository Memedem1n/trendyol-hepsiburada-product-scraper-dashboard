# Technical Notes (Public/Sanitized)

Date: 2026-02-26  
Scope: open-source safe documentation (no personal paths, no private scrape dumps)

## Purpose

This document summarizes the technical structure of the project in a community-safe format.  
All real/private scrape artifacts are intentionally excluded from version control.

## Architecture

1. Python scraper layer:
   - `poc_trendyol_hepsiburada.py`
   - `stage2_brand_scrape.py`
2. Dashboard layer:
   - `dashboard/index.html`
   - `dashboard/app.js`
   - `dashboard/styles.css`
3. Sample datasets:
   - `examples/sample_scrape_output.json`
   - `examples/sample_stage2_output.json`
   - `examples/sample_stage2_full_detail_output.json`
   - `examples/sample_stage2_full_detail_columns.txt`

## Data Contracts (Sample)

1. PoC output includes:
   - `query`
   - `sites[]`
   - `sites[].products[]`
2. Stage-2 basic output includes:
   - `settings`
   - `listing_totals`
   - `detail_totals`
   - `on_sale_products[]`
3. Stage-2 full-detail output includes:
   - `detail_schema`
   - `other_seller_totals`
   - `on_sale_products[].detail_columns`

## Privacy Policy (Repository Level)

1. Real scrape outputs are not committed.
2. Temporary raw page captures are not committed.
3. User-specific paths or environment details are not documented.
4. Repository only ships synthetic example data for demonstration.

## Operational Notes

1. Run scrapers locally and keep generated outputs private unless anonymized.
2. Use `dashboard/start_dashboard.ps1` and `dashboard/stop_dashboard.ps1` for dashboard runtime.
3. Dashboard default sample dataset path:
   - `../examples/sample_stage2_full_detail_output.json`

## Recommended Engineering Backlog

1. Add JSON contract validation tests.
2. Add parser smoke tests with controlled fixtures.
3. Modularize `dashboard/app.js` for maintainability.
4. Add CI checks for docs + data contract consistency.

