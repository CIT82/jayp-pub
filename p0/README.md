# External Libraries (The <head>)

## bootstrap-icons

This is an optional but officially part of Boostrap collection of icons that fit a general "Boostrap look and feel". I'm not sure exactly what said UI is yet, but there sure are a lot of them. It is free and open source. https://icons.getbootstrap.com/

### Links

<link rel="stylesheet" href="assets/libs/bootstrap-icons/bootstrap-icons.css">
<script src="assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>


## ApexCharts

This is an interactive chart rendering library in JavaScript. It appears to support a very wide variety of different chart types, and includes a generous amount of customization and animation options. I'm looking forward to discovering what this lib is capable of doing. It has a Community Edition which is what I assume is included here. https://apexcharts.com/

### Links

<link rel="stylesheet" href="assets/libs/apexcharts/apexcharts.css">
<script src="assets/libs/apexcharts/apexcharts.min.js"></script>

## FlatPickr

This is a lightweight date-time picker in JavaScript. In the demo, it shows as a dropdown-popup calendar. It is released under the MIT License. https://flatpickr.js.org/

### Links

<link rel="stylesheet" href="assets/libs/flatpickr/flatpickr.min.css">
<script src="assets/libs/flatpickr/flatpickr.min.js"></script>

## Custom CSS

### Links

<link rel="stylesheet" href="assets/css/main.css">

# Functional Blocks (Site Inventory, Top Half)

## Sidebar

Power Class: sidebar-wrapper
Lines: 32-114
Research: Defines the left sidebar menu, displayed vertically. Contains the site branding, navigation links grouped into Menu, Components, and Pages, and an administrator profile section at the bottom.

## Main

Power Class: main-wrapper
Lines: 123-624
Research: Defines the main content wrapper for everything displayed to the right of the sidebar. Contains the top navigation bar, dashboard header, main dashboard grid, and footer, effectively serving as the primary container for the page.

### Top Navbar

Power Class: navbar-custom
Lines: 126-243
Research: Defines the horizontal navigation bar across the top of the main content area. Provides sidebar controls, a Create quick-actions menu, search field, fullscreen control, notifications, and an administrator profile dropdown.

### Dashboard Header Banner

Power Class: page-header
Lines: 247-257
Research: Defines the introductory header for the dashboard, displaying the page title and a short description of its purpose. Also includes a date-range picker that allows the dashboard's reporting period to be selected.

### Main Layout Grid

Power Class: row g-4
Lines: 261-599
Research: Defines the responsive grid containing the dashboard's primary data displays and controls. Organizes summary cards, revenue and transaction information, product statistics, performance charts, and a promotional panel into responsive rows and columns.

#### Quick Info Stat Cards

Power Class: col-12
Lines: 264-360
Research: Full-width dashboard section for the update alert, Net Income, and Total Return.

#### Primary Dashboard

Power Class: col-x1-9 col-lg-8
Lines: 364-549
Research: Left portion of dashboard for Revenue, Transactions, and Product Overview.

#### Revenue

Power Class: col-12
Lines: 369-391
Research: Full-width section in primary dashboard for Revenue card and chart.

#### Transaction

Power Class: col-md-7 d-flex flex-column
Lines: 394-459
Research: Transaction list vertical flex container.

#### Product Overview

Power Class: col-md-5 d-flex flex-column
Lines: 462-545
Research: Product stats section.

#### Performance Details

Power Class: col-xl-3 col-lg-4
Lines: 552-597
Research: Right-side dashboard panel for performance chart and promo banner.

### Footer

Power Class: footer-custom
Lines: 603-621
Research: Defines the footer displayed at the bottom of the main content area. Contains brand and copyright information along with navigation links for Overview, Statistics, Help & Documentation, and Status.
