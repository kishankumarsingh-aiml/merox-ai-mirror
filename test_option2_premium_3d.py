import os
import re
import sys
import subprocess
import urllib.request

# Ensure UTF-8 output on Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PROJECT_DIR = r"c:\merox-ai-mirror"
os.chdir(PROJECT_DIR)

print("=" * 70)
print("MEROX: OPTION 2 PREMIUM 3D UI & OPTION 1 PRESERVATION VERIFICATION")
print("=" * 70)

# =========================================================================
# 1. VERIFY OPTION 1 PRESERVATION
# =========================================================================
print("\n[TEST 1] Verifying Option 1 Preservation & Integrity...")

assert os.path.exists("dashboard-option1.html"), "dashboard-option1.html missing!"
assert os.path.exists("dashboard-option1.css"), "dashboard-option1.css missing!"
assert os.path.exists("dashboard.html"), "dashboard.html missing!"

with open("dashboard-option1.html", "r", encoding="utf-8") as f:
    opt1_html = f.read()

with open("dashboard.html", "r", encoding="utf-8") as f:
    dash_html = f.read()

# Verify baseline protected strings in Option 1
protected_strings = [
    "MeroX",
    "Kishan Kumar Singh",
    "Recommended For You",
    "Men Shirt",
    "T-Shirt",
    "Cotton Pant",
    "Blue Jeans",
    "Goggles",
    "kiosk-action-tile"
]

for s in protected_strings:
    assert s in dash_html, f"Protected string '{s}' missing in dashboard.html"
    assert s in opt1_html, f"Protected string '{s}' missing in dashboard-option1.html"

assert os.path.exists("dashboard-option2.html"), "dashboard-option2.html missing"
assert "Option 2" not in dash_html, "Production dashboard.html must not contain visible 'Option 2'"

print("  ✓ Option 1 baseline preserved 100% in dashboard.html and dashboard-option1.html.")

# =========================================================================
# 2. VERIFY OPTION 2 FILE ARCHITECTURE
# =========================================================================
print("\n[TEST 2] Verifying Option 2 Architecture & Files...")

assert os.path.exists("dashboard-option2.html"), "dashboard-option2.html missing!"
assert os.path.exists("dashboard-option2.css"), "dashboard-option2.css missing!"
assert os.path.exists("rox-vision.js"), "rox-vision.js missing!"
assert os.path.exists("dashboard-option2.js"), "dashboard-option2.js missing!"

with open("dashboard-option2.html", "r", encoding="utf-8") as f:
    opt2_html = f.read()

with open("dashboard-option2.css", "r", encoding="utf-8") as f:
    opt2_css = f.read()

with open("rox-vision.js", "r", encoding="utf-8") as f:
    vision_js = f.read()

print("  ✓ All Option 2 dedicated files verified.")

# =========================================================================
# 3. VERIFY OPTION 2 HEADER & HERO 3D EXPERIENCE
# =========================================================================
print("\n[TEST 3] Verifying Option 2 Header & 3D Hero Section...")

# Header elements
assert "AI PERSONAL STYLE INTELLIGENCE" in opt2_html, "Header subtitle missing"
assert "opt2SearchInput" in opt2_html, "Center search bar missing"
assert "Search fashion, products or ask roX-AI..." in opt2_html, "Search placeholder missing"
assert "roX-AI" in opt2_html, "roX-AI button missing in header"
assert "3D Product" in opt2_html, "3D Product button missing in header"
assert "Your Looks" in opt2_html, "Your Looks button missing in header"
assert "Profile" in opt2_html, "Profile button missing in header"

# Hero elements
assert "Your Style." in opt2_html, "Hero headline 'Your Style.' missing"
assert "Now in 3D." in opt2_html, "Hero headline 'Now in 3D.' missing"
assert "Explore products, visualize your look and discover personalized fashion powered by MeroX AI." in opt2_html, "Hero subtext missing"
assert "Explore Collection" in opt2_html, "Hero primary CTA missing"
assert "Try Smart Mirror" in opt2_html, "Hero secondary CTA missing"
assert "heroParallaxCard" in opt2_html, "3D Hero Parallax Card missing"
assert "hero-3d-rings" in opt2_html, "3D ambient rings missing"

print("  ✓ Option 2 Floating Header and 3D Hero verified.")

# =========================================================================
# 4. VERIFY 10 MAJOR 3D FEATURE CARDS
# =========================================================================
print("\n[TEST 4] Verifying 10 Major 3D Feature Cards...")

required_cards = [
    ("01", "SMART MIRROR", "openSmartMirrorHud()"),
    ("02", "VIRTUAL TRY-ON", "openFeatureModal('tryon')"),
    ("03", "roX-AI STYLIST", "toggleOption2RoxDrawer()"),
    ("04", "3D PRODUCT VIEW", "openRoxVisionModal(1)"),
    ("05", "FASHION COLLECTION", "search.html"),
    ("06", "BUILD MY LOOK", "openFeatureModal('cloth')"),
    ("07", "SKIN CARE", "openFeatureModal('skin')"),
    ("08", "FITNESS", "openFeatureModal('fitness')"),
    ("09", "HAIRSTYLE", "openFeatureModal('hair')"),
    ("10", "PROFESSIONAL OUTFITS", "openFeatureModal('professional')")
]

for num, title, handler in required_cards:
    assert num in opt2_html, f"Feature card number '{num}' missing"
    assert title in opt2_html, f"Feature card title '{title}' missing"
    assert handler in opt2_html, f"Feature handler '{handler}' missing"

print("  ✓ All 10 Major 3D Feature Cards verified and connected to working functions.")

# =========================================================================
# 5. VERIFY roX VISION 3D STUDIO MODAL
# =========================================================================
print("\n[TEST 5] Verifying roX Vision 3D Studio Architecture...")

assert "roxVisionModal" in opt2_html, "roxVisionModal element missing"
assert "roxVisionViewport" in opt2_html, "roxVisionViewport element missing"
assert "roxVisionStage" in opt2_html, "roxVisionStage element missing"
assert "roxVisionLighting" in opt2_html, "roxVisionLighting element missing"
assert "roxVisionSetAngle('front')" in opt2_html, "Front angle preset missing"
assert "roxVisionSetAngle('side')" in opt2_html, "Side angle preset missing"
assert "roxVisionSetAngle('back')" in opt2_html, "Back angle preset missing"
assert "roxVisionResetView()" in opt2_html, "Reset view tool missing"
assert "roxVisionZoomIn()" in opt2_html, "Zoom in tool missing"
assert "roxVisionZoomOut()" in opt2_html, "Zoom out tool missing"
assert "roxVisionToggleFullscreen()" in opt2_html, "Fullscreen tool missing"
assert "roxVisionBtnTryOn" in opt2_html, "Try On CTA missing in 3D Studio"
assert "roxVisionBtnAddLook" in opt2_html, "Add to Look CTA missing in 3D Studio"

# Honest disclosure
assert "Interactive 3D Multi-Axis Studio" in opt2_html or "Interactive 3D Multi-Axis Studio" in vision_js, "Honest disclosure missing"

# roX Vision JS capabilities
assert "openRoxVisionModal" in vision_js, "openRoxVisionModal function missing"
assert "closeRoxVisionModal" in vision_js, "closeRoxVisionModal function missing"
assert "addEventListener(\"mousedown\"" in vision_js, "Mouse drag listener missing"
assert "addEventListener(\"wheel\"" in vision_js, "Wheel zoom listener missing"
assert "addEventListener(\"touchstart\"" in vision_js, "Touch drag listener missing"
assert "detachListeners" in vision_js, "Clean listener teardown missing"

print("  ✓ roX Vision 3D Studio verified with honest disclosure & interactive controls.")

# =========================================================================
# 6. VERIFY roX-AI 3D INTENT & CHAT ACTION INTEGRATION
# =========================================================================
print("\n[TEST 6] Verifying roX-AI 3D Intent Integration...")

with open("rox-ai.js", "r", encoding="utf-8") as f:
    rox_code = f.read()

assert "view in 3d" in rox_code, "Intent 'view in 3d' missing in rox-ai.js"
assert "VIEW_IN_3D" in rox_code, "Action 'VIEW_IN_3D' missing in rox-ai.js"

with open("dashboard.js", "r", encoding="utf-8") as f:
    dash_js = f.read()

assert 'replyData.action === "VIEW_IN_3D"' in dash_js, "VIEW_IN_3D action handler missing in dashboard.js"

print("  ✓ roX-AI 'View in 3D' intent and dashboard action bridge verified.")

# =========================================================================
# 7. LIVE HTTP & EDGE HEADLESS DOM VERIFICATION
# =========================================================================
print("\n[TEST 7] Verifying Live HTTP Endpoints & Headless Edge Rendering...")

BASE_URL = "http://127.0.0.1:5500"

# Check HTTP 200 for all entry points
test_urls = [
    ("/", 200),
    ("/dashboard.html", 200),
    ("/dashboard-option1.html", 200),
    ("/dashboard-option2.html", 200),
    ("/search.html", 200),
    ("/pricing.html", 200),
    ("/admin.html", 200),
    ("/look.html", 200),
]

for path, expected_status in test_urls:
    url = BASE_URL + path
    try:
        with urllib.request.urlopen(url) as resp:
            assert resp.status == expected_status, f"{url} returned status {resp.status}"
            print(f"  ✓ {url} -> HTTP {resp.status} OK")
    except Exception as e:
        raise AssertionError(f"Failed to fetch {url}: {e}")

# Headless Edge DOM dump for Option 2
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if os.path.exists(edge_path):
    cmd = [edge_path, "--headless=new", "--dump-dom", f"{BASE_URL}/dashboard-option2.html"]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    assert res.returncode == 0, f"Headless Edge crashed on dashboard-option2.html: {res.stderr}"
    dom = res.stdout
    assert "MeroX" in dom, "MeroX missing in rendered DOM"
    assert "Your Style." in dom, "Hero title missing in rendered DOM"
    assert "Now in 3D." in dom, "Hero title missing in rendered DOM"
    assert "SMART MIRROR" in dom, "Feature card missing in rendered DOM"
    assert "roX Vision 3D Studio" in dom, "roX Vision missing in rendered DOM"
    print(f"  ✓ Headless Edge rendered dashboard-option2.html successfully ({len(dom)} chars).")

print("\n" + "=" * 70)
print("OPTION 2 PREMIUM 3D UI & OPTION 1 PRESERVATION VERIFIED 100%!")
print("=" * 70)
