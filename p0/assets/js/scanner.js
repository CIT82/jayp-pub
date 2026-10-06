/**
 * Inventory Tracker - UPC Scanner & Product Database Module
 *
 * Implements:
 * 1. ZXing-powered mobile camera barcode scanner (UPC-A, UPC-E, EAN-13, Code 128)
 * 2. Multi-provider free product lookup cascade (UPCitemdb -> Open Food Facts)
 * 3. Permanent client-side product database via localStorage
 * 4. Heuristic quantity & unit extraction from product descriptions
 */

(function (global) {
  'use strict';

  const DB_KEY = 'product-database-v1';
  const LEGACY_CACHE_KEY = 'product-lookup-cache-v1';

  // Migrate any previous temporary entries to the permanent database
  (function migrateLegacyStorage() {
    try {
      if (typeof localStorage === 'undefined') return;
      const legacyRaw = localStorage.getItem(LEGACY_CACHE_KEY);
      if (legacyRaw) {
        const legacyData = JSON.parse(legacyRaw);
        const currentRaw = localStorage.getItem(DB_KEY);
        const currentDb = currentRaw ? JSON.parse(currentRaw) : {};
        let migratedCount = 0;
        for (const [upc, entry] of Object.entries(legacyData)) {
          if (entry && entry.data && !currentDb[upc]) {
            currentDb[upc] = {
              timestamp: entry.timestamp || Date.now(),
              data: entry.data
            };
            migratedCount++;
          }
        }
        if (migratedCount > 0) {
          localStorage.setItem(DB_KEY, JSON.stringify(currentDb));
        }
        localStorage.removeItem(LEGACY_CACHE_KEY);
      }
    } catch (e) {
      console.warn('Migration warning:', e);
    }
  })();

  // Heuristic regexes as specified
  const COUNT_REGEX = /\b(\d+(?:\.\d+)?)\s*(tablets?|tabs?|caplets?|capsules?|caps?|softgels?|gelcaps?|gummies?|lozenges?|packets?|patches?|count|ct)\b/i;
  const VOLUME_REGEX = /\b(\d+(?:\.\d+)?)\s*(fl\.?\s*oz|fluid ounces?|ounces?|oz|ml|milliliters?)\b/i;

  /**
   * Normalizes unit strings into standardized abbreviations or words.
   * e.g. "tabs" -> "tablets", "ml" -> "mL", "ct" -> "units", "fl oz" -> "fl oz"
   */
  function normalizeUnit(rawUnit) {
    if (!rawUnit || typeof rawUnit !== 'string') return 'units';
    const u = rawUnit.toLowerCase().replace(/\./g, '').trim();

    if (/^tab(let)?s?$/.test(u)) return 'tablets';
    if (/^caplet(s)?$/.test(u)) return 'caplets';
    if (/^cap(sule)?s?$/.test(u)) return 'capsules';
    if (/^softgel(s)?$/.test(u)) return 'softgels';
    if (/^gelcap(s)?$/.test(u)) return 'gelcaps';
    if (/^gumm(y|ies)$/.test(u)) return 'gummies';
    if (/^lozenge(s)?$/.test(u)) return 'lozenges';
    if (/^packet(s)?$/.test(u)) return 'packets';
    if (/^patch(es)?$/.test(u)) return 'patches';
    if (/^(count|ct)$/.test(u)) return 'units';
    if (/^(fl\s*oz|fluid\s*ounces?)$/.test(u)) return 'fl oz';
    if (/^(ounces?|oz)$/.test(u)) return 'oz';
    if (/^(ml|milliliters?)$/.test(u)) return 'mL';
    if (/^(g|grams?)$/.test(u)) return 'g';
    if (/^(kg|kilograms?)$/.test(u)) return 'kg';
    if (/^(l|liters?)$/.test(u)) return 'L';

    return u || 'units';
  }

  /**
   * Runs regular expressions against combined title, description, and size text.
   * Falls back to packageQuantity: 1 and unitLabel: "units".
   */
  function extractQuantityAndUnit(text) {
    if (!text || typeof text !== 'string') {
      return { packageQuantity: 1, unitLabel: 'units' };
    }

    const countMatch = text.match(COUNT_REGEX);
    if (countMatch) {
      const qty = parseFloat(countMatch[1]);
      return {
        packageQuantity: isNaN(qty) ? 1 : qty,
        unitLabel: normalizeUnit(countMatch[2])
      };
    }

    const volumeMatch = text.match(VOLUME_REGEX);
    if (volumeMatch) {
      const qty = parseFloat(volumeMatch[1]);
      return {
        packageQuantity: isNaN(qty) ? 1 : qty,
        unitLabel: normalizeUnit(volumeMatch[2])
      };
    }

    return { packageQuantity: 1, unitLabel: 'units' };
  }

  /**
   * Normalizes brand name (first comma-separated token, trimmed, fallback "Unknown brand").
   */
  function parseBrand(rawBrand) {
    if (!rawBrand || typeof rawBrand !== 'string') return 'Unknown brand';
    const firstToken = rawBrand.split(',')[0].trim();
    return firstToken || 'Unknown brand';
  }

  /**
   * Normalizes package title / description (fallback "Unknown product").
   */
  function parsePackageName(title, description, genericName) {
    const candidate = (title || genericName || description || '').trim();
    return candidate || 'Unknown product';
  }

  /**
   * Normalizes barcode text: strip non-alphanumeric characters, trim whitespace, and uppercase.
   */
  function normalizeBarcode(raw) {
    if (!raw || typeof raw !== 'string') return '';
    return raw.replace(/[^a-z0-9]/gi, '').toUpperCase().trim();
  }

  /**
   * Validates that UPC is non-empty and strictly numeric.
   */
  function validateUpc(rawUpc) {
    if (!rawUpc || typeof rawUpc !== 'string') {
      return { valid: false, reason: 'empty', message: 'Please enter or scan a UPC barcode.' };
    }
    const upc = rawUpc.trim();
    if (upc.length === 0) {
      return { valid: false, reason: 'empty', message: 'Please enter or scan a UPC barcode.' };
    }
    if (!/^\d+$/.test(upc)) {
      return {
        valid: false,
        reason: 'alphanumeric',
        message: 'The entered code contains non-numeric characters. Automatic catalog lookup requires a numeric UPC/EAN code. Please enter details manually.'
      };
    }
    return { valid: true, upc: upc };
  }

  /**
   * Reads stored product data from permanent localStorage database.
   */
  function getProductFromDb(upc) {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) return null;
      const db = JSON.parse(raw);
      const entry = db[upc];
      if (!entry) return null;

      return entry.data;
    } catch (err) {
      console.warn('Failed to access product database:', err);
      return null;
    }
  }

  /**
   * Saves successful product lookup data to permanent localStorage database with timestamp.
   */
  function saveProductToDb(upc, data) {
    try {
      if (typeof localStorage === 'undefined') return;
      const raw = localStorage.getItem(DB_KEY);
      const db = raw ? JSON.parse(raw) : {};
      db[upc] = {
        timestamp: Date.now(),
        data: data
      };
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (err) {
      console.warn('Failed to write to product database:', err);
    }
  }

  /**
   * Returns all stored products from the permanent database (sorted newest first).
   */
  function getAllStoredProducts() {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) return [];
      const db = JSON.parse(raw);
      const items = [];

      for (const [upc, entry] of Object.entries(db)) {
        if (entry && entry.data) {
          items.push({
            upc: upc,
            timestamp: entry.timestamp || 0,
            data: entry.data
          });
        }
      }
      return items.sort((a, b) => b.timestamp - a.timestamp);
    } catch (err) {
      console.warn('Failed to read all stored products:', err);
      return [];
    }
  }

  /**
   * Clears the product database in localStorage.
   */
  function clearProductDb() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(DB_KEY);
      }
    } catch (err) {
      console.warn('Failed to clear product database:', err);
    }
  }

  /**
   * Free Product Lookup Architecture (lookupProductByUpc)
   *
   * 1. Input Validation: Strictly numeric (/^\d+$/).
   * 2. Local Database: Permanent localStorage catalog under product-database-v1.
   * 3. Multi-Provider Fallback Cascade:
   *    - Provider A: UPCitemdb Trial API
   *    - Provider B: Open Food Facts API (v2)
   * 4. Data Normalization & Heuristic Quantity Extraction.
   */
  async function lookupProductByUpc(rawUpc) {
    // 1. Input Validation
    const validation = validateUpc(rawUpc);
    if (!validation.valid) {
      const err = new Error(validation.message);
      err.reason = validation.reason;
      throw err;
    }
    const upc = validation.upc;

    // 2. Local Database Check
    const stored = getProductFromDb(upc);
    if (stored) {
      return {
        ...stored,
        fromDatabase: true
      };
    }

    // 3. Multi-Provider Fallback Cascade
    let result = null;

    // Provider A — UPCitemdb Trial API
    try {
      const urlA = `https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(upc)}`;
      const resA = await fetch(urlA, {
        headers: { Accept: 'application/json' }
      });

      if (resA.ok) {
        const payloadA = await resA.json();
        if (payloadA && payloadA.code === 'OK' && Array.isArray(payloadA.items) && payloadA.items.length > 0) {
          const item = payloadA.items[0];
          const combinedText = [item.title, item.description, item.size].filter(Boolean).join(' ');
          const { packageQuantity, unitLabel } = extractQuantityAndUnit(combinedText);

          result = {
            source: 'UPCitemdb',
            upc: upc,
            brand: parseBrand(item.brand),
            packageName: parsePackageName(item.title, item.description),
            packageQuantity: packageQuantity,
            unitLabel: unitLabel
          };
        }
      }
    } catch (err) {
      // Catch CORS, 404, rate-limit or network errors; proceed to Provider B
      console.warn('Provider A (UPCitemdb) lookup error, cascading to Provider B:', err.message);
    }

    // Provider B — Open Food Facts API (v2)
    if (!result) {
      try {
        const urlB = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(upc)}.json?fields=product_name,generic_name,brands,quantity,product_quantity,product_quantity_unit`;
        const resB = await fetch(urlB, {
          headers: { Accept: 'application/json' }
        });

        if (resB.ok) {
          const payloadB = await resB.json();
          if (payloadB && payloadB.status === 1 && payloadB.product) {
            const prod = payloadB.product;
            const combinedText = [
              prod.product_name,
              prod.generic_name,
              prod.quantity,
              prod.product_quantity && prod.product_quantity_unit ? `${prod.product_quantity} ${prod.product_quantity_unit}` : ''
            ].filter(Boolean).join(' ');

            let { packageQuantity, unitLabel } = extractQuantityAndUnit(combinedText);

            // If regex didn't find specific unit in text, but OFF returned structured quantity
            if (packageQuantity === 1 && unitLabel === 'units' && prod.product_quantity) {
              const parsedOffQty = parseFloat(prod.product_quantity);
              if (!isNaN(parsedOffQty) && parsedOffQty > 0) {
                packageQuantity = parsedOffQty;
                if (prod.product_quantity_unit) {
                  unitLabel = normalizeUnit(prod.product_quantity_unit);
                }
              }
            }

            result = {
              source: 'Open Food Facts',
              upc: upc,
              brand: parseBrand(prod.brands),
              packageName: parsePackageName(prod.product_name, '', prod.generic_name),
              packageQuantity: packageQuantity,
              unitLabel: unitLabel
            };
          }
        }
      } catch (err) {
        console.warn('Provider B (Open Food Facts) lookup error:', err.message);
      }
    }

    // 4. Save to permanent database & return or throw
    if (result) {
      saveProductToDb(upc, result);
      return result;
    }

    const notFoundError = new Error(
      `No product information found for UPC "${upc}". The barcode may be unrecognized or the service unreachable. Please enter the details manually.`
    );
    notFoundError.reason = 'not_found';
    notFoundError.upc = upc;
    throw notFoundError;
  }

  /**
   * Camera Barcode Scanning Workflow (BrowserScanner)
   *
   * Uses @zxing/browser (BrowserMultiFormatReader) & @zxing/library (BarcodeFormat, DecodeHintType)
   * Restricts decode passes to 1D product codes: UPC_A, UPC_E, EAN_13, CODE_128.
   */
  class BrowserScanner {
    constructor(videoElement, onScan, onError) {
      this.videoElement = videoElement;
      this.onScan = onScan;
      this.onError = onError;
      this.controls = null;
      this.reader = null;
      this.isScanning = false;
    }

    /**
     * Camera Check: Verify navigator.mediaDevices?.getUserMedia is supported.
     */
    static isSupported() {
      return !!(
        typeof navigator !== 'undefined' &&
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === 'function'
      );
    }

    /**
     * Start the camera stream and barcode detection loop.
     */
    async start() {
      if (!BrowserScanner.isSupported()) {
        const err = new Error('Camera access (getUserMedia) is not supported by your browser or environment.');
        err.name = 'NotSupportedError';
        if (typeof this.onError === 'function') this.onError(err);
        throw err;
      }

      const ZXingLib = global.ZXing;
      const ZXingBrowserLib = global.ZXingBrowser;

      if (!ZXingBrowserLib || !ZXingBrowserLib.BrowserMultiFormatReader) {
        const err = new Error('ZXing scanner library (@zxing/browser) is not loaded.');
        if (typeof this.onError === 'function') this.onError(err);
        throw err;
      }

      // Configure DecodeHintType.POSSIBLE_FORMATS to 1D product codes:
      // BarcodeFormat.UPC_A, BarcodeFormat.UPC_E, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128
      const hints = new Map();
      const formats = [
        ZXingLib?.BarcodeFormat?.UPC_A ?? 14,
        ZXingLib?.BarcodeFormat?.UPC_E ?? 15,
        ZXingLib?.BarcodeFormat?.EAN_13 ?? 7,
        ZXingLib?.BarcodeFormat?.CODE_128 ?? 4
      ];
      const hintTypeKey = ZXingLib?.DecodeHintType?.POSSIBLE_FORMATS ?? 2;
      hints.set(hintTypeKey, formats);

      this.reader = new ZXingBrowserLib.BrowserMultiFormatReader(hints);
      this.isScanning = true;

      try {
        // Stream from device camera (rear/environment preferred on mobile)
        this.controls = await this.reader.decodeFromVideoDevice(
          undefined,
          this.videoElement,
          (result, error, controls) => {
            if (!this.isScanning) return;

            if (result) {
              const raw = result.getText();
              const normalized = normalizeBarcode(raw);

              // Stop scanner immediately on match
              this.stop();

              if (typeof this.onScan === 'function') {
                this.onScan(normalized);
              }
            }
          }
        );

        if (!this.isScanning) {
          this.stop();
        }
      } catch (err) {
        this.stop();
        if (typeof this.onError === 'function') {
          this.onError(err);
        } else {
          throw err;
        }
      }
    }

    /**
     * Result Normalization & Teardown:
     * Stop media stream via controls.stop() and clean up tracks.
     */
    stop() {
      this.isScanning = false;

      if (this.controls) {
        try {
          this.controls.stop();
        } catch (e) {
          console.warn('Error calling scanner controls.stop():', e);
        }
        this.controls = null;
      }

      if (this.videoElement && this.videoElement.srcObject) {
        try {
          const stream = this.videoElement.srcObject;
          if (stream.getTracks) {
            stream.getTracks().forEach((track) => track.stop());
          }
          this.videoElement.srcObject = null;
        } catch (e) {
          console.warn('Error stopping video stream tracks:', e);
        }
      }
    }
  }

  // Export module components
  global.UPCScanner = {
    BrowserScanner,
    lookupProductByUpc,
    validateUpc,
    normalizeBarcode,
    extractQuantityAndUnit,
    normalizeUnit,
    parseBrand,
    parsePackageName,
    getProductFromDb,
    saveProductToDb,
    getAllStoredProducts,
    clearProductDb,
    DB_KEY,
    // Backwards-compatible aliases
    getCachedProduct: getProductFromDb,
    setCachedProduct: saveProductToDb,
    getAllCachedProducts: getAllStoredProducts,
    clearProductCache: clearProductDb,
    CACHE_KEY: DB_KEY
  };
})(typeof window !== 'undefined' ? window : globalThis);
