# Inventory Tracker

A responsive, client-side inventory management web application developed for **CIT-82: Introduction to Web Development** at Fresno City College (Fall 2026) by **Jay C. Parangalan**.

Inventory Tracker allows small businesses and individuals to monitor stock levels, scan product barcodes using a device camera, organize items into categories and storage locations, log inventory transactions, and generate analytical reports.

---

## External Libraries (The `<head>` & Scripts)

### Bootstrap 5
The core UI and responsive layout framework. Provides responsive flexbox grids, dropdowns, collapse containers, and base component styling.

* **Website**: https://getbootstrap.com/
* **License**: MIT
* **Files**:
  * `<link rel="stylesheet" href="assets/libs/bootstrap/css/bootstrap.min.css">`
  * `<script src="assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>`

### Bootstrap Icons
Official icon library from Bootstrap, supplying UI icons for navigation, inventory categories, and status indicators.

* **Website**: https://icons.getbootstrap.com/
* **License**: MIT
* **Files**:
  * `<link rel="stylesheet" href="assets/libs/bootstrap-icons/bootstrap-icons.css">`

### ApexCharts
Interactive chart visualization library used for stock health donuts, category valuation bar charts, movement area charts, and dashboard trend sparklines.

* **Website**: https://apexcharts.com/
* **License**: MIT (Community Edition)
* **Files**:
  * `<link rel="stylesheet" href="assets/libs/apexcharts/apexcharts.css">`
  * `<script src="assets/libs/apexcharts/apexcharts.min.js"></script>`

### Flatpickr
Lightweight, zero-dependency date and date-range picker used for filtering inventory activity periods.

* **Website**: https://flatpickr.js.org/
* **License**: MIT
* **Files**:
  * `<link rel="stylesheet" href="assets/libs/flatpickr/flatpickr.min.css">`
  * `<script src="assets/libs/flatpickr/flatpickr.min.js"></script>`

### ZXing ("Zebra Crossing") Barcode Scanner
Client-side barcode processing library enabling live video camera scanning of 1D linear product barcodes via `getUserMedia`.

* **Repositories**: `@zxing/library` & `@zxing/browser`
* **License**: Apache-2.0
* **Files**:
  * `<script src="assets/libs/zxing/zxing.min.js"></script>`
  * `<script src="assets/libs/zxing/zxing-browser.min.js"></script>`

### Custom Stylesheet
* **File**: `<link rel="stylesheet" href="assets/css/main.css">`
* **Description**: Central design system defining color palettes (forest green `#072F1F`, lime accent `#B4F105`), custom card styling, responsive navigation layouts, and reusable utility classes.

---

## Custom Application Scripts

### `dashboard.js`
* **Path**: `assets/js/dashboard.js`
* **Purpose**: Manages global UI interactions across the site, including:
  * Mobile sidebar off-canvas toggle and backdrop overlay.
  * Desktop sidebar minimization (`#desktop-sidebar-toggle`).
  * Fullscreen mode toggle (`#btn-fullscreen`).
  * Flatpickr date range picker initialization on the dashboard.
  * ApexCharts renderers for dashboard and analytics views.

### `scanner.js`
* **Path**: `assets/js/scanner.js`
* **Purpose**: Core barcode detection, lookup, and database module (`UPCScanner` namespace):
  * `BrowserScanner`: Camera lifecycle management via ZXing, constrained to 1D barcodes (`UPC-A`, `UPC-E`, `EAN-13`, `Code 128`).
  * `lookupProductByUpc`: Multi-provider catalog cascade querying UPCitemdb Trial API first, then cascading to Open Food Facts v2 API.
  * Client-side Database: Automatically persists successful barcode lookups to `localStorage` under `product-database-v1` for offline availability.
  * Quantity & Unit Heuristics: Regex-based parsing to extract package counts and standardized measurement units (e.g., fl oz, tablets, mL).

### `scan-page.js`
* **Path**: `assets/js/scan-page.js`
* **Purpose**: Interactive controller for `scan.html`:
  * Camera overlay lifecycle with viewfinder targeting box and laser guide.
  * Manual UPC entry, sample code presets, and validation feedback.
  * Acquisition review card with JSON export and handoff to the Add Item form.
  * Recent scans history rendering with clear history controls.

---

## Functional Blocks & Component Architecture (`index.html`)

### 1. Sidebar Navigation
* **Selector / Class**: `.sidebar-wrapper` (`#sidebar`)
* **Description**: Dark-forest sticky vertical navigation containing brand identity and collapsible navigation groups:
  * **Dashboard**: Direct link to home.
  * **Inventory**: Expandable menu for *All Inventory*, *Scan Item*, and *Add Item*.
  * **Organize**: Expandable menu for *Categories*, *Locations*, and *Low Stock*.
  * **Tools**: Expandable menu for *Activity / History*, *Reports*, and *Import / Export*.
  * **More**: Expandable menu for *Help / About* and *Site Map*.

### 2. Main Content Wrapper
* **Selector / Class**: `.main-wrapper`
* **Description**: Primary layout container housing the top navbar, page header, content grid, and footer.

### 3. Top Navbar
* **Selector / Class**: `.navbar-custom`
* **Description**: Horizontal header bar providing:
  * Sidebar minimize/expand controls for desktop and mobile.
  * Quick Actions dropdown with shortcuts to *Scan Item*, *Add Item*, and *Import Inventory*.
  * Inventory search input pill.
  * Fullscreen toggle, notification dropdown with active low-stock alerts, and Resources profile menu.

### 4. Dashboard Header Banner
* **Selector / Class**: `.page-header`
* **Description**: Introductory header displaying the page title, summary subtitle, and the interactive Flatpickr activity period date picker button (`#date-picker-trigger`).

### 5. Main Layout Grid
* **Selector / Class**: `.row.g-4`
* **Description**: Responsive two-column dashboard grid.

#### A. Quick Info Stat Cards (Full Width)
* **Selector / Class**: `.col-12`
* **Components**:
  * **Stock Alert Card** (`.alert-green-card`): Highlight banner warning of items reaching reorder thresholds, linking to `low-stock.html`.
  * **Items Added Card** (`.card-stat`): KPI card displaying items added during the period (196) with positive trend badge and sparkline chart (`#income-sparkline`).
  * **Items Removed Card** (`.card-stat`): KPI card displaying items removed/adjusted (32) with reduction trend badge and sparkline chart (`#return-sparkline`).

#### B. Primary Dashboard Section
* **Selector / Class**: `.col-xl-9.col-lg-8`
* **Components**:
  * **Inventory Activity Over Time**: Full-width card with ApexCharts bar chart (`#revenue-chart`) plotting additions vs. removals over time.
  * **Recent Activity** (`.col-md-7`): Audit feed displaying latest logged movements (stock intakes, item moves, quantity adjustments).
  * **Stock Overview** (`.col-md-5`): Breakdown displaying category metrics and progress bars for Healthy Stock, Low Stock, Recently Added, Out of Stock, Categorized, and Location Assigned counts.

#### C. Performance Details Panel
* **Selector / Class**: `.col-xl-3.col-lg-4`
* **Components**:
  * **Inventory by Category Card**: ApexCharts donut chart (`#views-chart`) displaying relative stock share across primary departments.
  * **Scan Item CTA Banner** (`.promo-banner-card`): Quick-action callout card with decorative geometric SVG leading directly to the camera barcode scanner (`scan.html`).

### 6. Footer
* **Selector / Class**: `.footer-custom`
* **Description**: Bottom page footer displaying copyright notices, template attributions, and navigation links to *Dashboard*, *Help / About*, and *Site Map*.

---

## Application Pages Directory

| Page | File | Purpose |
| :--- | :--- | :--- |
| **Dashboard** | [`index.html`](index.html) | Central operations overview, KPI summary stat cards, stock progress bars, and recent activity. |
| **All Inventory** | [`inventory.html`](inventory.html) | Comprehensive catalog table with search filtering, status indicators, and stock count records. |
| **Scan Item** | [`scan.html`](scan.html) | Live camera barcode scanner and manual UPC lookup against free online product catalogs. |
| **Add Item** | [`add-item.html`](add-item.html) | New item registration form supporting SKUs, categories, locations, stock thresholds, and scan prefill. |
| **Categories** | [`categories.html`](categories.html) | Product classification grid with valuation totals and an ApexCharts distribution treemap. |
| **Locations** | [`locations.html`](locations.html) | Multi-facility tracking (Stores #1 & #2, Storage Annex) with capacity utilization bar charts. |
| **Low Stock** | [`low-stock.html`](low-stock.html) | Critical reorder monitoring table listing items below threshold levels with deficit counts. |
| **Activity / History** | [`activity.html`](activity.html) | Audit log and 7-day velocity trend chart tracking all inbound intakes, checkouts, and relocations. |
| **Reports** | [`reports.html`](reports.html) | Inventory valuation analytics, turnover metrics, stock health donuts, and top velocity items. |
| **Import / Export** | [`import-export.html`](import-export.html) | Batch catalog data transfer interface supporting CSV spreadsheets and JSON backup archives. |
| **Help / About** | [`about.html`](about.html) | Application background, developer information, and comprehensive camera barcode scanning guide. |
| **Site Map** | [`sitemap.html`](sitemap.html) | Complete hierarchical site directory with touch-friendly navigation jump chips. |
| **Page Skeleton** | [`skeleton.html`](skeleton.html) | Developer starter template containing standardized shell components for creating new pages. |

---

## Barcode Scanning & Product Lookup Architecture

The barcode scanning workflow operates completely client-side in the browser:

```
[ Device Camera / Manual Entry ]
                │
                ▼
      [ ZXing 1D Decoder ]
   (UPC-A, UPC-E, EAN-13, Code 128)
                │
                ▼
       [ UPC Validation ]  ──(Non-numeric)──> [ Prompt Manual Entry ]
                │
                ▼
  [ Local Product Database ]  ──(Hit)───────> [ Display Cached Result ]
  (localStorage: product-database-v1)
                │
             (Miss)
                ▼
    [ Provider A: UPCitemdb ]  ──(Found)─────> [ Normalize & Save to Local DB ]
                │
             (Miss)
                ▼
  [ Provider B: Open Food Facts ] ──(Found)──> [ Normalize & Save to Local DB ]
                │
             (Miss)
                ▼
   [ Friendly Alert + Link to Add Item Form with prefilled UPC ]
```

* **Supported 1D Formats**: North American UPC-A / UPC-E, international EAN-13, and linear Code 128 barcodes.
* **Numeric Code Requirement**: Online catalog queries require numeric UPC/EAN identifiers (`/^\d+$/`). Alphanumeric codes decoded by the camera direct the user to manual entry.
* **Persistent Local Database**: Acquired products are permanently stored in the browser's `localStorage` (`product-database-v1`), enabling instant offline lookups on repeat scans.
