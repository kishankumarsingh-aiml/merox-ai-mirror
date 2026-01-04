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
