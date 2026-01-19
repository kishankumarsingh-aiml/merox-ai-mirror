// rox-ai.js
// roX-AI Brain (Gemini powered)

import { GEMINI_API_KEY } from "./config.js";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * roX system personality (VERY IMPORTANT)
 * This controls how your AI behaves
 */
const ROX_SYSTEM_PROMPT = `
You are roX-AI, the official AI assistant of MeroX – AI Smart Mirror.

Your behavior rules:
- Be professional, confident, and friendly
- Do NOT repeat the same lines again and again
- Give clear, short, and useful answers
- Speak like a premium AI assistant, not a chatbot toy
- If mode is FITNESS: act like a fitness coach
- If mode is SKIN: act like a skincare expert
- If mode is GENERAL: act like a smart AI guide

Never say:
"I am just an AI"
"I cannot help with that"

Always guide the user politely and intelligently.
`;

/**
 * Main function to talk with roX-AI
 * @param {string} userMessage - user question
 * @param {string} mode - fitness | skin | general
 * @returns {string} AI reply
 */
export async function askRoxAI(userMessage, mode = "general") {
  try {
    const response = await fetch(
      `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
SYSTEM:
${ROX_SYSTEM_PROMPT}

CURRENT MODE: ${mode.toUpperCase()}

USER QUESTION:
${userMessage}
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!data.candidates || !data.candidates.length) {
      return "roX-AI is thinking… please try again.";
    }

    return (
      data.candidates[0].content.parts[0].text ||
      "roX-AI could not generate a response."
    );
  } catch (error) {
    console.error("roX-AI Error:", error);
    return "⚠️ roX-AI is temporarily unavailable. Please try again.";
  }
}
