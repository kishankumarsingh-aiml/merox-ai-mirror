/**
 * MeroX Camera & Virtual Try-On Engine (Phase 7 Production Prototype)
 * Provides WebRTC live video streaming, device switching, automatic & manual
 * face/head accessory overlay positioning, snapshot capture, and clean stream disposal.
 * Consumes the authoritative MeroXCatalog for accessory items.
 *
 * Clearly labeled as: Virtual Try-On Prototype (v1.0)
 * Privacy: 100% client-side Canvas processing. Zero frames stored or transmitted.
 * Bugfix: Transparent vector AR overlays eliminate opaque rectangular model photos.
 */

(function (global) {
  "use strict";

  let activeStream = null;
  let animationFrameId = null;
  let faceDetector = null;
  let isDetecting = false;
  let offscreenCanvas = null;
  let offscreenCtx = null;

  // Try-on state
  const tryOnState = {
    accessoryType: "goggles", // 'goggles', 'cap', 'hairstyle', 'apparel', or 'none'
    accessorySrc: "images/goggles1.jpeg",
    accessoryId: 21,
    scale: 1.0,
    offsetX: 0,
    offsetY: 0,
    rotation: 0, // Manual tilt in degrees (-45 to 45)
    detectedAngle: 0, // Auto-detected head tilt from eye landmarks
    isStreaming: false,
    facingMode: "user", // 'user' or 'environment'
    availableDevices: [],
    currentDeviceId: null,
    hasFaceDetector: false,
    autoTrack: true,
    detectedFace: null
  };

  // EMA (Exponential Moving Average) smoothing buffer to eliminate landmark jitter
  const smoothedBox = {
    x: null,
    y: null,
    width: null,
    height: null,
    angle: 0
  };

  const accessoryImg = new Image();
  accessoryImg.crossOrigin = "anonymous";

  // Check for native Shape Detection FaceDetector API (Chromium)
  if (typeof global.FaceDetector === "function") {
    try {
      faceDetector = new global.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
      tryOnState.hasFaceDetector = true;
      tryOnState.autoTrack = true;
    } catch (e) {
      faceDetector = null;
      tryOnState.hasFaceDetector = false;
    }
  }

  // =========================================================================
  // HIGH-FIDELITY TRANSPARENT VECTOR SVG ASSETS
  // Eliminates rectangular model photo overlays completely.
  // =========================================================================
  const VECTOR_ASSETS = {
    // --- GOGGLES (Catalog IDs 21–25) ---
    21: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="500" height="200">
      <defs>
        <linearGradient id="gold21" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fde047"/><stop offset="50%" stop-color="#ca8a04"/><stop offset="100%" stop-color="#854d0e"/>
        </linearGradient>
        <linearGradient id="lens21" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(20, 35, 30, 0.90)"/><stop offset="60%" stop-color="rgba(10, 22, 18, 0.85)"/><stop offset="100%" stop-color="rgba(5, 12, 10, 0.94)"/>
        </linearGradient>
        <linearGradient id="glare21" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.40)"/><stop offset="50%" stop-color="rgba(255,255,255,0.05)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </linearGradient>
      </defs>
      <path d="M 85 45 Q 250 32 415 45" stroke="url(#gold21)" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <path d="M 215 72 Q 250 62 285 72" stroke="url(#gold21)" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M 105 55 Q 160 52 215 62 Q 225 125 180 165 Q 125 180 95 135 Q 85 85 105 55 Z" fill="url(#lens21)" stroke="url(#gold21)" stroke-width="5"/>
      <path d="M 115 65 Q 155 63 185 75 Q 140 145 105 105 Z" fill="url(#glare21)"/>
      <path d="M 395 55 Q 340 52 285 62 Q 275 125 320 165 Q 375 180 405 135 Q 415 85 395 55 Z" fill="url(#lens21)" stroke="url(#gold21)" stroke-width="5"/>
      <path d="M 385 65 Q 345 63 315 75 Q 360 145 395 105 Z" fill="url(#glare21)"/>
      <path d="M 85 55 L 60 58" stroke="url(#gold21)" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M 415 55 L 440 58" stroke="url(#gold21)" stroke-width="4.5" stroke-linecap="round"/>
    </svg>`,

    22: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="500" height="200">
      <defs>
        <linearGradient id="frame22" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#2a2a2a"/><stop offset="50%" stop-color="#111111"/><stop offset="100%" stop-color="#050505"/>
        </linearGradient>
        <linearGradient id="lens22" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(15, 20, 30, 0.92)"/><stop offset="100%" stop-color="rgba(25, 35, 45, 0.85)"/>
        </linearGradient>
      </defs>
      <path d="M 65 45 Q 250 35 435 45 Q 445 70 435 150 Q 400 175 320 170 Q 285 170 270 120 Q 250 120 230 120 Q 215 170 180 170 Q 100 175 65 150 Q 55 70 65 45 Z" fill="url(#frame22)"/>
      <rect x="85" y="60" width="135" height="95" rx="14" fill="url(#lens22)"/>
      <path d="M 92 68 L 195 68 L 140 148 L 92 148 Z" fill="rgba(255,255,255,0.22)"/>
      <rect x="280" y="60" width="135" height="95" rx="14" fill="url(#lens22)"/>
      <path d="M 287 68 L 390 68 L 335 148 L 287 148 Z" fill="rgba(255,255,255,0.22)"/>
      <ellipse cx="78" cy="54" rx="4" ry="2.5" fill="#e2e8f0"/>
      <ellipse cx="422" cy="54" rx="4" ry="2.5" fill="#e2e8f0"/>
    </svg>`,

    23: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="500" height="200">
      <defs>
        <linearGradient id="bronze23" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#d97706"/><stop offset="50%" stop-color="#b45309"/><stop offset="100%" stop-color="#78350f"/>
        </linearGradient>
        <radialGradient id="amber23" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="rgba(245, 158, 11, 0.75)"/><stop offset="70%" stop-color="rgba(180, 83, 9, 0.85)"/><stop offset="100%" stop-color="rgba(120, 53, 15, 0.92)"/>
        </radialGradient>
      </defs>
      <path d="M 215 100 Q 250 70 285 100" stroke="url(#bronze23)" stroke-width="6" fill="none" stroke-linecap="round"/>
      <circle cx="155" cy="105" r="62" fill="url(#amber23)" stroke="url(#bronze23)" stroke-width="7"/>
      <ellipse cx="140" cy="90" rx="35" ry="22" fill="rgba(255,255,255,0.25)" transform="rotate(-25 140 90)"/>
      <circle cx="345" cy="105" r="62" fill="url(#amber23)" stroke="url(#bronze23)" stroke-width="7"/>
      <ellipse cx="330" cy="90" rx="35" ry="22" fill="rgba(255,255,255,0.25)" transform="rotate(-25 330 90)"/>
      <path d="M 93 105 L 65 105" stroke="url(#bronze23)" stroke-width="5" stroke-linecap="round"/>
      <path d="M 407 105 L 435 105" stroke="url(#bronze23)" stroke-width="5" stroke-linecap="round"/>
    </svg>`,

    24: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="500" height="200">
      <defs>
        <linearGradient id="sportLens24" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(0, 255, 224, 0.88)"/><stop offset="35%" stop-color="rgba(59, 130, 246, 0.88)"/><stop offset="70%" stop-color="rgba(168, 85, 247, 0.88)"/><stop offset="100%" stop-color="rgba(236, 72, 153, 0.88)"/>
        </linearGradient>
      </defs>
      <path d="M 50 75 Q 250 45 450 75 L 435 90 Q 250 65 65 90 Z" fill="#0f172a"/>
      <path d="M 65 90 Q 250 65 435 90 Q 425 150 360 165 Q 290 175 260 120 Q 250 115 240 120 Q 210 175 140 165 Q 75 150 65 90 Z" fill="url(#sportLens24)"/>
      <path d="M 90 95 Q 250 75 410 95 L 390 105 Q 250 88 110 105 Z" fill="rgba(255,255,255,0.40)"/>
    </svg>`,

    25: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="500" height="200">
      <defs>
        <linearGradient id="flatLens25" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(20, 20, 25, 0.95)"/><stop offset="60%" stop-color="rgba(15, 15, 20, 0.88)"/><stop offset="100%" stop-color="rgba(5, 5, 8, 0.95)"/>
        </linearGradient>
      </defs>
      <path d="M 70 50 L 430 50 L 420 145 Q 390 170 310 165 Q 275 160 260 115 Q 250 110 240 115 Q 225 160 190 165 Q 110 170 80 145 Z" fill="url(#flatLens25)" stroke="#09090b" stroke-width="4"/>
      <path d="M 85 58 L 415 58 L 380 75 L 120 75 Z" fill="rgba(255,255,255,0.25)"/>
    </svg>`,

    // --- CAPS (Catalog IDs 16–20) ---
    16: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 260" width="500" height="260">
      <defs>
        <linearGradient id="capBlack16" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#2d3748"/><stop offset="50%" stop-color="#1a202c"/><stop offset="100%" stop-color="#111827"/>
        </linearGradient>
      </defs>
      <path d="M 110 175 Q 115 45 250 35 Q 385 45 390 175 Q 250 195 110 175 Z" fill="url(#capBlack16)"/>
      <path d="M 250 35 Q 250 100 250 185" stroke="#374151" stroke-width="2" fill="none"/>
      <path d="M 250 35 Q 170 95 140 175" stroke="#374151" stroke-width="1.8" fill="none"/>
      <path d="M 250 35 Q 330 95 360 175" stroke="#374151" stroke-width="1.8" fill="none"/>
      <circle cx="250" cy="35" r="9" fill="#111827" stroke="#4b5563" stroke-width="1.5"/>
      <path d="M 80 180 Q 250 245 420 180 Q 370 160 250 168 Q 130 160 80 180 Z" fill="#0f172a" stroke="#374151" stroke-width="2"/>
      <path d="M 95 185 Q 250 235 405 185" stroke="#4b5563" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
    </svg>`,

    17: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 260" width="500" height="260">
      <defs>
        <linearGradient id="capSport17" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#334155"/><stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <path d="M 115 175 Q 120 50 250 40 Q 380 50 385 175 Q 250 195 115 175 Z" fill="url(#capSport17)"/>
      <path d="M 155 170 Q 200 90 250 85 Q 300 90 345 170" stroke="#00ffe0" stroke-width="3" fill="none"/>
      <circle cx="250" cy="40" r="8" fill="#00ffe0"/>
      <path d="M 85 180 Q 250 245 415 180 Q 365 160 250 168 Q 135 160 85 180 Z" fill="#0f172a" stroke="#00ffe0" stroke-width="2.5"/>
    </svg>`,

    18: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 260" width="500" height="260">
      <defs>
        <linearGradient id="capWhite18" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/><stop offset="70%" stop-color="#f1f5f9"/><stop offset="100%" stop-color="#e2e8f0"/>
        </linearGradient>
      </defs>
      <path d="M 110 175 Q 115 45 250 35 Q 385 45 390 175 Q 250 195 110 175 Z" fill="url(#capWhite18)" stroke="#cbd5e1" stroke-width="1.5"/>
      <circle cx="250" cy="35" r="9" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
      <path d="M 80 180 Q 250 245 420 180 Q 370 160 250 168 Q 130 160 80 180 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
      <path d="M 95 185 Q 250 235 405 185" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
    </svg>`,

    19: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 260" width="500" height="260">
      <defs>
        <linearGradient id="capOlive19" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#4d5b3d"/><stop offset="70%" stop-color="#3d492f"/><stop offset="100%" stop-color="#2a3320"/>
        </linearGradient>
      </defs>
      <path d="M 110 175 Q 115 45 250 35 Q 385 45 390 175 Q 250 195 110 175 Z" fill="url(#capOlive19)"/>
      <circle cx="250" cy="35" r="9" fill="#2a3320" stroke="#71815b" stroke-width="1.5"/>
      <path d="M 80 180 Q 250 245 420 180 Q 370 160 250 168 Q 130 160 80 180 Z" fill="#36402a" stroke="#71815b" stroke-width="2"/>
      <path d="M 95 185 Q 250 235 405 185" stroke="#71815b" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
    </svg>`,

    20: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 260" width="500" height="260">
      <defs>
        <linearGradient id="capNavy20" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1e3a8a"/><stop offset="70%" stop-color="#172554"/><stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <path d="M 110 175 Q 115 45 250 35 Q 385 45 390 175 Q 250 195 110 175 Z" fill="url(#capNavy20)"/>
      <circle cx="250" cy="35" r="9" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5"/>
      <path d="M 80 180 Q 250 245 420 180 Q 370 160 250 168 Q 130 160 80 180 Z" fill="#172554" stroke="#3b82f6" stroke-width="2"/>
      <path d="M 95 185 Q 250 235 405 185" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
    </svg>`,

    // --- HAIRSTYLES (5 PROTOTYPE VARIANTS) ---
    hair_quiff: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <defs>
        <linearGradient id="quiffGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2d1f18"/><stop offset="40%" stop-color="#1a110c"/><stop offset="100%" stop-color="#0d0906"/>
        </linearGradient>
      </defs>
      <path d="M 80 220 Q 75 130 120 70 Q 180 15 260 25 Q 330 40 330 130 Q 335 180 325 220 Q 305 170 270 145 Q 210 130 150 145 Q 100 175 80 220 Z" fill="url(#quiffGrad)"/>
      <path d="M 140 85 Q 200 40 270 50" stroke="#4a3528" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M 125 115 Q 190 75 255 80" stroke="#4a3528" stroke-width="3" stroke-linecap="round" fill="none"/>
    </svg>`,

    hair_pompadour: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <defs>
        <linearGradient id="pompGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#261b16"/><stop offset="100%" stop-color="#0a0705"/>
        </linearGradient>
      </defs>
      <path d="M 85 220 Q 80 110 140 50 Q 200 20 280 40 Q 330 65 320 220 Q 300 160 260 135 Q 200 120 140 140 Q 100 165 85 220 Z" fill="url(#pompGrad)"/>
      <path d="M 145 70 Q 200 45 265 60" stroke="#523a2e" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    </svg>`,

    hair_curtains: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 340" width="400" height="340">
      <defs>
        <linearGradient id="curtainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3b271d"/><stop offset="100%" stop-color="#140d0a"/>
        </linearGradient>
      </defs>
      <path d="M 60 280 Q 75 120 150 70 Q 200 85 250 70 Q 325 120 340 280 Q 315 180 270 120 Q 200 100 130 120 Q 85 180 60 280 Z" fill="url(#curtainGrad)"/>
      <path d="M 200 75 L 200 95" stroke="#140d0a" stroke-width="3"/>
      <path d="M 90 200 Q 120 240 100 290" stroke="#5a3d2e" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M 310 200 Q 280 240 300 290" stroke="#5a3d2e" stroke-width="3" stroke-linecap="round" fill="none"/>
    </svg>`,

    hair_curls: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <defs>
        <linearGradient id="curlyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#241a15"/><stop offset="100%" stop-color="#0a0705"/>
        </linearGradient>
      </defs>
      <path d="M 85 200 Q 60 140 100 90 Q 140 40 200 35 Q 260 40 300 90 Q 340 140 315 200 Q 290 150 250 140 Q 200 130 150 140 Q 110 150 85 200 Z" fill="url(#curlyGrad)"/>
      <circle cx="130" cy="95" r="14" fill="#382921"/>
      <circle cx="170" cy="70" r="15" fill="#382921"/>
      <circle cx="215" cy="65" r="16" fill="#382921"/>
      <circle cx="260" cy="80" r="15" fill="#382921"/>
      <circle cx="150" cy="115" r="13" fill="#382921"/>
    </svg>`,

    hair_buzz: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="400" height="260">
      <path d="M 95 190 Q 95 90 200 70 Q 305 90 305 190 Q 280 140 250 130 Q 200 120 150 130 Q 120 140 95 190 Z" fill="#17120e"/>
      <path d="M 125 155 Q 200 140 275 155" stroke="#2c221a" stroke-width="3" fill="none"/>
    </svg>`,

    // --- APPAREL (UPPER GARMENT PROTOTYPES - IDs 1, 6, 11, 26) ---
    apparel_shirt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="600" height="360">
      <defs>
        <linearGradient id="oxfordBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#93c5fd"/><stop offset="60%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#3b82f6"/>
        </linearGradient>
      </defs>
      <path d="M 180 80 Q 300 120 420 80 L 530 200 L 470 340 L 130 340 L 70 200 Z" fill="url(#oxfordBlue)"/>
      <rect x="288" y="95" width="24" height="245" fill="#3b82f6" stroke="#2563eb" stroke-width="1.5"/>
      <circle cx="300" cy="130" r="4.5" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="300" cy="180" r="4.5" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="300" cy="230" r="4.5" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="300" cy="280" r="4.5" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
      <path d="M 230 40 L 290 100 L 260 105 L 180 75 Z" fill="#dbeafe" stroke="#93c5fd" stroke-width="2"/>
      <path d="M 370 40 L 310 100 L 340 105 L 420 75 Z" fill="#dbeafe" stroke="#93c5fd" stroke-width="2"/>
    </svg>`,

    apparel_tshirt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="600" height="360">
      <defs>
        <linearGradient id="teeGrey" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#475569"/><stop offset="60%" stop-color="#334155"/><stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
      </defs>
      <path d="M 200 65 Q 300 115 400 65 L 530 180 L 460 340 L 140 340 L 70 180 Z" fill="url(#teeGrey)"/>
      <path d="M 220 65 Q 300 105 380 65 Q 300 118 220 65 Z" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
    </svg>`,

    apparel_blazer: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="600" height="360">
      <defs>
        <linearGradient id="blazerNavy" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/><stop offset="60%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/>
        </linearGradient>
      </defs>
      <path d="M 160 70 L 440 70 L 540 210 L 480 340 L 120 340 L 60 210 Z" fill="url(#blazerNavy)"/>
      <polygon points="260,70 340,70 300,180" fill="#f8fafc"/>
      <path d="M 190 70 L 260 170 L 210 180 L 180 130 Z" fill="#334155" stroke="#1e293b" stroke-width="2"/>
      <path d="M 410 70 L 340 170 L 390 180 L 420 130 Z" fill="#334155" stroke="#1e293b" stroke-width="2"/>
      <polygon points="380,210 405,195 415,210" fill="#ef4444"/>
    </svg>`,

    apparel_hoodie: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="600" height="360">
      <defs>
        <linearGradient id="hoodieBlack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#27272a"/><stop offset="60%" stop-color="#18181b"/><stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
      </defs>
      <path d="M 180 70 Q 300 125 420 70 L 530 190 L 460 340 L 140 340 L 70 190 Z" fill="url(#hoodieBlack)"/>
      <path d="M 195 70 Q 300 145 405 70 Q 300 120 195 70 Z" fill="#3f3f46" stroke="#52525b" stroke-width="2"/>
      <path d="M 270 115 L 265 190" stroke="#e4e4e7" stroke-width="3" stroke-linecap="round"/>
      <path d="M 330 115 L 335 190" stroke="#e4e4e7" stroke-width="3" stroke-linecap="round"/>
    </svg>`
  };

  // Map product IDs 1, 6, 11, 26 to apparel vectors
  VECTOR_ASSETS[1] = VECTOR_ASSETS.apparel_shirt;
  VECTOR_ASSETS[6] = VECTOR_ASSETS.apparel_tshirt;
  VECTOR_ASSETS[11] = VECTOR_ASSETS.apparel_blazer;
  VECTOR_ASSETS[26] = VECTOR_ASSETS.apparel_hoodie;

  /**
   * Helper to load SVG string into an Image object
   */
  function loadSvgIntoImage(svgString) {
    if (!svgString) return;
    const cleanSvg = svgString.trim();
    accessoryImg.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(cleanSvg);
  }

  // Pre-load default initial accessory (ID 21 Aviator)
  loadSvgIntoImage(VECTOR_ASSETS[21]);

  /**
   * Enumerate available video input devices
   */
  async function enumerateCameras() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return [];
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      tryOnState.availableDevices = devices.filter((d) => d.kind === "videoinput");
      return tryOnState.availableDevices;
    } catch (e) {
      return [];
    }
  }

  /**
   * Request webcam access and start streaming with robust error handling
   */
  async function startCamera(videoElement, statusCallback, deviceId = null) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (statusCallback) {
        statusCallback("error", "Webcam access is not supported by this browser. Try Chrome, Edge, or Safari.");
      }
      return false;
    }

    try {
      if (statusCallback) statusCallback("loading", "Requesting camera permission...");

      // Stop any existing stream first to free hardware
      stopCamera(videoElement);

      const constraints = {
        audio: false,
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        }
      };

      if (deviceId) {
        constraints.video.deviceId = { exact: deviceId };
        tryOnState.currentDeviceId = deviceId;
      } else {
        constraints.video.facingMode = tryOnState.facingMode;
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      activeStream = stream;

      if (videoElement) {
        videoElement.srcObject = stream;
        videoElement.setAttribute("playsinline", "true");
        videoElement.muted = true;
        await videoElement.play().catch((e) => console.warn("Video play error:", e));
      }

      tryOnState.isStreaming = true;
      await enumerateCameras();

      if (statusCallback) {
        statusCallback("active", "Camera connected. Virtual Try-On Prototype active.");
      }
      return true;
    } catch (err) {
      tryOnState.isStreaming = false;
      let msg = "Camera permission was denied. Please allow camera access in browser settings.";
      if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        msg = "No camera hardware detected on this device.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        msg = "Camera is currently locked by another application. Please close other camera apps.";
      } else if (err.name === "OverconstrainedError") {
        msg = "Requested camera resolution or facing mode is unavailable on this device.";
      } else if (err.name === "SecurityError") {
        msg = "Camera access blocked due to security restrictions (HTTPS or localhost required).";
      }

      if (statusCallback) statusCallback("error", msg);
      return false;
    }
  }

  /**
   * Switch front / rear camera or specific device
   */
  async function switchCamera(videoElement, statusCallback) {
    if (tryOnState.availableDevices.length > 1 && tryOnState.currentDeviceId) {
      const idx = tryOnState.availableDevices.findIndex((d) => d.deviceId === tryOnState.currentDeviceId);
      const nextIdx = (idx + 1) % tryOnState.availableDevices.length;
      return startCamera(videoElement, statusCallback, tryOnState.availableDevices[nextIdx].deviceId);
    }
    tryOnState.facingMode = tryOnState.facingMode === "user" ? "environment" : "user";
    return startCamera(videoElement, statusCallback);
  }

  /**
   * Stop active camera stream and release hardware completely
   */
  function stopCamera(videoElement) {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    if (activeStream) {
      activeStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      activeStream = null;
    }

    if (videoElement) {
      videoElement.srcObject = null;
    }

    tryOnState.isStreaming = false;
    tryOnState.detectedFace = null;
    tryOnState.detectedAngle = 0;
    smoothedBox.x = null;
    smoothedBox.y = null;
    smoothedBox.width = null;
    smoothedBox.height = null;
    smoothedBox.angle = 0;
  }

  /**
   * Automatic Face Landmark Detection loop with EMA jitter filtering & head-tilt computation
   */
  async function detectFaceLandmarks(videoEl) {
    if (!tryOnState.autoTrack || isDetecting || !videoEl || videoEl.readyState < 2) {
      return;
    }
    isDetecting = true;

    try {
      if (faceDetector) {
        // Native Shape Detection API
        const faces = await faceDetector.detect(videoEl);
        if (faces && faces.length > 0) {
          const rawFace = faces[0];
          tryOnState.detectedFace = rawFace;

          const box = rawFace.boundingBox;
          if (smoothedBox.x === null) {
            smoothedBox.x = box.x;
            smoothedBox.y = box.y;
            smoothedBox.width = box.width;
            smoothedBox.height = box.height;
          } else {
            // Exponential moving average smoothing (alpha = 0.35)
            smoothedBox.x = smoothedBox.x * 0.65 + box.x * 0.35;
            smoothedBox.y = smoothedBox.y * 0.65 + box.y * 0.35;
            smoothedBox.width = smoothedBox.width * 0.65 + box.width * 0.35;
            smoothedBox.height = smoothedBox.height * 0.65 + box.height * 0.35;
          }

          // Check if eye landmarks are available to estimate head tilt angle
          if (rawFace.landmarks && rawFace.landmarks.length >= 2) {
            const eyes = rawFace.landmarks.filter((l) => l.type === "eye" || (l.locations && l.locations.length > 0));
            if (eyes.length >= 2 && eyes[0].locations && eyes[1].locations) {
              const p1 = eyes[0].locations[0];
              const p2 = eyes[1].locations[0];
              const rawAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
              // Inverted for horizontally mirrored video
              const mirroredAngle = -rawAngle;
              smoothedBox.angle = smoothedBox.angle * 0.70 + mirroredAngle * 0.30;
              tryOnState.detectedAngle = smoothedBox.angle;
            }
          }
        } else {
          tryOnState.detectedFace = null;
          tryOnState.detectedAngle = 0;
        }
      } else {
        // High-speed client-side skin-locus tracker (universal fallback across all browsers)
        if (!offscreenCanvas) {
          offscreenCanvas = document.createElement("canvas");
          offscreenCanvas.width = 64;
          offscreenCanvas.height = 48;
          offscreenCtx = offscreenCanvas.getContext("2d", { willReadFrequently: true });
        }

        offscreenCtx.drawImage(videoEl, 0, 0, 64, 48);
        const imgData = offscreenCtx.getImageData(0, 0, 64, 48);
        const data = imgData.data;

        let minX = 64, maxX = 0, minY = 48, maxY = 0, count = 0;
        let leftSumY = 0, leftCount = 0;
        let rightSumY = 0, rightCount = 0;

        for (let y = 4; y < 44; y++) {
          for (let x = 6; x < 58; x++) {
            const idx = (y * 64 + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Robust skin-tone threshold in normalized RGB
            if (r > 75 && g > 40 && b > 20 && r > g && r > b && (r - g) > 12) {
              count++;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;

              // Sample eye line for tilt estimation
              if (y < 26) {
                if (x < 32) {
                  leftSumY += y;
                  leftCount++;
                } else {
                  rightSumY += y;
                  rightCount++;
                }
              }
            }
          }
        }

        if (count > 70) {
          const scaleX = (videoEl.videoWidth || 640) / 64;
          const scaleY = (videoEl.videoHeight || 480) / 48;

          const boxX = minX * scaleX;
          const boxY = minY * scaleY;
          const boxW = Math.max(120, (maxX - minX) * scaleX);
          const boxH = Math.max(140, (maxY - minY) * scaleY);

          if (smoothedBox.x === null) {
            smoothedBox.x = boxX;
            smoothedBox.y = boxY;
            smoothedBox.width = boxW;
            smoothedBox.height = boxH;
          } else {
            smoothedBox.x = smoothedBox.x * 0.65 + boxX * 0.35;
            smoothedBox.y = smoothedBox.y * 0.65 + boxY * 0.35;
            smoothedBox.width = smoothedBox.width * 0.65 + boxW * 0.35;
            smoothedBox.height = smoothedBox.height * 0.65 + boxH * 0.35;
          }

          if (leftCount > 10 && rightCount > 10) {
            const avgLeftY = leftSumY / leftCount;
            const avgRightY = rightSumY / rightCount;
            const rawTilt = Math.atan2(avgRightY - avgLeftY, 32) * (180 / Math.PI);
            const mirroredTilt = -rawTilt;
            smoothedBox.angle = smoothedBox.angle * 0.70 + mirroredTilt * 0.30;
            tryOnState.detectedAngle = smoothedBox.angle;
          }

          tryOnState.detectedFace = { boundingBox: smoothedBox };
        } else {
          tryOnState.detectedFace = null;
        }
      }
    } catch (e) {
      tryOnState.detectedFace = null;
    } finally {
      isDetecting = false;
    }
  }

  /**
   * Render Canvas overlay loop with landmark-assisted alignment, tilt rotation & manual fallback
   */
  function startOverlayLoop(videoEl, canvasEl) {
    if (!videoEl || !canvasEl) return;
    const ctx = canvasEl.getContext("2d");

    let lastDetectTime = 0;

    function render(currentTime) {
      if (videoEl.readyState >= 2) {
        const vw = videoEl.videoWidth || 640;
        const vh = videoEl.videoHeight || 480;

        if (canvasEl.width !== vw || canvasEl.height !== vh) {
          canvasEl.width = vw;
          canvasEl.height = vh;
        }

        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

        // Mirror video display for natural mirror UX
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(videoEl, -canvasEl.width, 0, canvasEl.width, canvasEl.height);
        ctx.restore();

        // Throttle face detection to every ~100ms for high frame-rate rendering
        if (tryOnState.autoTrack && currentTime - lastDetectTime > 100) {
          lastDetectTime = currentTime;
          detectFaceLandmarks(videoEl);
        }

        // Draw accessory if image is loaded and accessory is not 'none'
        if (tryOnState.accessoryType !== "none" && accessoryImg.complete && accessoryImg.naturalWidth > 0) {
          let centerX = canvasEl.width / 2;
          let centerY;
          let drawWidth;

          // Default positioning when face is not yet detected
          if (tryOnState.accessoryType === "cap") {
            centerY = canvasEl.height * 0.22;
            drawWidth = canvasEl.width * 0.44;
          } else if (tryOnState.accessoryType === "hairstyle") {
            centerY = canvasEl.height * 0.20;
            drawWidth = canvasEl.width * 0.46;
          } else if (tryOnState.accessoryType === "apparel") {
            centerY = canvasEl.height * 0.72;
            drawWidth = canvasEl.width * 0.78;
          } else {
            // Goggles / Eyewear
            centerY = canvasEl.height * 0.38;
            drawWidth = canvasEl.width * 0.34;
          }

          // Dynamic Landmark / Head Anchor Positioning
          if (tryOnState.autoTrack && tryOnState.detectedFace && smoothedBox.x !== null) {
            // Video is mirrored horizontally: face x needs inversion
            const mirroredFaceX = canvasEl.width - (smoothedBox.x + smoothedBox.width);
            centerX = mirroredFaceX + smoothedBox.width / 2;

            if (tryOnState.accessoryType === "cap") {
              // Placed atop forehead / skull
              centerY = smoothedBox.y - smoothedBox.height * 0.05;
              drawWidth = smoothedBox.width * 1.25;
            } else if (tryOnState.accessoryType === "hairstyle") {
              // Placed over crown and hairline
              centerY = smoothedBox.y - smoothedBox.height * 0.10;
              drawWidth = smoothedBox.width * 1.28;
            } else if (tryOnState.accessoryType === "apparel") {
              // Placed below chin at torso/shoulder level
              centerY = smoothedBox.y + smoothedBox.height * 0.98;
              drawWidth = smoothedBox.width * 2.15;
            } else {
              // Goggles placed precisely around eye level (~36% of face box)
              centerY = smoothedBox.y + smoothedBox.height * 0.36;
              drawWidth = smoothedBox.width * 0.96;
            }
          }

          // Apply manual calibration offsets
          centerX += tryOnState.offsetX;
          centerY += tryOnState.offsetY;
          drawWidth *= tryOnState.scale;

          const drawHeight = (drawWidth * accessoryImg.naturalHeight) / (accessoryImg.naturalWidth || 1);

          // Compute composite tilt: auto-detected head tilt + manual calibration slider
          const totalAngleDeg = (tryOnState.rotation || 0) + (tryOnState.autoTrack ? (tryOnState.detectedAngle || 0) : 0);
          const totalAngleRad = (totalAngleDeg * Math.PI) / 180;

          ctx.save();
          ctx.translate(centerX, centerY);
          if (totalAngleRad !== 0) {
            ctx.rotate(totalAngleRad);
          }

          // Render transparent vector accessory with subtle drop shadow
          ctx.shadowColor = "rgba(0,0,0,0.30)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetY = 4;

          ctx.drawImage(
            accessoryImg,
            -drawWidth / 2,
            -drawHeight / 2,
            drawWidth,
            drawHeight
          );

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);
  }

  /**
   * Set accessory item cleanly without restarting active camera stream
   * Maps catalog items and categories directly to transparent vector SVG assets.
   */
  function setAccessory(type, imgSrc = null, productId = null) {
    if (type === "none" || (!imgSrc && !productId)) {
      tryOnState.accessoryType = "none";
      tryOnState.accessorySrc = null;
      tryOnState.accessoryId = null;
      return;
    }

    const pId = productId ? Number(productId) : null;
    tryOnState.accessoryId = pId;
    tryOnState.accessorySrc = imgSrc || (pId ? `catalog_${pId}` : type);

    // Look up vector asset by numeric ID, string key, or category
    let vectorSvg = null;
    let resolvedType = type;

    if (pId && VECTOR_ASSETS[pId]) {
      vectorSvg = VECTOR_ASSETS[pId];
      if (pId >= 21 && pId <= 25) resolvedType = "goggles";
      else if (pId >= 16 && pId <= 20) resolvedType = "cap";
      else if ([1, 6, 11, 26].includes(pId)) resolvedType = "apparel";
    } else if (imgSrc && VECTOR_ASSETS[imgSrc]) {
      vectorSvg = VECTOR_ASSETS[imgSrc];
    } else if (VECTOR_ASSETS[type]) {
      vectorSvg = VECTOR_ASSETS[type];
    } else {
      // Fallback: check if imgSrc matches a canonical path
      const match = typeof imgSrc === "string" ? imgSrc.match(/(goggles|cap)(\d)/) : null;
      if (match) {
        const cat = match[1];
        const num = parseInt(match[2], 10);
        const mappedId = cat === "goggles" ? (20 + num) : (15 + num);
        if (VECTOR_ASSETS[mappedId]) {
          vectorSvg = VECTOR_ASSETS[mappedId];
          resolvedType = cat;
        }
      }
    }

    tryOnState.accessoryType = resolvedType;

    if (vectorSvg) {
      loadSvgIntoImage(vectorSvg);
    } else if (imgSrc) {
      accessoryImg.src = imgSrc;
    }
  }

  /**
   * Reset calibration sliders to baseline
   */
  function resetCalibration() {
    tryOnState.scale = 1.0;
    tryOnState.offsetX = 0;
    tryOnState.offsetY = 0;
    tryOnState.rotation = 0;
    tryOnState.detectedAngle = 0;
  }

  /**
   * Capture high-resolution snapshot from canvas
   */
  function takeSnapshot(canvasEl) {
    if (!canvasEl) return null;
    try {
      return canvasEl.toDataURL("image/png");
    } catch (e) {
      return null;
    }
  }

  // Auto clean-up when window navigates away or page is hidden (privacy protection)
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      stopCamera();
    });
  }
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        stopCamera();
      }
    });
  }

  // Export engine
  global.MeroXCamera = {
    startCamera,
    stopCamera,
    switchCamera,
    enumerateCameras,
    startOverlayLoop,
    setAccessory,
    resetCalibration,
    takeSnapshot,
    VECTOR_ASSETS,
    state: tryOnState
  };
})(typeof window !== "undefined" ? window : globalThis);
