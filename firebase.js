/**
 * MeroX Firebase Bridge
 * Re-exports MeroXAuth from auth.js
 */
// Ensure auth.js is loaded
if (typeof window !== "undefined" && !window.MeroXAuth) {
  const script = document.createElement("script");
  script.src = "auth.js";
  document.head.appendChild(script);
}
