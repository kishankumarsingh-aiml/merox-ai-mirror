// app.js
// 🔥 Firebase v8 (simple & stable)

// 🔐 Firebase config (APNA REAL DATA YAHI RAKHO)
const firebaseConfig = {
  apiKey: "AIzaSyBA6HoJ3TuuZI1Mx1Z38rxvdW9J9a9xu8A",
  authDomain: "merox-ai-mirror.firebaseapp.com",
  projectId: "merox-ai-mirror",
  storageBucket: "merox-ai-mirror.firebasestorage.app",
  messagingSenderId: "69028024588",
  appId: "1:69028024588:web:f374b0e927adfe839ff929",
  measurementId: "G-2HKXY2ZRBF"
};

// ✅ Initialize Firebase (SAFE)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// 🚀 DOM READY (YE SABSE IMPORTANT THA)
document.addEventListener("DOMContentLoaded", () => {
  // ===== ELEMENTS =====
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  // ===== TAB SWITCH LOGIC =====
  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");

    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  });

  signupTab.addEventListener("click", () => {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");

    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  });

  // ===== LOGIN =====
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        alert("✅ Login successful");
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        alert("❌ " + error.message);
      });
  });

  // ===== SIGN UP =====
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        alert("🎉 Account created successfully");
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        alert("❌ " + error.message);
      });
  });
});