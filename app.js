const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const tabs = document.querySelectorAll(".tab");

function showLogin() {
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
  tabs[0].classList.add("active");
  tabs[1].classList.remove("active");
}

function showSignup() {
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  tabs[1].classList.add("active");
  tabs[0].classList.remove("active");
}
