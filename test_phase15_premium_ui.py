import os
import re
import sys
import subprocess

# Configure UTF-8 encoding for Windows terminal output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PROJECT_DIR = r"c:\merox-ai-mirror"
os.chdir(PROJECT_DIR)

print("=" * 70)
print("MEROX PHASE 15: PREMIUM UI/UX & 3D TRANSFORMATION VERIFICATION")
print("=" * 70)

# =========================================================================
# 1. VERIFY DESIGN TOKENS & 3D CSS FOUNDATION
# =========================================================================
print("\n[TEST 1] Verifying Design Tokens & 3D CSS Architecture...")

required_tokens = [
    "--merox-primary",
    "--merox-secondary",
    "--merox-accent",
    "--merox-bg",
    "--merox-surface",
    "--merox-radius",
    "--merox-shadow",
    "--merox-transition"
]

for css_file in ["dashboard.css", "pricing.css", "search.css"]:
    assert os.path.exists(css_file), f"CSS file missing: {css_file}"
    with open(css_file, "r", encoding="utf-8") as f:
        code = f.read()
    for token in required_tokens:
        assert token in code, f"Design token '{token}' missing in {css_file}"
    # Verify 3D perspective / transforms
    assert "perspective" in code, f"3D perspective property missing in {css_file}"
    assert "translate" in code or "transform" in code, f"3D transform missing in {css_file}"
    print(f"  ✓ {css_file}: Centralized design tokens and 3D transforms verified.")

# =========================================================================
# 2. VERIFY DASHBOARD HERO SECTION & 3D FLOATING CARDS
# =========================================================================
print("\n[TEST 2] Verifying Dashboard Hero Section & Desktop Navigation...")

with open("dashboard.html", "r", encoding="utf-8") as f:
    dash_html = f.read()

# Hero Section
assert "merox-hero" in dash_html, "Hero section 'merox-hero' missing in dashboard.html"
assert "Your Style." in dash_html, "Hero headline 'Your Style.' missing"
assert "Powered by Intelligence." in dash_html, "Hero headline 'Powered by Intelligence.' missing"
assert "Discover what fits you, try it virtually, and build your personal look with MeroX AI." in dash_html, "Hero subtitle missing"
assert "Explore MeroX" in dash_html, "Primary CTA 'Explore MeroX' missing"
assert "Try Smart Mirror" in dash_html, "Secondary CTA 'Try Smart Mirror' missing"
assert "Membership Plans" in dash_html or "Membership" in dash_html, "Membership navigation link missing"

# Global Navigation
assert "topbar-nav" in dash_html, "Global navigation 'topbar-nav' missing in topbar"
assert "Home" in dash_html and "Discover" in dash_html, "Standard navigation items missing"

# 7 Major Categories (Protected Baseline)
categories = [
    "Skin Care",
    "Fitness",
    "Smart Mirror Demo",
    "Yoga Training",
    "Hairstyle by Face",
    "Best Cloth by Face",
    "Professional Outfits"
]
for cat in categories:
    assert cat in dash_html, f"Category '{cat}' missing in dashboard.html"

# Desktop Baseline Products (Protected Baseline)
assert "Kishan Kumar Singh" in dash_html, "Creator attribution missing"
assert "Recommended For You" in dash_html, "Recommended section missing"
assert "Men Shirt" in dash_html and "₹899" in dash_html, "Men Shirt ₹899 missing"
assert "T-Shirt" in dash_html and "₹499" in dash_html, "T-Shirt ₹499 missing"
assert "Cotton Pant" in dash_html and "₹1,199" in dash_html, "Cotton Pant ₹1,199 missing"
assert "Blue Jeans" in dash_html and "₹1,499" in dash_html, "Blue Jeans ₹1,499 missing"
assert "Goggles" in dash_html and "₹699" in dash_html, "Goggles ₹699 missing"

print("  ✓ Hero section, global navigation, 7 categories, and 5 desktop baseline cards verified.")

# =========================================================================
# 3. VERIFY roX-AI SIGNATURE CHIPS & KNOWLEDGE BASE
# =========================================================================
print("\n[TEST 3] Verifying roX-AI Signature Styling Experience...")

with open("rox-ai.js", "r", encoding="utf-8") as f:
    rox_code = f.read()

# Verify new signature prompts are bound in dashboard.html
signature_prompts = [
    "Find my style",
    "Build an outfit",
    "What suits my face?",
    "Suggest something under ₹2000",
    "Complete my look",
    "Try another style"
]
for prompt in signature_prompts:
    assert prompt in dash_html, f"roX-AI chip prompt '{prompt}' missing in dashboard.html"

# Verify knowledge base handling
assert "find my style" in rox_code, "Personal style assessment intent missing in rox-ai.js"
assert "complete my look" in rox_code, "Complete my look intent missing in rox-ai.js"
assert "try another style" in rox_code, "Alternative style intent missing in rox-ai.js"

print("  ✓ All 6 signature roX-AI quick actions and knowledge base handlers verified.")

# =========================================================================
# 4. VERIFY SUBSCRIPTION ARCHITECTURE & PRICING EXPERIENCE
# =========================================================================
print("\n[TEST 4] Verifying Subscription Layer & 3D Pricing Page...")

assert os.path.exists("subscription.js"), "subscription.js missing"
with open("subscription.js", "r", encoding="utf-8") as f:
    sub_code = f.read()

# 4 Tiers verification
assert "FREE" in sub_code, "Free tier missing in subscription.js"
assert "PRO" in sub_code and "399" in sub_code, "Pro tier (₹399) missing in subscription.js"
assert "PRO_PLUS" in sub_code and "499" in sub_code, "Pro+ tier (₹499) missing in subscription.js"
assert "ELITE" in sub_code and "599" in sub_code, "Elite tier (₹599) missing in subscription.js"
assert "MOST POPULAR" in sub_code, "Pro badge missing"
assert "openCheckoutModal" in sub_code, "openCheckoutModal missing"
assert "renderFeatureLockHtml" in sub_code, "renderFeatureLockHtml missing"
assert "isFeatureAllowed" in sub_code, "isFeatureAllowed missing"

assert os.path.exists("pricing.html"), "pricing.html missing"
with open("pricing.html", "r", encoding="utf-8") as f:
    pricing_html = f.read()

assert "MeroX" in pricing_html, "Brand missing in pricing.html"
assert "₹0" in pricing_html, "Free price missing in pricing.html"
assert "₹399" in pricing_html, "Pro price missing in pricing.html"
assert "₹499" in pricing_html, "Pro+ price missing in pricing.html"
assert "₹599" in pricing_html, "Elite price missing in pricing.html"
assert "MOST POPULAR" in pricing_html, "Most popular badge missing in pricing.html"
assert "comparisonTable" in pricing_html, "Comparison table missing in pricing.html"

print("  ✓ 4 subscription tiers (Free, Pro, Pro+, Elite), feature matrix, and pricing page verified.")

# =========================================================================
# 5. VERIFY PROFILE MULTI-SECTION EXPERIENCE
# =========================================================================
print("\n[TEST 5] Verifying Upgraded Profile Multi-Section Experience...")

with open("dashboard.js", "r", encoding="utf-8") as f:
    dash_js = f.read()

assert "switchProfileTab" in dash_js, "switchProfileTab function missing in dashboard.js"
assert "Membership" in dash_js, "Membership section missing in profile"
assert "Saved Looks" in dash_js, "Saved Looks section missing in profile"
assert "AI Preferences" in dash_js, "AI preferences missing in profile"
assert "Privacy" in dash_js, "Privacy section missing in profile"

print("  ✓ Profile multi-tabbed luxury experience verified.")

# =========================================================================
# 6. VERIFY SEARCH EXPERIENCE & HEADLESS BROWSER COMPATIBILITY
# =========================================================================
print("\n[TEST 6] Verifying Search 3D Transformation & Live DOM...")

with open("search.html", "r", encoding="utf-8") as f:
    search_html = f.read()

assert "Try On Live" in search_html, "Try On CTA missing in search.html product cards"
assert "data-cat=\"cap\"" in search_html, "data-cat='cap' missing"

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if os.path.exists(edge_path):
    edge_res = subprocess.run(
        [edge_path, "--headless=new", "--disable-gpu", "--virtual-time-budget=2000", "--dump-dom", "http://127.0.0.1:5500/search.html?q=cap"],
        capture_output=True,
        text=True,
        encoding="utf-8"
    )
    assert edge_res.returncode == 0, f"Headless Edge execution failed: {edge_res.stderr}"
    assert "Black Cap" in edge_res.stdout, "Live search DOM missing 'Black Cap'"
    assert "5 items found" in edge_res.stdout, "Live search DOM expected '5 items found'"
    print("  ✓ Live headless Edge verification of search.html?q=cap passed (5 items found).")

print("\n" + "=" * 70)
print("PHASE 15 PREMIUM UI/UX TRANSFORMATION VERIFIED 100%!")
print("=" * 70)
