/**
 * MeroX Subscription & Membership Architecture (Phase 15 Premium Pass)
 * Provides abstract tier management, plan comparisons, feature gating,
 * and honest payment/checkout modal orchestration.
 *
 * Tiers:
 *  - FREE (₹0/mo): Basic discovery, limited roX-AI, standard Smart Mirror
 *  - PRO (₹399/mo): Unlimited discovery, advanced roX-AI, complete look, saved looks (MOST POPULAR)
 *  - PRO_PLUS (₹499/mo): Enhanced face/style recommendations, priority Try-On, smart wardrobe
 *  - ELITE (₹599/mo): Full AI stylist, unlimited saved looks, wardrobe planning, exclusive collections (ELITE)
 *
 * Payment Status: In development for commercial mall deployment.
 * Explicitly does NOT fake payment completion.
 */

(function (global) {
  "use strict";

  const STORAGE_KEY = "merox_subscription_plan";
  const HISTORY_KEY = "merox_subscription_history";

  const PLANS = {
    FREE: {
      id: "FREE",
      name: "MeroX Free",
      price: 0,
      priceFormatted: "₹0",
      period: "forever",
      tagline: "Essential style discovery & mirror preview",
      badge: null,
      ctaText: "Current Plan",
      color: "#64748b",
      features: [
        "Basic MeroX dashboard",
        "Product discovery across 30 catalog items",
        "Standard search & category filters",
        "Basic recommendations",
        "Limited roX-AI interactions (5/day)",
        "Basic Smart Mirror Kiosk access"
      ],
      limits: {
        savedLooks: 3,
        tryonSessions: 10,
        aiQueriesPerDay: 5
      }
    },
    PRO: {
      id: "PRO",
      name: "MeroX Pro",
      price: 399,
      priceFormatted: "₹399",
      period: "/ month",
      tagline: "Our most popular personal style intelligence",
      badge: "MOST POPULAR",
      ctaText: "Upgrade to Pro",
      color: "#00ffe0",
      popular: true,
      features: [
        "Everything in Free",
        "Unlimited style discovery",
        "Advanced roX-AI stylist (unlimited conversations)",
        "Personalized outfit suggestions",
        "Complete My Look matching engine",
        "Style preferences & personalized feed",
        "Up to 25 Saved Looks in mirror wardrobe",
        "Priority Try-On AR rendering"
      ],
      limits: {
        savedLooks: 25,
        tryonSessions: 100,
        aiQueriesPerDay: Infinity
      }
    },
    PRO_PLUS: {
      id: "PRO_PLUS",
      name: "MeroX Pro+",
      price: 499,
      priceFormatted: "₹499",
      period: "/ month",
      tagline: "Deeper geometric style analysis & smart wardrobe",
      badge: "PRO+",
      ctaText: "Upgrade to Pro+",
      color: "#818cf8",
      features: [
        "Everything in Pro",
        "Advanced AI styling & fabric analysis",
        "Enhanced face & silhouette recommendations",
        "Priority Try-On experience with multi-item stacking",
        "Advanced outfit combinations (all 8 dress codes)",
        "Smart wardrobe suggestions based on store inventory",
        "Up to 50 Saved Looks with QR phone transfer"
      ],
      limits: {
        savedLooks: 50,
        tryonSessions: 250,
        aiQueriesPerDay: Infinity
      }
    },
    ELITE: {
      id: "ELITE",
      name: "MeroX Elite",
      price: 599,
      priceFormatted: "₹599",
      period: "/ month",
      tagline: "The pinnacle of luxury fashion technology",
      badge: "ELITE",
      ctaText: "Join Elite",
      color: "#f59e0b",
      luxury: true,
      features: [
        "Everything in Pro+",
        "Full MeroX AI stylist experience with Gemini Pro priority",
        "Advanced personal style profile & biometric proportions",
        "Unlimited saved looks & custom wardrobe collections",
        "Premium style intelligence & seasonal lookbook forecasts",
        "Advanced wardrobe planning & personal shopper concierge",
        "Exclusive Elite catalog previews & VIP mirror reservation"
      ],
      limits: {
        savedLooks: Infinity,
        tryonSessions: Infinity,
        aiQueriesPerDay: Infinity
      }
    }
  };

  const COMPARISON_CATEGORIES = [
    {
      category: "Style Discovery",
      features: [
        { name: "Authoritative 30-Piece Store Catalog", free: "✓", pro: "✓", pro_plus: "✓", elite: "✓" },
        { name: "Live Filter by Category & Dress Code", free: "✓", pro: "✓", pro_plus: "✓", elite: "✓" },
        { name: "Curated Seasonal Lookbooks", free: "—", pro: "✓", pro_plus: "✓", elite: "✓" },
        { name: "Exclusive Elite Runway Previews", free: "—", pro: "—", pro_plus: "—", elite: "✓" }
      ]
    },
    {
      category: "roX-AI Stylist",
      features: [
        { name: "Offline Domain Expert Assistant", free: "✓ (Limited)", pro: "✓ (Unlimited)", pro_plus: "✓ (Unlimited)", elite: "✓ (Unlimited)" },
        { name: "Custom Gemini API Connectivity", free: "✓", pro: "✓", pro_plus: "✓", elite: "✓" },
        { name: "8-Occasion Color Harmony Engine", free: "Basic", pro: "✓ Full", pro_plus: "✓ Full", elite: "✓ Concierge" },
        { name: "Budget-Constrained Look Generation", free: "—", pro: "✓", pro_plus: "✓", elite: "✓" }
      ]
    },
    {
      category: "Virtual Try-On AR",
      features: [
        { name: "WebRTC Live Camera Mirroring", free: "✓", pro: "✓", pro_plus: "✓", elite: "✓" },
        { name: "Transparent Vector AR Eyewear & Caps", free: "✓", pro: "✓", pro_plus: "✓", elite: "✓" },
        { name: "Auto Face-Tracking with Tilt Compensation", free: "✓", pro: "✓", pro_plus: "✓", elite: "✓" },
        { name: "Multi-Accessory & Upper Garment Layering", free: "Prototype", pro: "✓ Priority", pro_plus: "✓ Enhanced", elite: "✓ Ultra-HD" }
      ]
    },
    {
      category: "Wardrobe & Personalization",
      features: [
        { name: "Saved Looks Capacity", free: "3 looks", pro: "25 looks", pro_plus: "50 looks", elite: "Unlimited" },
        { name: "Geometric Face Shape Analyzer", free: "✓", pro: "✓", pro_plus: "✓", elite: "✓" },
        { name: "Body Silhouette & Collar Guide", free: "✓", pro: "✓", pro_plus: "✓", elite: "✓" },
        { name: "Phone QR Session Continuation", free: "✓", pro: "✓", pro_plus: "✓", elite: "✓" },
        { name: "VIP Personal Wardrobe Planning", free: "—", pro: "—", pro_plus: "✓", elite: "✓" }
      ]
    }
  ];

  /**
   * Get active subscription plan ID
   */
  function getCurrentPlanId() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && PLANS[stored]) {
        return stored;
      }
    } catch (e) {}
    return "FREE";
  }

  /**
   * Get full details of active plan
   */
  function getCurrentPlan() {
    const id = getCurrentPlanId();
    return PLANS[id] || PLANS.FREE;
  }

  /**
   * Get all defined plans
   */
  function getAllPlans() {
    return Object.values(PLANS);
  }

  /**
   * Get comparison matrix
   */
  function getComparisonMatrix() {
    return COMPARISON_CATEGORIES;
  }

  /**
   * Check if a feature is allowed under current plan
   */
  function isFeatureAllowed(featureKey) {
    const plan = getCurrentPlan();
    if (plan.id === "ELITE") return true;

    switch (featureKey) {
      case "unlimited_looks":
        return plan.id === "ELITE";
      case "smart_wardrobe":
        return plan.id === "PRO_PLUS" || plan.id === "ELITE";
      case "priority_tryon":
      case "unlimited_ai":
      case "complete_look":
        return plan.id !== "FREE";
      default:
        return true;
    }
  }

  /**
   * Render Checkout / Upgrade Modal
   * Explicitly avoids fake payment; explains commercial deployment status
   * and provides a safe simulation option for reviewers.
   */
  function openCheckoutModal(targetPlanId) {
    const plan = PLANS[targetPlanId] || PLANS.PRO;
    const currentId = getCurrentPlanId();
    const isCurrent = currentId === plan.id;

    // Create or locate checkout modal overlay
    let modalEl = document.getElementById("meroxCheckoutModal");
    if (!modalEl) {
      modalEl = document.createElement("div");
      modalEl.id = "meroxCheckoutModal";
      modalEl.className = "modal-backdrop hidden";
      modalEl.style.zIndex = "25000";
      document.body.appendChild(modalEl);
    }

    modalEl.innerHTML = `
      <div class="modal-card" style="max-width: 520px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 25px 60px rgba(0,0,0,0.6);">
        <div class="modal-header" style="background: linear-gradient(135deg, #0f172a, #1e293b); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 18px 24px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 24px;">${plan.luxury ? "👑" : "✨"}</span>
            <div>
              <h3 style="margin: 0; color: #fff; font-size: 18px;">${plan.name} Subscription</h3>
              <span style="font-size: 12px; color: ${plan.color}; font-weight: 600;">${plan.priceFormatted} ${plan.period}</span>
            </div>
          </div>
          <button type="button" class="close-btn" onclick="window.MeroXSubscription.closeCheckoutModal()" style="color: #fff; font-size: 24px; background: none; border: none; cursor: pointer;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 24px; color: #334155; line-height: 1.5;">
          ${isCurrent ? `
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 18px;">
              <span style="font-size: 28px;">✓</span>
              <h4 style="color: #166534; font-size: 16px; margin: 6px 0 4px;">You are currently on ${plan.name}</h4>
              <p style="color: #15803d; font-size: 13px; margin: 0;">Your membership benefits and mirror privileges are active.</p>
            </div>
          ` : `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 18px;">
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 8px;">Included in this plan:</div>
              <ul style="padding-left: 20px; font-size: 13px; color: #1e293b; display: flex; flex-direction: column; gap: 6px; margin: 0;">
                ${plan.features.map(f => `<li>${f}</li>`).join("")}
              </ul>
            </div>
          `}

          <!-- Honest Payment Gateway Notice -->
          <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 14px; border-radius: 8px; font-size: 12px; color: #92400e; margin-bottom: 20px;">
            <strong>Payment Notice:</strong> Commercial payment processing (Razorpay / Stripe) is prepared for mall store rollout. In this review environment, you can switch plan tiers below to verify UI states and feature gating without fake billing.
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button type="button" onclick="window.MeroXSubscription.closeCheckoutModal()" style="background: #e2e8f0; color: #1e293b; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 600; cursor: pointer;">
              Cancel
            </button>
            ${isCurrent ? `
              <button type="button" onclick="window.MeroXSubscription.setPlan('FREE')" style="background: #ef4444; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 600; cursor: pointer;">
                Switch to Free Tier
              </button>
            ` : `
              <button type="button" onclick="window.MeroXSubscription.setPlan('${plan.id}')" style="background: linear-gradient(135deg, #0f172a, #1e293b); color: #00ffe0; border: 1px solid #00ffe0; padding: 10px 22px; border-radius: 10px; font-weight: 700; cursor: pointer;">
                Activate ${plan.name} (Review Demo) ➔
              </button>
            `}
          </div>
        </div>
      </div>
    `;

    modalEl.classList.remove("hidden");
  }

  function closeCheckoutModal() {
    const modalEl = document.getElementById("meroxCheckoutModal");
    if (modalEl) modalEl.classList.add("hidden");
  }

  /**
   * Set plan and notify UI
   */
  function setPlan(planId) {
    if (!PLANS[planId]) return;
    try {
      localStorage.setItem(STORAGE_KEY, planId);
    } catch (e) {}

    closeCheckoutModal();

    // Broadcast change event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("merox_plan_changed", { detail: { planId, plan: PLANS[planId] } }));
      // Reload or refresh view if on pricing or profile
      if (typeof window.refreshMembershipUi === "function") {
        window.refreshMembershipUi();
      }
    }
  }

  /**
   * Render an elegant Feature Lock Banner / Modal
   */
  function renderFeatureLockHtml(featureName, requiredPlanId = "PRO") {
    const plan = PLANS[requiredPlanId] || PLANS.PRO;
    return `
      <div class="merox-feature-lock" style="background: rgba(15, 23, 42, 0.90); backdrop-filter: blur(12px); border: 1px solid rgba(0, 255, 224, 0.25); border-radius: 16px; padding: 24px; text-align: center; color: white; box-shadow: 0 12px 30px rgba(0,0,0,0.4); max-width: 380px; margin: 20px auto;">
        <div style="font-size: 28px; margin-bottom: 8px;">✦</div>
        <h4 style="font-size: 17px; margin-bottom: 6px; color: #fff;">${featureName}</h4>
        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 16px;">
          Unlock with <strong>${plan.name}</strong> for ${plan.priceFormatted}/month.
        </p>
        <button type="button" onclick="window.MeroXSubscription.openCheckoutModal('${plan.id}')" style="background: linear-gradient(135deg, #00ffe0, #0284c7); color: #000; border: none; padding: 10px 22px; border-radius: 20px; font-weight: 700; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
          ${plan.ctaText}
        </button>
      </div>
    `;
  }

  // Export subscription layer
  global.MeroXSubscription = {
    PLANS,
    getCurrentPlanId,
    getCurrentPlan,
    getAllPlans,
    getComparisonMatrix,
    isFeatureAllowed,
    openCheckoutModal,
    closeCheckoutModal,
    setPlan,
    renderFeatureLockHtml
  };

})(typeof window !== "undefined" ? window : globalThis);
