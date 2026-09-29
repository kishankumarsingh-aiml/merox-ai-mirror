/**
 * MeroX roX-AI Intelligence Engine (Phase 5 Production Edition)
 * Single authoritative AI service & orchestration layer for MeroX Smart Mirror.
 *
 * Architecture:
 * User Query -> Input Sanitizer & Intent Parser -> Context Layer (Active Page / Preferences)
 * -> Authoritative Product Catalog (products.js) -> Optional AI Provider (Gemini Flash)
 * -> Safe Fallback Engine (Offline Domain Expert) -> Sanitized Output Formatter -> User
 *
 * Security: 100% Zero hardcoded API keys. Optional user-supplied key stored locally in browser.
 * Privacy: Client-side execution. Zero user queries logged to external tracking.
 */

(function (global) {
  "use strict";

  const STORAGE_KEY = "merox_user_gemini_key";
  const LEGACY_STORAGE_KEY = "MEROX_GEMINI_API_KEY";

  let conversationHistory = [];

  /**
   * Safe HTML escaping to prevent XSS / script injection
   */
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatSafeText(raw) {
    if (!raw) return "";
    // Allow basic safe markdown formatting (**bold** -> <strong>, newlines -> <br>)
    const escaped = escapeHtml(raw);
    return escaped
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  }

  // ================= 1. DETERMINISTIC DOMAIN KNOWLEDGE BASE =================
  const KNOWLEDGE_BASE = [
    // 0A. FIND MY STYLE (PERSONAL STYLE ASSESSMENT)
    {
      keywords: ["find my style", "my style", "personal style", "style assessment", "discover style"],
      title: "MeroX Personal Style Discovery",
      reply: "Your personal style is shaped by silhouette harmony and occasion balance! In MeroX, we balance 3 core pillars:\n1. Structured Basics: Tailored Oxford shirts and clean tapered denim.\n2. Layering Dynamics: Pairing round-neck tees with open overshirts or lightweight blazers.\n3. Distinctive Accents: Classic metal aviators or minimalist monochrome caps.\nTell me your preferred daily vibe—Smart Casual, Streetwear, Minimalist, or Executive Formal?",
      productSuggestions: [6, 1, 21, 16], // Men Shirt, Cotton Pant, Aviator, Black Cap
      category: "shirt"
    },
    // 0B. COMPLETE MY LOOK
    {
      keywords: ["complete my look", "complete look", "match this look", "finish outfit"],
      title: "Complete Your Look Synergy",
      reply: "A complete look always balances upper, lower, footwear, and facial accents. If you are wearing casual denim or a solid t-shirt, elevate it instantly with contrasting sneakers and clean aviator shades. Tap any product in the store or use our Virtual Fitting Room to test live AR overlays!",
      productSuggestions: [21, 26, 16, 5], // Aviator, Running Shoes, Cap, Blue Jeans
      category: "goggles"
    },
    // 0C. TRY ANOTHER STYLE
    {
      keywords: ["try another style", "another style", "alternative style", "switch style", "different look"],
      title: "Alternative Style Aesthetic",
      reply: "Let's explore a fresh aesthetic! If you usually lean casual, try our Tailored Executive look with formal Oxford shoes and a slim-cut button down. Or switch to relaxed Streetwear with an oversized tee, vintage washed cap, and retro court sneakers.",
      productSuggestions: [12, 19, 28, 7], // Oversize tee, Vintage cap, Retro sneakers, Casual shirt
      category: "tshirt"
    },
    // 1. INTERVIEW & FORMAL DRESS
    {
      keywords: ["interview", "job interview", "formal", "office attire", "boardroom", "corporate"],
      title: "Corporate & Interview Styling",
      reply: "For interviews and corporate presentations, structured tailoring and clean lines project credibility. I recommend our Men Shirt (Formal) paired with Cotton Pants or Dark Denim, finished with polished Oxford Formal Shoes. Avoid loud accessories; crisp symmetry communicates executive poise.",
      productSuggestions: [6, 1, 29, 21], // Men Shirt, Cotton Pant, Formal Shoes, Aviator
      category: "shirt"
    },
    // 2. BLUE JEANS STYLING
    {
      keywords: ["blue jean", "blue jeans", "match blue jeans", "pair with blue jeans", "wear with jeans", "shirt goes with blue jeans"],
      title: "Blue Jeans Pairing Guide",
      reply: "Blue jeans are the ultimate style canvas! For smart-casual daytime, pair with a solid white Round-Neck Tee layered beneath a Checked Flannel Shirt and White Court Sneakers. For evening dinners, switch to our crisp Navy Casual Shirt or Slim Fit Shirt with loafers.",
      productSuggestions: [11, 8, 30, 7], // Round neck, Checked shirt, White shoes, Casual shirt
      category: "jeans"
    },
    // 3. PROFESSIONAL OUTFIT
    {
      keywords: ["suggest a professional outfit", "professional outfit", "business outfit", "formal outfit", "work outfit"],
      title: "Curated Executive Ensemble",
      reply: "Here is an executive ensemble curated directly from MeroX: Start with our Slim Fit Shirt in crisp white or pastel, paired with tailored Black Jeans or Cotton Trousers, finished with burnished Formal Oxford Shoes and classic metal Aviators.",
      productSuggestions: [9, 2, 29, 21], // Slim Fit Shirt, Black Jeans, Formal Shoes, Aviator
      category: "shirt"
    },
    // 4. BLACK GOGGLES & EYEWEAR
    {
      keywords: ["black goggles", "black shade", "wear with goggles", "pair goggles", "sunglasses outfit"],
      title: "Black Shades & Eyewear Styling",
      reply: "Black Shade goggles bring strong modern contrast! They look exceptional with monochrome minimalism: an Oversize Charcoal Tee or Black Cap, paired with distressed Ripped Jeans and clean white or retro sneakers.",
      productSuggestions: [25, 12, 4, 28], // Black Shade, Oversize Tee, Ripped Jeans, Sneakers
      category: "goggles"
    },
    // 5. BEGINNER FITNESS
    {
      keywords: ["beginner fitness", "fitness routine", "workout routine", "exercise routine", "gym plan", "start fitness", "how to workout"],
      title: "Foundational Beginner Fitness Plan",
      reply: "Start with full-body functional compound movements 3 days per week:\n• Squats: 3 sets of 8-10 reps\n• Push-ups: 3 sets of 8 reps\n• Bent-over Rows: 3 sets of 10 reps\n• Core Plank: 3 sets of 45 seconds\nPair this with 8,000 daily walking steps for steady metabolic and cardiovascular health.\n(Note: General fitness education only; consult a physician for medical exercise guidance).",
      productSuggestions: [26, 14, 17], // Running shoes, Sports tee, Sports cap
      category: "shoe"
    },
    // 6. BASIC SKINCARE
    {
      keywords: ["basic skincare", "skincare steps", "skincare routine", "skin steps", "morning skincare", "evening skincare", "skincare guide"],
      title: "Essential 4-Step Skincare Protocol",
      reply: "An effective daily skincare routine has 4 core pillars:\n1. Cleanse: Mild pH-balanced cleanser morning and night.\n2. Treat: Targeted serum (Niacinamide for pores/oil, Hyaluronic Acid for hydration).\n3. Moisturize: Lightweight barrier repair cream.\n4. Protect: Broad-spectrum SPF 50+ every morning rain or shine.\n(Disclaimer: General cosmetic skincare guidance only; does not diagnose medical conditions).",
      productSuggestions: [],
      category: "skin"
    },
    // 7. HAIRSTYLE BY FACE SHAPE
    {
      keywords: ["hairstyle", "haircut", "face shape", "hair suits me", "beard style"],
      title: "Facial Proportion & Hairstyle Rules",
      reply: "Great hair balances your natural facial geometry:\n• Round Faces: Choose high fades with volumetric textured quiffs or pompadours to add vertical height.\n• Square Faces: Soften chiseled jaws with classic side parts or textured French crops.\n• Oval Faces: Highly versatile—pompadour, buzz cut, or layered scissor flow.\n• Heart Faces: Opt for textured side fringes that balance the forehead.",
      productSuggestions: [16, 20, 21], // Black cap, Classic cap, Aviator
      category: "cap"
    },
    // 8. SNEAKERS & CASUAL FOOTWEAR
    {
      keywords: ["sneaker", "sneakers", "white shoes", "running shoes", "casual shoes", "recommend shoes"],
      title: "Footwear Recommendation",
      reply: "For daily versatile styling, you can never go wrong with clean all-white court sneakers—they elevate everything from denim to tailored chinos. For training, choose high-rebound responsive running shoes.",
      productSuggestions: [30, 28, 26], // White shoes, sneakers, running shoes
      category: "shoe"
    },
    // 9. T-SHIRTS & CASUAL TOPS
    {
      keywords: ["tshirt", "t-shirt", "tee", "casual top"],
      title: "T-Shirt Wardrobe Staples",
      reply: "Heavyweight combed cotton crewneck tees are the bedrock of modern street and casual style. Wear round-neck tees under blazers or overshirts, or wear an oversized boxy tee solo for effortless streetwear.",
      productSuggestions: [11, 12, 15], // Round neck, Oversize, Plain tee
      category: "tshirt"
    },
    // 10. YOGA & MOBILITY
    {
      keywords: ["yoga", "posture", "meditation", "flexibility", "stretching", "mobility"],
      title: "Guided Yoga & Mobility",
      reply: "Morning mobility sets the tone for your posture. Try starting with Mountain Pose (Tadasana) for grounding, followed by Warrior II and Child's Pose. Focus on diaphragmatic breathing and never force your joints past comfort.",
      productSuggestions: [],
      category: "yoga"
    },
    // 11. SMART MIRROR HUD
    {
      keywords: ["smart mirror", "mirror mode", "hud", "how does mirror work", "mirror features"],
      title: "MeroX Smart Mirror System",
      reply: "The MeroX Smart Mirror combines ambient high-contrast time and weather display with live camera tracking, daily outfit recommendations, and virtual accessory try-on. Tap 'Smart Mirror Demo' on your dashboard to experience the ambient HUD.",
      productSuggestions: [21, 16], // Aviator, Black cap
      category: "mirror"
    }
  ];

  // ================= 2. INTENT & PRICE PARSER =================
  function parsePriceAndCategory(query) {
    const q = query.toLowerCase();
    let maxPrice = null;
    let category = null;

    // Check price filter: "under 1000", "below 1500", "under ₹1000", "< 2000"
    const priceMatch = q.match(/(?:under|below|less than|within|max)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1], 10);
    }

    if (q.includes("shirt") && !q.includes("t-shirt") && !q.includes("tshirt")) category = "shirt";
    else if (q.includes("t-shirt") || q.includes("tshirt") || q.includes("tee")) category = "tshirt";
    else if (q.includes("jean") || q.includes("denim") || q.includes("pant")) category = "jeans";
    else if (q.includes("cap") || q.includes("hat")) category = "cap";
    else if (q.includes("goggle") || q.includes("shade") || q.includes("glass")) category = "goggles";
    else if (q.includes("shoe") || q.includes("sneaker") || q.includes("footwear")) category = "shoe";

    return { maxPrice, category };
  }

  // ================= 2b. OUTFIT & OCCASION INTENT PARSER (PHASE 6) =================
  function parseOutfitQuery(query) {
    const q = query.toLowerCase();
    const outfitKeywords = ["outfit", "attire", "ensemble", "wear", "look", "suit", "dress for", "style for", "recommendation", "recommend an outfit", "what should i wear"];
    const hasOutfitIntent = outfitKeywords.some((kw) => q.includes(kw));

    let occasion = null;
    if (q.includes("college") || q.includes("campus") || q.includes("university") || q.includes("lecture") || q.includes("student")) occasion = "college";
    else if (q.includes("interview") || q.includes("job") || q.includes("hire")) occasion = "interview";
    else if (q.includes("presentation") || q.includes("pitch") || q.includes("keynote") || q.includes("demo")) occasion = "presentation";
    else if (q.includes("meeting") || q.includes("boardroom") || q.includes("client")) occasion = "meeting";
    else if (q.includes("office") || q.includes("work") || q.includes("workday") || q.includes("business casual")) occasion = "office";
    else if (q.includes("formal") || q.includes("gala") || q.includes("evening") || q.includes("wedding")) occasion = "formal";
    else if (q.includes("party") || q.includes("club") || q.includes("night out") || q.includes("nightlife")) occasion = "party";
    else if (q.includes("casual") || q.includes("weekend") || q.includes("outing") || q.includes("daily")) occasion = "casual";

    if (!occasion && !hasOutfitIntent) {
      return null;
    }

    if (!occasion && hasOutfitIntent) {
      occasion = "interview";
    }

    let maxBudget = null;
    const priceMatch = q.match(/(?:under|below|less than|within|max|budget)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
    if (priceMatch) {
      maxBudget = parseInt(priceMatch[1], 10);
    }

    return { occasion, maxBudget };
  }

  // ================= 3. DETERMINISTIC OFFLINE REASONING ENGINE =================
  function processOfflineIntent(text, context = {}) {
    const q = text.toLowerCase().trim();

    // 0a. Controlled Retail Action Commands (Phase 10)
    if (q.includes("add to look") || q.includes("add to my look") || q.includes("add this to my look") || q.includes("add item to look")) {
      const activeProd = context.currentProduct;
      if (activeProd) {
        return {
          text: `Added **${activeProd.name}** (₹${activeProd.price.toLocaleString("en-IN")}) to your current shopping look!`,
          action: "ADD_TO_LOOK",
          productId: activeProd.id,
          products: [activeProd],
          source: "offline-expert"
        };
      }
    }

    if (q.includes("clear look") || q.includes("clear my look") || q.includes("reset look") || q.includes("reset my outfit")) {
      return {
        text: "Your current shopping look has been cleared. Ready to curate your next style combination!",
        action: "CLEAR_LOOK",
        products: [],
        source: "offline-expert"
      };
    }

    if (q.includes("try this on") || q.includes("try on live") || q.includes("fitting room")) {
      const activeProd = context.currentProduct;
      if (activeProd) {
        return {
          text: `Launching Virtual Fitting Room for **${activeProd.name}**...`,
          action: "TRY_ON_PRODUCT",
          productId: activeProd.id,
          products: [activeProd],
          source: "offline-expert"
        };
      }
    }

    if (q.includes("view in 3d") || q.includes("3d view") || q.includes("rox vision") || q.includes("see in 3d") || q.includes("visualize with rox vision") || q.includes("show in 3d")) {
      let targetProd = context.currentProduct;
      if (!targetProd && global.MeroXCatalog) {
        const allProds = global.MeroXCatalog.getAll();
        targetProd = allProds.find(p => q.includes(p.name.toLowerCase()) || q.includes((p.category || '').toLowerCase()));
        if (!targetProd) targetProd = global.MeroXCatalog.getById(1);
      }
      if (targetProd) {
        return {
          text: `Opening **roX Vision 3D Studio** for **${targetProd.name}**... You can rotate the garment, inspect fabric weave, and test dynamic lighting angles in real-time!`,
          action: "VIEW_IN_3D",
          productId: targetProd.id,
          products: [targetProd],
          source: "offline-expert"
        };
      }
    }

    if (q.includes("product prototype") || q.includes("hardware prototype") || q.includes("smart mirror hardware") || q.includes("mirror hardware") || q.includes("hardware") || q.includes("explore prototype")) {
      return {
        text: "Launching **MeroX Product Prototype Studio**... You can inspect the physical 180cm Smart Mirror hardware, 4K dielectric mirror display, AI camera with blue halo ring, interactive hotspots, and multi-angle views in full studio presentation.",
        action: "OPEN_PRODUCT_PROTOTYPE",
        products: [],
        source: "offline-expert"
      };
    }

    // 0b. Contextual item inquiries ("What goes with this?", "What matches this?", "Tell me about this")
    if (context && context.currentProduct && (
      q.includes("goes with this") || q.includes("matches this") || q.includes("match with this") ||
      q.includes("pair with this") || q.includes("style this") || q.includes("about this") ||
      q.includes("tell me about") || q.includes("how does this look") || q.includes("wear with this")
    )) {
      const p = context.currentProduct;
      let pairings = [];
      let advice = "";

      if (global.MeroXCatalog) {
        if (p.category === "jeans") {
          pairings = [global.MeroXCatalog.getById(6), global.MeroXCatalog.getById(11), global.MeroXCatalog.getById(30), global.MeroXCatalog.getById(21)].filter(Boolean);
          advice = `The **${p.name}** (${p.color}) are exceptionally versatile! For a smart casual appearance, layer with our Men Shirt (₹899) and White Court Sneakers (₹1,699). For streetwear ease, opt for our Round Neck Tee (₹499) and Aviators.`;
        } else if (p.category === "shirt") {
          pairings = [global.MeroXCatalog.getById(1), global.MeroXCatalog.getById(29), global.MeroXCatalog.getById(21)].filter(Boolean);
          advice = `The **${p.name}** brings structured elegance. Balance it with Blue Jeans (₹1,499) or Cotton Chinos, finished with Handcrafted Oxford Shoes (₹2,199) and Gold Aviators (₹699).`;
        } else if (p.category === "tshirt") {
          pairings = [global.MeroXCatalog.getById(4), global.MeroXCatalog.getById(16), global.MeroXCatalog.getById(28)].filter(Boolean);
          advice = `For an effortless modern street profile, pair the **${p.name}** with Distressed Ripped Jeans (₹1,699), our Black 6-Panel Cap (₹299), and Retro Chunky Sneakers (₹1,899).`;
        } else if (p.category === "cap") {
          pairings = [global.MeroXCatalog.getById(11), global.MeroXCatalog.getById(21), global.MeroXCatalog.getById(28)].filter(Boolean);
          advice = `The **${p.name}** anchors sporty and casual aesthetics. Pair with an essential Round Neck Tee and Aviator shades for sunny outdoor days.`;
        } else if (p.category === "goggles") {
          pairings = [global.MeroXCatalog.getById(9), global.MeroXCatalog.getById(2), global.MeroXCatalog.getById(30)].filter(Boolean);
          advice = `The **${p.name}** framed shades create an iconic silhouette. Pair with our Slim Fit Shirt and Jet Black Jeans for an assertive modern ensemble.`;
        } else if (p.category === "shoe") {
          pairings = [global.MeroXCatalog.getById(3), global.MeroXCatalog.getById(8), global.MeroXCatalog.getById(16)].filter(Boolean);
          advice = `The **${p.name}** provides the foundation of your silhouette. Match with Slim Fit Jeans and a Brushed Flannel Checked Shirt for balanced proportions.`;
        }
      }

      const meta = p.metadata || {};
      const fitNote = meta.fit ? `\n• **Fit:** ${meta.fit}` : "";
      const fabricNote = meta.fabric ? `\n• **Fabric:** ${meta.fabric}` : "";
      const stockNote = p.stockQuantity ? `\n• **Store Inventory:** ${p.stockQuantity} units available at ${p.location || 'Floor 2'}` : "";

      return {
        text: `**Styling Guide for ${p.name} (SKU: ${p.sku})**\n\n${advice}${fitNote}${fabricNote}${stockNote}`,
        products: pairings,
        source: "offline-expert"
      };
    }

    // 1. Check for fashion outfit recommendation intent (Phase 6)
    const outfitQuery = parseOutfitQuery(q);
    const engine = global.MeroXFashionRecommendationEngine || (global.MeroXModules && global.MeroXModules.FashionRecommendationEngine);
    if (outfitQuery && engine) {
      const rec = engine.recommend({ occasion: outfitQuery.occasion, maxBudget: outfitQuery.maxBudget });
      if (rec && rec.items && rec.items.length > 0) {
        const textResp = `**${rec.title}** (${rec.colorHarmony})\n\n${rec.stylingRationale}\n\n• **Total Outfit Price:** ${rec.totalPriceFormatted}\n• **Budget Status:** ${rec.budgetNote}`;
        return {
          text: textResp,
          products: rec.items,
          source: "offline-expert"
        };
      }
    }

    // 2. Check for specific price / budget query
    const { maxPrice, category } = parsePriceAndCategory(q);
    if (global.MeroXCatalog && (maxPrice !== null || category !== null)) {
      let filtered = global.MeroXCatalog.getAll();
      if (category) {
        filtered = filtered.filter((p) => p.category === category);
      }
      if (maxPrice !== null) {
        filtered = filtered.filter((p) => p.price <= maxPrice);
      }

      if (filtered.length > 0) {
        const catLabel = category ? `${category}s` : "items";
        const priceLabel = maxPrice ? ` under ₹${maxPrice.toLocaleString("en-IN")}` : "";
        return {
          text: `Here are real verified MeroX ${catLabel}${priceLabel} from our catalog:`,
          products: filtered.slice(0, 4),
          source: "offline-expert"
        };
      } else if (category && maxPrice) {
        return {
          text: `We currently don't have ${category}s priced below ₹${maxPrice}. The most affordable ${category} in our collection starts at ₹${Math.min(...global.MeroXCatalog.getByCategory(category).map(p => p.price))}.`,
          products: global.MeroXCatalog.getByCategory(category).slice(0, 2),
          source: "offline-expert"
        };
      }
    }

    // 2. Check knowledge base hits
    let bestMatch = null;
    let maxHits = 0;

    for (const item of KNOWLEDGE_BASE) {
      let hits = 0;
      for (const kw of item.keywords) {
        if (q.includes(kw)) {
          hits += kw.length;
        }
      }
      if (hits > maxHits) {
        maxHits = hits;
        bestMatch = item;
      }
    }

    if (bestMatch && maxHits > 0) {
      let products = [];
      if (global.MeroXCatalog && bestMatch.productSuggestions.length > 0) {
        products = bestMatch.productSuggestions
          .map((id) => global.MeroXCatalog.getById(id))
          .filter(Boolean);
      }
      return {
        text: bestMatch.reply,
        products: products,
        source: "offline-expert"
      };
    }

    // 3. Direct catalog keyword search
    if (global.MeroXCatalog) {
      const searchRes = global.MeroXCatalog.search(q);
      if (searchRes.length > 0) {
        return {
          text: `I located ${searchRes.length} item${searchRes.length === 1 ? "" : "s"} matching "${text}" in the MeroX catalog:`,
          products: searchRes.slice(0, 3),
          source: "offline-expert"
        };
      }
    }

    // 4. Transparent out-of-domain fallback
    return {
      text: "I am roX-AI, your personal MeroX style and mirror companion. I can help you find products in our catalog (e.g. 'find shirts under ₹1000', 'show blue jeans'), suggest interview outfits, recommend hairstyles for your face shape, or guide your skincare steps. How can I assist with your styling today?",
      products: global.MeroXCatalog ? global.MeroXCatalog.getRecommended().slice(0, 3) : [],
      source: "fallback"
    };
  }

  // Alias for backward compatibility
  const processOfflineQuery = processOfflineIntent;

  // ================= 4. OPTIONAL GENERATIVE AI BRIDGE =================
  async function queryGeminiApi(userText, apiKey, context = {}) {
    const cleanKey = apiKey.trim();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cleanKey}`;
    
    // Provide catalog context to prevent hallucinating fake products
    const availableItems = global.MeroXCatalog 
      ? global.MeroXCatalog.getAll().map(p => `${p.name} (₹${p.price}, ${p.category})`).join(", ")
      : "";

    const systemPrompt = 
      "You are roX-AI, the official Personal Stylist & Smart Mirror AI inside MeroX. " +
      "Guidelines: " +
      "1. Provide encouraging, concise, practical fashion, grooming, hairstyle, skincare, and fitness advice (2-4 sentences max). " +
      "2. When suggesting clothes, choose only from the official MeroX catalog: [" + availableItems + "]. Never invent fake products or prices. " +
      "3. Never give medical diagnoses or treatment advice. " +
      "4. Maintain a sharp, sophisticated, confident persona.";

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${userText}` }]
        }
      ]
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API response status: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  }

  // ================= 5. MASTER ORCHESTRATION LAYER =================
  async function sendMessage(userText, context = {}) {
    const raw = (userText || "").trim();
    if (!raw) {
      return {
        text: "Please type a style, product, or mirror question to consult roX-AI.",
        products: [],
        source: "offline-expert"
      };
    }

    // Safety: limit query length to 800 characters
    const text = raw.slice(0, 800);

    // Retrieve voluntarily configured Gemini key
    let userKey = "";
    try {
      if (typeof localStorage !== "undefined") {
        userKey = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY) || "";
      }
    } catch (e) {}

    // If key is present, attempt generative model with automated fallback
    if (userKey && userKey.trim().length > 15) {
      try {
        const aiText = await queryGeminiApi(text, userKey, context);
        if (aiText && aiText.trim()) {
          let attachedProducts = [];
          if (global.MeroXCatalog) {
            // Find any catalog products mentioned in the response
            const all = global.MeroXCatalog.getAll();
            attachedProducts = all.filter(p => aiText.toLowerCase().includes(p.name.toLowerCase())).slice(0, 3);
            if (attachedProducts.length === 0) {
              attachedProducts = global.MeroXCatalog.search(text).slice(0, 3);
            }
          }

          const result = {
            text: aiText.trim(),
            reply: aiText.trim(),
            products: attachedProducts,
            source: "gemini-model"
          };
          conversationHistory.push({ role: "user", text }, { role: "assistant", ...result });
          return result;
        }
      } catch (err) {
        console.warn("roX-AI: External AI provider unavailable or timed out. Gracefully switching to offline expert engine:", err);
      }
    }

    // Authoritative fallback: Deterministic offline expert engine
    const offlineResult = processOfflineIntent(text, context);
    offlineResult.reply = offlineResult.text; // Ensure both .text and .reply exist
    conversationHistory.push({ role: "user", text }, { role: "assistant", ...offlineResult });
    return offlineResult;
  }

  // Export authoritative roX-AI service
  const MeroXRoxAIService = {
    sendMessage: sendMessage,
    ask: sendMessage, // Backward compatibility
    getHistory: () => [...conversationHistory],
    clearHistory: () => {
      conversationHistory = [];
    },
    hasCustomKey: () => {
      try {
        const k = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
        return Boolean(k && k.trim());
      } catch (e) {
        return false;
      }
    },
    setCustomKey: (k) => {
      try {
        if (k && k.trim()) {
          localStorage.setItem(STORAGE_KEY, k.trim());
          localStorage.setItem(LEGACY_STORAGE_KEY, k.trim());
        } else {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(LEGACY_STORAGE_KEY);
        }
      } catch (e) {}
    }
  };

  global.MeroXRoxAI = MeroXRoxAIService;
  global.RoxAi = MeroXRoxAIService;
})(typeof window !== "undefined" ? window : globalThis);