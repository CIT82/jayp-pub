/* 
========================================================================
   BOOTSTRAP 5 ADMIN TEMPLATE - SPARK ADMIN
   DASHBOARD CORE JAVASCRIPT MODULE
   Developed with premium UI/UX standards

   Template Name: Spark Admin
   Version: 1.0 
   Author: Spark Admin Team 
   Email: hello.sparkadmin@gmail.com
   URL: https://sparkadmin.web.id
========================================================================
*/

document.addEventListener('DOMContentLoaded', function () {
    // -----------------------------------------------------------------
    // 1. Mobile Sidebar Toggle & Backdrop Overlay
    // -----------------------------------------------------------------
    const sidebar = document.querySelector('.sidebar-wrapper');
    const toggleBtn = document.querySelector('.sidebar-toggle-btn');
    
    // Create and append backdrop overlay for mobile sidebar
    let overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            sidebar.classList.toggle('show');
            overlay.classList.toggle('show', sidebar.classList.contains('show'));
        });

        // Close sidebar when clicking on backdrop overlay
        overlay.addEventListener('click', function () {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        });
    }


    // -----------------------------------------------------------------
    // 2. Revenue Chart (Vertical Bar Chart - Income vs Expenses)
    // -----------------------------------------------------------------
    const revenueChartEl = document.querySelector('#revenue-chart');
    if (revenueChartEl) {
        const revenueChartOptions = {
            series: [
                {
                    name: 'Income',
                    data: [44, 55, 41, 67, 52, 70, 61, 85]
                },
                {
                    name: 'Expenses',
                    data: [23, 33, 30, 48, 34, 45, 40, 45]
                }
            ],
            chart: {
                type: 'bar',
                height: 220,
                stacked: false,
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                },
                fontFamily: 'Plus Jakarta Sans, sans-serif'
            },
            colors: ['#072F1F', '#B4F105'], // Dark Green (Income), Lime Green (Expenses)
            states: {
                hover: {
                    filter: {
                        type: 'none'
                    }
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '48%',
                    borderRadius: 0
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            legend: {
                show: false // Custom legends are drawn statically in HTML to match reference layout
            },
            grid: {
                borderColor: '#E9EFEF',
                strokeDashArray: 4,
                yaxis: {
                    lines: {
                        show: true
                    }
                },
                xaxis: {
                    lines: {
                        show: false
                    }
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                }
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                labels: {
                    style: {
                        colors: '#6C7E75',
                        fontSize: '11px',
                        fontWeight: 500
                    }
                },
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                }
            },
            yaxis: {
                labels: {
                    show: false // Hides absolute numbers to match simplified reference chart style
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return "$ " + val + ".000";
                    }
                },
                theme: 'dark'
            }
        };

        const revenueChart = new ApexCharts(revenueChartEl, revenueChartOptions);
        revenueChart.render();
    }

    // -----------------------------------------------------------------
    // 3. Total View Performance Chart (Donut Chart)
    // -----------------------------------------------------------------
    const viewsChartEl = document.querySelector('#views-chart');
    if (viewsChartEl) {
        const viewsChartOptions = {
            series: [68, 23, 16], // View Count (68%), Percentage (23%), Sales (16%)
            chart: {
                type: 'donut',
                height: 250,
                fontFamily: 'Plus Jakarta Sans, sans-serif'
            },
            labels: ['View Count', 'Percentage', 'Sales'],
            colors: ['#B4F105', '#051C12', '#F97316'], // Lime, Forest Dark, Orange
            states: {
                hover: {
                    filter: {
                        type: 'none'
                    }
                }
            },
            legend: {
                show: false // Custom HTML legend used below the chart
            },
            dataLabels: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '72%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '12px',
                                fontWeight: 500,
                                color: '#6C7E75',
                                offsetY: -8
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                fontWeight: 800,
                                color: '#0B130F',
                                offsetY: 8,
                                formatter: function (val) {
                                    return val + "%";
                                }
                            },
                            total: {
                                show: true,
                                label: 'Total Count',
                                fontSize: '11px',
                                fontWeight: 500,
                                color: '#6C7E75',
                                formatter: function (w) {
                                    return '565K';
                                }
                            }
                        }
                    }
                }
            },
            tooltip: {
                theme: 'dark'
            }
        };

        const viewsChart = new ApexCharts(viewsChartEl, viewsChartOptions);
        viewsChart.render();
    }

    // -----------------------------------------------------------------
    // 4. Sparkline Charts (Net Income & Total Return)
    // -----------------------------------------------------------------
    const incomeSparkOptions = {
        series: [{
            name: 'Net Income',
            data: [45, 51, 46, 58, 50, 62, 55, 72, 65, 79, 70, 85]
        }],
        chart: {
            type: 'area',
            height: 45,
            sparkline: {
                enabled: true
            },
            fontFamily: 'Plus Jakarta Sans, sans-serif'
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        fill: {
            opacity: 0.1,
            type: 'solid'
        },
        colors: ['#22C55E'], // Green color matching trend-up
        tooltip: {
            fixed: {
                enabled: false
            },
            x: {
                show: false
            },
            y: {
                title: {
                    formatter: function (seriesName) {
                        return '';
                    }
                }
            },
            marker: {
                show: false
            }
        }
    };

    const returnSparkOptions = {
        series: [{
            name: 'Total Return',
            data: [50, 48, 55, 45, 40, 38, 42, 35, 30, 28, 32, 24]
        }],
        chart: {
            type: 'area',
            height: 45,
            sparkline: {
                enabled: true
            },
            fontFamily: 'Plus Jakarta Sans, sans-serif'
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        fill: {
            opacity: 0.1,
            type: 'solid'
        },
        colors: ['#EF4444'], // Red color matching trend-down
        tooltip: {
            fixed: {
                enabled: false
            },
            x: {
                show: false
            },
            y: {
                title: {
                    formatter: function (seriesName) {
                        return '';
                    }
                }
            },
            marker: {
                show: false
            }
        }
    };

    const incomeSparkEl = document.querySelector('#income-sparkline');
    if (incomeSparkEl) {
        const incomeSpark = new ApexCharts(incomeSparkEl, incomeSparkOptions);
        incomeSpark.render();
    }

    const returnSparkEl = document.querySelector('#return-sparkline');
    if (returnSparkEl) {
        const returnSpark = new ApexCharts(returnSparkEl, returnSparkOptions);
        returnSpark.render();
    }

    // -----------------------------------------------------------------
    // 5. Flatpickr Date Range Picker Initialization
    // -----------------------------------------------------------------
    const datePickerTrigger = document.querySelector('#date-picker-trigger');
    const selectedRangeText = document.querySelector('#selected-date-range');
    
    if (datePickerTrigger && selectedRangeText) {
        flatpickr(datePickerTrigger, {
            mode: 'range',
            dateFormat: 'Y-m-d',
            defaultDate: ['2026-01-12', '2026-01-23'],
            onValueUpdate: function (selectedDates, dateStr, instance) {
                if (selectedDates.length === 2) {
                    const startStr = instance.formatDate(selectedDates[0], 'F j, Y');
                    const endStr = instance.formatDate(selectedDates[1], 'F j, Y');
                    selectedRangeText.textContent = `${startStr} - ${endStr}`;
                } else if (selectedDates.length === 1) {
                    const startStr = instance.formatDate(selectedDates[0], 'F j, Y');
                    selectedRangeText.textContent = startStr;
                }
            }
        });
    }

    // -----------------------------------------------------------------
    // 6. Desktop Sidebar Minimize Interaction
    // -----------------------------------------------------------------
    const desktopToggleBtn = document.querySelector('#desktop-sidebar-toggle');
    if (desktopToggleBtn) {
        desktopToggleBtn.addEventListener('click', function () {
            document.body.classList.toggle('sidebar-minimized');
            
            // Toggle icon direction
            const icon = desktopToggleBtn.querySelector('i');
            if (icon) {
                if (document.body.classList.contains('sidebar-minimized')) {
                    icon.className = 'bi bi-chevron-bar-right';
                } else {
                    icon.className = 'bi bi-chevron-bar-left';
                }
            }
            
            // Trigger a window resize event so that charts (ApexCharts) redraw correctly
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 300);
        });
    }

    // -----------------------------------------------------------------
    // 7. Fullscreen Toggle Interaction
    // -----------------------------------------------------------------
    const fullscreenBtn = document.querySelector('#btn-fullscreen');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function () {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().then(() => {
                    updateFullscreenIcon(true);
                }).catch(err => {
                    console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
                });
            } else {
                document.exitFullscreen().then(() => {
                    updateFullscreenIcon(false);
                }).catch(err => {
                    console.error(`Error attempting to exit fullscreen mode: ${err.message}`);
                });
            }
        });

        function updateFullscreenIcon(isFullscreen) {
            const icon = fullscreenBtn.querySelector('i');
            if (icon) {
                if (isFullscreen) {
                    icon.className = 'bi bi-fullscreen-exit';
                } else {
                    icon.className = 'bi bi-arrows-fullscreen';
                }
            }
        }

        // Listen for browser native fullscreen changes (e.g. Esc key)
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                updateFullscreenIcon(true);
            } else {
                updateFullscreenIcon(false);
            }
        });
    }

    // -----------------------------------------------------------------
    // 8. Reports Page Charts (Category Valuation Bar & Stock Health Donut)
    // -----------------------------------------------------------------
    const catValuationEl = document.querySelector('#category-valuation-chart');
    if (catValuationEl) {
        const catValuationOptions = {
            series: [{
                name: 'Valuation ($)',
                data: [18400, 7820, 6240, 4030, 3910, 2450]
            }],
            chart: {
                type: 'bar',
                height: 250,
                toolbar: { show: false },
                fontFamily: 'Plus Jakarta Sans, sans-serif'
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: true,
                    barHeight: '58%',
                    distributed: true
                }
            },
            colors: ['#072F1F', '#B4F105', '#1B4D3E', '#FFB703', '#2A9D8F', '#E76F51'],
            dataLabels: {
                enabled: true,
                textAnchor: 'start',
                style: {
                    colors: ['#212529'],
                    fontSize: '11px',
                    fontWeight: 600
                },
                formatter: function (val) {
                    return '$' + Number(val).toLocaleString();
                },
                offsetX: 10
            },
            xaxis: {
                categories: ['Electronics', 'Packaging', 'Hardware', 'Safety', 'Office Supplies', 'Food & Bev'],
                labels: {
                    style: { colors: '#6C7E75', fontSize: '11px' },
                    formatter: function (val) {
                        return '$' + (val / 1000) + 'k';
                    }
                },
                axisBorder: { show: false }
            },
            yaxis: {
                labels: {
                    style: { colors: '#212529', fontSize: '12px', fontWeight: 600 }
                }
            },
            grid: {
                borderColor: '#E9EFEF',
                strokeDashArray: 3,
                xaxis: { lines: { show: true } },
                yaxis: { lines: { show: false } }
            },
            legend: { show: false },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: function (val) {
                        return '$' + Number(val).toLocaleString();
                    }
                }
            }
        };
        const catValuationChart = new ApexCharts(catValuationEl, catValuationOptions);
        catValuationChart.render();
    }

    const stockHealthEl = document.querySelector('#stock-health-chart');
    if (stockHealthEl) {
        const stockHealthOptions = {
            series: [1258, 20, 6],
            labels: ['Healthy Stock', 'Low Stock Alert', 'Out of Stock'],
            chart: {
                type: 'donut',
                height: 230,
                fontFamily: 'Plus Jakarta Sans, sans-serif'
            },
            colors: ['#072F1F', '#FFB703', '#DC3545'],
            dataLabels: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '72%',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '12px',
                                color: '#6C7E75',
                                offsetY: -4
                            },
                            value: {
                                show: true,
                                fontSize: '22px',
                                fontWeight: 700,
                                color: '#072F1F',
                                offsetY: 4,
                                formatter: function (val) {
                                    return Number(val).toLocaleString();
                                }
                            },
                            total: {
                                show: true,
                                label: 'Total SKUs',
                                fontSize: '11px',
                                color: '#6C7E75',
                                formatter: function () {
                                    return '1,284';
                                }
                            }
                        }
                    }
                }
            },
            stroke: { width: 2, colors: ['#ffffff'] },
            legend: {
                position: 'bottom',
                fontSize: '12px',
                markers: { radius: 12 },
                itemMargin: { horizontal: 8, vertical: 4 }
            },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: function (val) {
                        const total = 1284;
                        const pct = ((val / total) * 100).toFixed(1);
                        return val + ' units (' + pct + '%)';
                    }
                }
            }
        };
        const stockHealthChart = new ApexCharts(stockHealthEl, stockHealthOptions);
        stockHealthChart.render();
    }

    // -----------------------------------------------------------------
    // 9. Locations Page Chart (Capacity vs Current Units)
    // -----------------------------------------------------------------
    const locCapacityEl = document.querySelector('#location-capacity-chart');
    if (locCapacityEl) {
        const locCapacityOptions = {
            series: [
                {
                    name: 'Current Stock (Units)',
                    data: [520, 340, 424]
                },
                {
                    name: 'Max Shelf Capacity',
                    data: [660, 530, 520]
                }
            ],
            chart: {
                type: 'bar',
                height: 240,
                toolbar: { show: false },
                fontFamily: 'Plus Jakarta Sans, sans-serif'
            },
            colors: ['#072F1F', '#B4F105'],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '42%',
                    borderRadius: 3
                }
            },
            dataLabels: { enabled: false },
            stroke: { show: true, width: 2, colors: ['transparent'] },
            xaxis: {
                categories: ['Downtown Retail (Store #1)', 'Westside Branch (Store #2)', 'Central Storage Annex'],
                labels: {
                    style: { colors: '#212529', fontSize: '12px', fontWeight: 600 }
                },
                axisBorder: { show: false }
            },
            yaxis: {
                labels: {
                    style: { colors: '#6C7E75', fontSize: '11px' },
                    formatter: function (val) {
                        return val + ' units';
                    }
                }
            },
            grid: {
                borderColor: '#E9EFEF',
                strokeDashArray: 3,
                yaxis: { lines: { show: true } }
            },
            legend: { show: false },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: function (val) {
                        return val + ' units';
                    }
                }
            }
        };
        const locCapacityChart = new ApexCharts(locCapacityEl, locCapacityOptions);
        locCapacityChart.render();
    }

    // -----------------------------------------------------------------
    // 10. Activity Page Chart (7-Day Stock Velocity Area Trend)
    // -----------------------------------------------------------------
    const activityTrendEl = document.querySelector('#activity-trend-chart');
    if (activityTrendEl) {
        const activityTrendOptions = {
            series: [
                {
                    name: 'Inbound (Units Received)',
                    data: [42, 68, 35, 80, 55, 30, 32]
                },
                {
                    name: 'Outbound (Units Used / Sold)',
                    data: [18, 24, 28, 20, 26, 16, 14]
                }
            ],
            chart: {
                type: 'area',
                height: 230,
                toolbar: { show: false },
                zoom: { enabled: false },
                fontFamily: 'Plus Jakarta Sans, sans-serif'
            },
            colors: ['#B4F105', '#072F1F'],
            dataLabels: { enabled: false },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.45,
                    opacityTo: 0.05,
                    stops: [0, 95, 100]
                }
            },
            xaxis: {
                categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                labels: {
                    style: { colors: '#6C7E75', fontSize: '11px', fontWeight: 500 }
                },
                axisBorder: { show: false }
            },
            yaxis: {
                labels: {
                    style: { colors: '#6C7E75', fontSize: '11px' }
                }
            },
            grid: {
                borderColor: '#E9EFEF',
                strokeDashArray: 3,
                yaxis: { lines: { show: true } }
            },
            legend: { show: false },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: function (val) {
                        return val + ' units';
                    }
                }
            }
        };
        const activityTrendChart = new ApexCharts(activityTrendEl, activityTrendOptions);
        activityTrendChart.render();
    }

    // -----------------------------------------------------------------
    // 11. Categories Page Chart (Category Item Treemap)
    // -----------------------------------------------------------------
    const catTreemapEl = document.querySelector('#category-treemap-chart');
    if (catTreemapEl) {
        const catTreemapOptions = {
            series: [
                {
                    data: [
                        { x: 'Packaging & Shipping', y: 412 },
                        { x: 'Safety & Maintenance', y: 217 },
                        { x: 'Office Supplies', y: 215 },
                        { x: 'Electronics', y: 184 },
                        { x: 'Hardware & Tools', y: 164 },
                        { x: 'Food & Beverage', y: 92 }
                    ]
                }
            ],
            chart: {
                type: 'treemap',
                height: 240,
                toolbar: { show: false },
                fontFamily: 'Plus Jakarta Sans, sans-serif'
            },
            colors: ['#072F1F', '#1B4D3E', '#2D6A4F', '#40916C', '#52B788', '#B4F105'],
            plotOptions: {
                treemap: {
                    distributed: true,
                    enableShades: false,
                    borderRadius: 4
                }
            },
            dataLabels: {
                enabled: true,
                style: {
                    fontSize: '12px',
                    fontWeight: 600,
                    colors: ['#ffffff']
                },
                formatter: function (text, op) {
                    return [text, op.value + ' items'];
                },
                offsetY: -2
            },
            legend: { show: false },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: function (val) {
                        const total = 1284;
                        const pct = ((val / total) * 100).toFixed(1);
                        return val + ' items (' + pct + '% of catalog)';
                    }
                }
            }
        };
        const catTreemapChart = new ApexCharts(catTreemapEl, catTreemapOptions);
        catTreemapChart.render();
    }
});

