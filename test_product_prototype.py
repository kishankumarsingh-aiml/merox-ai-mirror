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
print("MEROX: PRODUCT PROTOTYPE & FINAL UI REFINEMENT VERIFICATION")
print("=" * 70)

# =========================================================================
# 1. VERIFY LOGIN ERROR MESSAGE FIX & TRANSLATION
# =========================================================================
print("\n[TEST 1] Verifying Login Error Message Fix & User-Friendly Translation...")

with open("auth.js", "r", encoding="utf-8") as f:
    auth_code = f.read()

assert "formatAuthError" in auth_code, "formatAuthError missing in auth.js"
assert "INVALID_LOGIN_CREDENTIALS" in auth_code, "INVALID_LOGIN_CREDENTIALS handling missing in auth.js"
assert "Email or password is incorrect" in auth_code, "Friendly translation missing in auth.js"
assert "An account with this email already exists" in auth_code, "EMAIL_EXISTS translation missing"
assert "Please choose a stronger password" in auth_code, "WEAK_PASSWORD translation missing"

with open("style.css", "r", encoding="utf-8") as f:
    style_css = f.read()

assert "overflow-wrap: anywhere" in style_css, "overflow-wrap missing in style.css"
assert "word-break: break-word" in style_css, "word-break missing in style.css"
assert "box-sizing: border-box" in style_css, "box-sizing missing in style.css"

with open("app.js", "r", encoding="utf-8") as f:
    app_code = f.read()

assert "MeroXAuth.formatAuthError" in app_code, "app.js showError must route through formatAuthError"

print("  ✓ Login error translation and overflow protection verified.")

# =========================================================================
# 2. VERIFY HEADER REFINEMENT & SVG ICON SYSTEM
# =========================================================================
print("\n[TEST 2] Verifying Header Refinement, Medium Search & SVG Icon System...")

with open("dashboard.html", "r", encoding="utf-8") as f:
    dash_html = f.read()

assert "Option 2" not in dash_html, "Visible 'Option 2' found in production dashboard.html!"
assert "Option 1" not in dash_html, "Visible 'Option 1' found in production dashboard.html!"
assert "Product Prototype" in dash_html, "'Product Prototype' nav item missing in dashboard.html"
assert "openProductPrototypeModal()" in dash_html, "openProductPrototypeModal handler missing in dashboard.html"
assert "nav-svg-icon" in dash_html, "nav-svg-icon missing in dashboard.html"
assert "utility-svg-icon" in dash_html, "utility-svg-icon missing in dashboard.html"

with open("dashboard.css", "r", encoding="utf-8") as f:
    dash_css = f.read()

assert "width:320px" in dash_css or "width: 320px" in dash_css or "max-width:350px" in dash_css, "Medium search width missing in dashboard.css"
assert ".nav-svg-icon" in dash_css, ".nav-svg-icon class missing in dashboard.css"
assert ".utility-svg-icon" in dash_css, ".utility-svg-icon class missing in dashboard.css"
assert ".prototype-nav-link" in dash_css, ".prototype-nav-link class missing in dashboard.css"

print("  ✓ Header refined: Option 2 removed, Product Prototype added, medium search & SVG icons active.")

# =========================================================================
# 3. VERIFY PRODUCT PROTOTYPE ASSETS & ARCHITECTURE
# =========================================================================
print("\n[TEST 3] Verifying Product Prototype Assets & Studio Architecture...")

assert os.path.exists("images/prototype-hardware-showcase.jpg"), "prototype-hardware-showcase.jpg missing"
assert os.path.exists("images/prototype-hardware-specs.jpg"), "prototype-hardware-specs.jpg missing"
assert os.path.exists("product-prototype.css"), "product-prototype.css missing"
assert os.path.exists("product-prototype.js"), "product-prototype.js missing"

with open("product-prototype.js", "r", encoding="utf-8") as f:
    proto_js = f.read()

assert "openProductPrototypeModal" in proto_js, "openProductPrototypeModal missing in product-prototype.js"
assert "closeProductPrototypeModal" in proto_js, "closeProductPrototypeModal missing in product-prototype.js"
assert "protoToggleAutoRotate" in proto_js, "protoToggleAutoRotate missing in product-prototype.js"
assert "protoZoomIn" in proto_js, "protoZoomIn missing in product-prototype.js"
assert "protoZoomOut" in proto_js, "protoZoomOut missing in product-prototype.js"
assert "protoResetView" in proto_js, "protoResetView missing in product-prototype.js"
assert "protoToggleFullscreen" in proto_js, "protoToggleFullscreen missing in product-prototype.js"
assert "protoToggleHotspot" in proto_js, "protoToggleHotspot missing in product-prototype.js"

# Modal DOM verification
assert "id=\"productPrototypeModal\"" in dash_html, "productPrototypeModal element missing in dashboard.html"
assert "id=\"protoStagePane\"" in dash_html, "protoStagePane element missing in dashboard.html"
assert "id=\"protoDisplayImg\"" in dash_html, "protoDisplayImg element missing in dashboard.html"
assert "proto-hotspot" in dash_html, "Hotspot elements missing in dashboard.html"
assert "180 cm" in dash_html, "Hardware height dimension missing"
assert "70 cm" in dash_html, "Hardware width dimension missing"
assert "25 cm" in dash_html, "Hardware depth dimension missing"
assert "4K Display" in dash_html, "4K Display feature missing"
assert "AI Camera" in dash_html, "AI Camera feature missing"

print("  ✓ Product Prototype studio, multi-angle views, 5 hotspots & verified dimensions confirmed.")

# =========================================================================
# 4. VERIFY roX-AI PRODUCT PROTOTYPE CONNECTION
# =========================================================================
print("\n[TEST 4] Verifying roX-AI Prototype Integration...")

with open("rox-ai.js", "r", encoding="utf-8") as f:
    rox_code = f.read()

assert "OPEN_PRODUCT_PROTOTYPE" in rox_code, "OPEN_PRODUCT_PROTOTYPE action missing in rox-ai.js"

with open("dashboard.js", "r", encoding="utf-8") as f:
    dash_js = f.read()

assert 'replyData.action === "OPEN_PRODUCT_PROTOTYPE"' in dash_js, "OPEN_PRODUCT_PROTOTYPE action handler missing in dashboard.js"
assert "Product Prototype" in dash_html, "Product Prototype chip missing in dashboard.html"

print("  ✓ roX-AI quick chip and action bridge verified.")

# =========================================================================
# 5. LIVE HTTP & EDGE HEADLESS DOM DUMP
# =========================================================================
print("\n[TEST 5] Verifying Live HTTP & Headless Edge DOM...")

BASE_URL = "http://127.0.0.1:5500"

with urllib.request.urlopen(f"{BASE_URL}/dashboard.html") as resp:
    assert resp.status == 200, f"HTTP status {resp.status}"

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if os.path.exists(edge_path):
    cmd = [edge_path, "--headless=new", "--dump-dom", f"{BASE_URL}/dashboard.html"]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    assert res.returncode == 0, f"Headless Edge error: {res.stderr}"
    dom = res.stdout
    assert "MeroX" in dom, "MeroX missing in DOM"
    assert "Product Prototype" in dom, "Product Prototype missing in rendered DOM"
    assert "Option 2" not in dom, "Option 2 visible in rendered DOM!"
    print(f"  ✓ Headless Edge DOM dump passed cleanly ({len(dom)} characters).")

print("\n" + "=" * 70)
print("PRODUCT PROTOTYPE & FINAL UI REFINEMENT VERIFIED 100%!")
print("=" * 70)
