// 🔥 Firebase Config (client-safe)
const firebaseConfig = {
  apiKey: "AIzaSyBA6HoJ3TuuZI1Mx1Z38rxvdW9J9a9xu8A",
  authDomain: "merox-ai-mirror.firebaseapp.com",
  projectId: "merox-ai-mirror",
  storageBucket: "merox-ai-mirror.appspot.com",
  messagingSenderId: "69028024588",
  appId: "1:69028024588:web:f374b0e927adfe839ff929"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener("DOMContentLoaded", () => {

  // ================= ELEMENTS =================
  const loginTab   = document.getElementById("loginTab");
  const signupTab  = document.getElementById("signupTab");
  const loginForm  = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  const authCard = document.getElementById("authCard");
  const chatBox  = document.getElementById("chatBox");

  const sendBtn   = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const messages  = document.getElementById("messages");

  // ================= TAB SWITCH =================
  loginTab.onclick = () => {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  };

  signupTab.onclick = () => {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  };

  // ================= LOGIN =================
  loginForm.onsubmit = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(
        loginEmail.value,
        loginPassword.value
      )
      .then(() => {
        authCard.style.display = "none";
        chatBox.classList.remove("hidden");
      })
      .catch(err => alert(err.message));
  };

  // ================= SIGNUP =================
  signupForm.onsubmit = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(
        signupEmail.value,
        signupPassword.value
      )
      .then(() => {
        authCard.style.display = "none";
        chatBox.classList.remove("hidden");
      })
      .catch(err => alert(err.message));
  };

  // ================= DUMMY CHAT (SAFE) =================
  sendBtn.onclick = () => {
    const msg = userInput.value.trim();
    if (!msg) return;

    const userDiv = document.createElement("div");
    userDiv.className = "user";
    userDiv.textContent = msg;
    messages.appendChild(userDiv);

    const botDiv = document.createElement("div");
    botDiv.className = "bot";
    botDiv.textContent = "🤖 roX-AI: Feature coming soon.";
    messages.appendChild(botDiv);

    userInput.value = "";
    messages.scrollTop = messages.scrollHeight;
  };

});