// ================= FIREBASE AUTH GUARD =================
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // agar login nahi hai → index.html pe bhej do
    window.location.href = "index.html";
  }
});

// ================= CAMERA LOGIC =================
const camera = document.getElementById("camera");
const startBtn = document.getElementById("startCamera");
const placeholder = document.getElementById("mirrorPlaceholder");

if (startBtn) {
  startBtn.addEventListener("click", async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      camera.srcObject = stream;
      camera.hidden = false;
      placeholder.style.display = "none";
      startBtn.innerText = "Camera Active";
      startBtn.disabled = true;
    } catch (err) {
      alert("Camera access denied");
    }
  });
}

// ================= CHAT + AI LOGIC =================
import { askRoxAI } from "./rox-ai.js";

const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("userInput");
const messages = document.getElementById("messages");

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  // user message
  messages.innerHTML += `<div class="user-msg">${userText}</div>`;
  input.value = "";

  // thinking
  const thinkingDiv = document.createElement("div");
  thinkingDiv.className = "ai-msg";
  thinkingDiv.innerText = "🤖 roX-AI is thinking...";
  messages.appendChild(thinkingDiv);
  messages.scrollTop = messages.scrollHeight;

  try {
    const reply = await askRoxAI(userText);
    thinkingDiv.remove();
    messages.innerHTML += `<div class="ai-msg">${reply}</div>`;
  } catch (err) {
    thinkingDiv.innerText = "❌ Error connecting roX-AI";
    console.error(err);
  }

  messages.scrollTop = messages.scrollHeight;
}