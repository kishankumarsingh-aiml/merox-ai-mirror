import os
import sys
import subprocess

# Configure UTF-8 encoding for Windows terminal output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PROJECT_DIR = r"c:\merox-ai-mirror"
os.chdir(PROJECT_DIR)

print("=" * 80)
print("MEROX MASTER COMPREHENSIVE VERIFICATION: PHASES 1 THROUGH 10")
print("=" * 80)

suites = [
    ("deep_audit_suite.py", "Deep Independent Verification & Acceptance Audit (Phases 1-7)"),
    ("test_phase6_recommendations.py", "Phase 6: Fashion Recommendation Engine"),
    ("test_phase7_tryon.py", "Phase 7: Advanced Virtual Try-On"),
    ("test_phase8_catalog_scan.py", "Phase 8: Retail Product Catalog & Barcode Scanner"),
    ("test_phase9_fitting_room.py", "Phase 9: Retail Virtual Fitting Room & Outfit Builder"),
    ("test_phase10_retail_kiosk.py", "Phase 10: Premium Smart Mirror UI & Professional roX-AI")
]

results = []

for script, desc in suites:
    print(f"\n[RUNNING] {desc} ({script})...")
    res = subprocess.run([sys.executable, script], capture_output=True, text=True, encoding="utf-8")
    status = "PASS" if res.returncode == 0 else "FAIL"
    results.append((script, desc, status, res.stdout, res.stderr))
    symbol = "✓ PASS" if status == "PASS" else "✗ FAIL"
    print(f"[{symbol}] {desc}")
    if status == "FAIL":
        print(f"STDERR: {res.stderr[:300]}")

print("\n" + "=" * 80)
print("MEROX PHASES 1-10 MASTER SCORECARD SUMMARY")
print("=" * 80)

all_pass = True
for script, desc, status, stdout, stderr in results:
    symbol = "✓ PASS" if status == "PASS" else "✗ FAIL"
    print(f"{symbol:8} | {script:30} | {desc}")
    if status != "PASS":
        all_pass = False

print("=" * 80)
if all_pass:
    print("FINAL VERDICT: 100% PASS - ALL PHASES 1 THROUGH 10 VERIFIED & ACCREDITED!")
else:
    print("FINAL VERDICT: ONE OR MORE TEST SUITES FAILED")
print("=" * 80)
