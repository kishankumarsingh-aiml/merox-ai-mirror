/**
 * MEROX OPTION 2: 3D SHOWROOM MAIN CONTROLLER
 * Orchestrates 3D hero parallax, 10-feature spatial hub, dynamic category discovery,
 * roX Vision triggers, and seamless synchronization with core MeroX subsystems.
 */

(function (global) {
  "use strict";

  // Record user preference for Option 2
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("merox_dashboard_version", "option2");
    }
  } catch (e) {}

  let activeCategory = "all";

  document.addEventListener("DOMContentLoaded", () => {
    initHeroParallax();
    initCategoryPills();
    renderProducts(activeCategory);
    initSearchBar();
    initOption2RoxChips();
  });

  // 1. 3D HERO PARALLAX INTERACTION
  function initHeroParallax() {
    const card = document.getElementById("heroParallaxCard");
    const container = document.getElementById("heroVisualStage");
    if (!card || !container) return;

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle rotation clamped to ±8 degrees
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px)`;
    });

    container.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    });
  }

  // 2. CATEGORY PILLS & 3D PRODUCT CARDS
  function initCategoryPills() {
    const pills = document.querySelectorAll(".cat-filter-pill");
    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        pills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        activeCategory = pill.getAttribute("data-category") || "all";
        renderProducts(activeCategory);
      });
    });
  }

  function renderProducts(category) {
    const grid = document.getElementById("opt2ProductGrid");
    if (!grid) return;

    let items = [];
    if (global.MeroXCatalog) {
      items = global.MeroXCatalog.getAll();
    } else if (global.products) {
      items = global.products;
    }

    if (category !== "all") {
      items = items.filter((p) => (p.category || "").toLowerCase() === category.toLowerCase());
    }

    // Limit to 12 featured items for clean showroom performance
    const displayItems = items.slice(0, 12);

    grid.innerHTML = displayItems
      .map((p) => {
        return `
        <div class="opt2-prod-card" data-id="${p.id}">
          <div class="opt2-prod-thumb-wrap">
            <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='images/shirt1.jpeg'">
            <button class="btn-quick-3d" onclick="openRoxVisionModal(${p.id})" title="Launch roX Vision 3D Studio">
              <span>👁️ 3D</span>
            </button>
          </div>
          <div class="opt2-prod-info">
            <span class="opt2-prod-cat">${p.subcategory || p.category}</span>
            <div class="opt2-prod-title" title="${p.name}">${p.name}</div>
            <div class="opt2-prod-meta-row">
              <span class="opt2-prod-price">${p.currencySymbol || "₹"}${p.price}</span>
              <span class="opt2-prod-rating">★ ${p.rating || "4.8"}</span>
            </div>
          </div>
          <div class="opt2-prod-actions">
            <button class="btn-card-tryon" onclick="handleCardTryOn(${p.id})">🕶️ Try On</button>
            <button class="btn-card-look" onclick="handleCardAddLook(${p.id}, this)">+ Look</button>
          </div>
        </div>
      `;
      })
      .join("");
  }

  global.handleCardTryOn = function (productId) {
    let p = null;
    if (global.MeroXCatalog) p = global.MeroXCatalog.getById(productId);
    if (!p && global.products) p = global.products.find((i) => i.id === productId);

    if (p && typeof global.launchTryonWithItem === "function") {
      global.launchTryonWithItem(p.category, p.image, p.id);
    } else if (typeof global.openTryOnFromMirror === "function") {
      global.openTryOnFromMirror();
    } else if (typeof global.openFeatureModal === "function") {
      global.openFeatureModal("tryon");
    }
  };

  global.handleCardAddLook = function (productId, btn) {
    if (typeof global.addToCustomerLook === "function") {
      global.addToCustomerLook(productId);
    }
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = "✓ Added";
      btn.style.color = "var(--merox-accent)";
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.color = "";
      }, 1800);
    }
  };

  // 3. SEARCH BAR IN OPTION 2 HEADER
  function initSearchBar() {
    const input = document.getElementById("opt2SearchInput");
    const btn = document.getElementById("opt2SearchBtn");
    if (!input) return;

    function doSearch() {
      const q = input.value.trim();
      if (!q) return;
      window.location.href = `search.html?q=${encodeURIComponent(q)}`;
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") doSearch();
    });

    if (btn) btn.addEventListener("click", doSearch);
  }

  // 4. roX-AI CHIPS IN OPTION 2
  function initOption2RoxChips() {
    // Quick prompt helper
    global.sendOption2RoxChip = function (promptText) {
      if (promptText === "View in 3D") {
        // Open roX Vision with currently featured or first item
        const featuredId = 1; // Blue Jeans
        if (typeof global.openRoxVisionModal === "function") {
          global.openRoxVisionModal(featuredId);
        }
        return;
      }

      // If normal text prompt, open drawer and send
      const drawer = document.getElementById("roxAiDrawer");
      if (drawer && !drawer.classList.contains("open")) {
        drawer.classList.add("open");
      }
      const input = document.getElementById("roxUserInput");
      const sendBtn = document.getElementById("roxSendBtn");
      if (input && sendBtn) {
        input.value = promptText;
        sendBtn.click();
      }
    };
  }

  // Toggle roX-AI Drawer helper
  global.toggleOption2RoxDrawer = function () {
    const drawer = document.getElementById("roxAiDrawer");
    if (!drawer) return;
    drawer.classList.toggle("open");
  };

  // Switch to Option 1 helper
  global.switchToOption1 = function () {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("merox_dashboard_version", "option1");
      }
    } catch (e) {}
    window.location.href = "dashboard.html";
  };
})(typeof window !== "undefined" ? window : globalThis);
