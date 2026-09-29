/**
 * MeroX Dashboard Main Controller (Phase 3 Production Edition)
 * Orchestrates navigation, account state, roX-AI assistant drawer with layered intelligence,
 * Your Store with Wishlist state, interactive feature modals (Skincare, Fitness, Yoga,
 * Hairstyle Face Analyzer, Best Cloth, Dynamic Professional Outfits, Virtual Try-On),
 * and Smart Mirror HUD with live WebRTC camera cleanup.
 *
 * Strictly preserves Kishan Kumar Singh's locked desktop visual baseline and enforces WCAG accessibility.
 */

(function () {
  "use strict";

  let clockInterval = null;
  let yogaTimerInterval = null;
  let yogaCurrentPoseIdx = 0;
  let yogaTimeRemaining = 45;
  let yogaIsRunning = false;

  // ================= 1. SEARCH REDIRECT =================
  window.goToSearch = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById("searchInput");
    if (!input) return;
    const q = input.value.trim();
    if (!q) {
      window.location.href = "search.html?q=all";
      return;
    }
    window.location.href = `search.html?q=${encodeURIComponent(q)}`;
  };

  // ================= 2. AUTHENTICATION & ACCOUNT POPOVER =================
  function initAuthUi() {
    // Route & Session Check: if unauthenticated and not in guest mode, initialize guest explorer
    if (window.MeroXAuth) {
      const existingUser = window.MeroXAuth.getUser();
      if (!existingUser && !window.MeroXAuth.isGuest()) {
        window.MeroXAuth.continueAsGuest();
      }
    }

    const authBtn = document.getElementById("authBtn");
    const authText = document.getElementById("authText");
    const accountPopover = document.getElementById("accountPopover");
    const popoverAvatar = document.getElementById("popoverAvatar");
    const popoverUserName = document.getElementById("popoverUserName");
    const popoverUserEmail = document.getElementById("popoverUserEmail");
    const popoverLogoutBtn = document.getElementById("popoverLogoutBtn");
    const popoverLogoutText = document.getElementById("popoverLogoutText");

    function updateUi(user) {
      if (!user || user.isGuest) {
        if (authText) authText.textContent = "Hello Sign In";
        if (popoverUserName) popoverUserName.textContent = "Guest Explorer";
        if (popoverUserEmail) popoverUserEmail.textContent = "Sign in to save favorites & measurements";
        if (popoverAvatar) popoverAvatar.textContent = "👤";
        if (popoverLogoutText) popoverLogoutText.textContent = "Sign In / Register";
        if (authBtn) authBtn.setAttribute("aria-expanded", "false");
      } else {
        const name = user.displayName || user.email.split("@")[0];
        if (authText) authText.textContent = `Hi, ${name}`;
        if (popoverUserName) popoverUserName.textContent = name;
        if (popoverUserEmail) popoverUserEmail.textContent = user.email;
        if (popoverAvatar) popoverAvatar.textContent = name.charAt(0).toUpperCase();
        if (popoverLogoutText) popoverLogoutText.textContent = "Sign Out";
      }

      // Synchronize Membership Plan Badge
      const plan = window.MeroXSubscription ? window.MeroXSubscription.getCurrentPlan() : null;
      const badgeEl = document.getElementById("popoverPlanBadge");
      if (badgeEl && plan) {
        badgeEl.textContent = `${plan.name}`;
      }
    }

    if (window.MeroXAuth) {
      window.MeroXAuth.onAuthChange((user) => {
        updateUi(user);
      });
    }

    if (authBtn) {
      authBtn.onclick = (e) => {
        e.stopPropagation();
        const user = window.MeroXAuth ? window.MeroXAuth.getUser() : null;
        if (!user || user.isGuest) {
          window.location.href = "index.html";
        } else {
          if (accountPopover) {
            const isHidden = accountPopover.classList.toggle("hidden");
            authBtn.setAttribute("aria-expanded", String(!isHidden));
          }
        }
      };
    }

    if (popoverLogoutBtn) {
      popoverLogoutBtn.onclick = () => {
        if (window.MeroXAuth) {
          window.MeroXAuth.logout().then(() => {
            window.location.href = "index.html";
          });
        } else {
          window.location.href = "index.html";
        }
      };
    }

    document.addEventListener("click", (e) => {
      if (accountPopover && !accountPopover.contains(e.target) && e.target !== authBtn && !authBtn.contains(e.target)) {
        accountPopover.classList.add("hidden");
        if (authBtn) authBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ================= 3. roX-AI SLIDE-OVER ASSISTANT =================
  function initRoxAi() {
    const roxAiBtn = document.getElementById("roxAiBtn");
    const roxAiDrawer = document.getElementById("roxAiDrawer");
    const closeRoxAiBtn = document.getElementById("closeRoxAiBtn");
    const clearRoxBtn = document.getElementById("clearRoxBtn");
    const roxSettingsToggle = document.getElementById("roxSettingsToggle");
    const roxSettingsBox = document.getElementById("roxSettingsBox");
    const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");
    const removeApiKeyBtn = document.getElementById("removeApiKeyBtn");
    const geminiApiKeyInput = document.getElementById("geminiApiKeyInput");
    const keyStatusText = document.getElementById("keyStatusText");
    const roxSendBtn = document.getElementById("roxSendBtn");
    const roxUserInput = document.getElementById("roxUserInput");
    const roxMessages = document.getElementById("roxMessages");

    function updateKeyStatus() {
      const stored = localStorage.getItem("merox_user_gemini_key");
      if (keyStatusText) {
        if (stored) {
          keyStatusText.textContent = "Status: Key Active (Generative AI Mode enabled)";
          keyStatusText.style.color = "#00ffe0";
          if (geminiApiKeyInput) geminiApiKeyInput.value = stored;
        } else {
          keyStatusText.textContent = "Status: Using Built-in Offline Expert Engine";
          keyStatusText.style.color = "#94a3b8";
          if (geminiApiKeyInput) geminiApiKeyInput.value = "";
        }
      }
    }
    updateKeyStatus();

    function openDrawer() {
      if (!roxAiDrawer) return;
      roxAiDrawer.classList.add("open");
      if (roxAiBtn) roxAiBtn.setAttribute("aria-expanded", "true");
      if (roxUserInput) setTimeout(() => roxUserInput.focus(), 250);
    }

    function closeDrawer() {
      if (!roxAiDrawer) return;
      roxAiDrawer.classList.remove("open");
      if (roxAiBtn) roxAiBtn.setAttribute("aria-expanded", "false");
      if (roxAiBtn) roxAiBtn.focus();
    }

    if (roxAiBtn) {
      roxAiBtn.addEventListener("click", () => {
        if (roxAiDrawer.classList.contains("open")) closeDrawer();
        else openDrawer();
      });
    }

    if (closeRoxAiBtn) closeRoxAiBtn.addEventListener("click", closeDrawer);

    if (clearRoxBtn) {
      clearRoxBtn.addEventListener("click", () => {
        if (!roxMessages) return;
        roxMessages.innerHTML = `
          <div class="msg bot">
            <div class="source-badge offline">🤖 roX-AI Offline Assistant (Domain Expert Engine)</div>
            Hi 👋 I am <strong>roX-AI</strong>, your MeroX Personal Stylist and Mirror Companion.<br><br>
            Ask me about interview outfits, denim matching, face shape haircuts, skincare protocols, or beginner fitness routines!
          </div>
        `;
      });
    }

    if (roxSettingsToggle && roxSettingsBox) {
      roxSettingsToggle.addEventListener("click", () => {
        roxSettingsBox.classList.toggle("hidden");
      });
    }

    if (saveApiKeyBtn && geminiApiKeyInput) {
      saveApiKeyBtn.addEventListener("click", () => {
        const val = geminiApiKeyInput.value.trim();
        if (val) {
          localStorage.setItem("merox_user_gemini_key", val);
          updateKeyStatus();
          alert("Gemini API key saved to your local browser storage.");
        }
      });
    }

    if (removeApiKeyBtn) {
      removeApiKeyBtn.addEventListener("click", () => {
        localStorage.removeItem("merox_user_gemini_key");
        updateKeyStatus();
        alert("Gemini API key removed. roX-AI will use the built-in offline expert engine.");
      });
    }

    async function handleRoxSend() {
      if (!roxUserInput || !roxMessages) return;
      const text = roxUserInput.value.trim();
      if (!text) return;

      const userMsg = document.createElement("div");
      userMsg.className = "msg user";
      userMsg.textContent = text;
      roxMessages.appendChild(userMsg);
      roxUserInput.value = "";
      roxMessages.scrollTop = roxMessages.scrollHeight;

      const loadingMsg = document.createElement("div");
      loadingMsg.className = "msg bot";
      loadingMsg.innerHTML = "Thinking...";
      roxMessages.appendChild(loadingMsg);
      roxMessages.scrollTop = roxMessages.scrollHeight;

      let replyData = null;
      const userPrefs = window.MeroXAuth ? window.MeroXAuth.getUserPreferences() : {};
      const retailContext = {
        userPreferences: userPrefs,
        currentProduct: window.customerSession ? window.customerSession.currentProduct : null,
        currentLook: window.customerSession ? window.customerSession.activeLook : [],
        storeId: window.customerSession ? window.customerSession.storeId : "STORE-MUM-01"
      };
      if (window.MeroXRoxAI) {
        replyData = await window.MeroXRoxAI.sendMessage(text, retailContext);
      } else {
        replyData = {
          text: "I am ready to help with style and mirror advice! Try asking for interview outfit tips.",
          source: "offline-expert"
        };
      }

      // Execute retail actions emitted by roX-AI (Phase 10)
      if (replyData && replyData.action) {
        if (replyData.action === "ADD_TO_LOOK" && replyData.productId && typeof window.addToCustomerLook === "function") {
          window.addToCustomerLook(replyData.productId);
        } else if (replyData.action === "CLEAR_LOOK" && typeof window.clearCustomerLook === "function") {
          window.clearCustomerLook();
        } else if (replyData.action === "TRY_ON_PRODUCT" && replyData.productId && typeof window.launchTryonWithItem === "function") {
          const p = window.MeroXCatalog ? window.MeroXCatalog.getById(replyData.productId) : null;
          if (p) window.launchTryonWithItem(p.category, p.image, p.id);
        } else if (replyData.action === "VIEW_IN_3D" && replyData.productId && typeof window.openRoxVisionModal === "function") {
          window.openRoxVisionModal(replyData.productId);
        } else if (replyData.action === "OPEN_PRODUCT_PROTOTYPE" && typeof window.openProductPrototypeModal === "function") {
          window.openProductPrototypeModal();
        }
      }

      loadingMsg.remove();

      const botMsg = document.createElement("div");
      botMsg.className = "msg bot";

      const badge = document.createElement("div");
      badge.className = `source-badge ${replyData.source === "gemini-model" ? "gemini" : "offline"}`;
      badge.textContent = replyData.source === "gemini-model" ? "✨ Gemini 1.5 Flash Model" : "🤖 roX-AI Offline Assistant";
      botMsg.appendChild(badge);

      const content = document.createElement("div");
      const safeHtml = (replyData.text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");
      content.innerHTML = safeHtml;
      botMsg.appendChild(content);

      if (replyData.products && replyData.products.length > 0) {
        const prodWrap = document.createElement("div");
        prodWrap.style.marginTop = "12px";
        prodWrap.style.display = "flex";
        prodWrap.style.gap = "8px";
        prodWrap.style.overflowX = "auto";
        prodWrap.style.paddingBottom = "6px";

        replyData.products.slice(0, 3).forEach((p) => {
          const card = document.createElement("div");
          card.style.background = "#1e293b";
          card.style.padding = "8px";
          card.style.borderRadius = "8px";
          card.style.minWidth = "120px";
          card.style.cursor = "pointer";
          card.innerHTML = `
            <img src="${p.image}" style="width: 100%; height: 75px; object-fit: cover; border-radius: 6px;">
            <div style="font-size: 11px; font-weight: 600; color: #fff; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.name}</div>
            <div style="font-size: 11px; color: #00ffe0; font-weight: 700;">₹${p.price}</div>
          `;
          card.onclick = () => window.openProductDetail(p.id);
          prodWrap.appendChild(card);
        });
        botMsg.appendChild(prodWrap);
      }

      roxMessages.appendChild(botMsg);
      roxMessages.scrollTop = roxMessages.scrollHeight;
    }

    if (roxSendBtn) roxSendBtn.addEventListener("click", handleRoxSend);
    if (roxUserInput) {
      roxUserInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleRoxSend();
        }
      });
    }

    window.sendRoxPrompt = function (promptText) {
      openDrawer();
      if (roxUserInput) {
        roxUserInput.value = promptText;
        handleRoxSend();
      }
    };
  }

  // ================= 4. UNIVERSAL FEATURE MODAL ROUTER =================
  window.openFeatureModal = function (featureKey) {
    const modal = document.getElementById("featureModal");
    const titleEl = document.getElementById("modalTitle");
    const bodyEl = document.getElementById("modalBody");
    if (!modal || !titleEl || !bodyEl) return;

    // Stop any existing camera streams before switching features
    if (window.MeroXCamera) {
      window.MeroXCamera.stopCamera();
    }
    if (yogaTimerInterval) {
      clearInterval(yogaTimerInterval);
      yogaTimerInterval = null;
      yogaIsRunning = false;
    }

    modal.classList.remove("hidden");

    switch (featureKey) {
      case "skin":
        titleEl.textContent = "✨ Skin Care Guidance & Cosmetic Quiz";
        bodyEl.innerHTML = renderSkincareHtml();
        break;

      case "fitness":
        titleEl.textContent = "🏋️ Fitness Hub & Interactive BMI Calculator";
        bodyEl.innerHTML = renderFitnessHtml();
        break;

      case "yoga":
        titleEl.textContent = "🧘 Guided Yoga & Pose Alignment Studio";
        bodyEl.innerHTML = renderYogaHtml();
        break;

      case "hair":
        titleEl.textContent = "💇 Hairstyle & Geometric Face Shape Analyzer";
        bodyEl.innerHTML = renderHairstyleHtml();
        break;

      case "cloth":
        titleEl.textContent = "👕 Best Cloth & Silhouette Matcher";
        bodyEl.innerHTML = renderBestClothHtml();
        break;

      case "professional":
        titleEl.textContent = "👔 Fashion Recommendation Engine & Smart Outfits";
        bodyEl.innerHTML = renderProfessionalOutfitsHtml("interview", null);
        break;

      case "store":
        titleEl.textContent = "🛍️ MeroX Collection Store & Wishlist";
        bodyEl.innerHTML = renderStoreHtml("all");
        break;

      case "tryon":
        titleEl.textContent = "🕶️ Virtual Try-On Prototype (v1.0)";
        bodyEl.innerHTML = renderTryOnHtml();
        setTimeout(initTryOnStream, 150);
        break;

      case "profile":
        titleEl.textContent = "👤 My MeroX Profile & Preferences";
        bodyEl.innerHTML = renderProfileHtml();
        break;

      default:
        titleEl.textContent = "MeroX Feature";
        bodyEl.innerHTML = "<p>Feature module loading...</p>";
    }
  };

  window.closeFeatureModal = function () {
    const modal = document.getElementById("featureModal");
    if (modal) {
      modal.classList.add("hidden");
    }
    // Clean hardware cleanup: stop camera stream
    if (window.MeroXCamera) {
      window.MeroXCamera.stopCamera();
    }
    if (yogaTimerInterval) {
      clearInterval(yogaTimerInterval);
      yogaTimerInterval = null;
      yogaIsRunning = false;
    }
  };

  window.closeFeatureModalOnBackdrop = function (e) {
    if (e.target && e.target.id === "featureModal") {
      window.closeFeatureModal();
    }
  };

  // Close all overlays with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      window.closeFeatureModal();
      window.closeSmartMirrorHud();
      const roxAiDrawer = document.getElementById("roxAiDrawer");
      if (roxAiDrawer && roxAiDrawer.classList.contains("open")) {
        roxAiDrawer.classList.remove("open");
        const btn = document.getElementById("roxAiBtn");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
      const accountPopover = document.getElementById("accountPopover");
      if (accountPopover) accountPopover.classList.add("hidden");
    }
  });

  // Product Detail Quick View
  window.openProductDetail = function (id) {
    if (!window.MeroXCatalog) return;
    const p = window.MeroXCatalog.getById(id);
    if (!p) return;

    const modal = document.getElementById("featureModal");
    const titleEl = document.getElementById("modalTitle");
    const bodyEl = document.getElementById("modalBody");
    if (!modal || !titleEl || !bodyEl) return;

    modal.classList.remove("hidden");
    titleEl.textContent = p.name;

    const isSaved = window.MeroXWishlist ? window.MeroXWishlist.isSaved(p.id) : false;

    bodyEl.innerHTML = `
      <div style="display: flex; gap: 24px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 240px; max-width: 320px; background: #f8fafc; border-radius: 16px; overflow: hidden; padding: 12px; text-align: center;">
          <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 260px; object-fit: cover; border-radius: 12px;">
        </div>
        <div style="flex: 1; min-width: 260px; display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 13px; text-transform: uppercase; color: #777; font-weight: 600;">${p.brand} • ${p.category}</div>
            <button type="button" class="wishlist-btn ${isSaved ? "saved" : ""}" onclick="toggleWishlistAction(${p.id}, this)" title="Save to Wishlist" aria-label="Toggle Wishlist">
              ${isSaved ? "❤️" : "🤍"}
            </button>
          </div>
          <h2 style="font-size: 24px; color: #111;">${p.name}</h2>
          <div style="font-size: 26px; font-weight: 700; color: #00796b;">₹${p.price.toLocaleString("en-IN")}</div>
          <p style="color: #4a5568; line-height: 1.6;">${p.description}</p>
          <div><strong>Available Sizes:</strong> ${p.availableSizes.join(", ")}</div>
          <div><strong>Color:</strong> ${p.color}</div>
          <div style="display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap;">
            <button type="button" onclick="window.location.href='search.html?q=${encodeURIComponent(p.category)}'" style="background: #111; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 600; cursor: pointer;">
              View Category (${p.category})
            </button>
            ${(p.category === "goggles" || p.category === "cap") ? `
              <button type="button" onclick="launchTryonWithItem('${p.category}', '${p.image}', ${p.id})" style="background: #00ffe0; color: #000; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 600; cursor: pointer;">
                Try On Live 🕶️
              </button>
            ` : ""}
          </div>
        </div>
      </div>
    `;
  };

  window.launchTryonWithItem = function (category, image, id) {
    window.openFeatureModal("tryon");
    setTimeout(() => {
      if (window.MeroXCamera) {
        window.MeroXCamera.setAccessory(category, image, id);
      }
    }, 200);
  };

  // ================= 5. FEATURE MODAL RENDERERS =================

  // --- A. COSMETIC SKINCARE WITH QUESTIONNAIRE ---
  function renderSkincareHtml() {
    return `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #856404;">
          <strong>Disclaimer:</strong> General cosmetic skincare guidance only. This does not diagnose medical conditions or substitute for professional dermatological advice.
        </div>

        <p style="color: #555;">Answer 2 quick questions to generate your targeted AM & PM cosmetic regimen:</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
            <label style="font-weight: 600; font-size: 14px; color: #111; display: block; margin-bottom: 8px;">1. Midday Skin Sensation:</label>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
              <label><input type="radio" name="skinFeel" value="oily" checked onchange="runSkincareAnalysis()"> Oily / Shiny all over face</label>
              <label><input type="radio" name="skinFeel" value="dry" onchange="runSkincareAnalysis()"> Tight, flaky, or rough texture</label>
              <label><input type="radio" name="skinFeel" value="combination" onchange="runSkincareAnalysis()"> Shiny T-zone, normal cheeks</label>
              <label><input type="radio" name="skinFeel" value="sensitive" onchange="runSkincareAnalysis()"> Easily flushed, stinging, reactive</label>
            </div>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
            <label style="font-weight: 600; font-size: 14px; color: #111; display: block; margin-bottom: 8px;">2. Primary Cosmetic Priority:</label>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
              <label><input type="radio" name="skinFocus" value="pores" checked onchange="runSkincareAnalysis()"> Sebum balance & pore appearance</label>
              <label><input type="radio" name="skinFocus" value="moisture" onchange="runSkincareAnalysis()"> Deep hydration & moisture barrier</label>
              <label><input type="radio" name="skinFocus" value="soothing" onchange="runSkincareAnalysis()"> Redness relief & skin calming</label>
              <label><input type="radio" name="skinFocus" value="radiance" onchange="runSkincareAnalysis()"> Gentle texture smoothing</label>
            </div>
          </div>
        </div>

        <div id="skincareResultBox">
          ${renderSkincareResult('oily')}
        </div>
      </div>
    `;
  }

  function renderSkincareResult(skinType) {
    if (!window.MeroXModules) return "";
    const data = window.MeroXModules.Skincare.getRoutine(skinType);
    if (!data) return "";

    return `
      <div style="background: #f8fafc; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4 style="color: #0f172a; font-size: 18px; margin-bottom: 4px;">${data.title}</h4>
          <p style="color: #64748b; font-size: 13px;">${data.desc}</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
            <h5 style="color: #00796b; font-size: 14px; margin-bottom: 10px;">☀️ Morning Protocol</h5>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${data.am.map((item) => `
                <div>
                  <strong style="font-size: 13px; color: #111;">${item.step}:</strong>
                  <div style="font-size: 13px; color: #334155;">${item.product}</div>
                  <div style="font-size: 11px; color: #64748b;">${item.purpose}</div>
                </div>
              `).join("")}
            </div>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
            <h5 style="color: #1e3a8a; font-size: 14px; margin-bottom: 10px;">🌙 Evening Protocol</h5>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${data.pm.map((item) => `
                <div>
                  <strong style="font-size: 13px; color: #111;">${item.step}:</strong>
                  <div style="font-size: 13px; color: #334155;">${item.product}</div>
                  <div style="font-size: 11px; color: #64748b;">${item.purpose}</div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 20px; flex-wrap: wrap; font-size: 13px;">
          <div style="flex: 1; min-width: 220px;">
            <strong style="color: #10b981;">Ingredients to Seek:</strong>
            <p style="color: #475569; margin-top: 4px;">${data.ingredientsToSeek.join(", ")}</p>
          </div>
          <div style="flex: 1; min-width: 220px;">
            <strong style="color: #ef4444;">Ingredients to Avoid:</strong>
            <p style="color: #475569; margin-top: 4px;">${data.ingredientsToAvoid.join(", ")}</p>
          </div>
        </div>

        <div style="background: #e6fffa; border: 1px solid #b2f5ea; padding: 10px 14px; border-radius: 8px; font-size: 12px; color: #234e52;">
          💡 <strong>Daily Practice Tip:</strong> ${data.lifestyleTip}
        </div>
      </div>
    `;
  }

  window.runSkincareAnalysis = function () {
    const feel = document.querySelector('input[name="skinFeel"]:checked');
    const val = feel ? feel.value : "combination";
    const box = document.getElementById("skincareResultBox");
    if (box) box.innerHTML = renderSkincareResult(val);
  };

  // --- B. FITNESS & VALIDATED BMI CALCULATOR ---
  function renderFitnessHtml() {
    return `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="background: #e0f2fe; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 8px; font-size: 13px; color: #0369a1;">
          <strong>Educational Notice:</strong> General fitness and wellness education only. Always consult a physician before beginning an intensive workout program.
        </div>

        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 260px; background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0;">
            <h4 style="margin-bottom: 14px; color: #111;">📊 BMI Calculator</h4>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div>
                <label style="font-size: 13px; color: #666;" for="bmiHeight">Height in cm (50–260):</label>
                <input type="number" id="bmiHeight" value="175" min="50" max="260" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e0; margin-top: 4px;">
              </div>
              <div>
                <label style="font-size: 13px; color: #666;" for="bmiWeight">Weight in kg (20–350):</label>
                <input type="number" id="bmiWeight" value="70" min="20" max="350" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e0; margin-top: 4px;">
              </div>
              <button type="button" onclick="calculateBmiAction()" style="background: #111; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 6px;">
                Calculate BMI
              </button>
            </div>

            <div id="bmiResult" style="margin-top: 16px; background: white; padding: 14px; border-radius: 10px; border: 1px solid #e2e8f0;">
              <div style="font-size: 13px; color: #777;">BMI Score:</div>
              <div style="font-size: 28px; font-weight: 700; color: #2ecc71;" id="bmiVal">22.9</div>
              <div style="font-size: 14px; font-weight: 600; color: #111;" id="bmiCat">Optimal / Normal Range</div>
              <p style="font-size: 12px; color: #555; margin-top: 6px;" id="bmiAdv">
                Great baseline! Maintain regular cardiovascular activity (150 min/week) and resistance training.
              </p>
            </div>
          </div>

          <div style="flex: 1.3; min-width: 280px; display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; gap: 8px;">
              <button type="button" class="acc-btn active" onclick="switchWorkoutGoal('strength', this)">Strength (Push/Pull)</button>
              <button type="button" class="acc-btn" onclick="switchWorkoutGoal('endurance', this)">Endurance (Cardio)</button>
              <button type="button" class="acc-btn" onclick="switchWorkoutGoal('flexibility', this)">Flexibility (Mobility)</button>
            </div>

            <div id="workoutPlanContent" style="background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0;">
              ${renderWorkoutPlanHtml('strength')}
            </div>

            <!-- Posture check -->
            <div style="background: #f8fafc; padding: 16px; border-radius: 14px; border: 1px solid #e2e8f0;">
              <h5 style="color: #111; margin-bottom: 6px;">🧘 Smart Mirror Posture Check</h5>
              <p style="font-size: 12px; color: #555; line-height: 1.5;">
                Stand in front of your smart mirror: Align ears directly over shoulders, relax clavicles, engage core gently, and keep knees soft. Avoid forward head tilt.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderWorkoutPlanHtml(goal) {
    if (!window.MeroXModules) return "";
    const plan = window.MeroXModules.Fitness.getWorkoutPlan(goal);
    return `
      <h4 style="color: #0f172a; margin-bottom: 4px;">${plan.title}</h4>
      <div style="font-size: 12px; color: #64748b; margin-bottom: 12px;">Frequency: ${plan.frequency}</div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${plan.days.map((d) => `
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px;">
            <strong style="font-size: 13px; color: #111;">${d.day}</strong>
            <ul style="padding-left: 18px; margin-top: 4px; font-size: 12px; color: #334155;">
              ${d.exercises.map((ex) => `<li>${ex}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      </div>
    `;
  }

  window.calculateBmiAction = function () {
    const h = document.getElementById("bmiHeight");
    const w = document.getElementById("bmiWeight");
    if (!h || !w || !window.MeroXModules) return;

    const res = window.MeroXModules.Fitness.calculateBMI(w.value, h.value);
    const box = document.getElementById("bmiResult");
    if (res.error) {
      if (box) {
        box.innerHTML = `<div style="color: #e53e3e; font-size: 13px; font-weight: 600;">⚠️ ${res.message}</div>`;
      }
      return;
    }

    if (box) {
      box.innerHTML = `
        <div style="font-size: 13px; color: #777;">BMI Score:</div>
        <div style="font-size: 28px; font-weight: 700; color: ${res.color};">${res.bmi}</div>
        <div style="font-size: 14px; font-weight: 600; color: #111;">${res.category}</div>
        <div style="font-size: 12px; color: #00796b; margin-top: 2px;">Healthy Weight Range: ${res.idealWeightRange}</div>
        <p style="font-size: 12px; color: #555; margin-top: 6px;">${res.advice}</p>
      `;
    }
  };

  window.switchWorkoutGoal = function (goal, btn) {
    document.querySelectorAll(".acc-btn").forEach((b) => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    const container = document.getElementById("workoutPlanContent");
    if (container) container.innerHTML = renderWorkoutPlanHtml(goal);
  };

  // --- C. YOGA & POSE ALIGNMENT STUDIO ---
  function renderYogaHtml() {
    if (!window.MeroXModules) return "";
    const poses = window.MeroXModules.Yoga.poses;
    yogaCurrentPoseIdx = 0;
    yogaTimeRemaining = poses[0].durationSec;

    return `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 10px 14px; border-radius: 8px; font-size: 13px; color: #15803d;">
          <strong>Notice:</strong> Guided mirror yoga timer prototype. Does not claim automated computer vision pose tracking.
        </div>

        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
          <!-- Pose Selector Sidebar -->
          <div style="flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 4px;">6-Step Guided Flow:</div>
            ${poses.map((p, idx) => `
              <button type="button" class="yoga-pose-pill ${idx === 0 ? "active" : ""}" id="yogaPoseBtn_${idx}" onclick="selectYogaPose(${idx})" style="text-align: left; padding: 10px 14px; border-radius: 10px; border: 1px solid #e2e8f0; background: ${idx === 0 ? "#111" : "#f8fafc"}; color: ${idx === 0 ? "white" : "#111"}; cursor: pointer; transition: all 0.2s;">
                <div style="font-weight: 600; font-size: 13px;">${idx + 1}. ${p.name}</div>
                <div style="font-size: 11px; color: ${idx === 0 ? "#00ffe0" : "#64748b"};">${p.sanskrit} • ${p.durationSec}s</div>
              </button>
            `).join("")}
          </div>

          <!-- Active Pose Display & Timer -->
          <div style="flex: 1.6; min-width: 280px; background: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; align-items: center; text-align: center;">
            <div style="font-size: 12px; text-transform: uppercase; color: #00796b; font-weight: 700; letter-spacing: 0.5px;" id="yogaPoseCategory">Beginner • Posture Alignment</div>
            <h3 id="yogaPoseName" style="color: #0f172a; font-size: 24px; margin: 4px 0 2px;">${poses[0].name}</h3>
            <div id="yogaPoseSanskrit" style="font-size: 14px; color: #64748b; font-style: italic; margin-bottom: 16px;">${poses[0].sanskrit}</div>

            <!-- Circular Timer -->
            <div style="width: 140px; height: 140px; border-radius: 50%; border: 6px solid #00ffe0; display: flex; align-items: center; justify-content: center; font-size: 38px; font-weight: 700; color: #111; margin-bottom: 20px; transition: border-color 0.3s;" id="yogaTimerCircle">
              ${yogaTimeRemaining}s
            </div>

            <!-- Controls -->
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
              <button type="button" id="yogaStartBtn" onclick="toggleYogaTimer()" style="background: #111; color: white; border: none; padding: 10px 24px; border-radius: 20px; font-weight: 600; cursor: pointer;">
                Start Timer
              </button>
              <button type="button" onclick="resetYogaTimer()" style="background: #e2e8f0; color: #111; border: none; padding: 10px 18px; border-radius: 20px; font-weight: 600; cursor: pointer;">
                Reset
              </button>
              <button type="button" onclick="nextYogaPose()" style="background: #00ffe0; color: #000; border: none; padding: 10px 18px; border-radius: 20px; font-weight: 600; cursor: pointer;">
                Next Pose ➔
              </button>
            </div>

            <!-- Alignment Instructions -->
            <div style="width: 100%; text-align: left; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px;">
              <strong style="font-size: 13px; color: #111;">Alignment Cues:</strong>
              <ul id="yogaInstructions" style="padding-left: 20px; margin: 6px 0 10px; font-size: 12px; color: #334155; line-height: 1.6;">
                ${poses[0].instructions.map((ins) => `<li>${ins}</li>`).join("")}
              </ul>
              <div id="yogaSafety" style="font-size: 12px; color: #dc2626;">
                ⚠️ <strong>Safety Note:</strong> ${poses[0].safety}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  window.selectYogaPose = function (idx) {
    if (!window.MeroXModules) return;
    const poses = window.MeroXModules.Yoga.poses;
    if (idx < 0 || idx >= poses.length) return;

    yogaCurrentPoseIdx = idx;
    yogaTimeRemaining = poses[idx].durationSec;
    clearInterval(yogaTimerInterval);
    yogaTimerInterval = null;
    yogaIsRunning = false;

    // Update active button state
    document.querySelectorAll(".yoga-pose-pill").forEach((btn, i) => {
      if (i === idx) {
        btn.style.background = "#111";
        btn.style.color = "white";
      } else {
        btn.style.background = "#f8fafc";
        btn.style.color = "#111";
      }
    });

    const p = poses[idx];
    const nameEl = document.getElementById("yogaPoseName");
    const sansEl = document.getElementById("yogaPoseSanskrit");
    const catEl = document.getElementById("yogaPoseCategory");
    const timerCircle = document.getElementById("yogaTimerCircle");
    const instEl = document.getElementById("yogaInstructions");
    const safetyEl = document.getElementById("yogaSafety");
    const startBtn = document.getElementById("yogaStartBtn");

    if (nameEl) nameEl.textContent = p.name;
    if (sansEl) sansEl.textContent = p.sanskrit;
    if (catEl) catEl.textContent = `${p.difficulty} • ${p.target}`;
    if (timerCircle) timerCircle.textContent = `${yogaTimeRemaining}s`;
    if (startBtn) startBtn.textContent = "Start Timer";
    if (instEl) instEl.innerHTML = p.instructions.map((ins) => `<li>${ins}</li>`).join("");
    if (safetyEl) safetyEl.innerHTML = `⚠️ <strong>Safety Note:</strong> ${p.safety}`;
  };

  window.toggleYogaTimer = function () {
    const startBtn = document.getElementById("yogaStartBtn");
    const timerCircle = document.getElementById("yogaTimerCircle");

    if (yogaIsRunning) {
      clearInterval(yogaTimerInterval);
      yogaTimerInterval = null;
      yogaIsRunning = false;
      if (startBtn) startBtn.textContent = "Resume Timer";
    } else {
      yogaIsRunning = true;
      if (startBtn) startBtn.textContent = "Pause Timer";

      yogaTimerInterval = setInterval(() => {
        yogaTimeRemaining--;
        if (timerCircle) timerCircle.textContent = `${yogaTimeRemaining}s`;

        if (yogaTimeRemaining <= 0) {
          clearInterval(yogaTimerInterval);
          yogaTimerInterval = null;
          yogaIsRunning = false;
          if (startBtn) startBtn.textContent = "Completed! Next ➔";
          if (timerCircle) {
            timerCircle.textContent = "✓ Done";
            timerCircle.style.borderColor = "#22c55e";
          }
        }
      }, 1000);
    }
  };

  window.resetYogaTimer = function () {
    clearInterval(yogaTimerInterval);
    yogaTimerInterval = null;
    yogaIsRunning = false;
    if (!window.MeroXModules) return;
    const poses = window.MeroXModules.Yoga.poses;
    yogaTimeRemaining = poses[yogaCurrentPoseIdx].durationSec;
    const timerCircle = document.getElementById("yogaTimerCircle");
    const startBtn = document.getElementById("yogaStartBtn");
    if (timerCircle) {
      timerCircle.textContent = `${yogaTimeRemaining}s`;
      timerCircle.style.borderColor = "#00ffe0";
    }
    if (startBtn) startBtn.textContent = "Start Timer";
  };

  window.nextYogaPose = function () {
    if (!window.MeroXModules) return;
    const poses = window.MeroXModules.Yoga.poses;
    const nextIdx = (yogaCurrentPoseIdx + 1) % poses.length;
    window.selectYogaPose(nextIdx);
  };

  // --- D. HAIRSTYLE & FACE SHAPE GEOMETRIC ANALYZER ---
  function renderHairstyleHtml() {
    return `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="background: #f1f5f9; border-left: 4px solid #64748b; padding: 10px 14px; border-radius: 8px; font-size: 13px; color: #334155;">
          <strong>Responsible AI Notice:</strong> Estimated face shape for visual styling only. Does not infer personality, intelligence, or medical attributes. Evaluates geometric proportions only.
        </div>

        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
          <!-- Left: Upload / Camera Snapshot -->
          <div style="flex: 1; min-width: 260px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 14px;">
            <h4 style="color: #111; font-size: 15px;">Analyze Your Face Shape</h4>
            <p style="font-size: 13px; color: #64748b;">
              Upload a front-facing portrait photo or capture a live mirror snapshot for automated geometric ratio analysis.
            </p>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              <input type="file" id="hairPhotoInput" accept="image/*" style="display: none;" onchange="handleHairPhotoUpload(this)">
              <button type="button" onclick="document.getElementById('hairPhotoInput').click()" style="background: #111; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                📁 Upload Portrait Photo
              </button>
              <button type="button" onclick="triggerTryonSnapshotForHair()" style="background: #00ffe0; color: #000; border: none; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                📸 Snap with Mirror Camera
              </button>
            </div>

            <div id="hairAnalysisStatus" style="font-size: 13px; color: #64748b; min-height: 20px;"></div>

            <div style="margin-top: 10px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
              <div style="font-size: 12px; color: #777; margin-bottom: 8px;">Or manually select your face shape:</div>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                <button type="button" class="acc-btn active" onclick="switchHairstyleDisplay('oval', this)">Oval</button>
                <button type="button" class="acc-btn" onclick="switchHairstyleDisplay('round', this)">Round</button>
                <button type="button" class="acc-btn" onclick="switchHairstyleDisplay('square', this)">Square</button>
                <button type="button" class="acc-btn" onclick="switchHairstyleDisplay('heart', this)">Heart</button>
                <button type="button" class="acc-btn" onclick="switchHairstyleDisplay('oblong', this)">Oblong</button>
              </div>
            </div>
          </div>

          <!-- Right: Hairstyle & Eyewear Recommendations -->
          <div style="flex: 1.4; min-width: 280px;" id="hairstyleContent">
            ${renderHairstyleDetails('oval')}
          </div>
        </div>
      </div>
    `;
  }

  function renderHairstyleDetails(shapeKey, analysisData = null) {
    if (!window.MeroXModules) return "";
    const data = window.MeroXModules.Hairstyle.getRecommendations(shapeKey);
    if (!data) return "";

    return `
      <div style="background: #f8fafc; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 14px;">
        <div>
          ${analysisData ? `<div style="display: inline-block; background: #00ffe0; color: #000; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; margin-bottom: 6px;">Ratio: ${analysisData.ratio} (Estimated from geometry)</div>` : ""}
          <h4 style="color: #0f172a; font-size: 20px; margin-bottom: 4px;">${data.title}</h4>
          <p style="color: #64748b; font-size: 13px;">${data.ratioDesc}</p>
        </div>

        <div>
          <strong style="color: #111; font-size: 14px;">Recommended Haircuts:</strong>
          <ul style="padding-left: 20px; margin: 6px 0 10px; color: #334155; font-size: 13px;">
            ${data.haircuts.map((h) => `<li>${h}</li>`).join("")}
          </ul>
        </div>

        <div>
          <strong style="color: #111; font-size: 14px;">Beard & Facial Hair:</strong>
          <p style="color: #475569; font-size: 13px; margin-top: 4px;">${data.beard}</p>
        </div>

        <!-- Matching Eyewear from Authoritative Catalog -->
        <div style="border-top: 1px solid #e2e8f0; padding-top: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="color: #111; font-size: 14px;">Matching Eyewear in Catalog:</strong>
            <button type="button" onclick="window.openFeatureModal('tryon')" style="background: none; border: none; color: #00796b; font-weight: 600; font-size: 12px; cursor: pointer;">
              Try On Live ➔
            </button>
          </div>
          <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
            ${data.recommendedEyewear.map((id) => {
              const p = window.MeroXCatalog ? window.MeroXCatalog.getById(id) : null;
              if (!p) return "";
              return `
                <div onclick="window.openProductDetail(${p.id})" style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px; min-width: 100px; text-align: center; cursor: pointer;">
                  <img src="${p.image}" style="width: 100%; height: 60px; object-fit: cover; border-radius: 6px;">
                  <div style="font-size: 11px; font-weight: 600; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.name}</div>
                  <div style="font-size: 11px; color: #00796b; font-weight: 700;">₹${p.price}</div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <div style="color: #dc2626; font-size: 12px; margin-top: 4px;">
          <strong>Styles to Avoid:</strong> ${data.avoid}
        </div>
      </div>
    `;
  }

  window.switchHairstyleDisplay = function (shape, btn) {
    document.querySelectorAll(".acc-btn").forEach((b) => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    const content = document.getElementById("hairstyleContent");
    if (content) content.innerHTML = renderHairstyleDetails(shape);
  };

  window.handleHairPhotoUpload = async function (input) {
    if (!input || !input.files || !input.files[0]) return;
    const file = input.files[0];
    const statusEl = document.getElementById("hairAnalysisStatus");

    if (!file.type.startsWith("image/")) {
      if (statusEl) statusEl.innerHTML = `<span style="color: #dc2626;">Please upload a valid image (JPG, PNG, WebP).</span>`;
      return;
    }

    if (statusEl) statusEl.innerHTML = `<span>Processing geometric face ratios...</span>`;

    const img = new Image();
    img.onload = async () => {
      if (window.MeroXModules) {
        const res = await window.MeroXModules.Hairstyle.estimateFaceShape(img);
        if (res.error) {
          if (statusEl) statusEl.innerHTML = `<span style="color: #dc2626;">⚠️ ${res.message}</span>`;
        } else {
          if (statusEl) statusEl.innerHTML = `<span style="color: #16a34a;">✓ Estimated: <strong>${res.estimatedShape.toUpperCase()}</strong></span>`;
          const content = document.getElementById("hairstyleContent");
          if (content) content.innerHTML = renderHairstyleDetails(res.estimatedShape, res);
        }
      }
    };
    img.src = URL.createObjectURL(file);
  };

  window.triggerTryonSnapshotForHair = function () {
    window.openFeatureModal("tryon");
  };

  // --- E. BEST CLOTH SILHOUETTE GUIDE ---
  function renderBestClothHtml() {
    return `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="color: #555;">Learn how collar cuts, necklines, and color palettes harmonize with facial geometry and physique.</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px;">
            <h4 style="color: #111; margin-bottom: 8px;">Curved / Soft Features</h4>
            <p style="font-size: 13px; color: #4a5568;"><strong>Necklines:</strong> Deep V-necks, sharp button-down collars, open lapel blazers.</p>
            <p style="font-size: 13px; color: #4a5568; margin-top: 6px;"><strong>Patterns:</strong> Vertical pin-stripes, monochrome dark palettes, slim vertical cuts.</p>
            <p style="font-size: 13px; color: #dc2626; margin-top: 6px;"><strong>Avoid:</strong> Chunky crew necks, wide horizontal block stripes.</p>
            <button type="button" onclick="window.location.href='search.html?q=shirt'" style="margin-top: 10px; background: #111; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
              Shop Collared Shirts ➔
            </button>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px;">
            <h4 style="color: #111; margin-bottom: 8px;">Angular / Chiseled</h4>
            <p style="font-size: 13px; color: #4a5568;"><strong>Necklines:</strong> Classic crew necks, shawl collars, spread collars.</p>
            <p style="font-size: 13px; color: #4a5568; margin-top: 6px;"><strong>Patterns:</strong> Subtle checks, textured knits, horizontal chest details.</p>
            <p style="font-size: 13px; color: #dc2626; margin-top: 6px;"><strong>Avoid:</strong> Overly deep plunging V-necks.</p>
            <button type="button" onclick="window.location.href='search.html?q=t-shirt'" style="margin-top: 10px; background: #111; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
              Shop Crewneck Tees ➔
            </button>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px;">
            <h4 style="color: #111; margin-bottom: 8px;">Athletic / Inverted Triangle</h4>
            <p style="font-size: 13px; color: #4a5568;"><strong>Necklines:</strong> Fitted crewneck tees, tailored slim shirts, structured jackets.</p>
            <p style="font-size: 13px; color: #4a5568; margin-top: 6px;"><strong>Patterns:</strong> Solid bold colors, athletic fit t-shirts, tapered denim.</p>
            <p style="font-size: 13px; color: #dc2626; margin-top: 6px;"><strong>Avoid:</strong> Baggy shapeless oversized sacks that hide posture.</p>
            <button type="button" onclick="window.location.href='search.html?q=jeans'" style="margin-top: 10px; background: #111; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
              Shop Tapered Denim ➔
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --- F. DYNAMIC FASHION RECOMMENDATIONS & OUTFITS (PHASE 6) ---
  let activeOutfitOccasion = "interview";
  let activeOutfitBudget = null;

  function renderProfessionalOutfitsHtml(occasion = null, maxBudget = undefined) {
    if (!window.MeroXModules || !window.MeroXModules.FashionRecommendationEngine) return "<p>Recommendation engine loading...</p>";
    if (occasion !== null) activeOutfitOccasion = occasion;
    if (maxBudget !== undefined) activeOutfitBudget = maxBudget;

    const engine = window.MeroXModules.FashionRecommendationEngine;
    const rec = engine.recommend({ occasion: activeOutfitOccasion, maxBudget: activeOutfitBudget });
    const occasions = engine.getAllOccasions();

    return `
      <div style="display: flex; flex-direction: column; gap: 18px;">
        <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 10px 14px; border-radius: 8px; font-size: 13px; color: #115e59;">
          <strong>Fashion Recommendation Engine:</strong> Personalized outfit combinations curated strictly from the authoritative 30-item MeroX catalog based on dress codes, color harmony, and budget filters.
        </div>

        <!-- Occasion Filter Tabs (8 Occasions) -->
        <div>
          <div style="font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 6px;">Select Dress Code / Occasion:</div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${occasions.map((occ) => `
              <button type="button" class="acc-btn ${occ.id === activeOutfitOccasion ? "active" : ""}" onclick="switchOutfitOccasion('${occ.id}', ${activeOutfitBudget})">
                ${occ.label}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Budget Quick Filters -->
        <div>
          <div style="font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 6px;">Budget Constraint:</div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button type="button" class="acc-btn ${activeOutfitBudget === null ? "active" : ""}" onclick="switchOutfitOccasion('${activeOutfitOccasion}', null)">All Budgets</button>
            <button type="button" class="acc-btn ${activeOutfitBudget === 2000 ? "active" : ""}" onclick="switchOutfitOccasion('${activeOutfitOccasion}', 2000)">Under ₹2,000</button>
            <button type="button" class="acc-btn ${activeOutfitBudget === 3500 ? "active" : ""}" onclick="switchOutfitOccasion('${activeOutfitOccasion}', 3500)">Under ₹3,500</button>
            <button type="button" class="acc-btn ${activeOutfitBudget === 5000 ? "active" : ""}" onclick="switchOutfitOccasion('${activeOutfitOccasion}', 5000)">Under ₹5,000</button>
          </div>
        </div>

        <!-- Selected Outfit Ensemble Card -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 4px;">
            <div>
              <span style="display: inline-block; background: #e0f2fe; color: #0284c7; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; margin-bottom: 4px;">
                Palette: ${rec.colorHarmony}
              </span>
              <h4 style="font-size: 20px; color: #111; margin: 0;">${rec.title}</h4>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 20px; font-weight: 700; color: #00796b;">Total: ${rec.totalPriceFormatted}</span>
              ${rec.withinBudget ? `
                <div style="font-size: 11px; color: #16a34a; font-weight: 600;">✓ Within Budget Target</div>
              ` : `
                <div style="font-size: 11px; color: #f59e0b; font-weight: 600;">⚠️ Foundation Combo</div>
              `}
            </div>
          </div>
          <p style="font-size: 13px; color: #64748b; margin: 8px 0 12px;">${rec.description}</p>

          <!-- Budget Status & Styling Rationale Box -->
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
            <div style="background: white; border-left: 3px solid #00ffe0; padding: 10px 14px; border-radius: 6px; font-size: 13px; color: #334155;">
              <strong>💡 Styling Rationale:</strong> ${rec.stylingRationale}
            </div>
            <div style="background: white; border-left: 3px solid #22c55e; padding: 8px 14px; border-radius: 6px; font-size: 12px; color: #15803d;">
              <strong>💵 Budget Guidance:</strong> ${rec.budgetNote}
            </div>
          </div>

          <!-- Product Pieces Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px;">
            ${rec.items.map((item) => `
              <div onclick="window.openProductDetail(${item.id})" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; text-align: center; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'">
                <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px;">
                <div style="font-size: 11px; text-transform: uppercase; color: #888; font-weight: 600; margin-top: 6px;">${item.category}</div>
                <div style="font-size: 12px; font-weight: 600; color: #111; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.name}</div>
                <div style="font-size: 12px; font-weight: 700; color: #00796b;">₹${item.price.toLocaleString("en-IN")}</div>
                ${(item.category === "goggles" || item.category === "cap") ? `
                  <button type="button" onclick="event.stopPropagation(); window.launchTryonWithItem('${item.category}', '${item.image}', ${item.id});" style="background: #00ffe0; color: #000; border: none; padding: 3px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; margin-top: 6px; cursor: pointer; width: 100%;">
                    Try On 🕶️
                  </button>
                ` : ""}
              </div>
            `).join("")}
          </div>

          <!-- Consult roX-AI CTA -->
          <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
            <button type="button" onclick="window.sendRoxPrompt('How should I style the ${rec.title} outfit?')" style="background: #111; color: white; border: none; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;">
              <span>🤖 Consult roX-AI on this Outfit</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  window.switchOutfitOccasion = function (occId, budget) {
    const bodyEl = document.getElementById("modalBody");
    if (bodyEl) bodyEl.innerHTML = renderProfessionalOutfitsHtml(occId, budget);
  };

  // --- G. STORE & WISHLIST VIEW ---
  function renderStoreHtml(filterCategory = "all") {
    if (!window.MeroXCatalog) return "<p>Catalog loading...</p>";
    const catalog = window.MeroXCatalog;
    let products = filterCategory === "all" ? catalog.getAll() : (filterCategory === "wishlist" ? (window.MeroXWishlist ? window.MeroXWishlist.getSavedProducts() : []) : catalog.getByCategory(filterCategory));

    const wishlistCount = window.MeroXWishlist ? window.MeroXWishlist.getCount() : 0;

    return `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <!-- Category Tabs -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="acc-btn ${filterCategory === "all" ? "active" : ""}" onclick="filterStoreCategory('all')">All (30)</button>
            <button type="button" class="acc-btn ${filterCategory === "shirt" ? "active" : ""}" onclick="filterStoreCategory('shirt')">Shirts</button>
            <button type="button" class="acc-btn ${filterCategory === "tshirt" ? "active" : ""}" onclick="filterStoreCategory('tshirt')">T-Shirts</button>
            <button type="button" class="acc-btn ${filterCategory === "jeans" ? "active" : ""}" onclick="filterStoreCategory('jeans')">Jeans</button>
            <button type="button" class="acc-btn ${filterCategory === "cap" ? "active" : ""}" onclick="filterStoreCategory('cap')">Caps</button>
            <button type="button" class="acc-btn ${filterCategory === "goggles" ? "active" : ""}" onclick="filterStoreCategory('goggles')">Goggles</button>
            <button type="button" class="acc-btn ${filterCategory === "shoe" ? "active" : ""}" onclick="filterStoreCategory('shoe')">Shoes</button>
            <button type="button" class="acc-btn ${filterCategory === "wishlist" ? "active" : ""}" onclick="filterStoreCategory('wishlist')">
              ❤️ Saved (<span id="storeWishlistCount">${wishlistCount}</span>)
            </button>
          </div>
        </div>

        <!-- Product Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; max-height: 480px; overflow-y: auto; padding: 4px;">
          ${products.length === 0 ? `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #888;">
              <h3>No items saved in your Wishlist yet.</h3>
              <p style="font-size: 13px; margin-top: 6px;">Tap the heart icon on any product to save it to your personal mirror wardrobe!</p>
            </div>
          ` : products.map((p) => {
            const isSaved = window.MeroXWishlist ? window.MeroXWishlist.isSaved(p.id) : false;
            return `
              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; text-align: center; position: relative;">
                <button type="button" class="wishlist-btn ${isSaved ? "saved" : ""}" onclick="toggleWishlistAction(${p.id}, this)" style="position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.85); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer;">
                  ${isSaved ? "❤️" : "🤍"}
                </button>
                <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 130px; object-fit: cover; border-radius: 8px; cursor: pointer;" onclick="window.openProductDetail(${p.id})">
                <div style="font-size: 11px; text-transform: uppercase; color: #888; font-weight: 600; margin-top: 6px;">${p.category}</div>
                <div style="font-size: 13px; font-weight: 600; color: #111; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 2px;">${p.name}</div>
                <div style="font-size: 13px; font-weight: 700; color: #00796b; margin-top: 2px;">₹${p.price.toLocaleString("en-IN")}</div>
                ${(p.category === "goggles" || p.category === "cap") ? `
                  <button type="button" onclick="launchTryonWithItem('${p.category}', '${p.image}', ${p.id})" style="background: #00ffe0; color: #000; border: none; width: 100%; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; margin-top: 8px; cursor: pointer;">
                    Try On Live 🕶️
                  </button>
                ` : ""}
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  window.filterStoreCategory = function (cat) {
    const bodyEl = document.getElementById("modalBody");
    if (bodyEl) bodyEl.innerHTML = renderStoreHtml(cat);
  };

  window.toggleWishlistAction = function (productId, btnEl) {
    if (!window.MeroXWishlist) return;
    const res = window.MeroXWishlist.toggle(productId);

    if (btnEl) {
      if (res.added) {
        btnEl.classList.add("saved");
        btnEl.textContent = "❤️";
      } else {
        btnEl.classList.remove("saved");
        btnEl.textContent = "🤍";
      }
    }

    const badge = document.getElementById("storeWishlistCount");
    if (badge) badge.textContent = res.count;
  };

  // --- H. VIRTUAL TRY-ON PROTOTYPE (PHASE 7) ---
  function renderTryOnHtml() {
    return `
      <div class="tryon-container">
        <div style="background: #e0f2fe; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 8px; font-size: 13px; color: #0369a1; width: 100%;">
          <strong>Virtual Try-On Prototype (v1.0):</strong> Real-time Canvas AR landmark alignment. Supports all 5 Goggles & 5 Caps from the canonical MeroX catalog with auto-tracking and precision manual calibration.
        </div>

        <div class="tryon-view">
          <video id="tryonVideo" autoplay muted playsinline style="display: none;"></video>
          <canvas id="tryonCanvas" width="640" height="480"></canvas>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 580px; font-size: 12px;">
          <div id="tryonStatusText" style="color: #64748b; font-weight: 500;">Starting camera stream...</div>
          <button type="button" onclick="switchTryonCameraDevice()" style="background: #e2e8f0; border: none; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
            🔄 Switch Camera
          </button>
        </div>

        <!-- Accessory Selectors from Catalog -->
        <div class="tryon-controls" style="max-width: 580px;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 12px; font-weight: 600; color: #475569;">Choose Item to Try On (AR Vector Overlay):</span>
              <span style="font-size: 11px; color: #64748b;">No camera images stored</span>
            </div>
            <div class="accessory-selector" style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('none', null, null, this)">🪞 None (Natural Mirror)</button>
              <button type="button" class="acc-btn active" onclick="switchTryonAccessory('goggles', 'images/goggles1.jpeg', 21, this)">🕶️ Aviator (₹699)</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('goggles', 'images/goggles2.jpeg', 22, this)">🕶️ Square (₹799)</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('goggles', 'images/goggles3.jpeg', 23, this)">🕶️ Round (₹749)</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('goggles', 'images/goggles4.jpeg', 24, this)">🕶️ Sports (₹899)</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('goggles', 'images/goggles5.jpeg', 25, this)">🕶️ Black Shade (₹649)</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('cap', 'images/cap1.jpeg', 16, this)">🧢 Black Cap (₹299)</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('cap', 'images/cap2.jpeg', 17, this)">🧢 Sports Cap (₹349)</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('cap', 'images/cap3.jpeg', 18, this)">🧢 White Cap (₹279)</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('cap', 'images/cap4.jpeg', 19, this)">🧢 Fashion Cap (₹399)</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('cap', 'images/cap5.jpeg', 20, this)">🧢 Classic Cap (₹319)</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('hairstyle', 'hair_quiff', null, this)">💇 Quiff Fade [Proto]</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('hairstyle', 'hair_pompadour', null, this)">💇 Pompadour [Proto]</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('hairstyle', 'hair_curtains', null, this)">💇 Curtains [Proto]</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('hairstyle', 'hair_curls', null, this)">💇 Curls [Proto]</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('hairstyle', 'hair_buzz', null, this)">💇 Buzz Cut [Proto]</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('apparel', 'apparel_shirt', 1, this)">👕 Oxford Shirt [Proto]</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('apparel', 'apparel_tshirt', 6, this)">👕 Crewneck Tee [Proto]</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('apparel', 'apparel_blazer', 11, this)">👕 Casual Blazer [Proto]</button>
              <button type="button" class="acc-btn" onclick="switchTryonAccessory('apparel', 'apparel_hoodie', 26, this)">👕 Tech Hoodie [Proto]</button>
            </div>
          </div>

          <!-- Calibration Controls -->
          <div style="background: #f8fafc; padding: 12px 16px; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; gap: 14px; flex-wrap: wrap; font-size: 12px;">
            <div style="flex: 1; min-width: 120px;">
              <label for="scaleSlider" style="display: flex; justify-content: space-between; font-weight: 600;">
                <span>Size / Scale:</span><span id="scaleLabel">1.0x</span>
              </label>
              <input type="range" id="scaleSlider" min="0.5" max="1.8" step="0.05" value="1.0" oninput="adjustTryonScale(this.value)" style="width: 100%;" aria-label="Accessory Size Scale">
            </div>
            <div style="flex: 1; min-width: 120px;">
              <label for="ySlider" style="display: flex; justify-content: space-between; font-weight: 600;">
                <span>Vertical Y:</span><span id="yLabel">0</span>
              </label>
              <input type="range" id="ySlider" min="-100" max="100" step="2" value="0" oninput="adjustTryonY(this.value)" style="width: 100%;" aria-label="Vertical Position Offset">
            </div>
            <div style="flex: 1; min-width: 120px;">
              <label for="xSlider" style="display: flex; justify-content: space-between; font-weight: 600;">
                <span>Horizontal X:</span><span id="xLabel">0</span>
              </label>
              <input type="range" id="xSlider" min="-100" max="100" step="2" value="0" oninput="adjustTryonX(this.value)" style="width: 100%;" aria-label="Horizontal Position Offset">
            </div>
            <div style="flex: 1; min-width: 120px;">
              <label for="rotSlider" style="display: flex; justify-content: space-between; font-weight: 600;">
                <span>Tilt / Rotation:</span><span id="rotLabel">0°</span>
              </label>
              <input type="range" id="rotSlider" min="-45" max="45" step="1" value="0" oninput="adjustTryonRotation(this.value)" style="width: 100%;" aria-label="Rotation Tilt Angle">
            </div>
            <div style="width: 100%; display: flex; justify-content: flex-end;">
              <button type="button" onclick="resetTryonCalibration()" style="background: none; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; color: #475569;">
                ↺ Reset Calibration
              </button>
            </div>
          </div>

          <div style="display: flex; gap: 10px; justify-content: center; margin-top: 4px;">
            <button type="button" onclick="captureTryonPhoto()" style="background: #111; color: white; border: none; padding: 9px 22px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer;">
              📸 Capture Snapshot
            </button>
            <button type="button" onclick="toggleTryonCameraActive(this)" style="background: #ef4444; color: white; border: none; padding: 9px 18px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer;">
              Stop Camera
            </button>
          </div>
        </div>

        <!-- Active Scanned Garment Fitting View & Variant Selector (Phase 9) -->
        <div id="tryonGarmentFittingSection" style="width: 100%; max-width: 580px; margin-top: 14px;">
          ${renderActiveFittingProductCard()}
        </div>

        <!-- Complete The Look AI Recommendations (Phase 9) -->
        <div class="complete-look-section" style="width: 100%; max-width: 580px;">
          <div style="font-size: 13px; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 6px;">
            <span>✨ Complete Your Look</span>
            <span style="font-size: 11px; color: #6366f1; font-weight: 500;">(Pairs from Store Catalog)</span>
          </div>
          <div class="complete-look-grid" id="completeLookGrid">
            ${renderFittingRecommendationsHtml()}
          </div>
        </div>

        <!-- My Current Look Drawer (Phase 9) -->
        <div id="currentLookDrawer" class="current-look-drawer" style="width: 100%; max-width: 580px;">
          <!-- Dynamically populated via renderCustomerLookUi() -->
        </div>

      </div>
    `;
  }

  function initTryOnStream() {
    const video = document.getElementById("tryonVideo");
    const canvas = document.getElementById("tryonCanvas");
    const statusEl = document.getElementById("tryonStatusText");

    if (window.MeroXCamera && video && canvas) {
      window.MeroXCamera.startCamera(video, (state, msg) => {
        if (statusEl) statusEl.textContent = msg;
      }).then((success) => {
        if (success) {
          window.MeroXCamera.startOverlayLoop(video, canvas);
        }
      });
    }
  }

  window.switchTryonAccessory = function (type, src, id, btn) {
    document.querySelectorAll(".accessory-selector .acc-btn").forEach((b) => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    if (window.MeroXCamera) {
      window.MeroXCamera.setAccessory(type, src, id);
    }
  };

  window.switchTryonCameraDevice = function () {
    const video = document.getElementById("tryonVideo");
    const statusEl = document.getElementById("tryonStatusText");
    if (window.MeroXCamera && video) {
      window.MeroXCamera.switchCamera(video, (state, msg) => {
        if (statusEl) statusEl.textContent = msg;
      });
    }
  };

  window.adjustTryonScale = function (val) {
    if (window.MeroXCamera) window.MeroXCamera.state.scale = parseFloat(val);
    const lbl = document.getElementById("scaleLabel");
    if (lbl) lbl.textContent = `${val}x`;
  };

  window.adjustTryonY = function (val) {
    if (window.MeroXCamera) window.MeroXCamera.state.offsetY = parseFloat(val);
    const lbl = document.getElementById("yLabel");
    if (lbl) lbl.textContent = val;
  };

  window.adjustTryonX = function (val) {
    if (window.MeroXCamera) window.MeroXCamera.state.offsetX = parseFloat(val);
    const lbl = document.getElementById("xLabel");
    if (lbl) lbl.textContent = val;
  };

  window.adjustTryonRotation = function (val) {
    if (window.MeroXCamera) window.MeroXCamera.state.rotation = parseFloat(val);
    const lbl = document.getElementById("rotLabel");
    if (lbl) lbl.textContent = `${val}°`;
  };

  window.resetTryonCalibration = function () {
    if (window.MeroXCamera) window.MeroXCamera.resetCalibration();
    const scaleInput = document.getElementById("scaleSlider");
    const yInput = document.getElementById("ySlider");
    const xInput = document.getElementById("xSlider");
    const rotInput = document.getElementById("rotSlider");
    const scaleLbl = document.getElementById("scaleLabel");
    const yLbl = document.getElementById("yLabel");
    const xLbl = document.getElementById("xLabel");
    const rotLbl = document.getElementById("rotLabel");

    if (scaleInput) scaleInput.value = "1.0";
    if (yInput) yInput.value = "0";
    if (xInput) xInput.value = "0";
    if (rotInput) rotInput.value = "0";
    if (scaleLbl) scaleLbl.textContent = "1.0x";
    if (yLbl) yLbl.textContent = "0";
    if (xLbl) xLbl.textContent = "0";
    if (rotLbl) rotLbl.textContent = "0°";
  };

  window.toggleTryonCameraActive = function (btn) {
    const video = document.getElementById("tryonVideo");
    const canvas = document.getElementById("tryonCanvas");
    const statusEl = document.getElementById("tryonStatusText");
    if (!window.MeroXCamera) return;

    if (window.MeroXCamera.state.isStreaming) {
      window.MeroXCamera.stopCamera(video);
      btn.textContent = "Start Camera";
      btn.style.background = "#16a34a";
      if (statusEl) statusEl.textContent = "Camera stream paused.";
    } else {
      btn.textContent = "Stop Camera";
      btn.style.background = "#ef4444";
      initTryOnStream();
    }
  };

  window.captureTryonPhoto = function () {
    const canvas = document.getElementById("tryonCanvas");
    if (!canvas || !window.MeroXCamera) return;

    const dataUrl = window.MeroXCamera.takeSnapshot(canvas);
    if (!dataUrl) return;

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `merox_tryon_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // --- I. USER PROFILE & PREFERENCES LAYER ---
  // --- I. USER PROFILE & PREFERENCES LAYER (PHASE 15 UPGRADE) ---
  let activeProfileTab = "profile";

  window.switchProfileTab = function(tabName) {
    activeProfileTab = tabName;
    const bodyEl = document.getElementById("modalBody");
    if (bodyEl) bodyEl.innerHTML = renderProfileHtml();
  };

  function renderProfileHtml() {
    const user = window.MeroXAuth ? window.MeroXAuth.getUser() : null;
    const isGuest = window.MeroXAuth ? window.MeroXAuth.isGuest() : false;
    const prefs = window.MeroXAuth ? window.MeroXAuth.getUserPreferences() : {};
    const plan = window.MeroXSubscription ? window.MeroXSubscription.getCurrentPlan() : { id: "FREE", name: "Free Plan", priceFormatted: "₹0", color: "#64748b" };

    const displayName = user ? user.displayName : "Guest Explorer";
    const email = user && !isGuest ? user.email : "Not linked (Browsing as Guest)";
    const statusText = user && !isGuest ? "Active Registered Member" : "Guest Explorer Session";
    const avatar = displayName ? displayName.charAt(0).toUpperCase() : "👤";
    const savedCount = window.MeroXWishlist ? window.MeroXWishlist.getCount() : 0;
    const savedProducts = window.MeroXWishlist ? window.MeroXWishlist.getSavedProducts() : [];

    return `
      <div style="display: flex; flex-direction: column; gap: 18px;">

        <!-- Top Navigation Tabs -->
        <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0;">
          <button type="button" class="acc-btn ${activeProfileTab === "profile" ? "active" : ""}" onclick="switchProfileTab('profile')">👤 Profile</button>
          <button type="button" class="acc-btn ${activeProfileTab === "style" ? "active" : ""}" onclick="switchProfileTab('style')">✨ Style Preferences</button>
          <button type="button" class="acc-btn ${activeProfileTab === "membership" ? "active" : ""}" onclick="switchProfileTab('membership')">👑 Membership (${plan.name})</button>
          <button type="button" class="acc-btn ${activeProfileTab === "looks" ? "active" : ""}" onclick="switchProfileTab('looks')">❤️ Saved Looks (${savedCount})</button>
          <button type="button" class="acc-btn ${activeProfileTab === "ai" ? "active" : ""}" onclick="switchProfileTab('ai')">🤖 AI Preferences</button>
          <button type="button" class="acc-btn ${activeProfileTab === "privacy" ? "active" : ""}" onclick="switchProfileTab('privacy')">🔒 Privacy & Mirror</button>
        </div>

        ${activeProfileTab === "profile" ? `
          <!-- 1. PROFILE SECTION -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; display: flex; gap: 18px; align-items: center; flex-wrap: wrap;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: #0b0f1a; color: #00ffe0; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 700; border: 2px solid #00ffe0;">
              ${avatar}
            </div>
            <div style="flex: 1; min-width: 200px;">
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <h3 style="color: #0f172a; font-size: 20px; margin: 0;">${displayName}</h3>
                <span style="background: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 12px;">${statusText}</span>
                <span style="background: rgba(0, 255, 224, 0.15); color: #00796b; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 12px; border: 1px solid rgba(0, 255, 224, 0.4);">${plan.name}</span>
              </div>
              <div style="font-size: 13px; color: #64748b; margin-top: 4px;">${email}</div>
            </div>
            ${isGuest ? `
              <button type="button" onclick="window.location.href='index.html'" style="background: #00ffe0; color: #000; border: none; padding: 8px 16px; border-radius: 20px; font-weight: 700; font-size: 13px; cursor: pointer;">
                Sign In / Register ➔
              </button>
            ` : `
              <button type="button" onclick="window.logoutFromProfile()" style="background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 13px; cursor: pointer;">
                Sign Out
              </button>
            `}
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 14px;">
            <h4 style="color: #111; font-size: 16px; margin: 0;">Account Identity</h4>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <label style="font-size: 13px; color: #64748b; font-weight: 600;" for="profileNameInput">Display Name:</label>
              <input type="text" id="profileNameInput" value="${displayName}" style="padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e0; font-size: 14px; background: white;" ${isGuest ? "disabled" : ""}>
            </div>
            <div style="display: flex; gap: 10px; align-items: center; margin-top: 4px;">
              <button type="button" onclick="saveProfileChanges()" style="background: #111; color: white; border: none; padding: 10px 22px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                Save Display Name
              </button>
              <span id="profileSaveStatus" style="font-size: 13px; font-weight: 600; color: #16a34a;"></span>
            </div>
          </div>
        ` : ""}

        ${activeProfileTab === "style" ? `
          <!-- 2. STYLE PREFERENCES SECTION -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 14px;">
            <h4 style="color: #111; font-size: 16px; margin: 0;">Personal Aesthetic & Wellness</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
              <div>
                <label style="font-size: 13px; color: #64748b; font-weight: 600;" for="prefCategory">Favorite Style Category:</label>
                <select id="prefCategory" style="width: 100%; padding: 9px; border-radius: 8px; border: 1px solid #cbd5e0; margin-top: 4px; background: white;">
                  <option value="all" ${prefs.favoriteCategory === "all" ? "selected" : ""}>All Categories (Versatile)</option>
                  <option value="shirt" ${prefs.favoriteCategory === "shirt" ? "selected" : ""}>Formal & Casual Shirts</option>
                  <option value="tshirt" ${prefs.favoriteCategory === "tshirt" ? "selected" : ""}>T-Shirts & Streetwear</option>
                  <option value="jeans" ${prefs.favoriteCategory === "jeans" ? "selected" : ""}>Jeans & Denim</option>
                  <option value="goggles" ${prefs.favoriteCategory === "goggles" ? "selected" : ""}>Goggles & Eyewear</option>
                  <option value="shoe" ${prefs.favoriteCategory === "shoe" ? "selected" : ""}>Sneakers & Footwear</option>
                </select>
              </div>

              <div>
                <label style="font-size: 13px; color: #64748b; font-weight: 600;" for="prefSkin">Skin Type Profile:</label>
                <select id="prefSkin" style="width: 100%; padding: 9px; border-radius: 8px; border: 1px solid #cbd5e0; margin-top: 4px; background: white;">
                  <option value="oily" ${prefs.skinProfile === "oily" ? "selected" : ""}>Oily Skin</option>
                  <option value="dry" ${prefs.skinProfile === "dry" ? "selected" : ""}>Dry Skin</option>
                  <option value="combination" ${prefs.skinProfile === "combination" ? "selected" : ""}>Combination Skin</option>
                  <option value="sensitive" ${prefs.skinProfile === "sensitive" ? "selected" : ""}>Sensitive Skin</option>
                </select>
              </div>

              <div>
                <label style="font-size: 13px; color: #64748b; font-weight: 600;" for="prefFitness">Fitness Goal:</label>
                <select id="prefFitness" style="width: 100%; padding: 9px; border-radius: 8px; border: 1px solid #cbd5e0; margin-top: 4px; background: white;">
                  <option value="strength" ${prefs.fitnessGoal === "strength" ? "selected" : ""}>Strength & Muscle</option>
                  <option value="endurance" ${prefs.fitnessGoal === "endurance" ? "selected" : ""}>Endurance & Cardio</option>
                  <option value="flexibility" ${prefs.fitnessGoal === "flexibility" ? "selected" : ""}>Mobility & Flexibility</option>
                </select>
              </div>
            </div>

            <div style="display: flex; gap: 10px; align-items: center; margin-top: 6px;">
              <button type="button" onclick="saveProfileChanges()" style="background: #111; color: white; border: none; padding: 10px 22px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                Save Style Preferences
              </button>
              <span id="profileSaveStatus" style="font-size: 13px; font-weight: 600; color: #16a34a;"></span>
            </div>
          </div>
        ` : ""}

        ${activeProfileTab === "membership" ? `
          <!-- 3. MEMBERSHIP & USAGE SECTION -->
          <div style="background: linear-gradient(135deg, #0f172a, #1e293b); color: white; border-radius: 16px; padding: 22px; border: 1px solid rgba(0, 255, 224, 0.3); box-shadow: 0 8px 24px rgba(0,0,0,0.2);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
              <div>
                <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #00ffe0; letter-spacing: 1px;">Current Active Tier</span>
                <h3 style="font-size: 24px; margin: 4px 0 2px; color: #ffffff;">${plan.name}</h3>
                <span style="font-size: 14px; color: #94a3b8;">${plan.priceFormatted} ${plan.period} • Commercial Mall License</span>
              </div>
              <button type="button" onclick="window.MeroXSubscription ? window.MeroXSubscription.openCheckoutModal('PRO') : window.location.href='pricing.html'" style="background: linear-gradient(135deg, #00ffe0, #0284c7); color: #000; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 700; font-size: 13px; cursor: pointer;">
                ${plan.id === "FREE" ? "Upgrade to Pro ➔" : "Manage / Switch Plan"}
              </button>
            </div>

            <!-- Usage Allocation Indicators -->
            <div style="border-top: 1px solid rgba(255,255,255,0.12); padding-top: 16px; display: flex; flex-direction: column; gap: 12px;">
              <div style="font-size: 12px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">Plan Allocation & Usage:</div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span>roX-AI Stylist Conversations</span>
                  <span style="color: #00ffe0; font-weight: 600;">${plan.id === "FREE" ? "5 daily queries (Basic)" : "Unlimited Active"}</span>
                </div>
                <div style="background: rgba(255,255,255,0.1); border-radius: 10px; height: 8px; overflow: hidden;">
                  <div style="background: #00ffe0; width: ${plan.id === "FREE" ? "60%" : "100%"}; height: 100%;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span>Virtual Try-On AR Sessions</span>
                  <span style="color: #00ffe0; font-weight: 600;">${plan.id === "FREE" ? "10 sessions allocation" : "Priority High-Speed"}</span>
                </div>
                <div style="background: rgba(255,255,255,0.1); border-radius: 10px; height: 8px; overflow: hidden;">
                  <div style="background: #00ffe0; width: ${plan.id === "FREE" ? "40%" : "100%"}; height: 100%;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span>Saved Looks Wardrobe</span>
                  <span style="color: #00ffe0; font-weight: 600;">${savedCount} / ${plan.id === "FREE" ? "3 max" : (plan.id === "PRO" ? "25" : "Unlimited")}</span>
                </div>
                <div style="background: rgba(255,255,255,0.1); border-radius: 10px; height: 8px; overflow: hidden;">
                  <div style="background: #00ffe0; width: ${Math.min(100, (savedCount / (plan.id === "FREE" ? 3 : 25)) * 100)}%; height: 100%;"></div>
                </div>
              </div>
            </div>

            <div style="margin-top: 18px; text-align: right;">
              <a href="pricing.html" style="color: #00ffe0; font-size: 12px; font-weight: 600; text-decoration: none;">
                View All 4 Tiers & Full Comparison Matrix ➔
              </a>
            </div>
          </div>
        ` : ""}

        ${activeProfileTab === "looks" ? `
          <!-- 4. SAVED LOOKS WARDROBE -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h4 style="color: #111; font-size: 16px; margin: 0;">My Saved Mirror Wardrobe (${savedCount})</h4>
              <button type="button" onclick="openFeatureModal('store')" style="background: none; border: none; color: #00796b; font-weight: 600; font-size: 12px; cursor: pointer;">
                Browse Store Catalog ➔
              </button>
            </div>

            ${savedProducts.length === 0 ? `
              <div style="text-align: center; padding: 30px; color: #64748b;">
                <p>No pieces saved in your wardrobe yet.</p>
                <button type="button" onclick="openFeatureModal('store')" style="background: #111; color: white; border: none; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; margin-top: 8px;">
                  Explore Products & Tap ❤️
                </button>
              </div>
            ` : `
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px;">
                ${savedProducts.map(p => `
                  <div style="background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; text-align: center;">
                    <img src="${p.image}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 6px;">
                    <div style="font-size: 12px; font-weight: 600; margin-top: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.name}</div>
                    <div style="font-size: 12px; font-weight: 700; color: #00796b;">₹${p.price}</div>
                    <button type="button" onclick="launchTryonWithItem('${p.category}', '${p.image}', ${p.id})" style="background: #00ffe0; color: #000; border: none; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; width: 100%; margin-top: 6px; cursor: pointer;">
                      Try On 🕶️
                    </button>
                  </div>
                `).join("")}
              </div>
            `}
          </div>
        ` : ""}

        ${activeProfileTab === "ai" ? `
          <!-- 5. AI PREFERENCES -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 14px;">
            <h4 style="color: #111; font-size: 16px; margin: 0;">roX-AI Stylist Engine Configuration</h4>
            <p style="font-size: 13px; color: #64748b; margin: 0;">
              roX-AI operates on an offline deterministic knowledge base with zero network latency. You can optionally link a Google Gemini API key stored strictly in your browser's local memory.
            </p>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button type="button" onclick="document.getElementById('apiKeySettingsBtn').click(); window.closeFeatureModal();" style="background: #0f172a; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer;">
                Configure API Key Settings ⚙️
              </button>
              <button type="button" onclick="window.sendRoxPrompt('Find my style'); window.closeFeatureModal();" style="background: linear-gradient(135deg, #00ffe0, #0284c7); color: #000; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer;">
                Launch Style Discovery with roX-AI ✨
              </button>
            </div>
          </div>
        ` : ""}

        ${activeProfileTab === "privacy" ? `
          <!-- 6. PRIVACY & MIRROR SECURITY -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 14px;">
            <h4 style="color: #111; font-size: 16px; margin: 0;">Privacy Protection & Mirror Session Controls</h4>
            <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 10px 14px; border-radius: 8px; font-size: 12px; color: #166534;">
              <strong>100% On-Device Processing:</strong> Webcam frames for Virtual Try-On and Face Tracking are processed locally in Canvas memory. Zero biometric images or recordings are transmitted or stored.
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
              <div>
                <strong style="font-size: 13px; color: #111;">Mirror Inactivity Privacy Timer</strong>
                <div style="font-size: 12px; color: #64748b;">Automatically clears mirror session after 90 seconds of inactivity</div>
              </div>
              <span style="font-size: 13px; font-weight: 700; color: #15803d;">Active (90s)</span>
            </div>

            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 6px;">
              <button type="button" onclick="window.MeroXSession ? window.MeroXSession.endSession('user_reset') : window.startNewKioskSession(); window.closeFeatureModal();" style="background: #ef4444; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer;">
                End Active Mirror Session Now (Reset)
              </button>
            </div>
          </div>
        ` : ""}

      </div>
    `;
  }

  window.saveProfileChanges = async function () {
    const nameInput = document.getElementById("profileNameInput");
    const catSelect = document.getElementById("prefCategory");
    const skinSelect = document.getElementById("prefSkin");
    const fitSelect = document.getElementById("prefFitness");
    const statusEl = document.getElementById("profileSaveStatus");

    if (!window.MeroXAuth) return;

    try {
      const newName = nameInput ? nameInput.value.trim() : "";
      const preferences = {
        favoriteCategory: catSelect ? catSelect.value : "all",
        skinProfile: skinSelect ? skinSelect.value : "combination",
        fitnessGoal: fitSelect ? fitSelect.value : "strength"
      };

      await window.MeroXAuth.updateUserProfile({
        displayName: newName,
        preferences: preferences
      });

      if (statusEl) {
        statusEl.textContent = "✓ Profile & preferences saved successfully!";
        setTimeout(() => {
          if (statusEl) statusEl.textContent = "";
        }, 3000);
      }
    } catch (e) {
      if (statusEl) {
        statusEl.textContent = `⚠️ ${e.message || "Failed to save profile."}`;
        statusEl.style.color = "#dc2626";
      }
    }
  };

  window.logoutFromProfile = function () {
    if (window.MeroXAuth) {
      window.MeroXAuth.logout().then(() => {
        window.location.href = "index.html";
      });
    } else {
      window.location.href = "index.html";
    }
  };

  // ================= 6. SMART MIRROR HUD (FULLSCREEN AMBIENT MODE) =================
  window.openSmartMirrorHud = function () {
    const hud = document.getElementById("smartMirrorHud");
    const video = document.getElementById("hudVideo");
    if (!hud) return;

    hud.classList.remove("hidden");

    // Dynamic greeting based on auth state
    const user = window.MeroXAuth ? window.MeroXAuth.getUser() : null;
    const name = user && !user.isGuest ? (user.displayName || user.email.split("@")[0]) : "Explorer";
    const greetingEl = document.getElementById("hudGreeting");
    if (greetingEl) {
      greetingEl.textContent = `Good ${getTimeOfDayGreeting()}, ${name}`;
    }

    // Start clock
    updateHudClock();
    if (clockInterval) clearInterval(clockInterval);
    clockInterval = setInterval(updateHudClock, 1000);

    // Start webcam background
    if (window.MeroXCamera && video) {
      window.MeroXCamera.startCamera(video);
    }
  };

  function getTimeOfDayGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Morning";
    if (h < 17) return "Afternoon";
    return "Evening";
  }

  function updateHudClock() {
    const clockEl = document.getElementById("hudClock");
    const dateEl = document.getElementById("hudDate");
    if (!clockEl || !dateEl) return;

    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    dateEl.textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }

  window.closeSmartMirrorHud = function () {
    const hud = document.getElementById("smartMirrorHud");
    if (hud) hud.classList.add("hidden");
    if (clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
    // Clean hardware shutdown
    if (window.MeroXCamera) {
      window.MeroXCamera.stopCamera();
    }
  };

  window.openTryOnFromMirror = function () {
    window.closeSmartMirrorHud();
    window.openFeatureModal("tryon");
  };

  // ================= 8. RETAIL SMART MIRROR KIOSK & SCANNER SUBSYSTEM (PHASES 8, 9, 10) =================
  window.customerSession = {
    currentProduct: null,
    activeLook: [],
    storeId: "STORE-MUM-01",
    storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall"
  };
  window.customerLook = window.customerSession.activeLook;

  // Helper to escape HTML safely
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --- A. SCANNER SUBSYSTEM ---
  let scannerStream = null;

  window.openScannerModal = function () {
    const modal = document.getElementById("scannerModal");
    if (modal) {
      modal.classList.remove("hidden");
    }
    startScannerCamera();
    const input = document.getElementById("scannerInput");
    if (input) {
      input.value = "";
      setTimeout(() => input.focus(), 150);
    }
  };

  window.closeScannerModal = function () {
    const modal = document.getElementById("scannerModal");
    if (modal) modal.classList.add("hidden");
    stopScannerCamera();
  };

  window.closeScannerModalOnBackdrop = function (e) {
    if (e.target && e.target.id === "scannerModal") {
      window.closeScannerModal();
    }
  };

  async function startScannerCamera() {
    const video = document.getElementById("scannerVideo");
    const status = document.getElementById("scannerStatus");
    if (!video) return;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
        scannerStream = stream;
        video.srcObject = stream;
        await video.play().catch(() => {});
        if (status) status.textContent = "Viewfinder active: Align barcode in frame";

        // Native BarcodeDetector hook if supported
        if (typeof window.BarcodeDetector === "function") {
          try {
            const detector = new window.BarcodeDetector({ formats: ["ean_13", "qr_code", "code_128"] });
            const detectLoop = async () => {
              if (!scannerStream || video.readyState < 2) return;
              try {
                const barcodes = await detector.detect(video);
                if (barcodes && barcodes.length > 0) {
                  const code = barcodes[0].rawValue;
                  window.simulateQuickScan(code);
                  return;
                }
              } catch (e) {}
              if (scannerStream) requestAnimationFrame(detectLoop);
            };
            requestAnimationFrame(detectLoop);
          } catch (e) {}
        }
      } catch (err) {
        if (status) status.textContent = "Camera preview unavailable. Use manual entry or quick demo chips below.";
      }
    } else {
      if (status) status.textContent = "Manual code entry active";
    }
  }

  function stopScannerCamera() {
    if (scannerStream) {
      scannerStream.getTracks().forEach(t => {
        try { t.stop(); } catch (e) {}
      });
      scannerStream = null;
    }
    const video = document.getElementById("scannerVideo");
    if (video) video.srcObject = null;
  }

  window.handleScanInput = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById("scannerInput");
    if (!input) return;
    const code = input.value.trim();
    if (!code) return;
    processScanCode(code);
  };

  window.simulateQuickScan = function (code) {
    const input = document.getElementById("scannerInput");
    if (input) input.value = code;
    processScanCode(code);
  };

  function processScanCode(rawCode) {
    const status = document.getElementById("scannerStatus");
    const resContainer = document.getElementById("scannerResultContainer");
    if (!rawCode || !window.MeroXCatalog) return;

    const product = window.MeroXCatalog.findAny(rawCode);

    if (product) {
      if (window.MeroXSession) {
        window.MeroXSession.recordScan(product);
      } else {
        window.customerSession.currentProduct = product;
      }
      if (status) status.textContent = `✓ Detected: ${product.name} (${product.sku})`;
      if (resContainer) {
        resContainer.innerHTML = renderScannedProductCard(product);
      }
    } else {
      if (status) status.textContent = "⚠️ Barcode not found in store";
      if (resContainer) {
        resContainer.innerHTML = `
          <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #991b1b; margin-top: 10px;">
            <strong>⚠️ Unrecognized Barcode or SKU:</strong> "${escapeHtml(rawCode)}" is not in the active store catalog. Please check the code or try one of the demo chips above.
          </div>
        `;
      }
    }
  }

  function renderScannedProductCard(p) {
    const meta = p.metadata || {};
    const fitText = meta.fit ? ` • Fit: ${meta.fit}` : "";
    return `
      <div class="scanned-product-card">
        <img src="${p.image}" alt="${escapeHtml(p.name)}" class="scanned-product-img" onerror="this.src=window.MeroXCatalog.getImageFallback('${p.category}')">
        <div class="scanned-product-info">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
              <h4 style="margin: 0; font-size: 17px; color: #0f172a;">${escapeHtml(p.name)}</h4>
              <span style="font-size: 16px; font-weight: 700; color: #4338ca;">₹${p.price.toLocaleString("en-IN")}</span>
            </div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
              SKU: <strong>${p.sku}</strong> | Barcode: ${p.barcode}
            </div>
            <div style="font-size: 12px; color: #059669; font-weight: 600; margin-top: 4px;">
              🟢 In Stock (${p.stockQuantity} units) • ${p.location || 'Floor 2'}
            </div>
            <p style="font-size: 12px; color: #475569; margin-top: 6px; line-height: 1.4;">
              ${escapeHtml(p.description)}${fitText}
            </p>
          </div>

          <div class="scanned-actions-row">
            <button type="button" class="btn-tryon-now" onclick="scanTryOnNow(${p.id})">
              🪞 Try On Now
            </button>
            <button type="button" class="btn-add-look" onclick="scanAddToLook(${p.id})">
              🛍️ Add to My Look
            </button>
            <button type="button" class="btn-add-wishlist" onclick="toggleStoreFavorite(${p.id}, this)">
              ❤️ Add to Wishlist
            </button>
            <button type="button" class="btn-ask-rox" onclick="scanAskRoxAi(${p.id})">
              🤖 Ask roX-AI Stylist
            </button>
          </div>
        </div>
      </div>
    `;
  }

  window.scanTryOnNow = function (productId) {
    window.closeScannerModal();
    const prod = window.MeroXCatalog ? window.MeroXCatalog.getById(productId) : null;
    if (prod) {
      if (window.MeroXSession) {
        window.MeroXSession.recordTryOnStart(prod, prod.tryOnType || "garment_preview");
      } else {
        window.customerSession.currentProduct = prod;
      }
      window.launchTryonWithItem(prod.category, prod.image, prod.id);
    }
  };

  window.scanAddToLook = function (productId) {
    window.addToCustomerLook(productId);
    const resContainer = document.getElementById("scannerResultContainer");
    if (resContainer) {
      const toast = document.createElement("div");
      toast.style.cssText = "background: #dcfce7; color: #166534; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 6px; margin-top: 8px;";
      toast.textContent = "✓ Added item to your current shopping look!";
      resContainer.prepend(toast);
      setTimeout(() => toast.remove(), 2500);
    }
  };

  window.scanAskRoxAi = function (productId) {
    window.closeScannerModal();
    const prod = window.MeroXCatalog ? window.MeroXCatalog.getById(productId) : null;
    if (!prod) return;
    const roxBtn = document.getElementById("roxAiBtn");
    if (roxBtn) roxBtn.click();
    const input = document.getElementById("roxAiInput");
    if (input) {
      input.value = `What matches with the ${prod.name} (SKU: ${prod.sku}) and how should I style it?`;
      const sendBtn = document.getElementById("roxAiSend");
      if (sendBtn) sendBtn.click();
    }
  };

  // --- B. CUSTOMER LOOK MANAGEMENT & CONTINUATION QR ---
  window.addToCustomerLook = function (itemOrId) {
    if (!window.MeroXCatalog) return;
    const prod = typeof itemOrId === "object" ? itemOrId : window.MeroXCatalog.getById(itemOrId);
    if (!prod) return;

    if (window.MeroXSession) {
      window.MeroXSession.addToLook(prod);
    } else {
      if (!window.customerSession.activeLook.some(x => x.id === prod.id)) {
        window.customerSession.activeLook.push(prod);
        window.customerLook = window.customerSession.activeLook;
      }
    }

    window.renderCustomerLookUi();
  };

  window.removeFromCustomerLook = function (productId) {
    if (window.MeroXSession) {
      window.MeroXSession.removeFromLook(productId);
    } else {
      window.customerSession.activeLook = window.customerSession.activeLook.filter(x => x.id !== Number(productId));
      window.customerLook = window.customerSession.activeLook;
    }
    window.renderCustomerLookUi();
  };

  window.clearCustomerLook = function () {
    if (window.MeroXSession) {
      window.MeroXSession.clearLook();
    } else {
      window.customerSession.activeLook = [];
      window.customerLook = [];
    }
    window.renderCustomerLookUi();
  };

  window.getCustomerLookTotal = function () {
    if (window.MeroXSession) {
      return window.MeroXSession.getLookTotal();
    }
    const sum = (window.customerSession.activeLook || []).reduce((acc, curr) => acc + (curr.price || 0), 0);
    return `₹${sum.toLocaleString("en-IN")}`;
  };

  window.renderCustomerLookUi = function () {
    const drawer = document.getElementById("currentLookDrawer");
    if (!drawer) return;
    const look = window.customerSession.activeLook || [];

    if (look.length === 0) {
      drawer.innerHTML = `
        <div style="font-size: 13px; color: #64748b; text-align: center; padding: 12px;">
          Your fitting look is currently empty. Scan garments or click "Add to Look" to curate your complete outfit!
        </div>
      `;
      return;
    }

    const itemsHtml = look.map(item => `
      <div class="look-item-thumb">
        <img src="${item.image}" alt="${escapeHtml(item.name)}">
        <button type="button" class="btn-remove-item" onclick="removeFromCustomerLook(${item.id})" title="Remove item">&times;</button>
        <div style="font-size: 11px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70px;">${escapeHtml(item.name)}</div>
        <div style="font-size: 10px; color: #4338ca; font-weight: 700;">₹${item.price}</div>
      </div>
    `).join("");

    drawer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 13px; font-weight: 700; color: #1e293b;">
          🛍️ My Current Look (${look.length} ${look.length === 1 ? 'item' : 'items'}):
        </span>
        <span style="font-size: 14px; font-weight: 700; color: #4338ca;">
          Total: ${window.getCustomerLookTotal()}
        </span>
      </div>
      <div class="look-items-list">${itemsHtml}</div>
      <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 10px; flex-wrap: wrap;">
        <button type="button" onclick="generatePhoneContinuationQr('qrContinuationContainer')" style="background: #0f172a; color: #00ffe0; border: 1px solid #00ffe0; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
          📱 Send Look to Phone (QR)
        </button>
        <button type="button" onclick="saveCustomerLook()" style="background: #6366f1; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
          💾 Save Look to Profile
        </button>
        <button type="button" onclick="clearCustomerLook()" style="background: none; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 12px; color: #64748b; cursor: pointer;">
          Clear Look
        </button>
      </div>
      <div id="qrContinuationContainer" style="margin-top: 10px;"></div>
    `;
  };

  window.saveCustomerLook = function () {
    const look = window.customerSession.activeLook || [];
    if (look.length === 0) return;
    if (window.MeroXSession) {
      const savedRecord = window.MeroXSession.saveLook();
      alert(`✓ Outfit Look saved to your MeroX profile! Ref: ${savedRecord.lookId}`);
      return savedRecord;
    }
    try {
      const saved = JSON.parse(localStorage.getItem("merox_saved_looks") || "[]");
      saved.push({
        id: "LOOK-" + Date.now(),
        date: new Date().toISOString(),
        itemIds: look.map(x => x.id),
        total: window.getCustomerLookTotal(),
        store: window.customerSession.storeName
      });
      localStorage.setItem("merox_saved_looks", JSON.stringify(saved));
      alert("✓ Outfit Look saved to your MeroX profile!");
    } catch (e) {}
  };

  window.generatePhoneContinuationQr = function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const look = window.customerSession.activeLook || [];
    if (look.length === 0) return;

    let lookRecord = null;
    if (window.MeroXSession) {
      lookRecord = window.MeroXSession.saveLook();
    } else {
      lookRecord = {
        lookId: "LK-" + Date.now().toString(16).toUpperCase(),
        items: look,
        total: window.getCustomerLookTotal(),
        storeId: window.customerSession.storeId
      };
    }

    // Smart Mirror phone continuation URL payload (supports local host & https://merox.ai/store-kiosk)
    const continuationUrl = window.MeroXSession
      ? window.MeroXSession.generateContinuationUrl(lookRecord)
      : `https://merox.ai/store-kiosk?id=${lookRecord.lookId}&store=${window.customerSession.storeId}`;

    const svgQr = createOfflineQrSvg(continuationUrl);

    container.innerHTML = `
      <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px; text-align: center; animation: fadeIn 0.3s ease;">
        <h5 style="margin: 0 0 6px; font-size: 13px; color: #0f172a;">Scan with Your Smartphone</h5>
        <p style="font-size: 11px; color: #64748b; margin-bottom: 10px;">Take your curated store look with you or complete purchase from your mobile.</p>
        <div style="display: flex; justify-content: center; margin-bottom: 8px;">
          ${svgQr}
        </div>
        <div style="font-size: 11px; color: #475569; word-break: break-all; margin-top: 6px;">
          Or open on mobile: <a href="${continuationUrl}" target="_blank" style="color: #6366f1; text-decoration: underline; font-weight:600;">${continuationUrl}</a>
        </div>
      </div>
    `;
  };

  function createOfflineQrSvg(text) {
    const size = 25;
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    const matrix = Array.from({ length: size }, () => Array(size).fill(0));

    function drawFinder(r, c) {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
            matrix[r + i][c + j] = 1;
          }
        }
      }
    }
    drawFinder(0, 0);
    drawFinder(0, size - 7);
    drawFinder(size - 7, 0);

    for (let i = 8; i < size - 8; i++) {
      matrix[6][i] = i % 2 === 0 ? 1 : 0;
      matrix[i][6] = i % 2 === 0 ? 1 : 0;
    }

    let bitIdx = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)) continue;
        if (r === 6 || c === 6) continue;
        const bit = ((hash >> (bitIdx % 28)) & 1) ^ (((r * 3 + c * 7 + bitIdx) % 2) === 0 ? 1 : 0);
        matrix[r][c] = bit;
        bitIdx++;
      }
    }

    const cellSize = 6;
    const svgSize = size * cellSize;
    let rects = "";
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c] === 1) {
          rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
        }
      }
    }

    return `<svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}" style="background: white; padding: 8px; border-radius: 8px; border: 1px solid #cbd5e1;" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
  }

  // --- C. VARIANT SELECTORS ---
  window.selectFittingVariantSize = function (size, btn) {
    if (!btn || !btn.parentElement) return;
    btn.parentElement.querySelectorAll(".variant-chip").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };

  window.selectFittingVariantColor = function (color, btn) {
    if (!btn || !btn.parentElement) return;
    btn.parentElement.querySelectorAll(".variant-chip").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };

  function renderActiveFittingProductCard() {
    const prod = window.customerSession ? window.customerSession.currentProduct : null;
    if (!prod) return "";
    const isApparel = prod.category !== "goggles" && prod.category !== "cap";
    const sizes = prod.sizes || ["S", "M", "L", "XL"];
    const colors = prod.colors || [prod.color || "Standard"];

    let smartSizeHint = "M (Recommended)";
    try {
      const prefs = window.MeroXAuth ? window.MeroXAuth.getUserPreferences() : {};
      if (prefs.bodyType === "athletic" || prefs.bodyType === "tall") smartSizeHint = "L (Recommended)";
      else if (prefs.bodyType === "petite") smartSizeHint = "S (Recommended)";
    } catch (e) {}

    return `
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <div style="display: flex; gap: 14px; align-items: center;">
          <img src="${prod.image}" alt="${escapeHtml(prod.name)}" style="width: 70px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <h4 style="margin: 0; font-size: 15px; color: #0f172a;">${escapeHtml(prod.name)}</h4>
              <span style="font-size: 14px; font-weight: 700; color: #4338ca;">₹${prod.price.toLocaleString("en-IN")}</span>
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
              SKU: <strong>${prod.sku}</strong> • Subcategory: ${prod.subcategory || prod.category}
            </div>
            <div style="font-size: 11px; color: #059669; font-weight: 600; margin-top: 2px;">
              🟢 In Stock (${prod.stockQuantity} units) • ${prod.location || 'Floor 2'}
            </div>
          </div>
        </div>

        ${isApparel ? `
          <div style="margin-top: 10px; font-size: 12px; color: #4338ca; background: #eef2ff; padding: 6px 10px; border-radius: 6px;">
            🪞 <strong>Smart Mirror Alignment:</strong> Virtual silhouette positioned against live torso/leg tracking.
          </div>

          <div style="margin-top: 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; color: #475569; margin-bottom: 4px;">
              <span>Select Size:</span>
              <span style="color: #6366f1;">BMI Suggestion: ${smartSizeHint}</span>
            </div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${sizes.map((s, idx) => `
                <button type="button" class="variant-chip ${idx === 1 ? 'active' : ''}" onclick="selectFittingVariantSize('${s}', this)">${s}</button>
              `).join("")}
            </div>
          </div>

          <div style="margin-top: 10px;">
            <div style="font-size: 11px; font-weight: 600; color: #475569; margin-bottom: 4px;">Available Colors:</div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${colors.map((c, idx) => `
                <button type="button" class="variant-chip ${idx === 0 ? 'active' : ''}" onclick="selectFittingVariantColor('${c}', this)">${c}</button>
              `).join("")}
            </div>
          </div>
        ` : ""}

        <div style="margin-top: 12px; display: flex; gap: 8px;">
          <button type="button" onclick="addToCustomerLook(${prod.id})" style="background: #6366f1; color: white; border: none; padding: 7px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;">
            🛍️ Add This to My Look
          </button>
          <button type="button" onclick="toggleStoreFavorite(${prod.id}, this)" style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 7px 12px; border-radius: 8px; font-size: 12px; color: #475569; cursor: pointer;">
            ❤️ Save to Wishlist
          </button>
        </div>
      </div>
    `;
  }

  function renderFittingRecommendationsHtml() {
    if (!window.MeroXCatalog) return "";
    const activeProd = window.customerSession ? window.customerSession.currentProduct : null;
    let recs = [];

    if (activeProd) {
      if (activeProd.category === "jeans") {
        recs = [window.MeroXCatalog.getById(6), window.MeroXCatalog.getById(11), window.MeroXCatalog.getById(21)];
      } else if (activeProd.category === "shirt") {
        recs = [window.MeroXCatalog.getById(1), window.MeroXCatalog.getById(21), window.MeroXCatalog.getById(29)];
      } else if (activeProd.category === "tshirt") {
        recs = [window.MeroXCatalog.getById(4), window.MeroXCatalog.getById(16), window.MeroXCatalog.getById(30)];
      } else if (activeProd.category === "goggles" || activeProd.category === "cap") {
        recs = [window.MeroXCatalog.getById(6), window.MeroXCatalog.getById(1), window.MeroXCatalog.getById(28)];
      } else {
        recs = [window.MeroXCatalog.getById(1), window.MeroXCatalog.getById(11), window.MeroXCatalog.getById(21)];
      }
    } else {
      recs = [window.MeroXCatalog.getById(6), window.MeroXCatalog.getById(1), window.MeroXCatalog.getById(21)];
    }

    return recs.filter(Boolean).map(item => `
      <div class="complete-look-card">
        <img src="${item.image}" alt="${escapeHtml(item.name)}">
        <div style="font-size: 11px; font-weight: 600; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(item.name)}</div>
        <div style="font-size: 11px; color: #4338ca; font-weight: 700;">₹${item.price}</div>
        <button type="button" onclick="addToCustomerLook(${item.id})" style="background: #eef2ff; border: 1px solid #c7d2fe; color: #4338ca; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 600; margin-top: 4px; cursor: pointer; width: 100%;">
          + Add to Look
        </button>
      </div>
    `).join("");
  }

  // --- D. RETAIL KIOSK FULLSCREEN MODE (PHASE 10) ---
  let kioskClockInterval = null;

  window.toggleRetailKioskMode = function () {
    const hud = document.getElementById("retailKioskHud");
    if (!hud) return;
    const isHidden = hud.classList.contains("hidden") || hud.style.display === "none";

    if (isHidden) {
      hud.classList.remove("hidden");
      hud.style.display = "flex";
      startKioskHud();
    } else {
      hud.classList.add("hidden");
      hud.style.display = "none";
      stopKioskHud();
    }
  };

  function startKioskHud() {
    const video = document.getElementById("kioskHudVideo");
    if (window.MeroXCamera && video) {
      window.MeroXCamera.startCamera(video);
    }
    updateKioskClock();
    if (kioskClockInterval) clearInterval(kioskClockInterval);
    kioskClockInterval = setInterval(updateKioskClock, 1000);
  }

  function stopKioskHud() {
    if (kioskClockInterval) {
      clearInterval(kioskClockInterval);
      kioskClockInterval = null;
    }
    if (window.MeroXCamera) {
      window.MeroXCamera.stopCamera();
    }
  }

  function updateKioskClock() {
    const clockEl = document.getElementById("kioskClock");
    const dateEl = document.getElementById("kioskDate");
    if (!clockEl || !dateEl) return;
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    dateEl.textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }

  window.startNewKioskSession = function () {
    if (window.MeroXSession) {
      window.MeroXSession.endSession("kiosk_reset");
    } else {
      window.clearCustomerLook();
      window.customerSession.currentProduct = null;
      if (window.MeroXRoxAI) {
        window.MeroXRoxAI.clearHistory();
      }
    }
    alert("✓ Shopping session reset! Clean mirror ready for next customer.");
  };

  // ================= 7. INITIALIZATION =================
  document.addEventListener("DOMContentLoaded", () => {
    initAuthUi();
    initRoxAi();

    // Ensure session timeout modal is clean and hidden on dashboard boot
    if (window.MeroXSession && typeof window.MeroXSession.hideWarningModal === "function") {
      window.MeroXSession.hideWarningModal();
    }

    const storeBtn = document.getElementById("yourStoreBtn");
    if (storeBtn) {
      storeBtn.addEventListener("click", () => {
        window.openFeatureModal("store");
      });
    }
  });

})();