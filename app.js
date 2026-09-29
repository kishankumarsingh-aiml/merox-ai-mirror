/**
 * MeroX Landing & Authentication Controller (Phase 4 Production Edition)
 * Orchestrates login, registration with display name & password confirmation,
 * password reset flow, password visibility toggles, and safe redirection to dashboard.html.
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Navigation elements
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const authTabs = document.getElementById("authTabs");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const forgotForm = document.getElementById("forgotForm");

  // Feedback alerts
  const authError = document.getElementById("authError");
  const authSuccess = document.getElementById("authSuccess");

  // Form inputs
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const signupName = document.getElementById("signupName");
  const signupEmail = document.getElementById("signupEmail");
  const signupPassword = document.getElementById("signupPassword");
  const signupConfirmPassword = document.getElementById("signupConfirmPassword");
  const forgotEmail = document.getElementById("forgotEmail");

  // Buttons
  const loginSubmitBtn = document.getElementById("loginSubmitBtn");
  const signupSubmitBtn = document.getElementById("signupSubmitBtn");
  const forgotSubmitBtn = document.getElementById("forgotSubmitBtn");
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  const backToLoginBtn = document.getElementById("backToLoginBtn");
  const guestBtn = document.getElementById("guestBtn");

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(msg) {
    if (!authError) return;
    let clean = msg;
    if (window.MeroXAuth && typeof window.MeroXAuth.formatAuthError === "function") {
      clean = window.MeroXAuth.formatAuthError(msg);
    }
    authError.textContent = clean;
    authError.classList.remove("hidden");
    if (authSuccess) authSuccess.classList.add("hidden");
  }

  function showSuccess(msg) {
    if (!authSuccess) return;
    authSuccess.textContent = msg;
    authSuccess.classList.remove("hidden");
    if (authError) authError.classList.add("hidden");
  }

  function clearAlerts() {
    if (authError) {
      authError.textContent = "";
      authError.classList.add("hidden");
    }
    if (authSuccess) {
      authSuccess.textContent = "";
      authSuccess.classList.add("hidden");
    }
  }

  // Password visibility toggle helper
  window.togglePasswordVisibility = function (inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === "password") {
      input.type = "text";
      if (btn) btn.textContent = "🙈";
    } else {
      input.type = "password";
      if (btn) btn.textContent = "👁️";
    }
  };

  // Redirect if already authenticated as a registered user
  if (window.MeroXAuth) {
    const currentUser = window.MeroXAuth.getUser();
    if (currentUser && !window.MeroXAuth.isGuest()) {
      window.location.replace("dashboard.html");
      return;
    }
  }

  // Tab switching: Login vs Sign Up
  if (loginTab && signupTab) {
    loginTab.onclick = () => {
      clearAlerts();
      loginTab.classList.add("active");
      signupTab.classList.remove("active");
      loginTab.setAttribute("aria-selected", "true");
      signupTab.setAttribute("aria-selected", "false");

      loginForm.classList.remove("hidden");
      signupForm.classList.add("hidden");
      if (forgotForm) forgotForm.classList.add("hidden");
      if (authTabs) authTabs.classList.remove("hidden");
    };

    signupTab.onclick = () => {
      clearAlerts();
      signupTab.classList.add("active");
      loginTab.classList.remove("active");
      signupTab.setAttribute("aria-selected", "true");
      loginTab.setAttribute("aria-selected", "false");

      signupForm.classList.remove("hidden");
      loginForm.classList.add("hidden");
      if (forgotForm) forgotForm.classList.add("hidden");
      if (authTabs) authTabs.classList.remove("hidden");
    };
  }

  // Forgot Password View Toggle
  if (forgotPasswordLink) {
    forgotPasswordLink.onclick = () => {
      clearAlerts();
      if (loginForm) loginForm.classList.add("hidden");
      if (signupForm) signupForm.classList.add("hidden");
      if (forgotForm) forgotForm.classList.remove("hidden");
      if (authTabs) authTabs.classList.add("hidden");
      if (forgotEmail && loginEmail && loginEmail.value) {
        forgotEmail.value = loginEmail.value;
      }
    };
  }

  if (backToLoginBtn) {
    backToLoginBtn.onclick = () => {
      clearAlerts();
      if (forgotForm) forgotForm.classList.add("hidden");
      if (loginForm) loginForm.classList.remove("hidden");
      if (authTabs) authTabs.classList.remove("hidden");
      if (loginTab) loginTab.click();
    };
  }

  // 1. SIGN IN SUBMISSION
  if (loginForm) {
    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      clearAlerts();

      const email = loginEmail.value.trim();
      const password = loginPassword.value;

      if (!email || !password) {
        showError("Please enter both your email address and password.");
        return;
      }

      if (!EMAIL_REGEX.test(email)) {
        showError("Please enter a valid email address (e.g. name@example.com).");
        return;
      }

      if (loginSubmitBtn) {
        loginSubmitBtn.disabled = true;
        loginSubmitBtn.textContent = "Authenticating...";
      }

      try {
        await window.MeroXAuth.login(email, password);
        window.location.href = "dashboard.html";
      } catch (err) {
        showError(err.message || "Failed to sign in. Please verify your credentials.");
      } finally {
        if (loginSubmitBtn) {
          loginSubmitBtn.disabled = false;
          loginSubmitBtn.textContent = "Login to Dashboard";
        }
      }
    };
  }

  // 2. SIGN UP SUBMISSION
  if (signupForm) {
    signupForm.onsubmit = async (e) => {
      e.preventDefault();
      clearAlerts();

      const name = signupName.value.trim();
      const email = signupEmail.value.trim();
      const password = signupPassword.value;
      const confirmPassword = signupConfirmPassword.value;

      if (!name) {
        showError("Please provide your full name or preferred display name.");
        signupName.focus();
        return;
      }

      if (!email || !EMAIL_REGEX.test(email)) {
        showError("Please provide a valid email address (e.g. name@example.com).");
        signupEmail.focus();
        return;
      }

      if (!password || password.length < 6) {
        showError("Password must be at least 6 characters long.");
        signupPassword.focus();
        return;
      }

      if (password !== confirmPassword) {
        showError("Passwords do not match. Please verify both password fields.");
        signupConfirmPassword.focus();
        return;
      }

      if (signupSubmitBtn) {
        signupSubmitBtn.disabled = true;
        signupSubmitBtn.textContent = "Creating Account...";
      }

      try {
        await window.MeroXAuth.signup(email, password, name);
        showSuccess("Account created successfully! Redirecting to dashboard...");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 350);
      } catch (err) {
        showError(err.message || "Failed to create account. Please try again.");
      } finally {
        if (signupSubmitBtn) {
          signupSubmitBtn.disabled = false;
          signupSubmitBtn.textContent = "Create MeroX Account";
        }
      }
    };
  }

  // 3. FORGOT PASSWORD SUBMISSION
  if (forgotForm) {
    forgotForm.onsubmit = async (e) => {
      e.preventDefault();
      clearAlerts();

      const email = forgotEmail.value.trim();
      if (!email || !EMAIL_REGEX.test(email)) {
        showError("Please enter a valid email address to receive reset instructions.");
        return;
      }

      if (forgotSubmitBtn) {
        forgotSubmitBtn.disabled = true;
        forgotSubmitBtn.textContent = "Sending Reset Link...";
      }

      try {
        const res = await window.MeroXAuth.resetPassword(email);
        showSuccess(res.message || "Password reset instructions sent. Please check your inbox.");
        forgotEmail.value = "";
      } catch (err) {
        showError(err.message || "Could not send reset email. Please try again.");
      } finally {
        if (forgotSubmitBtn) {
          forgotSubmitBtn.disabled = false;
          forgotSubmitBtn.textContent = "Send Reset Link";
        }
      }
    };
  }

  // 4. GUEST BYPASS
  if (guestBtn) {
    guestBtn.onclick = () => {
      if (window.MeroXAuth) {
        window.MeroXAuth.continueAsGuest().then(() => {
          window.location.href = "dashboard.html";
        });
      } else {
        window.location.href = "dashboard.html";
      }
    };
  }
});