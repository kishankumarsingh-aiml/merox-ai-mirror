import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBA6HoJ3TuuZI1Mx1Z38rxvdW9J9a9xu8A",
  authDomain: "merox-ai-mirror.firebaseapp.com",
  projectId: "merox-ai-mirror",
  storageBucket: "merox-ai-mirror.firebasestorage.app",
  messagingSenderId: "69028024588",
  appId: "1:69028024588:web:f374b0e927adfe839ff929",
  measurementId: "G-2HKXY2ZRBF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// SIGN UP
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = e.target[1].value;
  const password = e.target[2].value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Signup successful 🎉"))
    .catch(err => alert(err.message));
});

// LOGIN
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = e.target[0].value;
  const password = e.target[1].value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => alert("Login successful ✅"))
    .catch(err => alert(err.message));
});
