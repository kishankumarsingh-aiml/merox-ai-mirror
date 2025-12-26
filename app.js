// ===== DEMO LOGIN / SIGNUP LOGIC (FRONTEND ONLY) =====

// Elements
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Fake database (localStorage)
function saveUser(email, password) {
  localStorage.setItem("meroxUser", JSON.stringify({ email, password }));
}

function getUser() {
  return JSON.parse(localStorage.getItem("meroxUser"));
}

// SIGN UP
if (signupBtn) {
  signupBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("❌ Email aur Password required hai");
      return;
    }

    saveUser(email, password);
    alert("✅ Signup successful! Ab login karo.");
  });
}

// LOGIN
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const user = getUser();

    if (!email || !password) {
      alert("❌ Email aur Password daalo");
      return;
    }

    if (!user) {
      alert("❌ Pehle Sign Up karo");
      return;
    }

    if (email === user.email && password === user.password) {
      alert("🎉 Login Successful! Welcome to MeroX");
      document.body.innerHTML = `
        <div style="color:white;text-align:center;margin-top:100px">
          <h1>🚀 Welcome to MeroX Dashboard</h1>
          <p>AI Mirror Prototype – Phase 1</p>
          <button onclick="logout()" style="padding:10px 20px;margin-top:20px">Logout</button>
        </div>
      `;
    } else {
      alert("❌ Wrong Email or Password");
    }
  });
}

// LOGOUT
function logout() {
  location.reload();
}
