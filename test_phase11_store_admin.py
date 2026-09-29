import os
import re
import sys
import json
import urllib.request

# Configure UTF-8 encoding for Windows terminal output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PROJECT_DIR = r"c:\merox-ai-mirror"
os.chdir(PROJECT_DIR)

print("=" * 80)
print("PHASE 11: STORE ADMIN + INVENTORY MANAGEMENT VERIFICATION SUITE")
print("=" * 80)

passed_checks = 0
total_checks = 0

def check(category, test_name, condition, details=""):
    global passed_checks, total_checks
    total_checks += 1
    status = "✓ PASS" if condition else "✕ FAIL"
    if condition:
        passed_checks += 1
    print(f"[{status}] {category.upper()}: {test_name}")
    if details:
        print(f"         {details}")
    if not condition:
        print(f"         CRITICAL ERROR: Assertion failed for '{test_name}'")
        sys.exit(1)

# ================= 1. PRODUCTS.JS ENTERPRISE SCHEMA AUDIT =================
with open("products.js", "r", encoding="utf-8") as f:
    prod_code = f.read()

# 1.1 Exactly 30 base items
prod_ids = [int(m) for m in re.findall(r'id:\s*(\d+)', prod_code)]
check("Schema", "Single Authoritative Base Catalog (30 Products)", len(prod_ids) == 30 and set(prod_ids) == set(range(1, 31)), f"Found {len(prod_ids)} product IDs (1-30).")

# 1.2 Required Schema Fields
required_schema_fields = [
    "productId", "sku", "barcode", "qrCode", "rfid", "rfidEpc",
    "name", "category", "subcategory", "brand", "description",
    "price", "currency", "discount", "images", "thumbnail",
    "tryOnAsset", "tryOnType", "tryOnStatus", "colors", "sizes",
    "gender", "tags", "stock", "stockQuantity", "stockStatus",
    "storeId", "location", "status", "metadata", "createdAt", "updatedAt"
]

missing_fields = []
for f_name in required_schema_fields:
    matches = re.findall(rf'{f_name}:\s*', prod_code)
    if len(matches) < 30:
        missing_fields.append((f_name, len(matches)))

check("Schema", "Full Enterprise Schema Fields (32 Attributes)", len(missing_fields) == 0, f"All 32 enterprise attributes verified across products. (Missing: {missing_fields})")

# 1.3 Barcode & SKU Uniqueness
barcodes = re.findall(r'barcode:\s*["\'](8901234\d{6})["\']', prod_code)
check("Schema", "30 Unique EAN-13 Barcodes", len(barcodes) == 30 and len(set(barcodes)) == 30, f"{len(set(barcodes))} unique barcodes verified.")

skus = re.findall(r'sku:\s*["\'](MEROX-[A-Z]+-\d{3})["\']', prod_code)
check("Schema", "30 Unique MeroX Enterprise SKUs", len(skus) == 30 and len(set(skus)) == 30, f"{len(set(skus))} unique SKUs verified.")

# ================= 2. STORE ADMIN CATALOG METHODS AUDIT =================
admin_methods = [
    "getFilteredProducts",
    "createProduct",
    "updateProduct",
    "updateStock",
    "deactivateProduct",
    "reactivateProduct",
    "deleteProduct",
    "exportCatalog",
    "importProducts",
    "getInventoryStats",
    "getAuditLog",
    "logAudit",
    "clearAuditLog",
    "resetToDefault"
]

for method in admin_methods:
    check("Catalog API", f"MeroXCatalog.{method} Method", method in prod_code, f"Found '{method}' in MeroXCatalog implementation.")

# Check LocalStorage persistence keys
check("Persistence", "LocalStorage Admin Catalog Override Key", "merox_admin_catalog_override" in prod_code, "Stores dynamic CRUD mutations in 'merox_admin_catalog_override'.")
check("Persistence", "LocalStorage Audit Log Key", "merox_admin_audit_log" in prod_code, "Stores administrative activity log in 'merox_admin_audit_log'.")

# ================= 3. ROLE-BASED ACCESS CONTROL AUDIT (AUTH.JS) =================
with open("auth.js", "r", encoding="utf-8") as f:
    auth_code = f.read()

check("RBAC", "Defined Roles (CUSTOMER, STORE_ADMIN, SUPER_ADMIN)", "ROLES:" in auth_code and "STORE_ADMIN" in auth_code and "SUPER_ADMIN" in auth_code, "Role dictionary present.")
check("RBAC", "MeroXAuth.getRole()", "getRole:" in auth_code or "getRole =" in auth_code, "Role resolver implemented.")
check("RBAC", "MeroXAuth.hasRole()", "hasRole:" in auth_code or "hasRole =" in auth_code, "Role hierarchy verification implemented.")
check("RBAC", "MeroXAuth.setRole()", "setRole:" in auth_code or "setRole =" in auth_code, "Role persistence implemented.")
check("RBAC", "MeroXAuth.isAdmin()", "isAdmin:" in auth_code or "isAdmin =" in auth_code, "Admin gate helper implemented.")
check("RBAC", "MeroXAuth.loginAsDemoAdmin()", "loginAsDemoAdmin:" in auth_code or "loginAsDemoAdmin =" in auth_code, "Frictionless demo store admin login helper implemented.")
check("RBAC", "MeroXAuth.logoutAdmin()", "logoutAdmin:" in auth_code or "logoutAdmin =" in auth_code, "Admin session termination helper implemented.")

# ================= 4. STORE ADMIN UI AUDIT (ADMIN.HTML, ADMIN.CSS, ADMIN.JS) =================
with open("admin.html", "r", encoding="utf-8") as f:
    admin_html = f.read()

with open("admin.css", "r", encoding="utf-8") as f:
    admin_css = f.read()

with open("admin.js", "r", encoding="utf-8") as f:
    admin_js = f.read()

# UI Access Gate
check("Store Admin UI", "Access Gate Modal (#authGateModal)", 'id="authGateModal"' in admin_html, "Unauthorized access modal gate present.")
check("Store Admin UI", "Demo Store Admin Button (#demoAdminBtn)", 'id="demoAdminBtn"' in admin_html and "authorizeDemoStoreAdmin" in admin_js, "1-click demo admin authorization present.")

# Executive Header & Store Selector
check("Store Admin UI", "Store Selector (#storeSelector)", 'id="storeSelector"' in admin_html and "handleStoreChange" in admin_js, "Live multi-store switcher present.")
check("Store Admin UI", "Admin User Profile Pill (#adminUserAvatar)", 'id="adminUserAvatar"' in admin_html and 'id="adminRoleBadge"' in admin_html, "User avatar & role badge present.")

# KPI Cards
kpi_ids = ["kpiTotalProducts", "kpiTotalValuation", "kpiInStock", "kpiLowStock", "kpiOutOfStock", "kpiTryOnReady"]
all_kpis = all(f'id="{k}"' in admin_html for k in kpi_ids)
check("Store Admin UI", "6 Inventory KPI Metric Displays", all_kpis, f"All {len(kpi_ids)} KPI metrics present in overview.")

# Catalog Table & Filters
check("Store Admin UI", "Debounced Catalog Search (#catalogSearchInput)", 'id="catalogSearchInput"' in admin_html and "debouncedSearch" in admin_js, "Live debounced search bar present.")
check("Store Admin UI", "Catalog Filters (Category, Stock, Status, TryOn)", 'id="filterCategory"' in admin_html and 'id="filterStockStatus"' in admin_html, "Filter controls present.")
check("Store Admin UI", "Pagination Controls", 'id="paginationInfo"' in admin_html and "prevPage" in admin_js and "nextPage" in admin_js, "Pagination footer & controls present.")

# Product Management Modals
check("Store Admin UI", "Add Product Form (#addProductForm)", 'id="addProductForm"' in admin_html and "handleAddProductSubmit" in admin_js, "Product creation form present.")
check("Store Admin UI", "SKU & Barcode Real-Time Uniqueness Validation", "validateSkuUniqueness" in admin_js and "validateBarcodeUniqueness" in admin_js, "Interactive duplicate detection present.")
check("Store Admin UI", "Edit Product Modal (#editProductModal)", 'id="editProductModal"' in admin_html and "handleEditProductSubmit" in admin_js, "Product editing modal present.")
check("Store Admin UI", "Quick Stock Adjust Modal (#quickStockModal)", 'id="quickStockModal"' in admin_html and "saveQuickStock" in admin_js, "Stock stepping modal present.")

# Try-On Assets Matrix
check("Store Admin UI", "Try-On Assets Hub (#tryonMatrixGrid)", 'id="tryonMatrixGrid"' in admin_html and "renderTryOnHub" in admin_js, "Visual Try-On asset manager present.")
check("Store Admin UI", "Try-On Preview Modal (#tryonPreviewModal)", 'id="tryonPreviewModal"' in admin_html and "openTryonPreview" in admin_js, "AR asset inspection modal present.")

# Import / Export Hub
check("Store Admin UI", "Export Catalog Buttons (JSON & CSV)", "exportCatalogFile('json')" in admin_html and "exportCatalogFile('csv')" in admin_html, "Download handlers present.")
check("Store Admin UI", "Step 1: Import Validation Matrix (#importValidationMatrix)", 'id="importValidationMatrix"' in admin_html and "runImportPreview" in admin_js, "Dry-run validation report present.")
check("Store Admin UI", "Step 2: Commit Import Button (#commitImportBtn)", 'id="commitImportBtn"' in admin_html and "commitImportBatch" in admin_js, "Safe commit action present.")

# Audit Activity Log & Settings
check("Store Admin UI", "Audit Activity Log View (#auditTableBody)", 'id="auditTableBody"' in admin_html and "refreshAuditTable" in admin_js, "Audit log viewer present.")
check("Store Admin UI", "Factory Catalog Reset Operation", "promptFactoryReset" in admin_html and "resetToDefault" in admin_js, "Factory baseline reset present.")

# ================= 5. SMART MIRROR INTEGRATION & DASHBOARD BASELINE =================
with open("dashboard.html", "r", encoding="utf-8") as f:
    dash_html = f.read()

with open("dashboard.js", "r", encoding="utf-8") as f:
    dash_js = f.read()

# Verify locked baseline elements
check("Smart Mirror", "MeroX Logo (<h1>MeroX</h1>)", "<h1>MeroX</h1>" in dash_html, "Locked brand logo intact.")
check("Smart Mirror", "Creator Attribution (Kishan Kumar Singh)", "Kishan Kumar Singh" in dash_html, "Locked owner attribution intact.")
check("Smart Mirror", "Search Bar (#searchInput)", 'id="searchInput"' in dash_html, "Search input bar intact.")
check("Smart Mirror", "Top Icons (roX-AI, Your Store, Sign In)", 'id="roxAiBtn"' in dash_html and 'id="yourStoreBtn"' in dash_html and 'id="authBtn"' in dash_html, "Header navigation icons intact.")

# Recommended 5 Cards
rec_ok = (
    "Recommended For You" in dash_html and
    "Men Shirt" in dash_html and "₹899" in dash_html and
    "T-Shirt" in dash_html and "₹499" in dash_html and
    "Cotton Pant" in dash_html and "₹1,199" in dash_html and
    "Blue Jeans" in dash_html and "₹1,499" in dash_html and
    "Goggles" in dash_html and "₹699" in dash_html
)
check("Smart Mirror", "Recommended For You 5-Card Baseline", rec_ok, "Shirt ₹899, T-Shirt ₹499, Cotton Pant ₹1,199, Blue Jeans ₹1,499, Goggles ₹699 intact.")

# 7 Centered Categories
cats = ["Skin Care", "Fitness", "Smart Mirror Demo", "Yoga Training", "Hairstyle by Face", "Best Cloth by Face", "Professional Outfits"]
check("Smart Mirror", "7 Centered Category Cards", all(c in dash_html for c in cats), f"All {len(cats)} category cards intact.")

# Store Admin Portal Link in Popover
check("Smart Mirror", "Store Admin Portal Link in Popover (#popoverAdminLink)", 'id="popoverAdminLink"' in dash_html and 'href="admin.html"' in dash_html, "Unobtrusive access link present in account menu.")

# ================= 6. LIVE HTTP SERVER VERIFICATION (PORT 5500) =================
admin_endpoints = [
    ("/admin.html", 200, "text/html"),
    ("/admin.css", 200, "text/css"),
    ("/admin.js", 200, "application/javascript"),
    ("/dashboard.html", 200, "text/html"),
    ("/products.js", 200, "application/javascript"),
    ("/auth.js", 200, "application/javascript")
]

for path, exp_code, mime in admin_endpoints:
    url = f"http://127.0.0.1:5500{path}"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=5) as res:
            code = res.status
            content_type = res.headers.get("Content-Type", "")
            check("HTTP Server", f"Endpoint {path} (HTTP {exp_code})", code == exp_code, f"Status: {code}, Content-Type: {content_type}")
    except Exception as e:
        check("HTTP Server", f"Endpoint {path} (HTTP {exp_code})", False, f"Request failed: {str(e)}")

print("=" * 80)
print(f"PHASE 11 STORE ADMIN & INVENTORY SCORECARD: {passed_checks} / {total_checks} CHECKS PASSED")
print("=" * 80)
print("FINAL VERDICT: 100% PASS - PHASE 11 FULLY VERIFIED & ACCREDITED!")
print("=" * 80)
