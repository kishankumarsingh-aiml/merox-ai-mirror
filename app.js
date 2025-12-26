import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ================= FIREBASE CONFIG ================= */

const firebaseConfig = {
  apiKey: "AIzaSyBA6HoJ3TuuZI1Mx1Z38rxvdW9J9a9xu8A",
  authDomain: "merox-ai-mirror.firebaseapp.com",
  projectId: "merox-ai-mirror",
  storageBucket: "merox-ai-mirror.firebasestorage.app",
  messagingSenderId: "69028024588",
  appId: "1:69028024588:web:f374b0e927adfe839ff929"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ================= UI TOGGLE ================= */

window.showLogin = () => {
  document.getElementById("loginForm")?.classList.remove("hidden");
  document.getElementById("signupForm")?.classList.add("hidden");

  document.querySelectorAll(".tab")[0]?.classList.add("active");
  document.querySelectorAll(".tab")[1]?.classList.remove("active");
};

window.showSignup = () => {
  document.getElementById("signupForm")?.classList.remove("hidden");
  document.getElementById("loginForm")?.classList.add("hidden");

  document.querySelectorAll(".tab")[1]?.classList.add("active");
  document.querySelectorAll(".tab")[0]?.classList.remove("active");
};

/* ================= AUTH LOGIC ================= */

document.addEventListener("DOMContentLoaded", () => {

  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  // 🔐 Auto redirect if already logged in
  onAuthStateChanged(auth, (user) => {
    if (user && window.location.pathname.includes("index")) {
      window.location.href = "dashboard.html";
    }
  });

  // ================= SIGN UP =================
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = signupForm.querySelector('input[type="email"]').value;
      const password = signupForm.querySelector('input[type="password"]').value;

      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          alert("Signup successful 🎉");
          window.location.href = "dashboard.html"; // ✅ REDIRECT
        })
        .catch((err) => alert(err.message));
    });
  }

  // ================= LOGIN =================
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;

      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          alert("Login successful ✅");
          window.location.href = "dashboard.html"; // ✅ REDIRECT
        })
        .catch((err) => alert(err.message));
    });
  }

});
