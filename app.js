/* ================= UI TABS ================= */
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

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

/* ================= FIREBASE ================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

/* ================= SIGN UP ================= */
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🔥 FIXED EMAIL VERIFICATION FLOW
    await sendEmailVerification(user, {
      url: "https://kishankumarsingh-aiml.github.io/merox-ai-mirror/",
      handleCodeInApp: true
    });

    alert("Verification email sent 📩\nPlease check Gmail & verify.");
    auth.signOut(); // important
  } catch (error) {
    alert(error.message);
  }
});

/* ================= LOGIN ================= */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      alert("Please verify your email before accessing dashboard.");
      auth.signOut();
      return;
    }

    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
});

/* ================= AUTO REDIRECT ================= */
onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    if (window.location.pathname.includes("index.html")) {
      window.location.href = "dashboard.html";
    }
  }
});
