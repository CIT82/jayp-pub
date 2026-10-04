# Inventory Tracker TODO

## Phase 1: Site Architecture & Page Foundations (Complete)

- [x] Create the **Dashboard / Home** page with an inventory overview and summary statistics (`index.html`).
- [x] Create foundational inventory pages: **All Inventory** (`inventory.html`) and **Add Item** (`add-item.html`).
- [x] Create organization pages: **Categories** (`categories.html`), **Locations** (`locations.html`), and **Low Stock** (`low-stock.html`).
- [x] Create management pages: **Activity / History** (`activity.html`), **Reports** (`reports.html`), and **Import / Export** (`import-export.html`).
- [x] Create **Help / About** page shell (`about.html`) with application overview and developer info.
- [x] Create **Site Map** page (`sitemap.html`) showing site hierarchy and linking all sections.
- [x] Implement responsive sidebar/navbar navigation with **Inventory**, **Organize**, **Tools**, and **More** menus.
- [x] Establish unified theme, Bootstrap styles, KPI cards, and responsive tables.
- [x] Remove unneeded template pages and replace branding across all views.

## Phase 2: Barcode Scanning & Item Lookup (Active Milestone)
> *Goal: Enable live camera or manual UPC barcode scanning, query a static/mock catalog, and display item specifications without saving to storage.*

- [x] **Scan Interface & Viewfinder (`scan.html`)**
  - [x] Implement mobile-friendly camera viewfinder container with targeting overlay and scan guides.
  - [x] Add manual UPC entry form as a fallback / desktop testing control.
  - [x] Add camera control buttons (cancel/close, mobile playsinline support).
- [x] **Barcode Lookup Engine**
  - [x] Implement multi-provider lookup cascade with UPCitemdb and Open Food Facts APIs.
  - [x] Implement permanent client-side product database (`product-database-v1`) in `localStorage`.
  - [x] Handle unrecognized barcode state with friendly alert and link to Add Item with prefilled UPC.
- [x] **Read-Only Item Details Presentation**
  - [x] Display scanned item review card (brand, product name, quantity, unit, source badge).
  - [x] Provide direct handoff link to Add Item with prefilled URL query parameters.
- [x] **User Documentation (`about.html`)**
  - [x] Write instructions for camera barcode scanning, lighting tips, and supported code formats.

## Phase 3: Data Storage & Inventory Mutations (Upcoming)

- [ ] Implement browser local storage (`localStorage` / IndexedDB) for catalog items.
- [ ] Enable Add Item form submissions to write to local storage.
- [ ] Implement stock adjustments and count checkouts from Scan results and Inventory tables.
- [ ] Wire up Import / Export to download and load real JSON/CSV catalogs.
- [ ] Write Help / About documentation for local browser storage and backup procedures.

## Phase 4: Asset Cleanup & Final Review

- [x] Delete unreferenced template images from `assets/images/` (`avatar.png`, `spark-admin-free.png`, `user_*.jpg`).
- [x] Delete unused template authentication script (`assets/js/auth.js`).
- [ ] Clean up unused template CSS and JavaScript in `assets/css/main.css` and `assets/js/dashboard.js`.
- [ ] Check every page for dead links, placeholder text, and title consistency.
- [ ] Perform cross-browser and mobile responsive audit.
