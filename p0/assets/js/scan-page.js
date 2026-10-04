/**
 * Inventory Tracker - Scan Page Interactive UI Controller
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // DOM Elements
  const upcInput = document.getElementById('upc-input');
  const btnClearUpc = document.getElementById('btn-clear-upc');
  const btnStartScanner = document.getElementById('btn-start-scanner');
  const btnLookup = document.getElementById('btn-lookup-upc');
  const btnDemoSample = document.getElementById('btn-demo-sample');
  const lookupAlert = document.getElementById('lookup-alert');

  // Scanner Overlay Elements
  const scannerOverlay = document.getElementById('scanner-overlay');
  const scannerVideo = document.getElementById('scanner-video');
  const btnCancelScan = document.getElementById('btn-cancel-scan');
  const btnCloseScanner = document.getElementById('btn-close-scanner');

  // Result View Elements
  const resultStatusBadge = document.getElementById('result-status-badge');
  const resultStateLoading = document.getElementById('result-state-loading');
  const resultStateEmpty = document.getElementById('result-state-empty');
  const resultStateData = document.getElementById('result-state-data');

  // Attribution & Form Fields
  const attributionTitle = document.getElementById('attribution-title');
  const attributionNote = document.getElementById('attribution-note');
  const sourceBadge = document.getElementById('source-badge');

  const fieldBrand = document.getElementById('field-brand');
  const fieldUpc = document.getElementById('field-upc');
  const fieldName = document.getElementById('field-name');
  const fieldQty = document.getElementById('field-qty');
  const fieldUnit = document.getElementById('field-unit');

  // Action Buttons
  const btnUseInAddItem = document.getElementById('btn-use-in-add-item');
  const btnCopyJson = document.getElementById('btn-copy-json');
  const btnClearResult = document.getElementById('btn-clear-result');

  // History & Local Database
  const recentScansList = document.getElementById('recent-scans-list');
  const btnClearHistory = document.getElementById('btn-clear-history');

  // Scanner Instance
  let scannerInstance = null;

  /**
   * Helper to display alerts in the lookup card
   */
  function showAlert(message, type = 'danger', actionHtml = '') {
    if (!lookupAlert) return;
    lookupAlert.className = `alert alert-${type} mt-3 mb-0 d-flex flex-column gap-2`;
    lookupAlert.innerHTML = `
      <div class="d-flex align-items-start gap-2">
        <i class="bi ${type === 'danger' || type === 'warning' ? 'bi-exclamation-triangle-fill text-' + type : 'bi-info-circle-fill text-' + type} fs-5 mt-1 flex-shrink-0"></i>
        <div class="flex-grow-1">
          <div class="small fw-semibold text-dark">${message}</div>
          ${actionHtml ? `<div class="mt-2">${actionHtml}</div>` : ''}
        </div>
      </div>
    `;
    lookupAlert.classList.remove('d-none');
  }

  function hideAlert() {
    if (lookupAlert) {
      lookupAlert.classList.add('d-none');
      lookupAlert.innerHTML = '';
    }
  }

  /**
   * Shows or hides the clear button based on input value
   */
  function updateClearButton() {
    if (btnClearUpc && upcInput) {
      btnClearUpc.style.display = upcInput.value.trim().length > 0 ? 'block' : 'none';
    }
  }

  if (upcInput) {
    upcInput.addEventListener('input', function () {
      updateClearButton();
      hideAlert();
    });
  }

  if (btnClearUpc) {
    btnClearUpc.addEventListener('click', function () {
      if (upcInput) {
        upcInput.value = '';
        upcInput.focus();
      }
      updateClearButton();
      hideAlert();
    });
  }

  /**
   * Initialize and Start Camera Scanner
   */
  async function openCameraScanner() {
    hideAlert();

    if (!window.UPCScanner || !window.UPCScanner.BrowserScanner) {
      showAlert('Scanner module is still loading or failed to load. Please refresh.', 'warning');
      return;
    }

    if (!window.UPCScanner.BrowserScanner.isSupported()) {
      showAlert(
        'Camera API is not supported on this browser or device. Please type or paste the UPC barcode manually below.',
        'warning'
      );
      return;
    }

    // Show scanner overlay
    if (scannerOverlay) {
      scannerOverlay.classList.remove('d-none');
      document.body.style.overflow = 'hidden';
    }

    try {
      scannerInstance = new window.UPCScanner.BrowserScanner(
        scannerVideo,
        // onScan callback
        function (normalizedBarcode) {
          closeCameraScanner();
          if (upcInput) {
            upcInput.value = normalizedBarcode;
            updateClearButton();
          }
          // Automatically invoke lookup after successful camera scan
          performLookup(normalizedBarcode);
        },
        // onError callback
        function (err) {
          closeCameraScanner();
          handleCameraError(err);
        }
      );

      await scannerInstance.start();
    } catch (err) {
      closeCameraScanner();
      handleCameraError(err);
    }
  }

  /**
   * Closes the camera scanner overlay and stops streams
   */
  function closeCameraScanner() {
    if (scannerInstance) {
      scannerInstance.stop();
      scannerInstance = null;
    }
    if (scannerOverlay) {
      scannerOverlay.classList.add('d-none');
      document.body.style.overflow = '';
    }
  }

  /**
   * Handles camera access errors gracefully
   */
  function handleCameraError(err) {
    console.error('Camera Scanner Error:', err);
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      showAlert(
        'Camera access was denied. Please allow camera permissions in your browser address bar to scan barcodes, or enter the UPC manually.',
        'warning'
      );
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      showAlert(
        'No camera device was detected on this system. You can enter the UPC barcode number manually below.',
        'warning'
      );
    } else {
      showAlert(
        `Unable to access camera (${err.message || 'unknown error'}). Please enter the UPC barcode manually.`,
        'danger'
      );
    }
  }

  // Scanner button events
  if (btnStartScanner) {
    btnStartScanner.addEventListener('click', openCameraScanner);
  }
  if (btnCancelScan) {
    btnCancelScan.addEventListener('click', closeCameraScanner);
  }
  if (btnCloseScanner) {
    btnCloseScanner.addEventListener('click', closeCameraScanner);
  }

  // Keyboard escape closes camera
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && scannerOverlay && !scannerOverlay.classList.contains('d-none')) {
      closeCameraScanner();
    }
  });

  /**
   * Executes Product Lookup
   */
  async function performLookup(rawUpc) {
    hideAlert();

    const validation = window.UPCScanner.validateUpc(rawUpc);
    if (!validation.valid) {
      if (validation.reason === 'alphanumeric') {
        const manualAction = `
          <a href="add-item.html?barcode=${encodeURIComponent(rawUpc.trim())}" class="btn btn-sm btn-dark-custom py-1 px-3 mt-1">
            <span class="icon-wrap"><i class="bi bi-pencil-square"></i></span>
            <span>Enter Item Details Manually</span>
          </a>
        `;
        showAlert(validation.message, 'warning', manualAction);
      } else {
        showAlert(validation.message, 'warning');
      }
      return;
    }

    const upc = validation.upc;

    // Check offline status
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      // Check if it's stored in local database
      const stored = window.UPCScanner.getProductFromDb(upc);
      if (!stored) {
        showAlert(
          'Your device is currently offline. You can still view previously saved items or enter item details manually.',
          'warning',
          `<a href="add-item.html?barcode=${encodeURIComponent(upc)}" class="btn btn-sm btn-dark-custom py-1 px-3 mt-1">
            <span>Continue to Add Item Form</span>
          </a>`
        );
        return;
      }
    }

    // Set UI to loading state
    setResultState('loading');
    if (resultStatusBadge) {
      resultStatusBadge.innerHTML = '<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">Searching...</span>';
    }

    try {
      const product = await window.UPCScanner.lookupProductByUpc(upc);
      displayProductData(product);
      renderRecentScans();
    } catch (err) {
      console.warn('Product lookup failed:', err);
      setResultState('empty');

      if (resultStatusBadge) {
        resultStatusBadge.innerHTML = '<span class="badge bg-danger-subtle text-danger border border-danger-subtle">Not Found</span>';
      }

      const manualAction = `
        <a href="add-item.html?barcode=${encodeURIComponent(upc)}" class="btn btn-sm btn-dark-custom py-1 px-3 mt-1">
          <span class="icon-wrap"><i class="bi bi-plus-square"></i></span>
          <span>Add Item Manually With UPC ${upc}</span>
        </a>
      `;

      showAlert(
        err.message || `No product information was found for UPC ${upc}. Please enter details manually.`,
        'danger',
        manualAction
      );
    }
  }

  /**
   * Switch between visual result states ('loading', 'empty', 'data')
   */
  function setResultState(state) {
    if (resultStateLoading) resultStateLoading.classList.add('d-none');
    if (resultStateEmpty) resultStateEmpty.classList.add('d-none');
    if (resultStateData) resultStateData.classList.add('d-none');

    if (state === 'loading' && resultStateLoading) {
      resultStateLoading.classList.remove('d-none');
    } else if (state === 'data' && resultStateData) {
      resultStateData.classList.remove('d-none');
    } else if (resultStateEmpty) {
      resultStateEmpty.classList.remove('d-none');
    }
  }

  /**
   * Populates the review card with acquired product data
   */
  function displayProductData(product) {
    setResultState('data');

    if (resultStatusBadge) {
      resultStatusBadge.innerHTML = '<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-check-circle-fill me-1"></i> Acquired</span>';
    }

    // Attribution banner & note
    if (sourceBadge) {
      sourceBadge.textContent = product.source;
    }
    if (attributionTitle) {
      attributionTitle.textContent = `Found via ${product.source}`;
    }
    if (attributionNote) {
      if (product.fromDatabase || product.cached) {
        attributionNote.textContent = `Loaded from local product database (${product.source}). Review before saving.`;
      } else {
        attributionNote.textContent = `Filled from ${product.source}. Review before saving.`;
      }
    }

    // Form fields
    if (fieldBrand) fieldBrand.value = product.brand || 'Unknown brand';
    if (fieldUpc) fieldUpc.value = product.upc || '';
    if (fieldName) fieldName.value = product.packageName || 'Unknown product';
    if (fieldQty) fieldQty.value = product.packageQuantity || 1;
    if (fieldUnit) fieldUnit.value = product.unitLabel || 'units';

    // Configure "Use in Add Item Form" link
    if (btnUseInAddItem) {
      const params = new URLSearchParams({
        name: product.packageName || '',
        barcode: product.upc || '',
        brand: product.brand || '',
        qty: String(product.packageQuantity || 1),
        unit: product.unitLabel || 'units'
      });
      btnUseInAddItem.href = `add-item.html?${params.toString()}`;
    }
  }

  /**
   * Manual lookup trigger via button or form submit
   */
  if (btnLookup) {
    btnLookup.addEventListener('click', function (e) {
      e.preventDefault();
      const val = upcInput ? upcInput.value.trim() : '';
      performLookup(val);
    });
  }

  const lookupForm = document.getElementById('upc-lookup-form');
  if (lookupForm) {
    lookupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const val = upcInput ? upcInput.value.trim() : '';
      performLookup(val);
    });
  }

  /**
   * Try Sample UPC button
   */
  const sampleUpcs = [
    { upc: '012000000133', name: 'Pepsi Cola 12 Fl Oz' },
    { upc: '737628064502', name: 'Thai Kitchen Peanut Noodles' },
    { upc: '041220576920', name: 'HEB Market Item' }
  ];
  let sampleIndex = 0;

  if (btnDemoSample) {
    btnDemoSample.addEventListener('click', function () {
      const sample = sampleUpcs[sampleIndex % sampleUpcs.length];
      sampleIndex++;
      if (upcInput) {
        upcInput.value = sample.upc;
        updateClearButton();
      }
      performLookup(sample.upc);
    });
  }

  /**
   * Copy JSON button
   */
  if (btnCopyJson) {
    btnCopyJson.addEventListener('click', async function () {
      const data = {
        upc: fieldUpc ? fieldUpc.value : '',
        brand: fieldBrand ? fieldBrand.value : '',
        packageName: fieldName ? fieldName.value : '',
        packageQuantity: fieldQty ? parseFloat(fieldQty.value) || 1 : 1,
        unitLabel: fieldUnit ? fieldUnit.value : 'units'
      };

      try {
        await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        const originalHtml = btnCopyJson.innerHTML;
        btnCopyJson.innerHTML = '<i class="bi bi-check2 text-success me-1"></i> Copied!';
        setTimeout(() => {
          btnCopyJson.innerHTML = originalHtml;
        }, 2000);
      } catch (err) {
        console.warn('Clipboard copy failed:', err);
      }
    });
  }

  /**
   * Clear Result Form
   */
  if (btnClearResult) {
    btnClearResult.addEventListener('click', function () {
      setResultState('empty');
      if (resultStatusBadge) {
        resultStatusBadge.innerHTML = '<span class="badge bg-light text-muted border">Awaiting Scan</span>';
      }
      if (upcInput) {
        upcInput.value = '';
        updateClearButton();
      }
      hideAlert();
    });
  }

  /**
   * Renders the recent scans list from permanent localStorage database
   */
  function renderRecentScans() {
    if (!recentScansList || !window.UPCScanner) return;
    const items = window.UPCScanner.getAllStoredProducts();

    if (items.length === 0) {
      recentScansList.innerHTML = `
        <div class="text-center py-4 text-muted small">
          <i class="bi bi-clock-history fs-3 d-block mb-1 opacity-25"></i>
          No recent scans recorded.
        </div>
      `;
      return;
    }

    recentScansList.innerHTML = items
      .slice(0, 5)
      .map((entry) => {
        const d = entry.data;
        const timeAgo = formatTimeAgo(entry.timestamp);
        return `
          <div class="transaction-item cursor-pointer recent-scan-row" data-upc="${entry.upc}" style="cursor: pointer;" title="Click to view details">
            <div class="transaction-icon bg-success-subtle text-success">
              <i class="bi bi-upc"></i>
            </div>
            <div class="transaction-details">
              <div class="transaction-name">${escapeHtml(d.packageName || 'Unknown product')}</div>
              <div class="transaction-date">
                <span class="text-dark fw-semibold">${escapeHtml(d.brand || 'Unknown brand')}</span> &bull; UPC: ${entry.upc} &bull; ${timeAgo}
              </div>
            </div>
            <div class="transaction-amount">
              <span class="badge bg-light text-dark border">${d.packageQuantity} ${escapeHtml(d.unitLabel)}</span>
            </div>
          </div>
        `;
      })
      .join('');

    // Attach click handlers to recent items
    const rows = recentScansList.querySelectorAll('.recent-scan-row');
    rows.forEach((row) => {
      row.addEventListener('click', function () {
        const upc = this.getAttribute('data-upc');
        if (upc && upcInput) {
          upcInput.value = upc;
          updateClearButton();
          performLookup(upc);
        }
      });
    });
  }

  /**
   * Clear History Button
   */
  if (btnClearHistory) {
    btnClearHistory.addEventListener('click', function (e) {
      e.preventDefault();
      if (window.UPCScanner) {
        window.UPCScanner.clearProductDb();
        renderRecentScans();
      }
    });
  }

  function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initial load
  updateClearButton();
  renderRecentScans();

  // Check if a UPC was passed in the URL (e.g. ?upc=012000000133)
  const urlParams = new URLSearchParams(window.location.search);
  const upcFromUrl = urlParams.get('upc') || urlParams.get('barcode');
  if (upcFromUrl && upcInput) {
    upcInput.value = upcFromUrl;
    updateClearButton();
    performLookup(upcFromUrl);
  }
});
