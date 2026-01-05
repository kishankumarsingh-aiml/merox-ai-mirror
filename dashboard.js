// =======================
// MODE SWITCHING
// =======================
const filters = document.querySelectorAll(".filter");
const statusText = document.querySelector(".status-text");

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const mode = btn.dataset.mode;

    switch (mode) {
      case "skin":
        statusText.innerText = "Skin Care Mode Activated";
        break;
      case "fitness":
        statusText.innerText = "Fitness Mode Activated";
        break;
      case "goggles":
        statusText.innerText = "Goggles Try-On Mode Activated";
        break;
      case "clothes":
        statusText.innerText = "Clothes Try-On Mode Activated";
        break;
    }
  });
});


// =======================
// CAMERA PREVIEW (REAL)
// =======================
const cameraBox = document.querySelector(".camera-placeholder");

const video = document.createElement("video");
video.autoplay = true;
video.playsInline = true;
video.style.width = "100%";
video.style.height = "100%";
video.style.borderRadius = "14px";

cameraBox.innerHTML = "";
cameraBox.appendChild(video);

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });
    video.srcObject = stream;
  } catch (err) {
    cameraBox.innerHTML = "Camera access denied ❌";
    console.error(err);
  }
}

startCamera();

// =======================
// roX-AI CHAT LOGIC (DEMO)
// =======================
const roxInput = document.getElementById("roxInput");
const roxSend = document.getElementById("roxSend");
const roxMessages = document.getElementById("roxMessages");

roxSend.addEventListener("click", sendMessage);
roxInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = roxInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  roxInput.value = "";

  // Demo AI replies (context-based)
  setTimeout(() => {
    let reply = "I can help you with Fitness, Skin Care and MeroX Fashion.";

    if (text.toLowerCase().includes("fitness")) {
      reply = "🏋️ Fitness mode helps with workouts, calories and posture.";
    } else if (text.toLowerCase().includes("skin")) {
      reply = "🧴 Skin Care mode analyzes skin and suggests routine.";
    } else if (text.toLowerCase().includes("fashion")) {
      reply = "👗 MeroX Fashion lets you try clothes and goggles virtually.";
    }

    addMessage(reply, "bot");
  }, 600);
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `rox-msg ${type}`;
  div.innerText = text;
  roxMessages.appendChild(div);
  roxMessages.scrollTop = roxMessages.scrollHeight;
}
