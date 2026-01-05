// ========== MODE SWITCH LOGIC ==========
const filters = document.querySelectorAll(".filter");
const statusText = document.querySelector(".status-text");

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const mode = btn.dataset.mode;

    if (mode === "skin") statusText.innerText = "Skin Mode Activated";
    if (mode === "fitness") statusText.innerText = "Fitness Mode Activated";
    if (mode === "goggles") statusText.innerText = "MeroX Fashion Activated";
    if (mode === "clothes") statusText.innerText = "MeroX Fashion Activated";
  });
});

// ========== CAMERA PREVIEW ==========
const cameraBox = document.querySelector(".camera-placeholder");

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraBox.innerHTML = `<video autoplay playsinline></video>`;
    cameraBox.querySelector("video").srcObject = stream;
  } catch (err) {
    cameraBox.innerText = "Camera access denied";
  }
}

startCamera();

// ========== roX-AI CHAT ==========
const roxSend = document.getElementById("roxSend");
const roxInput = document.getElementById("roxInput");
const roxMessages = document.getElementById("roxMessages");

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = type === "user" ? "user-msg" : "ai-msg";
  msg.innerText = text;
  roxMessages.appendChild(msg);
  roxMessages.scrollTop = roxMessages.scrollHeight;
}

function roxReply(userText) {
  let reply = "I am roX-AI. I am here to help you.";

  if (userText.includes("premium"))
    reply = "Premium gives you full access to Fashion, AI Coach & Try-On.";

  if (userText.includes("fitness"))
    reply = "Fitness mode includes calorie calculator and posture analysis.";

  if (userText.includes("skin"))
    reply = "Skin mode analyzes skin type and suggests care routine.";

  setTimeout(() => addMessage(reply, "ai"), 500);
}

function sendMessage() {
  const text = roxInput.value.trim().toLowerCase();
  if (!text) return;

  addMessage(text, "user");
  roxInput.value = "";
  roxReply(text);
}

roxSend.addEventListener("click", sendMessage);

roxInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});
