/**
 * MeroX Unified Authentication Service (Phase 4 Production Edition)
 * Wraps Firebase v8 Auth with persistent sessions, profile management,
 * password reset, user preferences, guest mode, and user-friendly error translations.
 */

(function (global) {
  "use strict";

  const firebaseConfig = {
    apiKey: "AIzaSyBA6HoJ3TuuZI1Mx1Z38rxvdW9J9a9xu8A",
    authDomain: "merox-ai-mirror.firebaseapp.com",
    projectId: "merox-ai-mirror",
    storageBucket: "merox-ai-mirror.appspot.com",
    messagingSenderId: "69028024588",
    appId: "1:69028024588:web:f374b0e927adfe839ff929"
  };

  let firebaseAuth = null;
  let authInitialized = false;
  const authListeners = [];

  // Local storage session keys
  const GUEST_KEY = "merox_guest_mode";
  const LOCAL_USER_KEY = "merox_local_user";
  const PREFERENCES_KEY = "merox_user_preferences";

  // Initialize Firebase if available
  try {
    if (typeof global.firebase !== "undefined") {
      if (!global.firebase.apps.length) {
        global.firebase.initializeApp(firebaseConfig);
      }
      firebaseAuth = global.firebase.auth();
      authInitialized = true;
      // Configure local session persistence
      if (firebaseAuth.setPersistence && global.firebase.auth.Auth) {
        firebaseAuth.setPersistence(global.firebase.auth.Auth.Persistence.LOCAL).catch((err) => {
          console.warn("MeroX Auth: Persistence setup warning:", err);
        });
      }
    }
  } catch (err) {
    console.warn("MeroX Auth: Firebase initialization warning, using session fallback:", err);
  }

  function getLocalUser() {
    try {
      const data = localStorage.getItem(LOCAL_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function setLocalUser(user) {
    try {
      if (user) {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
        localStorage.removeItem(GUEST_KEY);
      } else {
        localStorage.removeItem(LOCAL_USER_KEY);
      }
    } catch (e) {
      console.warn("LocalStorage access restricted:", e);
    }
  }

  function notifyListeners(user) {
    authListeners.forEach((fn) => {
      try {
        fn(user);
      } catch (e) {
        console.error("Auth listener error:", e);
      }
    });
  }

  // Translate Firebase error codes and raw JSON to friendly explanations
  function formatAuthError(err) {
    if (!err) return "An unexpected error occurred. Please try again.";

    let raw = typeof err === "string" ? err : (err.message || "");
    const code = (err.code || "").toLowerCase();

    // Check if raw error message is JSON string
    if (typeof raw === "string" && (raw.includes("{") || raw.includes("INVALID_LOGIN_CREDENTIALS"))) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.error && parsed.error.message) {
          raw = parsed.error.message;
        }
      } catch (e) {
        if (raw.includes("INVALID_LOGIN_CREDENTIALS")) {
          raw = "INVALID_LOGIN_CREDENTIALS";
        }
      }
    }

    const rawUpper = typeof raw === "string" ? raw.toUpperCase() : "";

    // 1. Invalid credentials / wrong password / user not found
    if (
      rawUpper.includes("INVALID_LOGIN_CREDENTIALS") ||
      rawUpper.includes("INVALID-CREDENTIAL") ||
      rawUpper.includes("INVALID_PASSWORD") ||
      code.includes("invalid-credential") ||
      code.includes("invalid-login-credentials")
    ) {
      return "Email or password is incorrect. Please check your details and try again.";
    }

    if (rawUpper.includes("USER_NOT_FOUND") || code.includes("user-not-found")) {
      return "No account found with this email. Please check your details or sign up.";
    }

    if (rawUpper.includes("WRONG_PASSWORD") || code.includes("wrong-password")) {
      return "Incorrect password. Please try again or use 'Forgot Password'.";
    }

    // 2. Email exists / in use
    if (
      rawUpper.includes("EMAIL_EXISTS") ||
      rawUpper.includes("EMAIL_ALREADY_IN_USE") ||
      code.includes("email-already-in-use")
    ) {
      return "An account with this email already exists. Please log in instead.";
    }

    // 3. Password strength
    if (rawUpper.includes("WEAK_PASSWORD") || code.includes("weak-password")) {
      return "Please choose a stronger password (minimum 6 characters).";
    }

    // 4. Invalid email format
    if (rawUpper.includes("INVALID_EMAIL") || code.includes("invalid-email")) {
      return "The email address is improperly formatted.";
    }

    // 5. Account lock / rate limits
    if (rawUpper.includes("TOO_MANY_ATTEMPTS") || code.includes("too-many-requests")) {
      return "Access temporarily locked due to multiple failed attempts. Please try again later or reset password.";
    }

    // 6. Network issue
    if (rawUpper.includes("NETWORK_ERROR") || code.includes("network-request-failed")) {
      return "Network connection problem. Please check your internet connection and try again.";
    }

    // 7. Account disabled
    if (rawUpper.includes("USER_DISABLED") || code.includes("user-disabled")) {
      return "This account has been disabled. Please contact support.";
    }

    // Clean up any Firebase prefixes
    const cleanMsg = (typeof raw === "string" ? raw : "")
      .replace(/^Firebase:\s*/i, "")
      .replace(/\(auth\/[a-z0-9-]+\)\.?/gi, "")
      .trim();

    return cleanMsg || "Something went wrong. Please check your details and try again.";
  }

  // Setup Firebase Auth State Change Listener
  if (firebaseAuth) {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        const userInfo = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split("@")[0],
          isAnonymous: user.isAnonymous,
          emailVerified: user.emailVerified
        };
        setLocalUser(userInfo);
        notifyListeners(userInfo);
      } else {
        const local = getLocalUser();
        if (!local) {
          notifyListeners(null);
        }
      }
    });
  }

  const MeroXAuth = {
    isAvailable: () => authInitialized && firebaseAuth !== null,

    getUser: () => {
      if (firebaseAuth && firebaseAuth.currentUser) {
        const u = firebaseAuth.currentUser;
        return {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName || u.email.split("@")[0],
          emailVerified: u.emailVerified
        };
      }
      return getLocalUser();
    },

    isGuest: () => {
      try {
        return localStorage.getItem(GUEST_KEY) === "true";
      } catch (e) {
        return false;
      }
    },

    continueAsGuest: () => {
      try {
        localStorage.setItem(GUEST_KEY, "true");
        localStorage.removeItem(LOCAL_USER_KEY);
      } catch (e) {}
      const guestObj = { isGuest: true, displayName: "Guest Explorer" };
      notifyListeners(guestObj);
      return Promise.resolve(guestObj);
    },

    login: async (email, password) => {
      if (firebaseAuth) {
        try {
          const res = await firebaseAuth.signInWithEmailAndPassword(email, password);
          const user = {
            uid: res.user.uid,
            email: res.user.email,
            displayName: res.user.displayName || res.user.email.split("@")[0],
            emailVerified: res.user.emailVerified
          };
          setLocalUser(user);
          notifyListeners(user);
          return user;
        } catch (err) {
          throw new Error(formatAuthError(err));
        }
      }

      // Offline / Local mock session fallback
      const fallbackUser = {
        uid: "local_" + Date.now(),
        email: email,
        displayName: email.split("@")[0]
      };
      setLocalUser(fallbackUser);
      notifyListeners(fallbackUser);
      return fallbackUser;
    },

    signup: async (email, password, displayName = "") => {
      if (firebaseAuth) {
        try {
          const res = await firebaseAuth.createUserWithEmailAndPassword(email, password);
          if (displayName && res.user.updateProfile) {
            await res.user.updateProfile({ displayName: displayName.trim() });
          }
          const user = {
            uid: res.user.uid,
            email: res.user.email,
            displayName: displayName.trim() || res.user.email.split("@")[0],
            emailVerified: res.user.emailVerified
          };
          setLocalUser(user);
          notifyListeners(user);
          return user;
        } catch (err) {
          throw new Error(formatAuthError(err));
        }
      }

      const fallbackUser = {
        uid: "local_" + Date.now(),
        email: email,
        displayName: displayName.trim() || email.split("@")[0]
      };
      setLocalUser(fallbackUser);
      notifyListeners(fallbackUser);
      return fallbackUser;
    },

    resetPassword: async (email) => {
      if (!email || !email.includes("@")) {
        throw new Error("Please enter a valid email address to receive password reset instructions.");
      }
      if (firebaseAuth && firebaseAuth.sendPasswordResetEmail) {
        try {
          await firebaseAuth.sendPasswordResetEmail(email);
          return { success: true, message: `Password reset email sent to ${email}. Please check your inbox and spam folder.` };
        } catch (err) {
          throw new Error(formatAuthError(err));
        }
      }
      return { success: true, message: `Password reset email simulated for ${email}.` };
    },

    updateUserProfile: async (profileData = {}) => {
      const current = MeroXAuth.getUser();
      if (!current) throw new Error("No active session to update.");

      const updatedName = profileData.displayName ? profileData.displayName.trim() : current.displayName;

      if (firebaseAuth && firebaseAuth.currentUser && profileData.displayName) {
        try {
          await firebaseAuth.currentUser.updateProfile({ displayName: updatedName });
        } catch (err) {
          console.warn("Firebase profile update notice:", err);
        }
      }

      const updatedUser = {
        ...current,
        displayName: updatedName
      };
      setLocalUser(updatedUser);

      // Save optional preferences
      if (profileData.preferences) {
        MeroXAuth.setUserPreferences(profileData.preferences);
      }

      notifyListeners(updatedUser);
      return updatedUser;
    },

    getUserPreferences: () => {
      try {
        const raw = localStorage.getItem(PREFERENCES_KEY);
        return raw ? JSON.parse(raw) : {
          favoriteCategory: "all",
          skinProfile: "combination",
          fitnessGoal: "strength"
        };
      } catch (e) {
        return { favoriteCategory: "all", skinProfile: "combination", fitnessGoal: "strength" };
      }
    },

    setUserPreferences: (prefs) => {
      try {
        const current = MeroXAuth.getUserPreferences();
        const merged = { ...current, ...prefs };
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(merged));
        return merged;
      } catch (e) {
        return prefs;
      }
    },

    logout: async () => {
      setLocalUser(null);
      try {
        localStorage.removeItem(GUEST_KEY);
        localStorage.removeItem("merox_user_role");
      } catch (e) {}

      if (firebaseAuth) {
        try {
          await firebaseAuth.signOut();
        } catch (err) {
          console.warn("Sign out notice:", err);
        }
      }
      notifyListeners(null);
      return Promise.resolve();
    },

    onAuthChange: (callback) => {
      if (typeof callback === "function") {
        authListeners.push(callback);
        const current = MeroXAuth.getUser();
        if (current) {
          callback(current);
        } else if (MeroXAuth.isGuest()) {
          callback({ isGuest: true, displayName: "Guest Explorer" });
        } else {
          callback(null);
        }
      }
    },

    // Role-based Access Control (Phase 11)
    ROLES: {
      CUSTOMER: "CUSTOMER",
      STORE_ADMIN: "STORE_ADMIN",
      SUPER_ADMIN: "SUPER_ADMIN"
    },

    getRole: () => {
      try {
        const storedRole = localStorage.getItem("merox_user_role");
        if (storedRole) return storedRole;
        const user = MeroXAuth.getUser();
        if (user) {
          if (user.role) return user.role;
          const email = (user.email || "").toLowerCase();
          if (email === "admin@merox.store" || email === "storeadmin@merox.ai") return "STORE_ADMIN";
          if (email === "admin@merox.com" || email === "superadmin@merox.ai") return "SUPER_ADMIN";
        }
        return "CUSTOMER";
      } catch (e) {
        return "CUSTOMER";
      }
    },

    hasRole: (requiredRole) => {
      const hierarchy = {
        CUSTOMER: 1,
        STORE_ADMIN: 2,
        SUPER_ADMIN: 3
      };
      const currentRole = MeroXAuth.getRole();
      const currentLevel = hierarchy[currentRole] || 1;
      const requiredLevel = hierarchy[requiredRole] || 1;
      return currentLevel >= requiredLevel;
    },

    setRole: (role) => {
      try {
        const validRoles = ["CUSTOMER", "STORE_ADMIN", "SUPER_ADMIN"];
        const sanitized = validRoles.includes(role) ? role : "CUSTOMER";
        localStorage.setItem("merox_user_role", sanitized);
        const user = getLocalUser();
        if (user) {
          user.role = sanitized;
          setLocalUser(user);
        }
        notifyListeners(MeroXAuth.getUser());
        return sanitized;
      } catch (e) {
        return "CUSTOMER";
      }
    },

    isAdmin: () => {
      return MeroXAuth.hasRole("STORE_ADMIN");
    },

    loginAsDemoAdmin: (role = "STORE_ADMIN", storeId = "STORE-MUM-01") => {
      const demoAdmin = {
        uid: "demo_admin_" + Date.now(),
        email: "storeadmin@merox.ai",
        displayName: role === "SUPER_ADMIN" ? "Platform Super Admin" : "Store Admin (Mumbai)",
        role: role,
        storeId: storeId,
        storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall"
      };
      setLocalUser(demoAdmin);
      try {
        localStorage.setItem("merox_user_role", role);
      } catch (e) {}
      notifyListeners(demoAdmin);
      return demoAdmin;
    },

    logoutAdmin: async () => {
      try {
        localStorage.removeItem("merox_user_role");
      } catch (e) {}
      return MeroXAuth.logout();
    },

    formatAuthError: formatAuthError
  };

  global.MeroXAuth = MeroXAuth;
  if (firebaseAuth) {
    global.auth = firebaseAuth;
  }
})(typeof window !== "undefined" ? window : globalThis);
