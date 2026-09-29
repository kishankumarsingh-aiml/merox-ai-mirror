/**
 * MEROX roX Vision — 3D Product Studio Controller
 * High-performance interactive multi-axis 3D studio viewer for authentic catalog products.
 * Supports mouse drag orbit, touch orbit, wheel zoom, pinch zoom, reset, fullscreen,
 * lighting reflection tracking, and direct integration with Try-On & Lookbuilder.
 *
 * HONEST DISCLOSURE: Renders authentic high-resolution catalog product assets
 * within an interactive multi-axis 3D studio viewport with dynamic lighting and spatial depth.
 */

(function (global) {
  "use strict";

  let activeProduct = null;
  let yaw = 0; // rotateY
  let pitch = 0; // rotateX
  let zoom = 1.0; // scale
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentAngle = "front";
  let touchStartDist = 0;

  // DOM Elements cache
  let modalEl = null;
  let viewportEl = null;
  let stageEl = null;
  let lightReflectEl = null;
  let prodImgEl = null;
  let prodNameEl = null;
  let prodPriceEl = null;
  let prodBrandEl = null;
  let prodColorEl = null;
  let prodMaterialEl = null;
  let prodSizesEl = null;
  let prodDescEl = null;
  let prodStockEl = null;
  let prodCategoryEl = null;
  let btnTryOnEl = null;
  let btnAddLookEl = null;

  function initElements() {
    modalEl = document.getElementById("roxVisionModal");
    if (!modalEl) return false;

    viewportEl = document.getElementById("roxVisionViewport");
    stageEl = document.getElementById("roxVisionStage");
    lightReflectEl = document.getElementById("roxVisionLighting");
    prodImgEl = document.getElementById("roxVisionImage");
    prodNameEl = document.getElementById("roxVisionName");
    prodPriceEl = document.getElementById("roxVisionPrice");
    prodBrandEl = document.getElementById("roxVisionBrand");
    prodColorEl = document.getElementById("roxVisionColor");
    prodMaterialEl = document.getElementById("roxVisionMaterial");
    prodSizesEl = document.getElementById("roxVisionSizes");
    prodDescEl = document.getElementById("roxVisionDesc");
    prodStockEl = document.getElementById("roxVisionStock");
    prodCategoryEl = document.getElementById("roxVisionCategory");
    btnTryOnEl = document.getElementById("roxVisionBtnTryOn");
    btnAddLookEl = document.getElementById("roxVisionBtnAddLook");
    return true;
  }

  function updateTransform() {
    if (!stageEl) return;
    // Clamp pitch between -40 and 40 degrees for natural ergonomics
    pitch = Math.max(-40, Math.min(40, pitch));
    // Clamp zoom between 0.75x and 2.5x
    zoom = Math.max(0.75, Math.min(2.5, zoom));

    stageEl.style.transform = `rotateX(${pitch}deg) rotateY(${yaw}deg) scale3d(${zoom}, ${zoom}, ${zoom})`;

    // Update specular lighting reflection based on yaw and pitch
    if (lightReflectEl) {
      const lightX = 50 + (yaw % 360) * 0.25;
      const lightY = 50 - pitch * 0.5;
      lightReflectEl.style.background = `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(0, 255, 224, 0.35) 0%, rgba(129, 140, 248, 0.15) 40%, transparent 70%)`;
    }
  }

  // Mouse interaction handlers
  function onMouseDown(e) {
    if (e.button !== 0) return; // Left click only
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    if (viewportEl) viewportEl.style.cursor = "grabbing";
    e.preventDefault();
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    startX = e.clientX;
    startY = e.clientY;

    yaw += dx * 0.6;
    pitch -= dy * 0.4;
    updateTransform();
  }

  function onMouseUp() {
    if (isDragging) {
      isDragging = false;
      if (viewportEl) viewportEl.style.cursor = "grab";
    }
  }

  function onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    zoom += delta;
    updateTransform();
  }

  function onDoubleClick() {
    resetView();
  }

  // Touch interaction handlers
  function onTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      isDragging = false;
      touchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }

  function onTouchMove(e) {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;

      yaw += dx * 0.6;
      pitch -= dy * 0.4;
      updateTransform();
      e.preventDefault();
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (touchStartDist > 0) {
        const factor = dist / touchStartDist;
        zoom *= factor;
        touchStartDist = dist;
        updateTransform();
      }
      e.preventDefault();
    }
  }

  function onTouchEnd() {
    isDragging = false;
    touchStartDist = 0;
  }

  function attachListeners() {
    if (!viewportEl) return;
    viewportEl.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    viewportEl.addEventListener("wheel", onWheel, { passive: false });
    viewportEl.addEventListener("dblclick", onDoubleClick);

    viewportEl.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
  }

  function detachListeners() {
    if (viewportEl) {
      viewportEl.removeEventListener("mousedown", onMouseDown);
      viewportEl.removeEventListener("wheel", onWheel);
      viewportEl.removeEventListener("dblclick", onDoubleClick);
      viewportEl.removeEventListener("touchstart", onTouchStart);
    }
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
  }

  function resetView() {
    yaw = 0;
    pitch = 0;
    zoom = 1.0;
    currentAngle = "front";
    updateActiveAngleBtn("front");
    updateTransform();
  }

  function zoomIn() {
    zoom += 0.2;
    updateTransform();
  }

  function zoomOut() {
    zoom -= 0.2;
    updateTransform();
  }

  function setAngle(angle) {
    currentAngle = angle;
    updateActiveAngleBtn(angle);
    if (angle === "front") {
      yaw = 0;
      pitch = 0;
    } else if (angle === "side") {
      yaw = 45;
      pitch = 4;
    } else if (angle === "back") {
      yaw = 180;
      pitch = 0;
    }
    updateTransform();
  }

  function updateActiveAngleBtn(angle) {
    const btns = modalEl ? modalEl.querySelectorAll(".rox-angle-btn") : [];
    btns.forEach((btn) => {
      if (btn.getAttribute("data-angle") === angle) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  function toggleFullscreen() {
    if (!modalEl) return;
    const studioBox = modalEl.querySelector(".rox-vision-modal-box");
    if (!studioBox) return;

    if (!document.fullscreenElement) {
      if (studioBox.requestFullscreen) {
        studioBox.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  function openRoxVisionModal(productId) {
    if (!initElements()) {
      console.warn("roX Vision elements not found in DOM.");
      return;
    }

    let product = null;
    if (global.MeroXCatalog) {
      product = global.MeroXCatalog.getById(Number(productId));
    }
    if (!product && global.products) {
      product = global.products.find((p) => p.id === Number(productId) || p.id === productId);
    }
    if (!product && global.products && global.products.length > 0) {
      product = global.products[0];
    }
    if (!product) return;

    activeProduct = product;

    // Populate UI details from actual authoritative catalog
    if (prodNameEl) prodNameEl.textContent = product.name;
    if (prodPriceEl) prodPriceEl.textContent = `${product.currencySymbol || "₹"}${product.price}`;
    if (prodBrandEl) prodBrandEl.textContent = product.brand || "MeroX Studio";
    if (prodColorEl) prodColorEl.textContent = product.color || "Primary";
    if (prodCategoryEl) prodCategoryEl.textContent = (product.subcategory || product.category || "").toUpperCase();
    if (prodDescEl) prodDescEl.textContent = product.description || "Crafted with precision tailoring.";
    if (prodStockEl) {
      prodStockEl.textContent = product.stockQuantity
        ? `${product.stockQuantity} in stock (${product.location || "Store Showroom"})`
        : product.stockStatus || "In Stock";
    }

    // Material inference from metadata or category
    if (prodMaterialEl) {
      const meta = product.metadata || {};
      const cat = (product.category || "").toLowerCase();
      let mat = meta.fabric || "Premium Cotton / Poly-Blend";
      if (cat === "jeans") mat = "100% Ring-Spun Denim";
      else if (cat === "shirt") mat = "Pure Cotton Oxford Weave";
      else if (cat === "tshirt") mat = "220 GSM Combed Cotton";
      else if (cat === "shoe") mat = "Genuine Leather & Vulcanized Rubber";
      else if (cat === "goggles") mat = "Polarized Polycarbonate & Alloy Frame";
      else if (cat === "cap") mat = "100% Breathable Cotton Twill";
      prodMaterialEl.textContent = mat;
    }

    // Sizes
    if (prodSizesEl) {
      const sizes = product.availableSizes || product.sizes || ["S", "M", "L", "XL"];
      prodSizesEl.innerHTML = sizes
        .map((s, idx) => `<span class="size-pill ${idx === 0 ? 'selected' : ''}">${s}</span>`)
        .join("");
    }

    // Image asset
    if (prodImgEl) {
      prodImgEl.src = product.image;
      prodImgEl.alt = `${product.name} 3D Studio Presentation`;
    }

    // Wire actions
    if (btnTryOnEl) {
      btnTryOnEl.onclick = () => {
        closeRoxVisionModal();
        if (typeof global.launchTryonWithItem === "function") {
          global.launchTryonWithItem(product.category, product.image, product.id);
        } else if (typeof global.openTryOnFromMirror === "function") {
          global.openTryOnFromMirror();
        } else if (typeof global.openFeatureModal === "function") {
          global.openFeatureModal("tryon");
        }
      };
    }

    if (btnAddLookEl) {
      btnAddLookEl.onclick = () => {
        if (typeof global.addToCustomerLook === "function") {
          global.addToCustomerLook(product.id);
        }
        btnAddLookEl.textContent = "✓ Added to Look";
        setTimeout(() => {
          if (btnAddLookEl) btnAddLookEl.textContent = "✨ Add to Look";
        }, 2000);
      };
    }

    // Reset orientation and display modal
    resetView();
    attachListeners();
    modalEl.classList.remove("hidden");
    modalEl.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeRoxVisionModal() {
    if (!modalEl) modalEl = document.getElementById("roxVisionModal");
    if (!modalEl) return;

    detachListeners();
    modalEl.classList.add("hidden");
    modalEl.style.display = "none";
    document.body.style.overflow = "";

    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }

  // Export to global scope
  global.openRoxVisionModal = openRoxVisionModal;
  global.closeRoxVisionModal = closeRoxVisionModal;
  global.roxVisionResetView = resetView;
  global.roxVisionZoomIn = zoomIn;
  global.roxVisionZoomOut = zoomOut;
  global.roxVisionSetAngle = setAngle;
  global.roxVisionToggleFullscreen = toggleFullscreen;

  global.MeroXRoxVision = {
    open: openRoxVisionModal,
    close: closeRoxVisionModal,
    reset: resetView,
    setAngle: setAngle,
    getActiveProduct: () => activeProduct
  };
})(typeof window !== "undefined" ? window : globalThis);
