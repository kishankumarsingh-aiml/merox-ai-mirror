import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ================= UI HELPERS ================= */

function showDashboard() {
  document.getElementById("authSection")?.classList.add("hidden");
  document.getElementById("dashboard")?.classList.remove("hidden");
}

function showAuth() {
  document.getElementById("dashboard")?.classList.add("hidden");
  document.getElementById("authSection")?.classList.remove("hidden");
}

window.showLogin = () => {
  document.getElementById("loginForm")?.classList.remove("hidden");
  document.getElementById("signupForm")?.classList.add("hidden");
};

window.showSignup = () => {
  document.getElementById("signupForm")?.classList.remove("hidden");
  document.getElementById("loginForm")?.classList.add("hidden");
};

/* ================= AUTH STATE ================= */

onAuthStateChanged(auth, (user) => {
  if (user) {
    showDashboard(); // ✅ SAME PAGE DASHBOARD
  } else {
    showAuth();
  }
});

/* ================= SIGNUP ================= */

document.getElementById("signupForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = e.target.querySelector('input[type="email"]').value;
  const password = e.target.querySelector('input[type="password"]').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Signup successful 🎉");
      showDashboard();
    })
    .catch(err => alert(err.message));
});

/* ================= LOGIN ================= */

document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = e.target.querySelector('input[type="email"]').value;
  const password = e.target.querySelector('input[type="password"]').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful ✅");
      showDashboard();
    })
    .catch(err => alert(err.message));
});

/* ================= LOGOUT ================= */

window.logout = () => {
  signOut(auth).then(() => {
    showAuth();
  });
};
