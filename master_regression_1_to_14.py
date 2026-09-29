"""
MeroX Smart Mirror — Master Full Regression Runner (Phases 1 through 14)
Runs all 9 verification suites sequentially and outputs a unified final scorecard.
"""

import sys
import subprocess
import os

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PROJECT_DIR = r"c:\merox-ai-mirror"
os.chdir(PROJECT_DIR)

SUITES = [
    ("Phases 1–7 Deep Audit Suite", "deep_audit_suite.py"),
    ("Phase 6 Fashion Recommendation Engine", "test_phase6_recommendations.py"),
    ("Phase 7 Advanced Virtual Try-On", "test_phase7_tryon.py"),
    ("Phase 8 Retail Catalog & Scan System", "test_phase8_catalog_scan.py"),
    ("Phase 9 Retail Virtual Fitting Room", "test_phase9_fitting_room.py"),
    ("Phase 10 Retail Kiosk Mode & Smart Mirror HUD", "test_phase10_retail_kiosk.py"),
    ("Phase 11 Store Admin & Inventory Management", "test_phase11_store_admin.py"),
    ("Phase 12 Customer Session, QR Continuation & Privacy Analytics", "test_phase12_session_analytics.py"),
    ("Phase 13 Security, Privacy, Performance & Scale Benchmark", "test_phase13_security_performance.py")
]

print("=" * 80)
print("MEROX MASTER REGRESSION RUNNER — PHASES 1 THROUGH 14")
print("=" * 80)

results = []
all_passed = True

for name, script in SUITES:
    print(f"\n>>> Running: {name} ({script}) ...")
    res = subprocess.run([sys.executable, script], capture_output=True, text=True, encoding="utf-8")
    status = "PASS" if res.returncode == 0 else "FAIL"
    results.append((name, script, status, res.stdout, res.stderr))
    if res.returncode != 0:
        all_passed = False
        print(f"FAILED: {script}")
        print(res.stderr or res.stdout)
    else:
        print(f"PASSED: {script}")

print("\n" + "=" * 80)
print("MASTER REGRESSION SCORECARD (PHASES 1–14)")
print("=" * 80)

for name, script, status, _, _ in results:
    badge = "[PASS]" if status == "PASS" else "[FAIL]"
    print(f"{badge} {name:<65} ({script})")

print("=" * 80)
if all_passed:
    print("FINAL VERDICT: 100% PASS — ALL 9 SUITES PASSED WITH ZERO REGRESSIONS!")
else:
    print("FINAL VERDICT: REGRESSIONS DETECTED. PLEASE REVIEW LOGS.")
print("=" * 80)

sys.exit(0 if all_passed else 1)
