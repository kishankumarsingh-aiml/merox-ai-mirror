/**
 * MeroX Centralized Customer Session Manager (Phase 12)
 * Manages Smart Mirror customer session lifecycle, look state,
 * inactivity auto-timeout, camera cleanup, and privacy boundaries.
 *
 * Rule: ONE CUSTOMER SESSION MUST NOT LEAK INTO THE NEXT CUSTOMER SESSION.
 */

(function (global) {
  "use strict";

  const SAVED_LOOKS_KEY = "merox_saved_looks";

  function generateHex(len) {
    const chars = "0123456789abcdef";
    let res = "";
    for (let i = 0; i < len; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    return res;
  }

  class SessionManager {
    constructor() {
      this.config = {
        inactivityTimeoutMs: 90000, // 90 seconds default kiosk idle timeout
        warningDurationMs: 15000,   // 15 seconds warning countdown
        timeoutEnabled: true
      };

      this.session = null;
      this.inactivityTimer = null;
      this.warningInterval = null;
      this.remainingWarningSec = 0;
      this.listeners = [];

      this.init();
    }

    init() {
      this.hideWarningModal();
      this.startSession({ reason: "initial_boot" });
      this.bindUserActivityEvents();
      this.bindModalButtons();
    }

    /**
     * Start a new isolated customer session
     */
    startSession(options = {}) {
      const now = Date.now();
      const defaultStoreId = (this.session && this.session.storeId) || "STORE-MUM-01";
      const defaultStoreName = (this.session && this.session.storeName) || "MeroX Flagship Kiosk — Mumbai Phoenix Mall";
      const defaultMirrorId = (this.session && this.session.mirrorId) || "MIRROR-01";

      this.clearTimers();
      this.hideWarningModal();

      this.session = {
        sessionId: "SESS-" + now + "-" + generateHex(4),
        storeId: options.storeId || defaultStoreId,
        storeName: options.storeName || defaultStoreName,
        mirrorId: options.mirrorId || defaultMirrorId,
        sessionStart: now,
        lastActivity: now,
        status: "active",
        currentProduct: null,
        scannedProducts: [],
        viewedProducts: [],
        activeLook: [],
        selectedVariants: {},
        tryOnActive: false,
        tryOnProduct: null
      };

      // Synchronize legacy globals for full backward compatibility
      global.customerSession = this.session;
      global.customerLook = this.session.activeLook;

      // Track telemetry event
      if (global.MeroXAnalytics) {
        global.MeroXAnalytics.recordEvent("SESSION_STARTED", {
          sessionId: this.session.sessionId,
          storeId: this.session.storeId,
          mirrorId: this.session.mirrorId
        });
      }

      this.resetInactivityTimer();
      this.emitEvent("session_started", this.session);
      return this.session;
    }

    /**
     * End session and perform 100% complete customer state purge
     */
    endSession(reason = "user_ended") {
      if (!this.session) return;

      const durationSec = Math.round((Date.now() - this.session.sessionStart) / 1000);
      const endedSessionId = this.session.sessionId;
      const storeId = this.session.storeId;
      const mirrorId = this.session.mirrorId;

      // Track telemetry event
      const eventType = reason === "timeout" ? "SESSION_TIMEOUT" : "SESSION_ENDED";
      if (global.MeroXAnalytics) {
        global.MeroXAnalytics.recordEvent(eventType, {
          sessionId: endedSessionId,
          storeId: storeId,
          mirrorId: mirrorId,
          durationSec: durationSec,
          reason: reason
        });
      }

      // 1. Clear Inactivity Timers & Warning Modals
      this.clearTimers();
      this.hideWarningModal();

      // 2. Stop and release hardware camera streams
      if (global.MeroXCamera && typeof global.MeroXCamera.stopCamera === "function") {
        try { global.MeroXCamera.stopCamera(); } catch (e) {}
      }
      if (typeof global.stopScannerCamera === "function") {
        try { global.stopScannerCamera(); } catch (e) {}
      }

      // 3. Clear roX-AI conversation history and context memory
      if (global.MeroXRoxAI && typeof global.MeroXRoxAI.clearHistory === "function") {
        try { global.MeroXRoxAI.clearHistory(); } catch (e) {}
      }

      // 4. Purge temporary customer look and interaction state
      this.session.activeLook = [];
      this.session.currentProduct = null;
      this.session.scannedProducts = [];
      this.session.viewedProducts = [];
      this.session.selectedVariants = {};
      this.session.tryOnActive = false;
      this.session.tryOnProduct = null;
      this.session.status = "ended";

      // Synchronize legacy globals
      global.customerLook = [];
      if (global.customerSession) {
        global.customerSession.activeLook = [];
        global.customerSession.currentProduct = null;
      }

      // Purge session-scoped storage
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("merox_current_look");
          localStorage.removeItem("merox_kiosk_current_product");
          localStorage.removeItem("merox_kiosk_scanned_list");
        }
      } catch (e) {}

      // 5. Close open modals and return mirror to clean home screen
      if (typeof global.closeFeatureModal === "function") {
        try { global.closeFeatureModal(); } catch (e) {}
      }
      if (typeof global.closeScannerModal === "function") {
        try { global.closeScannerModal(); } catch (e) {}
      }
      if (typeof global.closeSmartMirrorHud === "function") {
        try { global.closeSmartMirrorHud(); } catch (e) {}
      }

      // Reset DOM look drawers and scanned cards if present
      const lookDrawer = document.getElementById("fittingLookDrawer");
      if (lookDrawer && typeof global.renderCustomerLookDrawer === "function") {
        global.renderCustomerLookDrawer();
      }
      const scannerResult = document.getElementById("scannerResultContainer");
      if (scannerResult) scannerResult.innerHTML = "";
      const qrContainer = document.getElementById("fittingQrContainer");
      if (qrContainer) qrContainer.innerHTML = "";
      const kioskLookBanner = document.getElementById("kioskSessionLookBanner");
      if (kioskLookBanner) {
        kioskLookBanner.innerHTML = "";
        kioskLookBanner.classList.add("hidden");
      }

      const roxMessages = document.getElementById("roxMessages");
      if (roxMessages) {
        roxMessages.innerHTML = `
          <div class="msg bot">
            <div class="source-badge offline">🤖 roX-AI Stylist Assistant</div>
            Hi 👋 I am <strong>roX-AI</strong>, your MeroX Personal Stylist and Mirror Companion.<br><br>
            Ask me about interview outfits, denim matching, face shape haircuts, skincare protocols, or beginner fitness routines!
          </div>
        `;
      }

      this.emitEvent("session_ended", { sessionId: endedSessionId, reason });

      // 6. Immediately spawn fresh ready session for the next shopper
      const nextSession = this.startSession({
        storeId,
        mirrorId,
        reason: "auto_new_shopper"
      });

      return nextSession;
    }

    /**
     * Touch activity to prevent timeout
     */
    touchActivity() {
      this.hideWarningModal();
      if (!this.session) {
        this.startSession({ reason: "activity_reboot" });
        return;
      }
      this.session.lastActivity = Date.now();
      this.resetInactivityTimer();
    }

    resetInactivityTimer() {
      if (!this.config.timeoutEnabled) return;
      this.clearTimers();

      const warningTime = Math.max(5000, this.config.inactivityTimeoutMs - this.config.warningDurationMs);

      this.inactivityTimer = setTimeout(() => {
        this.showWarningModal();
      }, warningTime);
    }

    clearTimers() {
      if (this.inactivityTimer) {
        clearTimeout(this.inactivityTimer);
        this.inactivityTimer = null;
      }
      if (this.warningInterval) {
        clearInterval(this.warningInterval);
        this.warningInterval = null;
      }
    }

    showWarningModal() {
      this.remainingWarningSec = Math.round(this.config.warningDurationMs / 1000);
      let modal = document.getElementById("sessionTimeoutModal");

      if (!modal) {
        modal = document.createElement("div");
        modal.id = "sessionTimeoutModal";
        modal.className = "session-timeout-overlay";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-labelledby", "timeoutModalTitle");
        modal.innerHTML = `
          <div class="session-timeout-card">
            <span class="timeout-icon" aria-hidden="true">⏳</span>
            <h3 id="timeoutModalTitle">Are you still styling?</h3>
            <p>Your session will end in <strong id="timeoutCountdown">${this.remainingWarningSec}</strong> seconds to protect your privacy.</p>
            <div style="display: flex; gap: 10px; margin-top: 16px;">
              <button type="button" id="modalKeepSessionBtn" class="timeout-continue-btn" onclick="window.MeroXSession ? window.MeroXSession.touchActivity() : null" style="flex: 1;">
                Keep Styling (Continue)
              </button>
              <button type="button" id="modalResetNowBtn" class="admin-btn admin-btn-danger admin-btn-sm" onclick="window.MeroXSession ? window.MeroXSession.endSession('user_reset') : null" style="padding: 10px 14px; border-radius: 10px; font-weight: 700; background: #ef4444; color: #fff; border: none; cursor: pointer;">
                Reset Now
              </button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      } else {
        const countdownEl = document.getElementById("timeoutCountdown");
        if (countdownEl) countdownEl.textContent = this.remainingWarningSec;
        modal.classList.remove("hidden");
        modal.style.display = "flex";
      }

      this.bindModalButtons();

      if (this.warningInterval) {
        clearInterval(this.warningInterval);
        this.warningInterval = null;
      }

      this.warningInterval = setInterval(() => {
        this.remainingWarningSec--;
        const countdownEl = document.getElementById("timeoutCountdown");
        if (countdownEl) countdownEl.textContent = this.remainingWarningSec;

        if (this.remainingWarningSec <= 0) {
          clearInterval(this.warningInterval);
          this.warningInterval = null;
          this.endSession("timeout");
        }
      }, 1000);
    }

    hideWarningModal() {
      if (this.warningInterval) {
        clearInterval(this.warningInterval);
        this.warningInterval = null;
      }
      const modal = document.getElementById("sessionTimeoutModal");
      if (modal) {
        modal.classList.add("hidden");
        modal.style.display = "none";
      }
    }

    bindModalButtons() {
      if (typeof document === "undefined") return;
      const keepBtn = document.getElementById("modalKeepSessionBtn");
      if (keepBtn && !keepBtn._bound) {
        keepBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.touchActivity();
        });
        keepBtn._bound = true;
      }
      const resetBtn = document.getElementById("modalResetNowBtn");
      if (resetBtn && !resetBtn._bound) {
        resetBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.endSession("user_reset");
        });
        resetBtn._bound = true;
      }
    }

    bindUserActivityEvents() {
      if (typeof window === "undefined") return;
      let lastTouch = 0;
      const throttleHandler = () => {
        const now = Date.now();
        if (now - lastTouch > 1500) {
          lastTouch = now;
          this.touchActivity();
        }
      };

      window.addEventListener("pointerdown", throttleHandler, { passive: true });
      window.addEventListener("click", throttleHandler, { passive: true });
      window.addEventListener("touchstart", throttleHandler, { passive: true });
      window.addEventListener("keydown", throttleHandler, { passive: true });
      window.addEventListener("scroll", throttleHandler, { passive: true });

      if (typeof document !== "undefined") {
        document.addEventListener("DOMContentLoaded", () => {
          this.hideWarningModal();
          this.bindModalButtons();
        });
      }
    }

    // ================= LOOK BUILDING SUITE =================
    getActiveLook() {
      return this.session ? [...this.session.activeLook] : [];
    }

    addToLook(product, variant = {}) {
      if (!this.session || !product) return [];
      this.touchActivity();

      // Check if product already exists in look
      const existingIdx = this.session.activeLook.findIndex(p => p.id === product.id);
      const lookItem = {
        id: product.id,
        productId: product.productId || `PROD-${product.id}`,
        sku: product.sku,
        name: product.name,
        category: product.category,
        price: Number(product.price) || 0,
        image: product.image,
        storeId: product.storeId || this.session.storeId,
        size: variant.size || "M",
        color: variant.color || product.color || "Standard"
      };

      if (existingIdx !== -1) {
        this.session.activeLook[existingIdx] = lookItem;
      } else {
        this.session.activeLook.push(lookItem);
      }

      // Synchronize legacy globals
      global.customerLook = this.session.activeLook;

      if (global.MeroXAnalytics) {
        global.MeroXAnalytics.recordEvent("PRODUCT_ADDED_TO_LOOK", {
          sessionId: this.session.sessionId,
          storeId: this.session.storeId,
          mirrorId: this.session.mirrorId,
          productId: product.id,
          sku: product.sku,
          category: product.category
        });
      }

      this.emitEvent("look_updated", this.session.activeLook);
      return this.session.activeLook;
    }

    removeFromLook(productId) {
      if (!this.session) return [];
      this.touchActivity();
      this.session.activeLook = this.session.activeLook.filter(p => p.id !== Number(productId));
      global.customerLook = this.session.activeLook;
      this.emitEvent("look_updated", this.session.activeLook);
      return this.session.activeLook;
    }

    clearLook() {
      if (!this.session) return [];
      this.touchActivity();
      this.session.activeLook = [];
      global.customerLook = [];
      this.emitEvent("look_updated", []);
      return [];
    }

    getLookTotal() {
      if (!this.session) return "₹0";
      const sum = this.session.activeLook.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
      return "₹" + sum.toLocaleString("en-IN");
    }

    getLookTotalNum() {
      if (!this.session) return 0;
      return this.session.activeLook.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
    }

    /**
     * Save look anonymously to persistent storage and generate short ID
     */
    saveLook() {
      if (!this.session || this.session.activeLook.length === 0) return null;
      this.touchActivity();

      const lookId = "LK-" + generateHex(6).toUpperCase();
      const lookRecord = {
        lookId: lookId,
        sessionId: this.session.sessionId,
        storeId: this.session.storeId,
        storeName: this.session.storeName,
        mirrorId: this.session.mirrorId,
        timestamp: new Date().toISOString(),
        items: [...this.session.activeLook],
        total: this.getLookTotal(),
        totalNum: this.getLookTotalNum()
      };

      try {
        const raw = localStorage.getItem(SAVED_LOOKS_KEY);
        const saved = raw ? JSON.parse(raw) : [];
        saved.unshift(lookRecord);
        if (saved.length > 100) saved.length = 100;
        localStorage.setItem(SAVED_LOOKS_KEY, JSON.stringify(saved));
      } catch (e) {
        console.warn("MeroX Session: Save look localStorage write error:", e);
      }

      if (global.MeroXAnalytics) {
        global.MeroXAnalytics.recordEvent("LOOK_CREATED", {
          sessionId: this.session.sessionId,
          storeId: this.session.storeId,
          mirrorId: this.session.mirrorId,
          lookId: lookId,
          itemCount: lookRecord.items.length,
          totalPrice: lookRecord.totalNum
        });
      }

      this.emitEvent("look_saved", lookRecord);
      return lookRecord;
    }

    /**
     * Resolve a saved look by short ID
     */
    resolveLook(lookId) {
      if (!lookId) return null;
      try {
        const raw = localStorage.getItem(SAVED_LOOKS_KEY);
        if (!raw) return null;
        const saved = JSON.parse(raw);
        return saved.find(l => l.lookId === lookId || l.id === lookId) || null;
      } catch (e) {
        return null;
      }
    }

    /**
     * Generate mobile QR continuation URL
     */
    generateContinuationUrl(lookRecord) {
      if (!lookRecord) return "";
      const base = window.location.origin + window.location.pathname.replace(/[^/]*$/, "");
      const itemIds = (lookRecord.items || []).map(i => i.id).join(",");
      // Build safe URL containing lookId and resilient fallback items param
      const url = `${base}look.html?id=${encodeURIComponent(lookRecord.lookId)}&store=${encodeURIComponent(lookRecord.storeId || "STORE-MUM-01")}&items=${encodeURIComponent(itemIds)}`;

      if (global.MeroXAnalytics && this.session) {
        global.MeroXAnalytics.recordEvent("QR_GENERATED", {
          sessionId: this.session.sessionId,
          storeId: this.session.storeId,
          mirrorId: this.session.mirrorId,
          lookId: lookRecord.lookId
        });
      }

      return url;
    }

    // ================= INTERACTION EVENT RECORDERS =================
    setCurrentProduct(product) {
      if (!this.session || !product) return;
      this.touchActivity();
      this.session.currentProduct = product;
      if (!this.session.viewedProducts.some(p => p.id === product.id)) {
        this.session.viewedProducts.push(product);
      }
      global.customerSession.currentProduct = product;

      if (global.MeroXAnalytics) {
        global.MeroXAnalytics.recordEvent("PRODUCT_VIEWED", {
          sessionId: this.session.sessionId,
          storeId: this.session.storeId,
          mirrorId: this.session.mirrorId,
          productId: product.id,
          sku: product.sku,
          category: product.category
        });
      }
      this.emitEvent("product_viewed", product);
    }

    recordScan(product) {
      if (!this.session || !product) return;
      this.touchActivity();
      this.session.currentProduct = product;
      if (!this.session.scannedProducts.some(p => p.id === product.id)) {
        this.session.scannedProducts.push(product);
      }
      global.customerSession.currentProduct = product;

      if (global.MeroXAnalytics) {
        global.MeroXAnalytics.recordEvent("PRODUCT_SCANNED", {
          sessionId: this.session.sessionId,
          storeId: this.session.storeId,
          mirrorId: this.session.mirrorId,
          productId: product.id,
          sku: product.sku,
          category: product.category
        });
      }
      this.emitEvent("product_scanned", product);
    }

    recordTryOnStart(product, mode = "garment_preview") {
      if (!this.session || !product) return;
      this.touchActivity();
      this.session.tryOnActive = true;
      this.session.tryOnProduct = product;

      if (global.MeroXAnalytics) {
        global.MeroXAnalytics.recordEvent("TRY_ON_STARTED", {
          sessionId: this.session.sessionId,
          storeId: this.session.storeId,
          mirrorId: this.session.mirrorId,
          productId: product.id,
          sku: product.sku,
          mode: mode
        });
      }
    }

    recordTryOnComplete(product) {
      if (!this.session || !product) return;
      if (global.MeroXAnalytics) {
        global.MeroXAnalytics.recordEvent("TRY_ON_COMPLETED", {
          sessionId: this.session.sessionId,
          storeId: this.session.storeId,
          mirrorId: this.session.mirrorId,
          productId: product.id,
          sku: product.sku
        });
      }
    }

    recordRoxQuery(queryText) {
      if (!this.session) return;
      this.touchActivity();
      if (global.MeroXAnalytics) {
        global.MeroXAnalytics.recordEvent("ROX_AI_QUERY", {
          sessionId: this.session.sessionId,
          storeId: this.session.storeId,
          mirrorId: this.session.mirrorId,
          queryLength: (queryText || "").length
        });
      }
    }

    getSessionContext() {
      if (!this.session) return {};
      return {
        sessionId: this.session.sessionId,
        storeId: this.session.storeId,
        storeName: this.session.storeName,
        mirrorId: this.session.mirrorId,
        currentProduct: this.session.currentProduct,
        currentLook: [...this.session.activeLook],
        scannedCount: this.session.scannedProducts.length,
        lookCount: this.session.activeLook.length
      };
    }

    getCurrentSession() {
      return this.getSessionContext();
    }

    getLookItems() {
      return this.getActiveLook();
    }

    markInteraction() {
      return this.touchActivity();
    }

    showTimeoutWarning() {
      return this.showWarningModal();
    }

    setStoreId(storeId, storeName = null) {
      if (this.session) {
        this.session.storeId = storeId;
        if (storeName) this.session.storeName = storeName;
      }
    }

    // ================= EVENT LISTENER SUITE =================
    on(event, callback) {
      if (typeof callback === "function") {
        this.listeners.push({ event, callback });
      }
    }

    emitEvent(event, data) {
      this.listeners
        .filter(l => l.event === event || l.event === "*")
        .forEach(l => {
          try { l.callback(data); } catch (e) { console.error("Session listener error:", e); }
        });

      if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
        try {
          window.dispatchEvent(new CustomEvent("merox_session_" + event, { detail: data }));
        } catch (e) {}
      }
    }
  }

  // Export Singleton
  const instance = new SessionManager();
  global.MeroXSession = instance;

})(typeof window !== "undefined" ? window : globalThis);
