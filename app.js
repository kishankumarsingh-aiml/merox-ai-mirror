import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBA6HoJ3TuuZI1Mx1Z38rxvdW9J9a9xu8A",
  authDomain: "merox-ai-mirror.firebaseapp.com",
  projectId: "merox-ai-mirror",
  appId: "1:69028024588:web:f374b0e927adfe839ff929"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Tabs
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

loginTab.onclick = () => {
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
};

signupTab.onclick = () => {
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  signupTab.classList.add("active");
  loginTab.classList.remove("active");
};

// Signup
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  createUserWithEmailAndPassword(
    auth,
    signupEmail.value,
    signupPassword.value
  )
  .then(() => alert("Signup successful 🎉"))
  .catch(err => alert(err.message));
});

// Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  signInWithEmailAndPassword(
    auth,
    loginEmail.value,
    loginPassword.value
  )
  .then(() => alert("Login successful ✅"))
  .catch(err => alert(err.message));
});
