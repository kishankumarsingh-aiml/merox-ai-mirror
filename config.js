// MeroX Client Configuration
// For security, secret API keys are NOT hardcoded in client source files.
// Gemini API key can be supplied via browser localStorage for local testing or via a secure backend proxy.

export const getGeminiApiKey = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem("MEROX_GEMINI_API_KEY") || "";
    }
  } catch (e) {
    console.warn("Storage access restricted:", e);
  }
  return "";
};

export const setGeminiApiKey = (key) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      if (key && key.trim()) {
        window.localStorage.setItem("MEROX_GEMINI_API_KEY", key.trim());
      } else {
        window.localStorage.removeItem("MEROX_GEMINI_API_KEY");
      }
    }
  } catch (e) {
    console.warn("Storage access restricted:", e);
  }
};

export const GEMINI_API_KEY = getGeminiApiKey();
