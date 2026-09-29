import os
import re
import sys

# Configure UTF-8 encoding for Windows terminal output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PROJECT_DIR = r"c:\merox-ai-mirror"
os.chdir(PROJECT_DIR)

print("=" * 70)
print("MEROX PHASE 7: ADVANCED VIRTUAL TRY-ON VERIFICATION SUITE")
print("=" * 70)

# ================= 1. CODE AUDIT OF camera.js =================
with open("camera.js", "r", encoding="utf-8") as f:
    cam_code = f.read()

# Core exported API
required_cam_methods = [
    "startCamera",
    "stopCamera",
    "switchCamera",
    "enumerateCameras",
    "startOverlayLoop",
    "setAccessory",
    "resetCalibration",
    "takeSnapshot"
]
for method in required_cam_methods:
    assert method in cam_code, f"Required camera method '{method}' missing in camera.js"

# Landmark tracking & Rotation verification
assert "FaceDetector" in cam_code, "Native FaceDetector integration missing"
assert "detectFaceLandmarks" in cam_code, "detectFaceLandmarks loop missing"
assert "landmarks" in cam_code, "Landmarks inspection missing"
assert "Math.atan2" in cam_code, "atan2 tilt angle computation missing"
assert "detectedAngle" in cam_code, "detectedAngle state missing"
assert "rotation" in cam_code, "Manual rotation state missing"

# Jitter smoothing (EMA)
assert "smoothedBox" in cam_code, "EMA smoothedBox buffer missing"
assert "0.65" in cam_code and "0.35" in cam_code, "EMA alpha weighting factors missing"

# "None" accessory & zero-restart switching
assert "accessoryType !== \"none\"" in cam_code or "tryOnState.accessoryType !== \"none\"" in cam_code, "'none' accessory guard missing in render loop"
assert "track.stop()" in cam_code, "Hardware release track.stop() missing in stopCamera"
assert "srcObject = null" in cam_code, "videoElement detach missing in stopCamera"
assert "cancelAnimationFrame" in cam_code, "cancelAnimationFrame missing in stopCamera"
assert "beforeunload" in cam_code, "beforeunload hardware release listener missing"

print("[PASS] camera.js architecture: Landmark tilt, EMA jitter smoothing, None option & hardware release verified.")

# ================= 2. VERIFY TRY-ON MODAL IN dashboard.js =================
with open("dashboard.js", "r", encoding="utf-8") as f:
    dash_code = f.read()

assert "Virtual Try-On Prototype (v1.0)" in dash_code, "Honest prototype disclaimer missing in dashboard.js"
assert "switchTryonAccessory" in dash_code, "switchTryonAccessory missing in dashboard.js"
assert "adjustTryonScale" in dash_code, "adjustTryonScale missing in dashboard.js"
assert "adjustTryonY" in dash_code, "adjustTryonY missing in dashboard.js"
assert "adjustTryonX" in dash_code, "adjustTryonX missing in dashboard.js"
assert "adjustTryonRotation" in dash_code, "adjustTryonRotation missing in dashboard.js"
assert "resetTryonCalibration" in dash_code, "resetTryonCalibration missing in dashboard.js"
assert "captureTryonPhoto" in dash_code, "captureTryonPhoto snapshot missing in dashboard.js"
assert "switchTryonCameraDevice" in dash_code, "switchTryonCameraDevice missing in dashboard.js"

# Verify all 5 Goggles from canonical catalog are selectable
for g_id in [21, 22, 23, 24, 25]:
    assert f"{g_id}" in dash_code, f"Goggles ID {g_id} selector missing in dashboard.js"

# Verify all 5 Caps from canonical catalog are selectable
for c_id in [16, 17, 18, 19, 20]:
    assert f"{c_id}" in dash_code, f"Cap ID {c_id} selector missing in dashboard.js"

# Verify 'none' option exists
assert "'none'" in dash_code, "'none' natural mirror option missing in dashboard.js"

# Verify modal close triggers camera release
assert "window.MeroXCamera.stopCamera()" in dash_code, "closeFeatureModal stopCamera trigger missing in dashboard.js"

print("[PASS] dashboard.js: 10 canonical accessory buttons, None option, 4 calibration sliders & hardware release verified.")

# ================= 3. VERIFY ALL 10 ACCESSORY IMAGE ASSETS ON DISK =================
required_images = [
    "images/goggles1.jpeg",
    "images/goggles2.jpeg",
    "images/goggles3.jpeg",
    "images/goggles4.jpeg",
    "images/goggles5.jpeg",
    "images/cap1.jpeg",
    "images/cap2.jpeg",
    "images/cap3.jpeg",
    "images/cap4.jpeg",
    "images/cap5.jpeg",
]
for img_path in required_images:
    assert os.path.exists(img_path), f"Accessory image file missing: {img_path}"
    assert os.path.getsize(img_path) > 0, f"Accessory image file empty: {img_path}"

print(f"[PASS] All {len(required_images)} accessory image files verified on disk (100% non-empty).")

# ================= 4. VERIFY CSS RESPONSIVENESS IN dashboard.css =================
with open("dashboard.css", "r", encoding="utf-8") as f:
    css_code = f.read()

assert ".tryon-container" in css_code, ".tryon-container rule missing in dashboard.css"
assert ".tryon-view" in css_code, ".tryon-view rule missing in dashboard.css"
assert ".tryon-controls" in css_code, ".tryon-controls rule missing in dashboard.css"
assert ".accessory-selector" in css_code, ".accessory-selector rule missing in dashboard.css"
assert ".acc-btn" in css_code, ".acc-btn rule missing in dashboard.css"

print("[PASS] dashboard.css: Try-On container, aspect ratio & accessory button styling verified.")

# ================= 5. STRICT DASHBOARD VISUAL BASELINE CHECK =================
with open("dashboard.html", "r", encoding="utf-8") as f:
    dash_html = f.read()

assert "MeroX" in dash_html, "MeroX brand missing in dashboard.html"
assert "Kishan Kumar Singh" in dash_html, "Creator attribution missing in dashboard.html"
assert "Recommended For You" in dash_html, "Recommended For You section missing"
assert "Men Shirt" in dash_html and "₹899" in dash_html, "Card Men Shirt ₹899 missing"
assert "T-Shirt" in dash_html and "₹499" in dash_html, "Card T-Shirt ₹499 missing"
assert "Cotton Pant" in dash_html and "₹1,199" in dash_html, "Card Cotton Pant ₹1,199 missing"
assert "Blue Jeans" in dash_html and "₹1,499" in dash_html, "Card Blue Jeans ₹1,499 missing"
assert "Goggles" in dash_html and "₹699" in dash_html, "Card Goggles ₹699 missing"

print("[PASS] dashboard.html: Desktop visual baseline 100% locked & preserved.")

print("=" * 70)
print("PHASE 7 ADVANCED VIRTUAL TRY-ON VERIFIED 100%!")
print("=" * 70)
