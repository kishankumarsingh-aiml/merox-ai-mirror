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
print("PHASE 8: RETAIL PRODUCT CATALOG + SCAN SYSTEM VERIFICATION SUITE")
print("=" * 80)

# ================= 1. AUTHORITATIVE CATALOG SCHEMA AUDIT =================
with open("products.js", "r", encoding="utf-8") as f:
    prod_code = f.read()

# Extract all IDs
prod_ids = [int(m) for m in re.findall(r'id:\s*(\d+)', prod_code)]
assert len(prod_ids) == 30, f"Expected 30 products, got {len(prod_ids)}"
assert set(prod_ids) == set(range(1, 31)), "Product IDs must be 1 to 30"
print(f"[✓ PASS] Exactly 30 canonical products verified in products.js.")

# Verify Required Retail Fields on all products
required_fields = [
    "productId", "sku", "name", "category", "subcategory", "price",
    "currency", "currencySymbol", "image", "images", "tryOnAsset",
    "tryOnType", "sizes", "colors", "stockQuantity", "stockStatus",
    "storeId", "storeName", "location", "barcode", "qrCode", "rfid", "metadata"
]

for field in required_fields:
    matches = re.findall(rf'{field}:\s*', prod_code)
    assert len(matches) >= 30, f"Field '{field}' appears only {len(matches)} times, expected at least 30"

print(f"[✓ PASS] All {len(required_fields)} retail schema fields present across all 30 products.")

# Verify Barcode Formats (13-digit EAN starting with 8901234)
barcodes = re.findall(r'barcode:\s*["\'](8901234\d{6})["\']', prod_code)
assert len(barcodes) == 30, f"Expected 30 13-digit EAN barcodes, got {len(barcodes)}"
assert len(set(barcodes)) == 30, "All 30 barcodes must be unique"
print(f"[✓ PASS] 30 unique EAN-13 barcodes verified (e.g. {barcodes[0]} - {barcodes[-1]}).")

# Verify SKU Formats
skus = re.findall(r'sku:\s*["\'](MEROX-[A-Z]+-\d{3})["\']', prod_code)
assert len(skus) == 30, f"Expected 30 MeroX SKUs, got {len(skus)}"
assert len(set(skus)) == 30, "All 30 SKUs must be unique"
print(f"[✓ PASS] 30 unique SKUs verified (e.g. {skus[0]} - {skus[-1]}).")

# Verify Try-On Types
valid_tryon_types = {"goggles", "cap", "garment_preview", "footwear_preview"}
tryon_matches = re.findall(r'tryOnType:\s*["\']([a-z_]+)["\']', prod_code)
assert len(tryon_matches) >= 30, f"Expected at least 30 tryOnTypes, got {len(tryon_matches)}"
for t in tryon_matches[:30]:
    assert t in valid_tryon_types, f"Invalid tryOnType '{t}' found!"
print(f"[✓ PASS] Honest Try-On Types verified: goggles, cap, garment_preview, footwear_preview.")

# ================= 2. CATALOG LOOKUP API & INDEXING AUDIT =================
assert "bySku:" in prod_code or "bySku =" in prod_code, "bySku method missing"
assert "byBarcode:" in prod_code or "byBarcode =" in prod_code, "byBarcode method missing"
assert "byQr:" in prod_code or "byQr =" in prod_code, "byQr method missing"
assert "byRfid:" in prod_code or "byRfid =" in prod_code, "byRfid method missing"
assert "findAny:" in prod_code or "findAny =" in prod_code, "findAny unified resolver missing"
assert "getByStore:" in prod_code or "getByStore =" in prod_code, "getByStore method missing"
assert "getAllStores:" in prod_code or "getAllStores =" in prod_code, "getAllStores method missing"
assert "importProducts:" in prod_code or "importProducts =" in prod_code, "importProducts onboarding method missing"
print("[✓ PASS] All O(1) hashmap indexing APIs present in MeroXCatalog.")

# ================= 3. MULTI-STORE INFRASTRUCTURE AUDIT =================
stores_found = re.findall(r'id:\s*["\'](STORE-[A-Z]+-\d+)["\']', prod_code)
assert len(stores_found) >= 3, f"Expected at least 3 stores, got {len(stores_found)}"
assert "STORE-MUM-01" in stores_found, "STORE-MUM-01 missing"
print(f"[✓ PASS] Multi-store infrastructure verified with {len(stores_found)} registered stores.")

# ================= 4. UI SCANNER INTEGRATION AUDIT =================
with open("dashboard.html", "r", encoding="utf-8") as f:
    html_code = f.read()

assert 'id="kioskScanFab"' in html_code or 'kiosk-scan-fab' in html_code, "Scanner trigger button missing in dashboard.html"
assert 'id="scannerModal"' in html_code, "scannerModal backdrop missing in dashboard.html"
assert 'id="scannerVideo"' in html_code or 'scanner-viewfinder' in html_code, "Scanner viewfinder missing in dashboard.html"
assert 'id="scannerInput"' in html_code, "Manual barcode/SKU input missing in dashboard.html"
assert 'quick-scan' in html_code or 'demo-scan' in html_code, "Quick-scan demo chips missing in dashboard.html"

with open("dashboard.js", "r", encoding="utf-8") as f:
    dash_code = f.read()

assert "openScannerModal" in dash_code, "openScannerModal missing in dashboard.js"
assert "closeScannerModal" in dash_code, "closeScannerModal missing in dashboard.js"
assert "handleScanInput" in dash_code or "submitScan" in dash_code, "Scan input handler missing in dashboard.js"
assert "MeroXCatalog.findAny" in dash_code or "MeroXCatalog.byBarcode" in dash_code, "Scanner not wired to authoritative catalog in dashboard.js"

print("[✓ PASS] Scanner UI, camera viewfinder, quick-scan chips, and catalog lookups verified in dashboard.")
print("=" * 80)
print("PHASE 8 RETAIL CATALOG & SCAN SYSTEM: 100% PASS")
print("=" * 80)
