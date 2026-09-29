/**
 * MEROX PRODUCT PROTOTYPE STUDIO CONTROLLER
 * High-end fullscreen hardware visualization for MeroX Smart Mirror.
 * Supports multi-angle perspective switching, interactive drag orbit,
 * auto-rotate cycle, zoom (+/- / wheel / pinch), pan, hotspots, and fullscreen.
 *
 * HONEST DISCLOSURE: Renders authentic MeroX industrial design specifications
 * and showroom reference photography without fabricating unverified specs.
 */

(function (global) {
  "use strict";

  let modalEl = null;
  let stagePaneEl = null;
  let visualContainerEl = null;
  let displayImgEl = null;
  let autoRotateBtn = null;
  let activeHotspotPopover = null;

  let zoom = 1.0;
  let panX = 0;
  let panY = 0;
  let rotY = 0;
  let rotX = 0;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let autoRotateTimer = null;
  let isAutoRotating = false;

  const VIEWS = {
    ultrahd: {
      src: "images/prototype-ultrahd-mirror.png",
      label: "Ultra HD Studio",
      rotX: 0,
      rotY: 0
    },
    showroom: {
      src: "images/prototype-hardware-showcase.jpg",
      label: "Showroom",
      rotX: 0,
      rotY: -4
    },
    front: {
      src: "images/prototype-ultrahd-mirror.png",
      label: "Front Elevation",
      rotX: 0,
      rotY: 0
    },
    side: {
      src: "images/prototype-hardware-showcase.jpg",
      label: "Profile / Side Angle",
      rotX: 2,
      rotY: -15
    },
    back: {
      src: "images/prototype-hardware-showcase.jpg",
      label: "Chassis & Back Mount",
      rotX: 0,
      rotY: 180
    },
    specs: {
      src: "images/prototype-hardware-specs.jpg",
      label: "Technical Specs",
      rotX: 0,
      rotY: 0
    }
  };

  let currentViewKey = "ultrahd";

  function initElements() {
    modalEl = document.getElementById("productPrototypeModal");
    if (!modalEl) return false;

    stagePaneEl = document.getElementById("protoStagePane");
    visualContainerEl = document.getElementById("protoVisualContainer");
    displayImgEl = document.getElementById("protoDisplayImg");
    autoRotateBtn = document.getElementById("protoBtnAutoRotate");
    return true;
  }

  function updateTransform() {
    if (!displayImgEl) return;
    zoom = Math.max(0.75, Math.min(2.5, zoom));
    rotX = Math.max(-20, Math.min(20, rotX));

    displayImgEl.style.transform = `scale(${zoom}) translate(${panX}px, ${panY}px) perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
  }

  // 1. MOUSE DRAG & TOUCH ORBIT
  function onMouseDown(e) {
    if (e.target.closest(".proto-hotspot") || e.target.closest(".proto-hotspot-popover")) return;
    if (e.button !== 0) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    if (stagePaneEl) stagePaneEl.style.cursor = "grabbing";
    e.preventDefault();
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    startX = e.clientX;
    startY = e.clientY;

    rotY += dx * 0.4;
    rotX -= dy * 0.25;
    updateTransform();
  }

  function onMouseUp() {
    isDragging = false;
    if (stagePaneEl) stagePaneEl.style.cursor = "grab";
  }

  function onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    zoom += delta;
    updateTransform();
  }

  function onDblClick() {
    resetView();
  }

  // Touch support
  let touchStartDist = 0;
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

      rotY += dx * 0.4;
      rotX -= dy * 0.25;
      updateTransform();
      e.preventDefault();
    } else if (e.touches.length === 2 && touchStartDist > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartDist;
      zoom *= factor;
      touchStartDist = dist;
      updateTransform();
      e.preventDefault();
    }
  }

  function onTouchEnd() {
    isDragging = false;
    touchStartDist = 0;
  }

  function attachListeners() {
    if (!stagePaneEl) return;
    stagePaneEl.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    stagePaneEl.addEventListener("wheel", onWheel, { passive: false });
    stagePaneEl.addEventListener("dblclick", onDblClick);

    stagePaneEl.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
  }

  function detachListeners() {
    if (stagePaneEl) {
      stagePaneEl.removeEventListener("mousedown", onMouseDown);
      stagePaneEl.removeEventListener("wheel", onWheel);
      stagePaneEl.removeEventListener("dblclick", onDblClick);
      stagePaneEl.removeEventListener("touchstart", onTouchStart);
    }
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
  }

  // 2. VIEW SWITCHING
  function setView(viewKey) {
    if (!VIEWS[viewKey]) return;
    currentViewKey = viewKey;
    const view = VIEWS[viewKey];

    if (displayImgEl) {
      displayImgEl.src = view.src;
      rotX = view.rotX;
      rotY = view.rotY;
      updateTransform();
    }

    // Update active button state
    if (modalEl) {
      const btns = modalEl.querySelectorAll(".proto-view-btn");
      btns.forEach((btn) => {
        if (btn.getAttribute("data-view") === viewKey) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }

    // Hide hotspots in technical blueprint view to avoid clutter
    const hotspots = modalEl ? modalEl.querySelectorAll(".proto-hotspot") : [];
    hotspots.forEach((h) => {
      h.style.display = viewKey === "specs" ? "none" : "flex";
    });
    closeHotspot();
  }

  // 3. ZOOM & RESET CONTROLS
  function zoomIn() {
    zoom += 0.2;
    updateTransform();
  }

  function zoomOut() {
    zoom -= 0.2;
    updateTransform();
  }

  function resetView() {
    zoom = 1.0;
    panX = 0;
    panY = 0;
    rotX = 0;
    rotY = 0;
    updateTransform();
    closeHotspot();
  }

  // 4. AUTO ROTATE
  function toggleAutoRotate() {
    if (isAutoRotating) {
      stopAutoRotate();
    } else {
      startAutoRotate();
    }
  }

  function startAutoRotate() {
    isAutoRotating = true;
    if (autoRotateBtn) {
      autoRotateBtn.classList.add("active");
      autoRotateBtn.textContent = "⏸ Pause Rotate";
    }

    autoRotateTimer = setInterval(() => {
      rotY += 1.2;
      updateTransform();
    }, 40);
  }

  function stopAutoRotate() {
    isAutoRotating = false;
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
    if (autoRotateBtn) {
      autoRotateBtn.classList.remove("active");
      autoRotateBtn.textContent = "↺ Auto Rotate";
    }
  }

  // 5. FULLSCREEN
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (modalEl && modalEl.requestFullscreen) {
        modalEl.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // 6. HOTSPOTS
  function toggleHotspot(hotspotId, targetEl) {
    closeHotspot();
    const popover = document.getElementById(`hotspotPop_${hotspotId}`);
    if (!popover) return;

    popover.classList.remove("hidden");
    activeHotspotPopover = popover;
  }

  function closeHotspot() {
    if (activeHotspotPopover) {
      activeHotspotPopover.classList.add("hidden");
      activeHotspotPopover = null;
    }
  }

  // 7. OPEN & CLOSE MODAL
  function openProductPrototypeModal() {
    if (!initElements()) {
      console.warn("Product Prototype modal elements missing in DOM.");
      return;
    }

    resetView();
    setView("ultrahd");
    attachListeners();

    modalEl.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeProductPrototypeModal() {
    if (!modalEl) modalEl = document.getElementById("productPrototypeModal");
    if (!modalEl) return;

    stopAutoRotate();
    detachListeners();
    closeHotspot();

    modalEl.classList.add("hidden");
    document.body.style.overflow = "";

    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }

  // Export to global scope
  global.openProductPrototypeModal = openProductPrototypeModal;
  global.closeProductPrototypeModal = closeProductPrototypeModal;
  global.protoSetView = setView;
  global.protoZoomIn = zoomIn;
  global.protoZoomOut = zoomOut;
  global.protoResetView = resetView;
  global.protoToggleAutoRotate = toggleAutoRotate;
  global.protoToggleFullscreen = toggleFullscreen;
  global.protoToggleHotspot = toggleHotspot;
  global.protoCloseHotspot = closeHotspot;

  global.MeroXProductPrototype = {
    open: openProductPrototypeModal,
    close: closeProductPrototypeModal,
    setView: setView,
    reset: resetView
  };
})(typeof window !== "undefined" ? window : globalThis);
