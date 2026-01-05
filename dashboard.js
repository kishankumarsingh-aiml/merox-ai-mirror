// CAMERA LOGIC
const camera = document.getElementById("camera");
const startBtn = document.getElementById("startCamera");
const placeholder = document.getElementById("mirrorPlaceholder");

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

// CHAT LOGIC
const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("userInput");
const messages = document.getElementById("messages");

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  setTimeout(() => {
    addMessage(roXReply(text), "bot");
  }, 600);
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = type;
  div.innerText = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function roXReply(msg) {
  msg = msg.toLowerCase();

  if (msg.includes("fitness"))
    return "🏋️ I can help with workouts, calorie calculator and fitness tips.";

  if (msg.includes("skin"))
    return "🧴 I analyze skin and suggest routine, diet and care tips.";

  if (msg.includes("fashion") || msg.includes("clothes"))
    return "👕 MeroX Fashion lets you try clothes virtually using AI Mirror.";

  if (msg.includes("premium"))
    return "⭐ Premium unlocks Fashion, AI Coach and advanced Try-On features.";

  return "🤖 I am roX-AI. Ask me about Fitness, Skin, Fashion or Premium.";
}
