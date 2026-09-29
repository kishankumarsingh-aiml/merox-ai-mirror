/**
 * MeroX Privacy-Safe Store Analytics Engine (Phase 12)
 * Telemetry event recorder and aggregate analytics processor.
 *
 * Privacy Principle:
 * - Aggregated non-PII metrics only.
 * - Zero collection of names, emails, biometrics, or camera images.
 * - Store-isolated event partitions (STORE-MUM-01, STORE-BLR-02, STORE-DEL-03).
 */

(function (global) {
  "use strict";

  const EVENTS_KEY = "merox_store_analytics_events";
  const MAX_EVENTS = 1000;

  function generateId(prefix = "EVT") {
    return prefix + "-" + Date.now() + "-" + Math.floor(Math.random() * 10000).toString(16);
  }

  const MeroXAnalyticsService = {
    /**
     * Record a telemetry event
     */
    recordEvent: (eventType, payload = {}) => {
      try {
        if (typeof localStorage === "undefined") return null;

        const event = {
          eventId: generateId("EVT"),
          eventType: String(eventType).toUpperCase(),
          timestamp: new Date().toISOString(),
          sessionId: payload.sessionId || "SESS-UNKNOWN",
          storeId: payload.storeId || "STORE-MUM-01",
          mirrorId: payload.mirrorId || "MIRROR-01",
          productId: payload.productId || null,
          sku: payload.sku || null,
          category: payload.category || null,
          details: payload.details || {},
          durationSec: payload.durationSec || null
        };

        const raw = localStorage.getItem(EVENTS_KEY);
        const events = raw ? JSON.parse(raw) : [];
        events.push(event);

        // Keep maximum 1000 events (FIFO)
        if (events.length > MAX_EVENTS) {
          events.splice(0, events.length - MAX_EVENTS);
        }

        localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
        return event;
      } catch (e) {
        console.warn("MeroX Analytics record notice:", e);
        return null;
      }
    },

    /**
     * Get raw event log filtered by store
     */
    getEvents: (storeId = "all") => {
      try {
        if (typeof localStorage === "undefined") return [];
        const raw = localStorage.getItem(EVENTS_KEY);
        const events = raw ? JSON.parse(raw) : [];
        if (!storeId || storeId === "all") return events;
        return events.filter(e => e.storeId === storeId);
      } catch (e) {
        return [];
      }
    },

    hasLiveEvents: (storeId = "all") => {
      return MeroXAnalyticsService.getEvents(storeId).length > 0;
    },

    /**
     * Compute aggregated store analytics summary
     */
    getStoreSummary: (storeId = "STORE-MUM-01") => {
      const events = MeroXAnalyticsService.getEvents(storeId);

      const summary = {
        storeId: storeId,
        isLive: events.length > 0,
        dataType: events.length > 0 ? "LIVE_STORE_TELEMETRY" : "DEMO_BENCHMARK",
        totalSessions: 0,
        completedSessions: 0,
        timedOutSessions: 0,
        totalScans: 0,
        totalViews: 0,
        totalTryOns: 0,
        tryOnCompletions: 0,
        totalLooksCreated: 0,
        totalQrGenerated: 0,
        totalQrOpened: 0,
        totalRoxQueries: 0,
        avgSessionDurationSec: 0,
        categoryInteractions: {},
        topScannedProducts: {},
        topLookProducts: {}
      };

      if (events.length === 0) {
        // Return benchmark prototype data clearly marked as DEMO_BENCHMARK
        return MeroXAnalyticsService.getDemoBenchmark(storeId);
      }

      const sessionStarts = new Map();
      const durations = [];
      const sessionIds = new Set();

      events.forEach(e => {
        sessionIds.add(e.sessionId);

        switch (e.eventType) {
          case "SESSION_STARTED":
            summary.totalSessions++;
            sessionStarts.set(e.sessionId, new Date(e.timestamp).getTime());
            break;

          case "SESSION_ENDED":
            summary.completedSessions++;
            if (e.durationSec) {
              durations.push(e.durationSec);
            } else if (sessionStarts.has(e.sessionId)) {
              const start = sessionStarts.get(e.sessionId);
              const dur = Math.round((new Date(e.timestamp).getTime() - start) / 1000);
              if (dur > 0 && dur < 3600) durations.push(dur);
            }
            break;

          case "SESSION_TIMEOUT":
            summary.timedOutSessions++;
            if (e.durationSec) durations.push(e.durationSec);
            break;

          case "PRODUCT_SCANNED":
            summary.totalScans++;
            if (e.sku) {
              summary.topScannedProducts[e.sku] = (summary.topScannedProducts[e.sku] || 0) + 1;
            }
            if (e.category) {
              summary.categoryInteractions[e.category] = (summary.categoryInteractions[e.category] || 0) + 1;
            }
            break;

          case "PRODUCT_VIEWED":
            summary.totalViews++;
            if (e.category) {
              summary.categoryInteractions[e.category] = (summary.categoryInteractions[e.category] || 0) + 1;
            }
            break;

          case "TRY_ON_STARTED":
            summary.totalTryOns++;
            break;

          case "TRY_ON_COMPLETED":
            summary.tryOnCompletions++;
            break;

          case "PRODUCT_ADDED_TO_LOOK":
            if (e.sku) {
              summary.topLookProducts[e.sku] = (summary.topLookProducts[e.sku] || 0) + 1;
            }
            break;

          case "LOOK_CREATED":
            summary.totalLooksCreated++;
            break;

          case "QR_GENERATED":
            summary.totalQrGenerated++;
            break;

          case "QR_OPENED":
            summary.totalQrOpened++;
            break;

          case "ROX_AI_QUERY":
            summary.totalRoxQueries++;
            break;
        }
      });

      // Compute totalSessions if SESSION_STARTED was not explicitly captured
      if (summary.totalSessions === 0 && sessionIds.size > 0) {
        summary.totalSessions = sessionIds.size;
      }

      if (durations.length > 0) {
        summary.avgSessionDurationSec = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
      } else {
        summary.avgSessionDurationSec = 45; // Kiosk average benchmark
      }

      summary.conversionRate = summary.totalSessions > 0
        ? Math.round((summary.totalLooksCreated / summary.totalSessions) * 100)
        : 0;

      summary.qrConversionRate = summary.totalQrGenerated > 0
        ? Math.round((summary.totalQrOpened / summary.totalQrGenerated) * 100)
        : 0;

      return summary;
    },

    /**
     * Demo benchmark baseline for stores with zero live telemetry
     */
    getDemoBenchmark: (storeId) => {
      const isMum = storeId === "STORE-MUM-01";
      const isBlr = storeId === "STORE-BLR-02";
      const mult = isMum ? 1.0 : isBlr ? 0.75 : 0.6;

      return {
        storeId: storeId,
        isLive: false,
        dataType: "DEMO_BENCHMARK",
        totalSessions: Math.round(48 * mult),
        completedSessions: Math.round(39 * mult),
        timedOutSessions: Math.round(9 * mult),
        totalScans: Math.round(92 * mult),
        totalViews: Math.round(145 * mult),
        totalTryOns: Math.round(64 * mult),
        tryOnCompletions: Math.round(52 * mult),
        totalLooksCreated: Math.round(26 * mult),
        totalQrGenerated: Math.round(18 * mult),
        totalQrOpened: Math.round(14 * mult),
        totalRoxQueries: Math.round(74 * mult),
        avgSessionDurationSec: 112,
        conversionRate: Math.round((26 / 48) * 100),
        qrConversionRate: Math.round((14 / 18) * 100),
        categoryInteractions: {
          jeans: Math.round(38 * mult),
          shirt: Math.round(32 * mult),
          goggles: Math.round(28 * mult),
          shoe: Math.round(22 * mult),
          tshirt: Math.round(18 * mult),
          cap: Math.round(14 * mult)
        },
        topScannedProducts: {
          "MEROX-JNS-001": Math.round(18 * mult),
          "MEROX-SHT-006": Math.round(15 * mult),
          "MEROX-GOG-021": Math.round(14 * mult),
          "MEROX-SHO-026": Math.round(11 * mult)
        },
        topLookProducts: {
          "MEROX-JNS-001": Math.round(14 * mult),
          "MEROX-SHT-006": Math.round(12 * mult),
          "MEROX-SHO-030": Math.round(9 * mult)
        }
      };
    },

    clearAnalytics: (storeId = "all") => {
      try {
        if (typeof localStorage === "undefined") return;
        if (!storeId || storeId === "all") {
          localStorage.removeItem(EVENTS_KEY);
        } else {
          const events = MeroXAnalyticsService.getEvents("all");
          const remaining = events.filter(e => e.storeId !== storeId);
          localStorage.setItem(EVENTS_KEY, JSON.stringify(remaining));
        }
      } catch (e) {}
    }
  };

  global.MeroXAnalytics = MeroXAnalyticsService;

})(typeof window !== "undefined" ? window : globalThis);
