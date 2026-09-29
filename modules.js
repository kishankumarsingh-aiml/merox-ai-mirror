/**
 * MeroX Interactive Feature Modules (Phase 3 Production Edition)
 * Implements Skincare, Fitness/BMI, Yoga, Hairstyle Face Geometry Analyzer,
 * Best Cloth Silhouettes, Dynamic Professional Outfits Recommender, and Wishlist Manager.
 * All modules consume the authoritative window.MeroXCatalog single source of truth.
 */

(function (global) {
  "use strict";

  // ================= 1. COSMETIC SKINCARE MODULE =================
  const SkincareModule = {
    DISCLAIMER: "⚠️ General cosmetic skincare guidance only. This does not diagnose medical conditions or substitute for professional dermatological care.",

    profiles: {
      oily: {
        title: "Oily & Sebum-Prone Skin Profile",
        desc: "Characterized by excess sebum production, enlarged pores, and midday shine across forehead, nose, and chin.",
        am: [
          { step: "Cleanse", product: "Salicylic Acid (BHA 0.5-2%) or gentle foaming gel cleanser", purpose: "Clears excess overnight sebum without stripping" },
          { step: "Tone / Treat", product: "Niacinamide 10% + Zinc 1% serum", purpose: "Regulates sebum synthesis and minimizes pore appearance" },
          { step: "Moisturize", product: "Oil-free mattifying water-gel moisturizer", purpose: "Hydrates without occlusive pore congestion" },
          { step: "Protect", product: "Broad-Spectrum SPF 50+ ultralight fluid sunscreen", purpose: "Protects against UV-induced oxidative stress" }
        ],
        pm: [
          { step: "First Cleanse", product: "Micellar water or light cleansing oil", purpose: "Breaks down SPF, pollutants, and sebum" },
          { step: "Second Cleanse", product: "Gentle balancing foaming wash", purpose: "Deep water-based pore purification" },
          { step: "Exfoliate / Treat", product: "Leave-on 2% BHA Salicylic liquid (2-3x weekly)", purpose: "Clears deep follicular lining" },
          { step: "Barrier Repair", product: "Ceramide & Centella light emulsion", purpose: "Fortifies stratum corneum overnight" }
        ],
        ingredientsToSeek: ["Salicylic Acid (BHA)", "Niacinamide", "Zinc PCA", "Green Tea Extract", "Hyaluronic Acid"],
        ingredientsToAvoid: ["Heavy mineral oils", "Coconut oil", "High concentrations of denatured alcohol", "Abrasive walnut scrubs"],
        lifestyleTip: "Blot gently with oil-absorbing sheets mid-day instead of repeatedly washing with harsh soaps."
      },
      dry: {
        title: "Dry & Dehydrated Skin Profile",
        desc: "Characterized by tight sensations, low moisture retention, flaking, and diminished natural elasticity.",
        am: [
          { step: "Cleanse", product: "Cream / milk cleanser or lukewarm water splash", purpose: "Preserves natural lipid mantle" },
          { step: "Hydrate", product: "Multi-molecular Hyaluronic Acid serum on damp skin", purpose: "Draws atmospheric moisture into epidermis" },
          { step: "Moisturize", product: "Ceramide, Squalane, and Shea-enriched cream", purpose: "Locks in hydration and repairs lipid matrix" },
          { step: "Protect", product: "Nourishing dewy SPF 50+ chemical/mineral sunscreen", purpose: "Prevents UV dehydration" }
        ],
        pm: [
          { step: "First Cleanse", product: "Nourishing cleansing balm", purpose: "Melts sunscreen smoothly without friction" },
          { step: "Second Cleanse", product: "Gentle hydrating cream cleanser", purpose: "Rinses clean while infusing glycerin" },
          { step: "Nourish", product: "100% Plant-derived Squalane or Rosehip oil", purpose: "Supplements essential fatty acids" },
          { step: "Overnight Barrier", product: "Rich peptide recovery barrier cream", purpose: "Seals moisture during nocturnal repair" }
        ],
        ingredientsToSeek: ["Ceramides (1, 3, 6-II)", "Glycerin", "Hyaluronic Acid", "Squalane", "Colloidal Oatmeal"],
        ingredientsToAvoid: ["High sulfates (SLS/SLES)", "Astringent witch hazel with alcohol", "High fragrance concentrations"],
        lifestyleTip: "Apply moisturizer within 60 seconds of washing while your face is still damp to seal humectants."
      },
      combination: {
        title: "Combination Skin Profile",
        desc: "Characterized by an oily T-zone (forehead, nose, chin) paired with balanced or dry cheeks.",
        am: [
          { step: "Cleanse", product: "pH-balanced gentle gel-to-foam cleanser", purpose: "Cleanses T-zone without overdrying cheeks" },
          { step: "Targeted Serum", product: "Niacinamide 5% serum focused on T-zone", purpose: "Balances uneven oil distribution" },
          { step: "Moisturize", product: "Dual-texture water cream or lightweight lotion", purpose: "Even, weightless hydration" },
          { step: "Protect", product: "Invisible finish broad-spectrum SPF 50", purpose: "Non-greasy sun defense" }
        ],
        pm: [
          { step: "First Cleanse", product: "Gentle micellar water cleanse", purpose: "Removes daily grime and SPF" },
          { step: "Second Cleanse", product: "Gentle balancing foaming cleanser", purpose: "Purifies congested areas" },
          { step: "Treat", product: "AHA/BHA clarifying toner 2x weekly on T-zone only", purpose: "Smooths texture selectively" },
          { step: "Moisturize", product: "Ceramide lotion on cheeks, lighter gel on nose/forehead", purpose: "Targeted zonal hydration" }
        ],
        ingredientsToSeek: ["Niacinamide", "Centella Asiatica", "Lactic Acid", "Panthenol (B5)", "Sodium Hyaluronate"],
        ingredientsToAvoid: ["One-size-fits-all heavy ointments across entire face"],
        lifestyleTip: "Zone-treat your skin: apply richer hydrating products on your outer cheeks and lighter textures down the center."
      },
      sensitive: {
        title: "Sensitive & Reactive Skin Profile",
        desc: "Easily irritated, prone to flushing, stinging, and reactive barrier compromise.",
        am: [
          { step: "Cleanse", product: "Ultra-gentle non-foaming lotion cleanser", purpose: "Zero-irritation gentle cleansing" },
          { step: "Soothe", product: "Centella Asiatica (Cica) or Panthenol 5% serum", purpose: "Calms redness and strengthens micro-barrier" },
          { step: "Moisturize", product: "Fragrance-free barrier relief cream with oat extract", purpose: "Relieves tightness and prevents water loss" },
          { step: "Protect", product: "100% Mineral Zinc Oxide SPF 50+ sunscreen", purpose: "Gentle physical barrier that reflects UV rays" }
        ],
        pm: [
          { step: "First Cleanse", product: "Mild non-fragranced cleansing oil", purpose: "Breaks down sunscreen with minimal rubbing" },
          { step: "Second Cleanse", product: "Lukewarm water rinse with soothing cleanser", purpose: "Clears residue without temperature shock" },
          { step: "Recover", product: "Pure Madecassoside or Allantoin calming ampoule", purpose: "Intensive soothing" },
          { step: "Protect", product: "Hypoallergenic lipid restoration balm", purpose: "Provides protective moisture cocoon" }
        ],
        ingredientsToSeek: ["Centella Asiatica", "Madecassoside", "Colloidal Oatmeal", "Allantoin", "Zinc Oxide"],
        ingredientsToAvoid: ["Synthetic fragrance", "Essential oils (lavender, citrus)", "High-strength chemical peels"],
        lifestyleTip: "Always patch test every new cosmetic formula on your inner forearm for 24-48 hours before facial use."
      }
    },

    getRoutine: function (skinType) {
      return this.profiles[skinType] || this.profiles.combination;
    },

    analyzeQuestionnaire: function (answers) {
      // answers: { feel: 'oily'|'dry'|'combination'|'sensitive', focus: string, sensitivity: string }
      const key = answers.feel || "combination";
      const profile = this.getRoutine(key);
      return {
        type: key,
        profile: profile,
        disclaimer: this.DISCLAIMER
      };
    },

    analyzePhotoLuminosity: function (canvasOrImg) {
      // Non-diagnostic client-side lighting / contrast check for cosmetic photo review
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 64;
        canvas.height = 64;
        ctx.drawImage(canvasOrImg, 0, 0, 64, 64);
        const data = ctx.getImageData(0, 0, 64, 64).data;
        let totalLum = 0;
        for (let i = 0; i < data.length; i += 4) {
          totalLum += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        }
        const avgLum = totalLum / (data.length / 4);
        return {
          avgLuminosity: Math.round(avgLum),
          lightingQuality: avgLum > 180 ? "Bright / Washed Out" : avgLum < 70 ? "Dim / Low Lighting" : "Balanced Lighting",
          tip: "Optimal skincare assessments require diffuse, natural daylight with zero harsh shadows."
        };
      } catch (e) {
        return { avgLuminosity: 128, lightingQuality: "Standard", tip: "Natural daylight is ideal." };
      }
    }
  };

  // ================= 2. FITNESS & BMI MODULE =================
  const FitnessModule = {
    DISCLAIMER: "ℹ️ General fitness and wellness education only. Always consult a certified physician before starting an intensive training regimen.",

    calculateBMI: function (weightKg, heightCm) {
      const w = parseFloat(weightKg);
      const h = parseFloat(heightCm);

      if (isNaN(w) || isNaN(h) || h < 50 || h > 260 || w < 20 || w > 350) {
        return {
          error: true,
          message: "Please enter realistic height (50–260 cm) and weight (20–350 kg) values."
        };
      }

      const heightM = h / 100;
      const bmi = parseFloat((w / (heightM * heightM)).toFixed(1));
      let category = "";
      let advice = "";
      let color = "";
      let targetRange = `${(18.5 * heightM * heightM).toFixed(1)} – ${(24.9 * heightM * heightM).toFixed(1)} kg`;

      if (bmi < 18.5) {
        category = "Underweight";
        advice = "Aim for a moderate caloric surplus with protein-rich whole foods and progressive resistance training to build lean muscular tissue.";
        color = "#3498db";
      } else if (bmi <= 24.9) {
        category = "Optimal / Normal Range";
        advice = "Excellent baseline. Focus on cardiovascular health (150 min/week moderate activity), functional mobility, and progressive strength.";
        color = "#2ecc71";
      } else if (bmi <= 29.9) {
        category = "Overweight";
        advice = "Introduce daily active steps (8,000–10,000), 3 days of resistance training, and a sustainable 300–500 kcal dietary deficit.";
        color = "#f39c12";
      } else {
        category = "Obesity Range";
        advice = "Focus on joint-friendly low-impact movement (swimming, brisk walking, stationary cycling) paired with structured nutritional guidance.";
        color = "#e74c3c";
      }

      return {
        error: false,
        bmi: bmi,
        category: category,
        idealWeightRange: targetRange,
        advice: advice,
        color: color
      };
    },

    getWorkoutPlan: function (goal, activityLevel) {
      const plans = {
        strength: {
          title: "3-Day Progressive Overload Strength Split",
          frequency: "3 sessions / week (approx. 45-60 min)",
          days: [
            { day: "Day 1 (Push)", exercises: ["Barbell / Dumbbell Bench Press (3x8)", "Overhead Shoulder Press (3x10)", "Incline DB Press (3x10)", "Tricep Rope Pushdowns (3x12)"] },
            { day: "Day 2 (Pull)", exercises: ["Barbell Deadlift or RDL (3x6)", "Lat Pulldowns / Pull-ups (3x8)", "Bent-Over Barbell Rows (3x10)", "Bicep Dumbbell Curls (3x12)"] },
            { day: "Day 3 (Legs & Core)", exercises: ["Barbell Back Squats (3x8)", "Romanian Deadlifts (3x10)", "Walking Dumbbell Lunges (3x12/leg)", "Hanging Knee Raises / Planks (3x60s)"] }
          ]
        },
        endurance: {
          title: "Cardiovascular Stamina & Aerobic Base",
          frequency: "3-4 sessions / week",
          days: [
            { day: "Session 1", exercises: ["35-minute Zone-2 Aerobic Run / Jog (conversational pace)"] },
            { day: "Session 2", exercises: ["20-minute High-Intensity Interval Training (30s sprint / 60s jog)"] },
            { day: "Session 3", exercises: ["45-minute Low-Impact Cycling, Rowing, or Swimming"] },
            { day: "Session 4", exercises: ["Active Recovery: 60-minute outdoor walk + dynamic mobility"] }
          ]
        },
        flexibility: {
          title: "Functional Mobility & Postural Realignment",
          frequency: "Daily (approx. 15-20 min)",
          days: [
            { day: "Morning Flow", exercises: ["10 Sun Salutations (Surya Namaskar) + Thoracic spine cat-cow rotations"] },
            { day: "Midday Reset", exercises: ["Doorway pectoral stretches + hip flexor lunges to counter desk sitting"] },
            { day: "Evening Wind-Down", exercises: ["Pigeon pose (90s/side), Hamstring strap stretch, Reclining spinal twists"] }
          ]
        }
      };

      return plans[goal] || plans.strength;
    },

    getPostureTips: function () {
      return [
        { area: "Desk Ergonomics", tip: "Position top third of computer screen directly at eye level. Elbows bent at 90°, wrists flat, feet resting flat on the ground." },
        { area: "Standing Alignment", tip: "Stack ears over shoulders, shoulders over hips, and hips over ankles. Gently contract transverse abdominis and avoid anterior pelvic tilt." },
        { area: "Neck & Chin", tip: "Perform 10 gentle chin tucks every hour to reverse 'tech-neck' forward head carriage." }
      ];
    }
  };

  // ================= 3. YOGA MODULE =================
  const YogaModule = {
    DISCLAIMER: "🧘 Guided mirror yoga timer prototype. Does not claim automated computer vision pose tracking.",

    poses: [
      {
        id: "tadasana",
        name: "Mountain Pose",
        sanskrit: "Tadasana",
        durationSec: 45,
        difficulty: "Beginner",
        target: "Posture, balance, core stability",
        instructions: [
          "Stand tall with big toes touching, heels slightly apart.",
          "Engage quadriceps, draw abdominal wall gently inward and upward.",
          "Roll shoulders back and down, opening palms outward with relaxed fingers.",
          "Breathe deeply through the nose, feeling grounded through all four corners of the feet."
        ],
        safety: "Do not lock knees back into hyperextension; keep a micro-softness in the joints."
      },
      {
        id: "virabhadrasana2",
        name: "Warrior II",
        sanskrit: "Virabhadrasana II",
        durationSec: 45,
        difficulty: "Beginner",
        target: "Quadriceps, hip flexors, shoulder endurance",
        instructions: [
          "Step feet wide (approx. 4 feet). Turn front foot forward 90°, back foot in slightly.",
          "Bend front knee directly over front ankle (not extending past toes).",
          "Extend arms horizontally at shoulder level, parallel to the ground.",
          "Gaze gently over front fingertips with steady, even breathing."
        ],
        safety: "Ensure front knee does not collapse inward toward the big toe."
      },
      {
        id: "vrikshasana",
        name: "Tree Pose",
        sanskrit: "Vrikshasana",
        durationSec: 45,
        difficulty: "Beginner - Intermediate",
        target: "Single-leg balance, ankle stability, pelvic opening",
        instructions: [
          "Shift weight onto standing leg. Place sole of opposite foot on inner calf or inner thigh.",
          "Avoid placing foot directly onto the side of the knee joint.",
          "Bring hands together in prayer position at chest or extend arms overhead.",
          "Fix gaze (Drishti) on an unmoving focal point on the wall."
        ],
        safety: "Keep standing foot firmly rooted; step down smoothly if balance wavers."
      },
      {
        id: "adho_mukha",
        name: "Downward-Facing Dog",
        sanskrit: "Adho Mukha Svanasana",
        durationSec: 60,
        difficulty: "Beginner",
        target: "Hamstrings, calves, shoulders, spine elongation",
        instructions: [
          "Come to hands and knees. Spread fingers wide, press firmly through knuckles.",
          "Tuck toes and lift hips high toward the ceiling, creating an inverted 'V' shape.",
          "Pedal heels gently toward the floor; bend knees if hamstrings feel tight.",
          "Relax head between upper arms, keeping neck long and shoulders away from ears."
        ],
        safety: "Do not dump weight onto wrists; distribute pressure across palms and knuckles."
      },
      {
        id: "bhujangasana",
        name: "Cobra Pose",
        sanskrit: "Bhujangasana",
        durationSec: 45,
        difficulty: "Beginner",
        target: "Spinal extensor strength, chest opening",
        instructions: [
          "Lie face down, tops of feet pressing into mat with legs hip-width apart.",
          "Place hands under shoulders, elbows hugging close to ribs.",
          "Inhale, peel chest off mat using back extensor muscles with minimal wrist pushing.",
          "Keep gaze slightly forward and down to keep cervical spine neutral."
        ],
        safety: "Avoid forcing depth into the lower back; focus on lengthening the upper thoracic spine."
      },
      {
        id: "balasana",
        name: "Child's Pose",
        sanskrit: "Balasana",
        durationSec: 60,
        difficulty: "Restorative",
        target: "Nervous system relaxation, hip & lower back release",
        instructions: [
          "Kneel on mat, big toes touching, knees spread wide to edges of mat.",
          "Lower hips back onto heels and fold torso forward between thighs.",
          "Rest forehead comfortably on the floor and extend arms forward or back along torso.",
          "Take slow, restorative diaphragmatic breaths."
        ],
        safety: "Place a folded blanket under knees or beneath hips if knee flexion causes discomfort."
      }
    ]
  };

  // ================= 4. HAIRSTYLE & FACE GEOMETRY ANALYZER =================
  const HairstyleModule = {
    DISCLAIMER: "Estimated face shape for visual styling only. Does not claim medical or scientific certainty. Evaluates geometric proportions only.",

    shapes: {
      oval: {
        id: "oval",
        title: "Oval Face Shape",
        ratioDesc: "Balanced length-to-width ratio (approx. 1.4 – 1.5) with gently tapering jawline.",
        haircuts: [
          "Pompadour with clean mid taper",
          "Textured Quiff or Side-Swept Crop",
          "Short Textured Fringe with faded sides",
          "Classic Scissor Cut with brushed-back layers"
        ],
        beard: "Versatile; clean shave, short designer stubble, or faded corporate beard.",
        glassesCategory: "goggles",
        recommendedEyewear: [21, 22, 23], // Aviator, Square, Round from catalog
        avoid: "Overly long heavy front bangs that conceal forehead proportions."
      },
      round: {
        id: "round",
        title: "Round Face Shape",
        ratioDesc: "Equal width and length with soft cheek curves and rounded chin profile.",
        haircuts: [
          "High Skin Fade with Textured Spikes",
          "Angular Side Fringe with high crown volume",
          "Classic Pompadour with tight tapered sides",
          "Faux Hawk with clean temples"
        ],
        beard: "Pointed goatee or tapered boxed beard with trimmed cheeks to create vertical length.",
        glassesCategory: "goggles",
        recommendedEyewear: [22, 24, 25], // Square, Sports, Black Shade
        avoid: "Wide buzz cuts or round bowl cuts that accentuate circular geometry."
      },
      square: {
        id: "square",
        title: "Square Face Shape",
        ratioDesc: "Strong chiseled jawline with forehead, cheekbones, and jaw of nearly identical width.",
        haircuts: [
          "Side Part with clean low taper",
          "Textured French Crop with softened edge",
          "Classic Military Crew Cut",
          "Slicked Back Undercut"
        ],
        beard: "Rounded or soft shadow stubble to complement sharp jaw angles.",
        glassesCategory: "goggles",
        recommendedEyewear: [21, 23], // Aviators, Round frames
        avoid: "Blunt geometric bangs that create rigid horizontal lines across the face."
      },
      heart: {
        id: "heart",
        title: "Heart / Triangle Face Shape",
        ratioDesc: "Wider forehead tapering gracefully down to a refined, pointed chin.",
        haircuts: [
          "Mid-Length Textured Scissor Cut",
          "Side-Swept Fringe with natural movement",
          "Classic Taper with volume at the nape",
          "Medium Curtains with relaxed center part"
        ],
        beard: "Fuller rounded beard along jawline and chin to balance upper facial width.",
        glassesCategory: "goggles",
        recommendedEyewear: [21, 23], // Light Aviators, Round Wire-rims
        avoid: "Very high voluminous quiffs that exaggerate upper forehead width."
      },
      oblong: {
        id: "oblong",
        title: "Oblong / Rectangular Face Shape",
        ratioDesc: "Noticeably greater length than width (ratio > 1.6) with straight vertical cheek lines.",
        haircuts: [
          "Classic Side Part with fuller sides",
          "Textured Crop with horizontal fringe",
          "Layered Medium Scissor Cut",
          "Gentle Wavy Quiff with controlled height"
        ],
        beard: "Fuller side stubble with closely trimmed chin to visually widen the face.",
        glassesCategory: "goggles",
        recommendedEyewear: [22, 24], // Wide Square & Sports frames
        avoid: "Sky-high pompadours and skin fades that exaggerate vertical length."
      }
    },

    getRecommendations: function (shape) {
      return this.shapes[shape] || this.shapes.oval;
    },

    /**
     * Client-side geometric face estimation from image/canvas
     */
    estimateFaceShape: async function (imageOrCanvas) {
      if (!imageOrCanvas) {
        return { error: true, type: "invalid_input", message: "Please provide a valid portrait image or camera snapshot." };
      }

      // Check Shape Detection API
      if (typeof window !== "undefined" && typeof window.FaceDetector === "function") {
        try {
          const detector = new window.FaceDetector({ fastMode: false, maxDetectedFaces: 5 });
          const faces = await detector.detect(imageOrCanvas);

          if (!faces || faces.length === 0) {
            return {
              error: true,
              type: "no_face",
              message: "No clear face was detected in this photo. Please ensure good lighting and a front-facing angle."
            };
          }

          if (faces.length > 1) {
            return {
              error: true,
              type: "multiple_faces",
              message: `Multiple faces detected (${faces.length} found). Please provide a photo with only one person for accurate styling.`
            };
          }

          const box = faces[0].boundingBox;
          const ratio = box.height / box.width;
          let shape = "oval";

          if (ratio > 1.58) {
            shape = "oblong";
          } else if (ratio < 1.15) {
            shape = "round";
          } else if (ratio >= 1.15 && ratio <= 1.35) {
            shape = "square";
          } else {
            shape = "oval";
          }

          return {
            error: false,
            estimatedShape: shape,
            ratio: parseFloat(ratio.toFixed(2)),
            data: this.getRecommendations(shape),
            disclaimer: this.DISCLAIMER
          };
        } catch (e) {
          // Fall through to canvas aspect estimation
        }
      }

      // Fallback: Geometric canvas aspect ratio estimation
      try {
        const w = imageOrCanvas.naturalWidth || imageOrCanvas.videoWidth || imageOrCanvas.width || 400;
        const h = imageOrCanvas.naturalHeight || imageOrCanvas.videoHeight || imageOrCanvas.height || 400;
        const aspect = h / w;
        let shape = "oval";

        if (aspect > 1.35) shape = "oblong";
        else if (aspect < 0.95) shape = "round";
        else shape = "oval";

        return {
          error: false,
          estimatedShape: shape,
          ratio: parseFloat(aspect.toFixed(2)),
          data: this.getRecommendations(shape),
          disclaimer: this.DISCLAIMER
        };
      } catch (err) {
        return {
          error: true,
          type: "processing_error",
          message: "Could not process image geometry. You can manually select your face shape below."
        };
      }
    }
  };

  // ================= 5. BEST CLOTH SILHOUETTE GUIDE =================
  const BestClothModule = {
    guides: {
      round: {
        title: "Curved & Rounded Proportions",
        necklines: "Deep V-necks, sharp button-down collars, open lapel blazers",
        patterns: "Vertical pin-stripes, monochrome dark palettes, slim vertical cuts",
        avoid: "Chunky crew necks, wide horizontal block stripes",
        catalogRecommendations: [6, 9, 2] // Men Shirt, Slim Fit Shirt, Black Jeans
      },
      angular: {
        title: "Angular & Chiseled Proportions",
        necklines: "Classic crew necks, shawl collars, spread collars",
        patterns: "Subtle checks, textured knits, horizontal chest details",
        avoid: "Overly deep plunging V-necks",
        catalogRecommendations: [8, 11, 1] // Checked Shirt, Round Neck, Blue Jeans
      },
      athletic: {
        title: "Athletic & Inverted Triangle Proportions",
        necklines: "Fitted crewneck tees, tailored slim shirts, structured shoulder jackets",
        patterns: "Solid bold colors, athletic fit t-shirts, tapered denim",
        avoid: "Baggy shapeless oversized sacks that hide posture",
        catalogRecommendations: [14, 9, 3] // Sports Tee, Slim Fit Shirt, Slim Fit Jeans
      }
    }
  };

  // ================= 6. FASHION RECOMMENDATION ENGINE (PHASE 6) =================
  const FashionRecommendationEngine = {
    OCCASION_ALIASES: {
      college: "college", campus: "college", university: "college", school: "college", lecture: "college", student: "college",
      interview: "interview", "job interview": "interview", corporate: "interview", job: "interview",
      office: "office", work: "office", workday: "office", "business casual": "office", business: "office",
      presentation: "presentation", pitch: "presentation", keynote: "presentation", demo: "presentation",
      meeting: "meeting", "business meeting": "meeting", boardroom: "meeting", executive: "meeting", client: "meeting",
      formal: "formal", "formal event": "formal", gala: "formal", evening: "formal", wedding: "formal", dinner: "formal",
      casual: "casual", everyday: "casual", weekend: "casual", street: "casual", outing: "casual", daily: "casual",
      party: "party", "night out": "party", club: "party", nightlife: "party", festival: "party", celebration: "party"
    },

    occasionsConfig: {
      college: {
        id: "college",
        label: "College & Campus",
        title: "College & Campus Everyday",
        description: "Relaxed, functional campus streetwear prioritizing daily mobility, lecture-hall comfort, and effortless personal flair.",
        stylingRationale: "A breathable pure combed cotton tee paired with durable straight-wash denim and low-profile street sneakers offers all-day lecture-hall comfort while projecting effortless youth aesthetics.",
        colorHarmony: "Street Neutral & Classic Indigo",
        itemIds: [11, 1, 28, 16], // Round Neck (₹499), Blue Jeans (₹1,499), Sneakers (₹1,899), Black Cap (₹299)
        budgetItems: [15, 5, 27, 16], // Plain Tee (₹399), Classic Denim (₹1,299), Casual Shoes (₹1,799), Black Cap (₹299)
        coreCombo: [11, 1], // Round Neck (₹499) + Blue Jeans (₹1,499) = ₹1,998
        ultraBudget: [15, 5] // Plain Tee (₹399) + Classic Denim (₹1,299) = ₹1,698
      },
      interview: {
        id: "interview",
        label: "Job Interview",
        title: "Corporate & Tech Interview Attire",
        description: "Sharply balanced corporate attire projecting diligence, professional presence, and executive confidence.",
        stylingRationale: "Crisp collared formal shirting paired with structured dark denim/trousers and polished dress footwear conveys respect for company culture, diligence, and high attention to detail.",
        colorHarmony: "High-Contrast Corporate & Burnished Leather",
        itemIds: [6, 1, 29, 21], // Men Shirt (₹899), Cotton Pant/Blue Jeans (₹1,499), Formal Shoes (₹2,199), Aviator Goggles (₹699)
        budgetItems: [6, 5, 27, 21], // Men Shirt (₹899), Classic Denim (₹1,299), Casual Shoes (₹1,799), Aviator (₹699)
        coreCombo: [6, 5], // Men Shirt (₹899) + Classic Denim (₹1,299) = ₹2,198
        ultraBudget: [6] // Men Shirt (₹899)
      },
      office: {
        id: "office",
        label: "Business Casual",
        title: "Executive Business Casual",
        description: "Versatile modern office ensemble designed for presentations and corporate client engagements.",
        stylingRationale: "A tailored slim-fit shirt paired with dark wash denim and premium loafers balances workday comfort with impeccable professional authority.",
        colorHarmony: "Monochrome Minimalist & Cool Slate",
        itemIds: [9, 2, 27, 22], // Slim Fit Shirt (₹1,199), Black Jeans (₹1,599), Casual Shoes (₹1,799), Square Goggles (₹799)
        budgetItems: [7, 5, 27, 25], // Casual Shirt (₹999), Classic Denim (₹1,299), Casual Shoes (₹1,799), Black Shade (₹649)
        coreCombo: [7, 5], // Casual Shirt (₹999) + Classic Denim (₹1,299) = ₹2,298
        ultraBudget: [7] // Casual Shirt (₹999)
      },
      presentation: {
        id: "presentation",
        label: "Pitch & Presentation",
        title: "Pitch & Presentation Sharp Casual",
        description: "High-energy presentation aesthetic combining classic tailoring with energetic modern streetwear.",
        stylingRationale: "A structured patterned overshirt paired with clean straight denim and pristine white court sneakers commands visual focus while projecting modern authority.",
        colorHarmony: "Dynamic Contrast & Crisp White Footwear",
        itemIds: [8, 1, 30, 21], // Checked Shirt (₹1,099), Blue Jeans (₹1,499), White Shoes (₹1,699), Aviator (₹699)
        budgetItems: [7, 5, 30, 21], // Casual Shirt (₹999), Classic Denim (₹1,299), White Shoes (₹1,699), Aviator (₹699)
        coreCombo: [8, 1], // Checked Shirt (₹1,099) + Blue Jeans (₹1,499) = ₹2,598
        ultraBudget: [8] // Checked Shirt (₹1,099)
      },
      meeting: {
        id: "meeting",
        label: "Executive Meeting",
        title: "High-Stakes Business Meeting",
        description: "Authoritative boardroom attire radiating calm leadership and sharpness.",
        stylingRationale: "Crisp tailored shirting anchored by dark tapered trousers and deep leather oxford shoes creates a focused, high-contrast silhouette under boardroom lighting.",
        colorHarmony: "Executive Monochrome & Deep Black",
        itemIds: [9, 2, 29, 25], // Slim Fit Shirt (₹1,199), Black Jeans (₹1,599), Formal Shoes (₹2,199), Black Shade (₹649)
        budgetItems: [6, 5, 29, 25], // Men Shirt (₹899), Classic Denim (₹1,299), Formal Shoes (₹2,199), Black Shade (₹649)
        coreCombo: [9, 2], // Slim Fit Shirt (₹1,199) + Black Jeans (₹1,599) = ₹2,798
        ultraBudget: [6, 5] // Men Shirt (₹899) + Classic Denim (₹1,299) = ₹2,198
      },
      formal: {
        id: "formal",
        label: "Evening Formal",
        title: "Evening Gala & Networking Formal",
        description: "Elegant evening ensemble for awards nights, industry galas, and professional celebrations.",
        stylingRationale: "Monochrome formal pairing with sleek square eyewear and polished black footwear ensures sophisticated presence during evening lighting.",
        colorHarmony: "Refined Midnight & Polished Black",
        itemIds: [6, 2, 29, 22], // Men Shirt (₹899), Black Jeans (₹1,599), Formal Shoes (₹2,199), Square Goggles (₹799)
        budgetItems: [6, 2, 27, 25], // Men Shirt (₹899), Black Jeans (₹1,599), Casual Shoes (₹1,799), Black Shade (₹649)
        coreCombo: [6, 2], // Men Shirt (₹899) + Black Jeans (₹1,599) = ₹2,498
        ultraBudget: [6] // Men Shirt (₹899)
      },
      casual: {
        id: "casual",
        label: "Casual Everyday",
        title: "Casual Everyday & Weekend Outing",
        description: "Laid-back weekend ensemble balancing breezy breathable cotton textures with versatile comfort.",
        stylingRationale: "Breathable pure cotton paired with flexible washed denim and supportive walking sneakers delivers unmatched versatility for weekend outings and coffee runs.",
        colorHarmony: "Warm Earth Tones & Vintage Amber",
        itemIds: [7, 3, 27, 23], // Casual Shirt (₹999), Slim Fit Jeans (₹1,399), Casual Shoes (₹1,799), Round Goggles (₹749)
        budgetItems: [15, 5, 27, 18], // Plain Tee (₹399), Classic Denim (₹1,299), Casual Shoes (₹1,799), White Cap (₹279)
        coreCombo: [15, 3], // Plain Tee (₹399) + Slim Fit Jeans (₹1,399) = ₹1,798
        ultraBudget: [15, 5] // Plain Tee (₹399) + Classic Denim (₹1,299) = ₹1,698
      },
      party: {
        id: "party",
        label: "Party & Night Out",
        title: "Party & Night Out Street Style",
        description: "High-contrast urban nightlife aesthetic designed to stand out under moody ambient lighting.",
        stylingRationale: "Distressed denim paired with drop-shoulder dark streetwear and statement dark shades delivers an assertive, effortlessly stylish nightlife presence.",
        colorHarmony: "Urban Edge & Dark Streetwear",
        itemIds: [12, 4, 28, 25], // Oversize Tee (₹599), Ripped Jeans (₹1,699), Sneakers (₹1,899), Black Shade (₹649)
        budgetItems: [13, 2, 28, 25], // Printed Tee (₹549), Black Jeans (₹1,599), Sneakers (₹1,899), Black Shade (₹649)
        coreCombo: [12, 4], // Oversize Tee (₹599) + Ripped Jeans (₹1,699) = ₹2,298
        ultraBudget: [12, 2] // Oversize Tee (₹599) + Black Jeans (₹1,599) = ₹2,198
      }
    },

    /**
     * Normalize an input occasion string against aliases
     */
    resolveOccasion: function (input) {
      if (!input || typeof input !== "string") return "interview";
      const cleaned = input.toLowerCase().trim();
      return this.OCCASION_ALIASES[cleaned] || this.occasionsConfig[cleaned] ? cleaned : "interview";
    },

    /**
     * Authoritative recommendation method consuming window.MeroXCatalog
     */
    recommend: function (filters = {}) {
      if (!global.MeroXCatalog) return null;
      const catalog = global.MeroXCatalog;

      const occasionKey = this.resolveOccasion(filters.occasion || "interview");
      const cfg = this.occasionsConfig[occasionKey] || this.occasionsConfig.interview;

      const maxBudget = filters.maxBudget ? Number(filters.maxBudget) : null;
      let selectedIds = cfg.itemIds;
      let withinBudget = true;
      let budgetNote = "Curated full 4-piece ensemble for complete occasion presence.";

      // Budget filtering pipeline
      if (maxBudget && !isNaN(maxBudget) && maxBudget > 0) {
        const fullCost = cfg.itemIds.reduce((sum, id) => {
          const item = catalog.getById(id);
          return sum + (item ? item.price : 0);
        }, 0);

        if (fullCost <= maxBudget) {
          selectedIds = cfg.itemIds;
          withinBudget = true;
          budgetNote = `Complete 4-piece ensemble fits comfortably within your ₹${maxBudget.toLocaleString("en-IN")} budget.`;
        } else {
          // Check budget tier
          const budgetCost = cfg.budgetItems.reduce((sum, id) => {
            const item = catalog.getById(id);
            return sum + (item ? item.price : 0);
          }, 0);

          if (budgetCost <= maxBudget) {
            selectedIds = cfg.budgetItems;
            withinBudget = true;
            budgetNote = `Budget-optimized 4-piece ensemble fits within your ₹${maxBudget.toLocaleString("en-IN")} budget.`;
          } else {
            // Check core combo
            const coreCost = cfg.coreCombo.reduce((sum, id) => {
              const item = catalog.getById(id);
              return sum + (item ? item.price : 0);
            }, 0);

            if (coreCost <= maxBudget) {
              selectedIds = cfg.coreCombo;
              withinBudget = true;
              budgetNote = `Curated essential 2-piece core outfit (Top + Bottom) fitting within your ₹${maxBudget.toLocaleString("en-IN")} budget.`;
            } else {
              // Check ultra budget
              const ultraCost = cfg.ultraBudget.reduce((sum, id) => {
                const item = catalog.getById(id);
                return sum + (item ? item.price : 0);
              }, 0);

              if (ultraCost <= maxBudget) {
                selectedIds = cfg.ultraBudget;
                withinBudget = true;
                budgetNote = `Curated foundation pieces fitting within your ₹${maxBudget.toLocaleString("en-IN")} budget.`;
              } else {
                selectedIds = cfg.ultraBudget;
                withinBudget = false;
                budgetNote = `Lowest-cost foundation combo for ${cfg.label} starts at ₹${ultraCost.toLocaleString("en-IN")}, slightly exceeding your ₹${maxBudget.toLocaleString("en-IN")} target.`;
              }
            }
          }
        }
      }

      const items = selectedIds.map((id) => catalog.getById(id)).filter(Boolean);
      const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

      // Deterministic explainable scoring
      let score = 92;
      if (withinBudget) score += 4;
      if (items.length >= 4) score += 2;

      return {
        id: occasionKey,
        occasion: occasionKey,
        label: cfg.label,
        title: cfg.title,
        description: cfg.description,
        stylingRationale: cfg.stylingRationale,
        recommendedBecause: cfg.stylingRationale,
        colorHarmony: cfg.colorHarmony,
        items: items,
        itemIds: items.map((p) => p.id),
        totalPrice: totalPrice,
        totalPriceFormatted: `₹${totalPrice.toLocaleString("en-IN")}`,
        withinBudget: withinBudget,
        budgetNote: budgetNote,
        score: score
      };
    },

    getAllOccasions: function () {
      return Object.values(this.occasionsConfig).map((occ) => ({
        id: occ.id,
        label: occ.label
      }));
    }
  };

  // Backward compatibility alias
  const ProfessionalOutfitsModule = FashionRecommendationEngine;

  // ================= 7. WISHLIST & FAVORITES MANAGER =================
  const WishlistModule = {
    STORAGE_KEY: "merox_wishlist_ids",

    getIds: function () {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    toggle: function (productId) {
      const id = Number(productId);
      let list = this.getIds();
      const idx = list.indexOf(id);
      let added = false;

      if (idx > -1) {
        list.splice(idx, 1);
        added = false;
      } else {
        list.push(id);
        added = true;
      }

      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
      } catch (e) {}

      return { added, count: list.length, list };
    },

    isSaved: function (productId) {
      return this.getIds().includes(Number(productId));
    },

    getCount: function () {
      return this.getIds().length;
    },

    getSavedProducts: function () {
      if (!global.MeroXCatalog) return [];
      const ids = this.getIds();
      return ids.map((id) => global.MeroXCatalog.getById(id)).filter(Boolean);
    },

    clear: function () {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
      } catch (e) {}
    }
  };

  // Expose on global window object
  global.MeroXModules = {
    Skincare: SkincareModule,
    Fitness: FitnessModule,
    Yoga: YogaModule,
    Hairstyle: HairstyleModule,
    BestCloth: BestClothModule,
    ProfessionalOutfits: ProfessionalOutfitsModule,
    FashionRecommendationEngine: FashionRecommendationEngine,
    Wishlist: WishlistModule
  };
  global.MeroXFashionRecommendationEngine = FashionRecommendationEngine;
  global.MeroXWishlist = WishlistModule;
})(typeof window !== "undefined" ? window : globalThis);
