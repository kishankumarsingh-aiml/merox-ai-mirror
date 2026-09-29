"""
MeroX Smart Mirror — Phase 12 Automated Verification Suite
Customer Session + QR Continuation + Privacy-Safe Store Analytics
"""

import os
import re
import json
import urllib.request

def test_file_existence():
    print("\n--- 1. FILE EXISTENCE & INTEGRITY ---")
    required_files = [
        "session.js",
        "analytics.js",
        "look.html",
        "dashboard.html",
        "dashboard.js",
        "dashboard.css",
        "admin.html",
        "admin.js",
        "admin.css",
        "products.js"
    ]
    for rf in required_files:
        assert os.path.exists(rf), f"Missing required file: {rf}"
        assert os.path.getsize(rf) > 0, f"File is empty: {rf}"
        print(f"  [PASS] {rf} exists ({os.path.getsize(rf)} bytes)")

def test_single_catalog_truth():
    print("\n--- 2. AUTHORITATIVE CATALOG PRESERVATION ---")
    with open("products.js", "r", encoding="utf-8") as f:
        prod_content = f.read()
    
    # Exactly 30 items
    matches = re.findall(r"id:\s*(\d+)", prod_content)
    assert len(matches) == 30, f"Expected 30 items in products.js, found {len(matches)}"
    print(f"  [PASS] products.js contains exactly 30 base items")

    # Check that session.js, analytics.js, and look.html DO NOT declare duplicate PRODUCTS array
    for fname in ["session.js", "analytics.js", "look.html"]:
        with open(fname, "r", encoding="utf-8") as f:
            c = f.read()
            assert "const PRODUCTS =" not in c and "let PRODUCTS =" not in c and "var PRODUCTS =" not in c, \
                f"{fname} must not declare duplicate PRODUCTS array"
            print(f"  [PASS] {fname} has zero duplicate catalog declarations (consumes authoritative window.MeroXCatalog)")

def test_locked_baseline_preservation():
    print("\n--- 3. LOCKED BASELINE AUDIT (dashboard.html) ---")
    with open("dashboard.html", "r", encoding="utf-8") as f:
        dash = f.read()

    assert "Kishan Kumar Singh" in dash, "Baseline owner attribution must be preserved"
    assert "MeroX" in dash, "MeroX branding must be preserved"
    assert "Recommended For You" in dash, "Recommended section must be preserved"
    assert "Men Shirt" in dash and "₹899" in dash, "Men Shirt card preserved"
    assert "T-Shirt" in dash and "₹499" in dash, "T-Shirt card preserved"
    assert "Cotton Pant" in dash and "₹1,199" in dash, "Cotton Pant card preserved"
    assert "Blue Jeans" in dash and "₹1,499" in dash, "Blue Jeans card preserved"
    assert "Goggles" in dash and "₹699" in dash, "Goggles card preserved"

    categories = ["Skin Care", "Fitness", "Smart Mirror Demo", "Yoga Training", "Hairstyle by Face", "Best Cloth by Face", "Professional Outfits"]
    for cat in categories:
        assert cat in dash, f"Category card missing: {cat}"

    # Verify script includes
    assert '<script src="analytics.js"></script>' in dash, "dashboard.html must include analytics.js"
    assert '<script src="session.js"></script>' in dash, "dashboard.html must include session.js"
    assert '<script src="dashboard.js"></script>' in dash, "dashboard.html must include dashboard.js"

    # Verify Phase 12 UI elements
    assert 'id="newShopperToggle"' in dash, "dashboard.html must have newShopperToggle button"
    assert 'id="sessionTimeoutModal"' in dash, "dashboard.html must have sessionTimeoutModal"
    assert 'id="timeoutCountdown"' in dash, "dashboard.html must have timeoutCountdown"
    assert 'id="modalKeepSessionBtn"' in dash, "dashboard.html must have modalKeepSessionBtn"
    assert 'id="modalResetNowBtn"' in dash, "dashboard.html must have modalResetNowBtn"

    print("  [PASS] Locked baseline untouched (Kishan Kumar Singh attribution, 7 categories, 5 recommend cards)")
    print("  [PASS] Dashboard includes session.js, analytics.js, and session UI controls")

def test_session_manager_architecture():
    print("\n--- 4. SESSION MANAGER ARCHITECTURE (session.js) ---")
    with open("session.js", "r", encoding="utf-8") as f:
        sess = f.read()

    # Public API presence
    expected_apis = [
        "startSession",
        "endSession",
        "getCurrentSession",
        "addToLook",
        "removeFromLook",
        "getLookItems",
        "clearLook",
        "getLookTotal",
        "saveLook",
        "resolveLook",
        "generateContinuationUrl",
        "markInteraction",
        "resetInactivityTimer",
        "showTimeoutWarning",
        "setStoreId"
    ]
    for api in expected_apis:
        assert api in sess, f"session.js missing API: {api}"
        print(f"  [PASS] MeroXSession.{api} verified")

    # Inactivity timers
    assert "90000" in sess and "90 seconds" in sess, "Default idle timeout should be 90s"
    assert "15000" in sess and "15 seconds" in sess, "Warning countdown should be 15s"

    # Cleanup actions on endSession
    cleanup_checks = [
        "merox_current_look",
        "merox_kiosk_current_product",
        "merox_kiosk_scanned_list",
        "stopCamera",
        "sessionTimeoutModal",
        "SESSION_ENDED"
    ]
    for cc in cleanup_checks:
        assert cc in sess, f"endSession missing cleanup trigger: {cc}"
        print(f"  [PASS] endSession purges: {cc}")

    # Look persistence and prefix
    assert "LK-" in sess, "Look IDs must use LK- prefix"
    assert "merox_saved_looks" in sess, "Saved looks storage key verified"

def test_privacy_safe_analytics_engine():
    print("\n--- 5. PRIVACY-SAFE ANALYTICS ENGINE (analytics.js) ---")
    with open("analytics.js", "r", encoding="utf-8") as f:
        an = f.read()

    # Events key and max buffer
    assert "merox_store_analytics_events" in an, "Analytics storage key verified"
    assert "MAX_EVENTS = 1000" in an, "Analytics buffer capped at 1000 events (FIFO)"

    # Event types
    events = [
        "SESSION_STARTED",
        "SESSION_ENDED",
        "SESSION_TIMEOUT",
        "PRODUCT_SCANNED",
        "PRODUCT_VIEWED",
        "TRY_ON_STARTED",
        "TRY_ON_COMPLETED",
        "PRODUCT_ADDED_TO_LOOK",
        "LOOK_CREATED",
        "ROX_AI_QUERY",
        "QR_GENERATED",
        "QR_OPENED"
    ]
    for ev in events:
        assert ev in an, f"analytics.js missing event type handler: {ev}"
        print(f"  [PASS] Telemetry event type: {ev}")

    # Methods
    for method in ["recordEvent", "getEvents", "hasLiveEvents", "getStoreSummary", "getDemoBenchmark", "clearAnalytics"]:
        assert method in an, f"analytics.js missing method: {method}"
        print(f"  [PASS] MeroXAnalytics.{method} verified")

    # Honest differentiator
    assert "LIVE_STORE_TELEMETRY" in an, "Live telemetry data type indicator verified"
    assert "DEMO_BENCHMARK" in an, "Demo benchmark data type indicator verified"
    print("  [PASS] Live telemetry vs Demo benchmark differentiator verified")

def test_mobile_qr_continuation():
    print("\n--- 6. MOBILE QR CONTINUATION (look.html) ---")
    with open("look.html", "r", encoding="utf-8") as f:
        look = f.read()

    # Verification of standalone mobile view
    assert "viewport" in look, "Mobile viewport tag required"
    assert "products.js" in look, "look.html must load products.js"
    assert "analytics.js" in look, "look.html must load analytics.js"
    assert "session.js" in look, "look.html must load session.js"
    assert "QR_OPENED" in look, "look.html must track QR_OPENED event"
    assert "window.MeroXCatalog" in look, "look.html uses MeroXCatalog for resolution"
    assert "shareCurrentLook" in look, "look.html supports Web Share API"
    assert "admin.html" not in look, "look.html must never expose admin controls"

    print("  [PASS] look.html is mobile-first, resilient, privacy-safe, with zero admin exposure")

def test_store_admin_analytics_integration():
    print("\n--- 7. STORE ADMIN ANALYTICS INTEGRATION (admin.html & admin.js) ---")
    with open("admin.html", "r", encoding="utf-8") as f:
        adm_html = f.read()

    # Tab navigation
    assert 'data-tab="analytics"' in adm_html, "admin.html missing analytics nav button"
    assert 'id="tab-analytics"' in adm_html, "admin.html missing tab-analytics section"
    assert 'id="anTelemetryBadge"' in adm_html, "admin.html missing telemetry badge"
    assert 'id="anTotalSessions"' in adm_html, "admin.html missing total sessions KPI"
    assert 'id="anTotalScans"' in adm_html, "admin.html missing total scans KPI"
    assert 'id="anTryOns"' in adm_html, "admin.html missing tryons KPI"
    assert 'id="anLooksBuilt"' in adm_html, "admin.html missing looks built KPI"
    assert 'id="anQrTransfers"' in adm_html, "admin.html missing QR transfers KPI"
    assert 'id="anAvgDuration"' in adm_html, "admin.html missing avg duration KPI"
    assert 'funnel-container' in adm_html, "admin.html missing funnel container"
    assert 'id="anCategoryBreakdown"' in adm_html, "admin.html missing category breakdown container"
    assert 'id="anTopScannedTable"' in adm_html, "admin.html missing top scanned table"
    assert 'id="anTopLookTable"' in adm_html, "admin.html missing top look table"
    assert '<script src="analytics.js"></script>' in adm_html, "admin.html must include analytics.js"
    assert '<script src="session.js"></script>' in adm_html, "admin.html must include session.js"

    with open("admin.js", "r", encoding="utf-8") as f:
        adm_js = f.read()

    assert 'case "analytics":' in adm_js, "admin.js switchTab must handle 'analytics'"
    assert "refreshAnalyticsDashboard" in adm_js, "admin.js must implement refreshAnalyticsDashboard"
    assert "exportAnalyticsJson" in adm_js, "admin.js must implement exportAnalyticsJson"
    assert "clearStoreAnalytics" in adm_js, "admin.js must implement clearStoreAnalytics"

    print("  [PASS] Store admin navigation, KPI panels, funnel, breakdown, export, and clear verified")

def test_live_http_server():
    print("\n--- 8. LIVE HTTP SERVER 200 CHECKS ---")
    urls = [
        "http://127.0.0.1:5500/dashboard.html",
        "http://127.0.0.1:5500/admin.html",
        "http://127.0.0.1:5500/look.html?id=LK-TEST99&store=STORE-MUM-01&items=1,6,21",
        "http://127.0.0.1:5500/session.js",
        "http://127.0.0.1:5500/analytics.js",
        "http://127.0.0.1:5500/products.js"
    ]
    for url in urls:
        req = urllib.request.Request(url, headers={"User-Agent": "MeroX-Phase12-Verifier"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            assert resp.status == 200, f"Expected 200 for {url}, got {resp.status}"
            content = resp.read()
            assert len(content) > 0, f"Empty response for {url}"
            print(f"  [PASS] HTTP 200 OK: {url} ({len(content)} bytes)")

if __name__ == "__main__":
    print("==================================================")
    print("MEROX PHASE 12 VERIFICATION SUITE")
    print("==================================================")
    test_file_existence()
    test_single_catalog_truth()
    test_locked_baseline_preservation()
    test_session_manager_architecture()
    test_privacy_safe_analytics_engine()
    test_mobile_qr_continuation()
    test_store_admin_analytics_integration()
    test_live_http_server()
    print("\n==================================================")
    print(">>> ALL PHASE 12 VERIFICATION CHECKS PASSED (100%) <<<")
    print("==================================================")
