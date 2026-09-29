/**
 * MEROX AUTHORITATIVE PRODUCT CATALOG (Retail Smart Mirror Edition)
 * Single source of truth for all MeroX products across all fashion categories.
 * All image assets verified to exist in /images/*.jpeg.
 * Includes complete retail metadata: SKU, Barcode (EAN-13), QR, RFID, Store Inventory, & Try-On Type.
 */

(function (global) {
  "use strict";

  const STORES = [
    {
      id: "STORE-MUM-01",
      name: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      city: "Mumbai",
      location: "Lower Parel, Phoenix Palladium, Level 2",
      active: true
    },
    {
      id: "STORE-BLR-02",
      name: "MeroX Tech Kiosk — Bengaluru Orion Mall",
      city: "Bengaluru",
      location: "Rajajinagar, Orion Mall, Ground Floor",
      active: true
    },
    {
      id: "STORE-DEL-03",
      name: "MeroX Select Kiosk — Delhi Select Citywalk",
      city: "Delhi",
      location: "Saket, Select Citywalk, Fashion Corridor",
      active: true
    }
  ];

  const PRODUCTS = [
    {
      id: 1,
      productId: "PROD-001",
      sku: "MEROX-JNS-001",
      name: "Blue Jeans",
      category: "jeans",
      subcategory: "Denim Bottoms",
      price: 1499,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/jeans1.jpeg",
      images: ["images/jeans1.jpeg"],
      tryOnAsset: "images/jeans1.jpeg",
      thumbnail: "images/jeans1.jpeg",
      tryOnType: "garment_preview",
      description: "Classic premium wash denim with relaxed comfort and flexible fit.",
      brand: "MeroX Denim",
      tags: ["jeans", "blue jeans", "denim", "pants", "casual", "bottoms"],
      gender: "Men",
      color: "Blue",
      colors: ["Blue", "Light Indigo", "Dark Blue"],
      availableSizes: ["30", "32", "34", "36"],
      sizes: ["30", "32", "34", "36"],
      rating: 4.6,
      stockStatus: "In Stock",
      stockQuantity: 18,
      stock: 18,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 2, Men's Section",
      barcode: "8901234000010",
      qrCode: "MEROX:SKU:MEROX-JNS-001",
      rfid: "RFID-9901-001",
      rfidEpc: "EPC-96-A01B2C001",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Regular Straight", "fabric": "98% Cotton, 2% Elastane", "care": "Machine wash cold, inside out", "season": "All Season"}
    },
    {
      id: 2,
      productId: "PROD-002",
      sku: "MEROX-JNS-002",
      name: "Black Jeans",
      category: "jeans",
      subcategory: "Denim Bottoms",
      price: 1599,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/jeans2.jpeg",
      images: ["images/jeans2.jpeg"],
      tryOnAsset: "images/jeans2.jpeg",
      thumbnail: "images/jeans2.jpeg",
      tryOnType: "garment_preview",
      description: "Deep jet-black stretch denim designed for evening and smart-casual styling.",
      brand: "MeroX Denim",
      tags: ["jeans", "black jeans", "denim", "dark", "pants", "bottoms"],
      gender: "Men",
      color: "Black",
      colors: ["Jet Black", "Charcoal Black"],
      availableSizes: ["30", "32", "34", "36"],
      sizes: ["30", "32", "34", "36"],
      rating: 4.7,
      stockStatus: "In Stock",
      stockQuantity: 14,
      stock: 14,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 2, Men's Section",
      barcode: "8901234000027",
      qrCode: "MEROX:SKU:MEROX-JNS-002",
      rfid: "RFID-9901-002",
      rfidEpc: "EPC-96-A01B2C002",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Slim Tapered", "fabric": "99% Cotton, 1% Spandex", "care": "Machine wash cold", "season": "All Season"}
    },
    {
      id: 3,
      productId: "PROD-003",
      sku: "MEROX-JNS-003",
      name: "Slim Fit Jeans",
      category: "jeans",
      subcategory: "Denim Bottoms",
      price: 1399,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/jeans3.jpeg",
      images: ["images/jeans3.jpeg"],
      tryOnAsset: "images/jeans3.jpeg",
      thumbnail: "images/jeans3.jpeg",
      tryOnType: "garment_preview",
      description: "Modern tapered slim-fit jeans offering a sleek contemporary profile.",
      brand: "MeroX Denim",
      tags: ["jeans", "slim fit", "tapered", "denim", "pants", "bottoms"],
      gender: "Men",
      color: "Medium Blue",
      colors: ["Medium Blue", "Washed Grey"],
      availableSizes: ["28", "30", "32", "34"],
      sizes: ["28", "30", "32", "34"],
      rating: 4.5,
      stockStatus: "In Stock",
      stockQuantity: 22,
      stock: 22,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 2, Men's Section",
      barcode: "8901234000034",
      qrCode: "MEROX:SKU:MEROX-JNS-003",
      rfid: "RFID-9901-003",
      rfidEpc: "EPC-96-A01B2C003",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Slim Fit", "fabric": "Stretch Denim Blend", "care": "Machine wash warm", "season": "All Season"}
    },
    {
      id: 4,
      productId: "PROD-004",
      sku: "MEROX-JNS-004",
      name: "Ripped Jeans",
      category: "jeans",
      subcategory: "Denim Bottoms",
      price: 1699,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/jeans4.jpeg",
      images: ["images/jeans4.jpeg"],
      tryOnAsset: "images/jeans4.jpeg",
      thumbnail: "images/jeans4.jpeg",
      tryOnType: "garment_preview",
      description: "Edgy distressed denim with laser-cut knee rips for high-energy street looks.",
      brand: "MeroX Street",
      tags: ["jeans", "ripped", "distressed", "denim", "streetwear", "bottoms"],
      gender: "Men",
      color: "Light Blue",
      colors: ["Light Blue", "Acid Wash"],
      availableSizes: ["30", "32", "34"],
      sizes: ["30", "32", "34"],
      rating: 4.4,
      stockStatus: "In Stock",
      stockQuantity: 9,
      stock: 9,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 2, Men's Section",
      barcode: "8901234000041",
      qrCode: "MEROX:SKU:MEROX-JNS-004",
      rfid: "RFID-9901-004",
      rfidEpc: "EPC-96-A01B2C004",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Skinny Distressed", "fabric": "Cotton Stretch", "care": "Gentle cycle", "season": "Spring/Summer"}
    },
    {
      id: 5,
      productId: "PROD-005",
      sku: "MEROX-JNS-005",
      name: "Classic Denim",
      category: "jeans",
      subcategory: "Denim Bottoms",
      price: 1299,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/jeans5.jpeg",
      images: ["images/jeans5.jpeg"],
      tryOnAsset: "images/jeans5.jpeg",
      thumbnail: "images/jeans5.jpeg",
      tryOnType: "garment_preview",
      description: "Timeless regular-cut blue jeans built with sturdy reinforced stitching.",
      brand: "MeroX Basics",
      tags: ["jeans", "classic", "denim", "regular fit", "pants", "bottoms"],
      gender: "Men",
      color: "Dark Indigo",
      colors: ["Dark Indigo", "Raw Denim"],
      availableSizes: ["30", "32", "34", "36", "38"],
      sizes: ["30", "32", "34", "36", "38"],
      rating: 4.5,
      stockStatus: "In Stock",
      stockQuantity: 25,
      stock: 25,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 2, Men's Section",
      barcode: "8901234000058",
      qrCode: "MEROX:SKU:MEROX-JNS-005",
      rfid: "RFID-9901-005",
      rfidEpc: "EPC-96-A01B2C005",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Regular Fit", "fabric": "100% Rigid Denim", "care": "Machine wash cold", "season": "All Season"}
    },
    {
      id: 6,
      productId: "PROD-006",
      sku: "MEROX-SHT-006",
      name: "Men Shirt",
      category: "shirt",
      subcategory: "Formal & Casual Shirts",
      price: 899,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/shirt1.jpeg",
      images: ["images/shirt1.jpeg"],
      tryOnAsset: "images/shirt1.jpeg",
      thumbnail: "images/shirt1.jpeg",
      tryOnType: "garment_preview",
      description: "Crisp tailored button-down shirt ideal for office wear and smart gatherings.",
      brand: "MeroX Formal",
      tags: ["shirt", "men shirt", "formal", "button down", "office", "tops"],
      gender: "Men",
      color: "White",
      colors: ["White", "Sky Blue", "Ivory"],
      availableSizes: ["S", "M", "L", "XL"],
      sizes: ["S", "M", "L", "XL"],
      rating: 4.7,
      stockStatus: "In Stock",
      stockQuantity: 30,
      stock: 30,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 2, Men's Section",
      barcode: "8901234000065",
      qrCode: "MEROX:SKU:MEROX-SHT-006",
      rfid: "RFID-9901-006",
      rfidEpc: "EPC-96-A01B2C006",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Slim Formal", "fabric": "100% Egyptian Cotton", "care": "Machine wash warm, iron medium", "collar": "Spread Collar"}
    },
    {
      id: 7,
      productId: "PROD-007",
      sku: "MEROX-SHT-007",
      name: "Casual Shirt",
      category: "shirt",
      subcategory: "Formal & Casual Shirts",
      price: 999,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/shirt2.jpeg",
      images: ["images/shirt2.jpeg"],
      tryOnAsset: "images/shirt2.jpeg",
      thumbnail: "images/shirt2.jpeg",
      tryOnType: "garment_preview",
      description: "Relaxed-fit everyday shirt with breathable cotton weave for casual outings.",
      brand: "MeroX Casuals",
      tags: ["shirt", "casual shirt", "relaxed", "cotton", "weekend", "tops"],
      gender: "Men",
      color: "Navy",
      colors: ["Navy", "Olive Green", "Beige"],
      availableSizes: ["M", "L", "XL"],
      sizes: ["M", "L", "XL"],
      rating: 4.5,
      stockStatus: "In Stock",
      stockQuantity: 16,
      stock: 16,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 2, Men's Section",
      barcode: "8901234000072",
      qrCode: "MEROX:SKU:MEROX-SHT-007",
      rfid: "RFID-9901-007",
      rfidEpc: "EPC-96-A01B2C007",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Regular Casual", "fabric": "Cotton Slub Weave", "care": "Machine wash cold", "collar": "Button-down Collar"}
    },
    {
      id: 8,
      productId: "PROD-008",
      sku: "MEROX-SHT-008",
      name: "Checked Shirt",
      category: "shirt",
      subcategory: "Formal & Casual Shirts",
      price: 1099,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/shirt3.jpeg",
      images: ["images/shirt3.jpeg"],
      tryOnAsset: "images/shirt3.jpeg",
      thumbnail: "images/shirt3.jpeg",
      tryOnType: "garment_preview",
      description: "Bold tartan checked pattern on brushed cotton flannel. Perfect for layering.",
      brand: "MeroX Street",
      tags: ["shirt", "checked shirt", "plaid", "flannel", "layering", "tops"],
      gender: "Men",
      color: "Red & Black",
      colors: ["Red & Black", "Blue & White"],
      availableSizes: ["S", "M", "L", "XL"],
      sizes: ["S", "M", "L", "XL"],
      rating: 4.6,
      stockStatus: "In Stock",
      stockQuantity: 19,
      stock: 19,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 2, Men's Section",
      barcode: "8901234000089",
      qrCode: "MEROX:SKU:MEROX-SHT-008",
      rfid: "RFID-9901-008",
      rfidEpc: "EPC-96-A01B2C008",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Relaxed Over-shirt", "fabric": "100% Brushed Cotton Flannel", "care": "Machine wash cold", "collar": "Classic Point"}
    },
    {
      id: 9,
      productId: "PROD-009",
      sku: "MEROX-SHT-009",
      name: "Slim Fit Shirt",
      category: "shirt",
      subcategory: "Formal & Casual Shirts",
      price: 1199,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/shirt4.jpeg",
      images: ["images/shirt4.jpeg"],
      tryOnAsset: "images/shirt4.jpeg",
      thumbnail: "images/shirt4.jpeg",
      tryOnType: "garment_preview",
      description: "Precision contoured silhouette accentuating physique for evening occasions.",
      brand: "MeroX Tailored",
      tags: ["shirt", "slim fit shirt", "formal", "party", "modern", "tops"],
      gender: "Men",
      color: "Black",
      colors: ["Black", "Burgundy"],
      availableSizes: ["S", "M", "L"],
      sizes: ["S", "M", "L"],
      rating: 4.8,
      stockStatus: "In Stock",
      stockQuantity: 12,
      stock: 12,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 2, Men's Section",
      barcode: "8901234000096",
      qrCode: "MEROX:SKU:MEROX-SHT-009",
      rfid: "RFID-9901-009",
      rfidEpc: "EPC-96-A01B2C009",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Ultra Slim Fit", "fabric": "97% Cotton, 3% Lycra", "care": "Dry clean recommended", "collar": "Cutaway Collar"}
    },
    {
      id: 10,
      productId: "PROD-010",
      sku: "MEROX-SHT-010",
      name: "Denim Shirt",
      category: "shirt",
      subcategory: "Formal & Casual Shirts",
      price: 1299,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/shirt5.jpeg",
      images: ["images/shirt5.jpeg"],
      tryOnAsset: "images/shirt5.jpeg",
      thumbnail: "images/shirt5.jpeg",
      tryOnType: "garment_preview",
      description: "Rugged lightweight denim shirt with snap buttons and twin chest pockets.",
      brand: "MeroX Denim",
      tags: ["shirt", "denim shirt", "western", "casual", "rugged", "tops"],
      gender: "Men",
      color: "Denim Blue",
      colors: ["Denim Blue", "Washed Grey"],
      availableSizes: ["M", "L", "XL"],
      sizes: ["M", "L", "XL"],
      rating: 4.5,
      stockStatus: "In Stock",
      stockQuantity: 15,
      stock: 15,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 2, Men's Section",
      barcode: "8901234000102",
      qrCode: "MEROX:SKU:MEROX-SHT-010",
      rfid: "RFID-9901-010",
      rfidEpc: "EPC-96-A01B2C010",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Western Regular", "fabric": "Lightweight Chambray Denim", "care": "Machine wash cold", "collar": "Spread Collar"}
    },
    {
      id: 11,
      productId: "PROD-011",
      sku: "MEROX-TSH-011",
      name: "Round Neck",
      category: "tshirt",
      subcategory: "Everyday Tees & Streetwear",
      price: 499,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/tshirt1.jpeg",
      images: ["images/tshirt1.jpeg"],
      tryOnAsset: "images/tshirt1.jpeg",
      thumbnail: "images/tshirt1.jpeg",
      tryOnType: "garment_preview",
      description: "100% combed organic cotton essential crewneck tee with ultra-soft hand feel.",
      brand: "MeroX Basics",
      tags: ["tshirt", "round neck", "crewneck", "tee", "casual", "tops"],
      gender: "Unisex",
      color: "White",
      colors: ["White", "Black", "Melange Grey"],
      availableSizes: ["S", "M", "L", "XL"],
      sizes: ["S", "M", "L", "XL"],
      rating: 4.6,
      stockStatus: "In Stock",
      stockQuantity: 35,
      stock: 35,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 1, Casual Wear",
      barcode: "8901234000119",
      qrCode: "MEROX:SKU:MEROX-TSH-011",
      rfid: "RFID-9901-011",
      rfidEpc: "EPC-96-A01B2C011",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Regular Fit", "fabric": "100% Combed Bio-washed Cotton (180 GSM)", "care": "Machine wash cold", "neckline": "Crew Neck"}
    },
    {
      id: 12,
      productId: "PROD-012",
      sku: "MEROX-TSH-012",
      name: "Oversize",
      category: "tshirt",
      subcategory: "Everyday Tees & Streetwear",
      price: 599,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/tshirt2.jpeg",
      images: ["images/tshirt2.jpeg"],
      tryOnAsset: "images/tshirt2.jpeg",
      thumbnail: "images/tshirt2.jpeg",
      tryOnType: "garment_preview",
      description: "Heavyweight drop-shoulder boxy tee engineered for modern streetwear aesthetics.",
      brand: "MeroX Street",
      tags: ["tshirt", "oversize", "drop shoulder", "boxy", "streetwear", "tops"],
      gender: "Unisex",
      color: "Beige",
      colors: ["Beige", "Sage Green", "Charcoal"],
      availableSizes: ["S", "M", "L", "XL"],
      sizes: ["S", "M", "L", "XL"],
      rating: 4.7,
      stockStatus: "In Stock",
      stockQuantity: 24,
      stock: 24,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 1, Casual Wear",
      barcode: "8901234000126",
      qrCode: "MEROX:SKU:MEROX-TSH-012",
      rfid: "RFID-9901-012",
      rfidEpc: "EPC-96-A01B2C012",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Boxy Oversized", "fabric": "Heavyweight Cotton (240 GSM)", "care": "Wash inside out cold", "neckline": "Ribbed Crew"}
    },
    {
      id: 13,
      productId: "PROD-013",
      sku: "MEROX-TSH-013",
      name: "Printed",
      category: "tshirt",
      subcategory: "Everyday Tees & Streetwear",
      price: 549,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/tshirt3.jpeg",
      images: ["images/tshirt3.jpeg"],
      tryOnAsset: "images/tshirt3.jpeg",
      thumbnail: "images/tshirt3.jpeg",
      tryOnType: "garment_preview",
      description: "High-density typographic graphic tee inspired by urban brutalist architecture.",
      brand: "MeroX Street",
      tags: ["tshirt", "printed", "graphic tee", "typography", "casual", "tops"],
      gender: "Unisex",
      color: "Black",
      colors: ["Black", "White"],
      availableSizes: ["M", "L", "XL"],
      sizes: ["M", "L", "XL"],
      rating: 4.4,
      stockStatus: "In Stock",
      stockQuantity: 20,
      stock: 20,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 1, Casual Wear",
      barcode: "8901234000133",
      qrCode: "MEROX:SKU:MEROX-TSH-013",
      rfid: "RFID-9901-013",
      rfidEpc: "EPC-96-A01B2C013",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Regular Fit", "fabric": "Cotton Jersey with High-Density Screen Print", "care": "Do not iron directly on print", "neckline": "Crew Neck"}
    },
    {
      id: 14,
      productId: "PROD-014",
      sku: "MEROX-TSH-014",
      name: "Sports Tee",
      category: "tshirt",
      subcategory: "Everyday Tees & Streetwear",
      price: 649,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/tshirt4.jpeg",
      images: ["images/tshirt4.jpeg"],
      tryOnAsset: "images/tshirt4.jpeg",
      thumbnail: "images/tshirt4.jpeg",
      tryOnType: "garment_preview",
      description: "Moisture-wicking dry-fit performance activewear tee with 4-way stretch.",
      brand: "MeroX Active",
      tags: ["tshirt", "sports", "dry fit", "activewear", "gym", "tops"],
      gender: "Men",
      color: "Grey",
      colors: ["Grey", "Electric Blue", "Anthracite"],
      availableSizes: ["S", "M", "L", "XL"],
      sizes: ["S", "M", "L", "XL"],
      rating: 4.8,
      stockStatus: "In Stock",
      stockQuantity: 28,
      stock: 28,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 1, Casual Wear",
      barcode: "8901234000140",
      qrCode: "MEROX:SKU:MEROX-TSH-014",
      rfid: "RFID-9901-014",
      rfidEpc: "EPC-96-A01B2C014",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Athletic Fit", "fabric": "90% Polyester, 10% Spandex Quick-Dry", "care": "Machine wash cold, air dry", "technology": "AeroVent Ventilation"}
    },
    {
      id: 15,
      productId: "PROD-015",
      sku: "MEROX-TSH-015",
      name: "Plain Tee",
      category: "tshirt",
      subcategory: "Everyday Tees & Streetwear",
      price: 399,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/tshirt5.jpeg",
      images: ["images/tshirt5.jpeg"],
      tryOnAsset: "images/tshirt5.jpeg",
      thumbnail: "images/tshirt5.jpeg",
      tryOnType: "garment_preview",
      description: "Clean, unbranded minimalist crewneck tee in durable pre-shrunk cotton.",
      brand: "MeroX Basics",
      tags: ["tshirt", "plain", "solid", "minimal", "essential", "tops"],
      gender: "Unisex",
      color: "Navy Blue",
      colors: ["Navy Blue", "Olive", "Maroon"],
      availableSizes: ["S", "M", "L", "XL"],
      sizes: ["S", "M", "L", "XL"],
      rating: 4.5,
      stockStatus: "In Stock",
      stockQuantity: 40,
      stock: 40,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 1, Casual Wear",
      barcode: "8901234000157",
      qrCode: "MEROX:SKU:MEROX-TSH-015",
      rfid: "RFID-9901-015",
      rfidEpc: "EPC-96-A01B2C015",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Standard Regular", "fabric": "100% Pre-shrunk Cotton", "care": "Machine wash warm", "neckline": "Crew Neck"}
    },
    {
      id: 16,
      productId: "PROD-016",
      sku: "MEROX-CAP-016",
      name: "Black Cap",
      category: "cap",
      subcategory: "Headwear & Caps",
      price: 299,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/cap1.jpeg",
      images: ["images/cap1.jpeg"],
      tryOnAsset: "images/cap1.jpeg",
      thumbnail: "images/cap1.jpeg",
      tryOnType: "cap",
      description: "Structured 6-panel cotton twill cap with curved visor and brass clasp closure.",
      brand: "MeroX Headwear",
      tags: ["cap", "black cap", "baseball cap", "hat", "accessories"],
      gender: "Unisex",
      color: "Black",
      colors: ["Black", "Charcoal"],
      availableSizes: ["Free Size (Adjustable)"],
      sizes: ["Free Size (Adjustable)"],
      rating: 4.5,
      stockStatus: "In Stock",
      stockQuantity: 26,
      stock: 26,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 1, Accessories Bar",
      barcode: "8901234000164",
      qrCode: "MEROX:SKU:MEROX-CAP-016",
      rfid: "RFID-9901-016",
      rfidEpc: "EPC-96-A01B2C016",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Adjustable Strapback (56-62cm)", "fabric": "100% Heavy Cotton Twill", "care": "Spot clean only", "visor": "Curved Brim"}
    },
    {
      id: 17,
      productId: "PROD-017",
      sku: "MEROX-CAP-017",
      name: "Sports Cap",
      category: "cap",
      subcategory: "Headwear & Caps",
      price: 349,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/cap2.jpeg",
      images: ["images/cap2.jpeg"],
      tryOnAsset: "images/cap2.jpeg",
      thumbnail: "images/cap2.jpeg",
      tryOnType: "cap",
      description: "Featherlight breathable athletic cap with laser-perforated airflow side panels.",
      brand: "MeroX Active",
      tags: ["cap", "sports cap", "running cap", "breathable", "accessories"],
      gender: "Unisex",
      color: "Navy & Red",
      colors: ["Navy & Red", "Black & Silver"],
      availableSizes: ["Free Size (Adjustable)"],
      sizes: ["Free Size (Adjustable)"],
      rating: 4.6,
      stockStatus: "In Stock",
      stockQuantity: 17,
      stock: 17,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 1, Accessories Bar",
      barcode: "8901234000171",
      qrCode: "MEROX:SKU:MEROX-CAP-017",
      rfid: "RFID-9901-017",
      rfidEpc: "EPC-96-A01B2C017",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Ergonomic Performance Fit", "fabric": "Laser-perforated Poly-Spandex", "care": "Hand wash cold", "visor": "Anti-glare Undervisor"}
    },
    {
      id: 18,
      productId: "PROD-018",
      sku: "MEROX-CAP-018",
      name: "White Cap",
      category: "cap",
      subcategory: "Headwear & Caps",
      price: 279,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/cap3.jpeg",
      images: ["images/cap3.jpeg"],
      tryOnAsset: "images/cap3.jpeg",
      thumbnail: "images/cap3.jpeg",
      tryOnType: "cap",
      description: "Minimalist tennis aesthetic clean white cap with moisture-absorbing sweatband.",
      brand: "MeroX Basics",
      tags: ["cap", "white cap", "tennis cap", "minimal", "summer", "accessories"],
      gender: "Unisex",
      color: "White",
      colors: ["White", "Off-White"],
      availableSizes: ["Free Size (Adjustable)"],
      sizes: ["Free Size (Adjustable)"],
      rating: 4.3,
      stockStatus: "In Stock",
      stockQuantity: 21,
      stock: 21,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 1, Accessories Bar",
      barcode: "8901234000188",
      qrCode: "MEROX:SKU:MEROX-CAP-018",
      rfid: "RFID-9901-018",
      rfidEpc: "EPC-96-A01B2C018",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Low Profile 6-Panel", "fabric": "Pure White Cotton Canvas", "care": "Hand wash with mild detergent", "visor": "Classic Curved"}
    },
    {
      id: 19,
      productId: "PROD-019",
      sku: "MEROX-CAP-019",
      name: "Fashion Cap",
      category: "cap",
      subcategory: "Headwear & Caps",
      price: 399,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/cap4.jpeg",
      images: ["images/cap4.jpeg"],
      tryOnAsset: "images/cap4.jpeg",
      thumbnail: "images/cap4.jpeg",
      tryOnType: "cap",
      description: "Streetwear flat-brim snapback with high-density embroidered MeroX emblem.",
      brand: "MeroX Street",
      tags: ["cap", "fashion cap", "snapback", "flat brim", "streetwear", "accessories"],
      gender: "Unisex",
      color: "Grey & Black",
      colors: ["Grey & Black", "Camo Black"],
      availableSizes: ["Free Size (Adjustable)"],
      sizes: ["Free Size (Adjustable)"],
      rating: 4.7,
      stockStatus: "In Stock",
      stockQuantity: 15,
      stock: 15,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 1, Accessories Bar",
      barcode: "8901234000195",
      qrCode: "MEROX:SKU:MEROX-CAP-019",
      rfid: "RFID-9901-019",
      rfidEpc: "EPC-96-A01B2C019",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Structured Flat-Brim Snapback", "fabric": "Wool-Acrylic Blend", "care": "Dry wipe with brush", "visor": "Rigid Flat Brim"}
    },
    {
      id: 20,
      productId: "PROD-020",
      sku: "MEROX-CAP-020",
      name: "Classic Cap",
      category: "cap",
      subcategory: "Headwear & Caps",
      price: 319,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/cap5.jpeg",
      images: ["images/cap5.jpeg"],
      tryOnAsset: "images/cap5.jpeg",
      thumbnail: "images/cap5.jpeg",
      tryOnType: "cap",
      description: "Unstructured dad-hat profile in vintage enzyme-washed cotton for effortless chill.",
      brand: "MeroX Casuals",
      tags: ["cap", "classic cap", "dad hat", "vintage", "relaxed", "accessories"],
      gender: "Unisex",
      color: "Beige",
      colors: ["Beige", "Vintage Khaki", "Washed Olive"],
      availableSizes: ["Free Size (Adjustable)"],
      sizes: ["Free Size (Adjustable)"],
      rating: 4.4,
      stockStatus: "In Stock",
      stockQuantity: 19,
      stock: 19,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 1, Accessories Bar",
      barcode: "8901234000201",
      qrCode: "MEROX:SKU:MEROX-CAP-020",
      rfid: "RFID-9901-020",
      rfidEpc: "EPC-96-A01B2C020",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"fit": "Unstructured Vintage Dad Hat", "fabric": "Enzyme-washed Cotton Chino", "care": "Machine wash delicate", "visor": "Curved Relaxed"}
    },
    {
      id: 21,
      productId: "PROD-021",
      sku: "MEROX-GGL-021",
      name: "Aviator",
      category: "goggles",
      subcategory: "Eyewear & Sunglasses",
      price: 699,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/goggles1.jpeg",
      images: ["images/goggles1.jpeg"],
      tryOnAsset: "images/goggles1.jpeg",
      thumbnail: "images/goggles1.jpeg",
      tryOnType: "goggles",
      description: "Iconic teardrop polarized pilot sunglasses in gold metallic wireframe.",
      brand: "MeroX Eyewear",
      tags: ["goggles", "aviator", "sunglasses", "shades", "pilot", "accessories"],
      gender: "Unisex",
      color: "Gold & Green",
      colors: ["Gold & Green", "Silver & Mirror Blue"],
      availableSizes: ["Medium Standard (58mm)"],
      sizes: ["Medium Standard (58mm)"],
      rating: 4.8,
      stockStatus: "In Stock",
      stockQuantity: 18,
      stock: 18,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 1, Accessories Bar",
      barcode: "8901234000218",
      qrCode: "MEROX:SKU:MEROX-GGL-021",
      rfid: "RFID-9901-021",
      rfidEpc: "EPC-96-A01B2C021",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"lens": "UV400 Polarized Tri-Acetate Cellulose", "frame": "Surgical Stainless Steel Wire", "weight": "22g", "bridge": "Double Brow Bar"}
    },
    {
      id: 22,
      productId: "PROD-022",
      sku: "MEROX-GGL-022",
      name: "Square",
      category: "goggles",
      subcategory: "Eyewear & Sunglasses",
      price: 799,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/goggles2.jpeg",
      images: ["images/goggles2.jpeg"],
      tryOnAsset: "images/goggles2.jpeg",
      thumbnail: "images/goggles2.jpeg",
      tryOnType: "goggles",
      description: "Chunky modern acetate square frame offering assertive architectural presence.",
      brand: "MeroX Eyewear",
      tags: ["goggles", "square", "sunglasses", "wayfarer", "bold", "accessories"],
      gender: "Unisex",
      color: "Tortoise Shell",
      colors: ["Tortoise Shell", "Matte Black"],
      availableSizes: ["Standard Frame (54mm)"],
      sizes: ["Standard Frame (54mm)"],
      rating: 4.6,
      stockStatus: "In Stock",
      stockQuantity: 13,
      stock: 13,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 1, Accessories Bar",
      barcode: "8901234000225",
      qrCode: "MEROX:SKU:MEROX-GGL-022",
      rfid: "RFID-9901-022",
      rfidEpc: "EPC-96-A01B2C022",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"lens": "Anti-glare Gradient Polycarbonate", "frame": "Handcrafted Cellulose Acetate", "weight": "32g", "hinges": "5-Barrel Precision Hinges"}
    },
    {
      id: 23,
      productId: "PROD-023",
      sku: "MEROX-GGL-023",
      name: "Round",
      category: "goggles",
      subcategory: "Eyewear & Sunglasses",
      price: 749,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/goggles3.jpeg",
      images: ["images/goggles3.jpeg"],
      tryOnAsset: "images/goggles3.jpeg",
      thumbnail: "images/goggles3.jpeg",
      tryOnType: "goggles",
      description: "Bohemian retro circular wireframe sunglasses with dark tinted lenses.",
      brand: "MeroX Eyewear",
      tags: ["goggles", "round", "circular", "retro", "vintage", "accessories"],
      gender: "Unisex",
      color: "Silver & Black",
      colors: ["Silver & Black", "Gold & Amber"],
      availableSizes: ["Standard Round (50mm)"],
      sizes: ["Standard Round (50mm)"],
      rating: 4.5,
      stockStatus: "In Stock",
      stockQuantity: 16,
      stock: 16,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 1, Accessories Bar",
      barcode: "8901234000232",
      qrCode: "MEROX:SKU:MEROX-GGL-023",
      rfid: "RFID-9901-023",
      rfidEpc: "EPC-96-A01B2C023",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"lens": "UV400 Tinted Optical Glass", "frame": "Ultralight Monel Alloy", "weight": "19g", "nosePads": "Medical Grade Silicone"}
    },
    {
      id: 24,
      productId: "PROD-024",
      sku: "MEROX-GGL-024",
      name: "Sports",
      category: "goggles",
      subcategory: "Eyewear & Sunglasses",
      price: 899,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/goggles4.jpeg",
      images: ["images/goggles4.jpeg"],
      tryOnAsset: "images/goggles4.jpeg",
      thumbnail: "images/goggles4.jpeg",
      tryOnType: "goggles",
      description: "Aerodynamic wraparound sports performance shades with rubberized temples.",
      brand: "MeroX Active",
      tags: ["goggles", "sports", "wraparound", "running", "cycling", "accessories"],
      gender: "Unisex",
      color: "Matte Black & Red",
      colors: ["Matte Black & Red", "Neon Yellow & Mirror"],
      availableSizes: ["Wrap Shield (65mm)"],
      sizes: ["Wrap Shield (65mm)"],
      rating: 4.7,
      stockStatus: "In Stock",
      stockQuantity: 11,
      stock: 11,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 1, Accessories Bar",
      barcode: "8901234000249",
      qrCode: "MEROX:SKU:MEROX-GGL-024",
      rfid: "RFID-9901-024",
      rfidEpc: "EPC-96-A01B2C024",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"lens": "Shatterproof Polycarbonate Hydrophobic", "frame": "TR90 Grilamid Memory Polymer", "weight": "26g", "venting": "Anti-Fog Channeling"}
    },
    {
      id: 25,
      productId: "PROD-025",
      sku: "MEROX-GGL-025",
      name: "Black Shade",
      category: "goggles",
      subcategory: "Eyewear & Sunglasses",
      price: 649,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/goggles5.jpeg",
      images: ["images/goggles5.jpeg"],
      tryOnAsset: "images/goggles5.jpeg",
      thumbnail: "images/goggles5.jpeg",
      tryOnType: "goggles",
      description: "All-black blackout sunglasses providing 100% UV400 glare filtering.",
      brand: "MeroX Eyewear",
      tags: ["goggles", "black shade", "dark shades", "blackout", "accessories"],
      gender: "Unisex",
      color: "Pitch Black",
      colors: ["Pitch Black"],
      availableSizes: ["Standard Frame (55mm)"],
      sizes: ["Standard Frame (55mm)"],
      rating: 4.6,
      stockStatus: "In Stock",
      stockQuantity: 22,
      stock: 22,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 1, Accessories Bar",
      barcode: "8901234000256",
      qrCode: "MEROX:SKU:MEROX-GGL-025",
      rfid: "RFID-9901-025",
      rfidEpc: "EPC-96-A01B2C025",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"lens": "Category 3 Pitch Dark Polarized", "frame": "Matte Polycarbonate", "weight": "28g", "protection": "100% UVA / UVB / UVC"}
    },
    {
      id: 26,
      productId: "PROD-026",
      sku: "MEROX-SHO-026",
      name: "Running Shoes",
      category: "shoe",
      subcategory: "Footwear & Sneakers",
      price: 1999,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/shoe1.jpeg",
      images: ["images/shoe1.jpeg"],
      tryOnAsset: "images/shoe1.jpeg",
      thumbnail: "images/shoe1.jpeg",
      tryOnType: "footwear_preview",
      description: "Responsive nitrogen-infused foam running shoes for long-distance comfort.",
      brand: "MeroX Athletics",
      tags: ["shoe", "running shoes", "athletic", "sneakers", "sports", "footwear"],
      gender: "Men",
      color: "Grey & Orange",
      colors: ["Grey & Orange", "Triple Black"],
      availableSizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
      sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
      rating: 4.8,
      stockStatus: "In Stock",
      stockQuantity: 14,
      stock: 14,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 2, Footwear Studio",
      barcode: "8901234000263",
      qrCode: "MEROX:SKU:MEROX-SHO-026",
      rfid: "RFID-9901-026",
      rfidEpc: "EPC-96-A01B2C026",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"upper": "Engineered Jacquard Breathable Mesh", "midsole": "Nitrogen Cushion Foam EVA", "outsole": "High-Abrasion Carbon Rubber", "drop": "8mm Heel-to-toe"}
    },
    {
      id: 27,
      productId: "PROD-027",
      sku: "MEROX-SHO-027",
      name: "Casual Shoes",
      category: "shoe",
      subcategory: "Footwear & Sneakers",
      price: 1799,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/shoe2.jpeg",
      images: ["images/shoe2.jpeg"],
      tryOnAsset: "images/shoe2.jpeg",
      thumbnail: "images/shoe2.jpeg",
      tryOnType: "footwear_preview",
      description: "Versatile suede leather lace-up casual kicks with memory foam insoles.",
      brand: "MeroX Footwear",
      tags: ["shoe", "casual shoes", "loafers", "everyday", "footwear"],
      gender: "Men",
      color: "Tan Brown",
      colors: ["Tan Brown", "Navy Suede"],
      availableSizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
      sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
      rating: 4.5,
      stockStatus: "In Stock",
      stockQuantity: 16,
      stock: 16,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 2, Footwear Studio",
      barcode: "8901234000270",
      qrCode: "MEROX:SKU:MEROX-SHO-027",
      rfid: "RFID-9901-027",
      rfidEpc: "EPC-96-A01B2C027",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"upper": "Genuine Suede Leather", "insole": "Orthopedic Memory Foam", "outsole": "Flexible Vulcanized Rubber", "style": "Low-top Derby"}
    },
    {
      id: 28,
      productId: "PROD-028",
      sku: "MEROX-SHO-028",
      name: "Sneakers",
      category: "shoe",
      subcategory: "Footwear & Sneakers",
      price: 1899,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/shoe3.jpeg",
      images: ["images/shoe3.jpeg"],
      tryOnAsset: "images/shoe3.jpeg",
      thumbnail: "images/shoe3.jpeg",
      tryOnType: "footwear_preview",
      description: "Chunky silhouette retro cupsole street sneakers with reinforced eyelets.",
      brand: "MeroX Street",
      tags: ["shoe", "sneakers", "streetwear", "retro", "kicks", "footwear"],
      gender: "Unisex",
      color: "Multi Color",
      colors: ["Multi Color", "Monochrome White/Grey"],
      availableSizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
      sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
      rating: 4.7,
      stockStatus: "In Stock",
      stockQuantity: 12,
      stock: 12,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 2, Footwear Studio",
      barcode: "8901234000287",
      qrCode: "MEROX:SKU:MEROX-SHO-028",
      rfid: "RFID-9901-028",
      rfidEpc: "EPC-96-A01B2C028",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"upper": "Layered Microfiber & Ripstop Fabric", "midsole": "Chunky Sculpted Phylon", "outsole": "Non-marking Rubber Grippers", "style": "Retro Chunky Runner"}
    },
    {
      id: 29,
      productId: "PROD-029",
      sku: "MEROX-SHO-029",
      name: "Formal Shoes",
      category: "shoe",
      subcategory: "Footwear & Sneakers",
      price: 2199,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/shoe4.jpeg",
      images: ["images/shoe4.jpeg"],
      tryOnAsset: "images/shoe4.jpeg",
      thumbnail: "images/shoe4.jpeg",
      tryOnType: "footwear_preview",
      description: "Hand-burnished full-grain leather Oxford dress shoes for formal authority.",
      brand: "MeroX Formal",
      tags: ["shoe", "formal shoes", "oxfords", "leather", "office", "footwear"],
      gender: "Men",
      color: "Polished Black",
      colors: ["Polished Black", "Cognac Brown"],
      availableSizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
      sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
      rating: 4.9,
      stockStatus: "In Stock",
      stockQuantity: 10,
      stock: 10,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 2, Footwear Studio",
      barcode: "8901234000294",
      qrCode: "MEROX:SKU:MEROX-SHO-029",
      rfid: "RFID-9901-029",
      rfidEpc: "EPC-96-A01B2C029",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"upper": "Full Grain Argentine Calf Leather", "sole": "Stacked Leather Sole with Rubber Inset", "construction": "Goodyear Welted", "closure": "Closed Lace Oxford"}
    },
    {
      id: 30,
      productId: "PROD-030",
      sku: "MEROX-SHO-030",
      name: "White Shoes",
      category: "shoe",
      subcategory: "Footwear & Sneakers",
      price: 1699,
      currency: "INR",
      currencySymbol: "₹",
      image: "images/shoe5.jpeg",
      images: ["images/shoe5.jpeg"],
      tryOnAsset: "images/shoe5.jpeg",
      thumbnail: "images/shoe5.jpeg",
      tryOnType: "footwear_preview",
      description: "Clean minimalist white tennis court sneakers crafted from smooth matte leather.",
      brand: "MeroX Basics",
      tags: ["shoe", "white shoes", "sneakers", "minimalist", "clean", "footwear"],
      gender: "Unisex",
      color: "Pure White",
      colors: ["Pure White", "White with Green Tab"],
      availableSizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
      sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
      rating: 4.7,
      stockStatus: "In Stock",
      stockQuantity: 20,
      stock: 20,
      storeId: "STORE-MUM-01",
      storeName: "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
      location: "Floor 2, Footwear Studio",
      barcode: "8901234000300",
      qrCode: "MEROX:SKU:MEROX-SHO-030",
      rfid: "RFID-9901-030",
      rfidEpc: "EPC-96-A01B2C030",
      discount: 0,
      status: "active",
      tryOnStatus: "available",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      metadata: {"upper": "Premium Action Leather", "sole": "Durable Stitched Rubber Cupsole", "lining": "Breathable Mesh", "style": "Minimalist Court Sneaker"}
    }
  ];

  // Category search alias map (normalized query -> canonical category)
  const CATEGORY_ALIASES = {
    jeans: ["jean", "jeans", "denim", "pant", "pants", "bottom", "bottoms", "trouser", "trousers"],
    shirt: ["shirt", "shirts", "formal shirt", "casual shirt", "checked shirt"],
    tshirt: ["tshirt", "tshirts", "t-shirt", "t-shirts", "tee", "tees", "round neck", "oversize"],
    cap: ["cap", "caps", "hat", "hats", "headwear", "snapback", "baseball cap"],
    goggles: ["goggles", "goggle", "glasses", "sunglasses", "shades", "aviator", "eyewear", "spectacles"],
    shoe: ["shoe", "shoes", "sneaker", "sneakers", "footwear", "running shoes", "loafers", "boots"]
  };

  // High-performance hash lookup indices for Retail Kiosk & Barcode/QR Scanning
  const skuIndex = new Map();
  const barcodeIndex = new Map();
  const qrIndex = new Map();
  const rfidIndex = new Map();
  const idIndex = new Map();

  const OVERRIDE_KEY = "merox_admin_catalog_override";
  const AUDIT_LOG_KEY = "merox_admin_audit_log";

  function indexProduct(p) {
    if (!p) return;
    if (p.id !== undefined && p.id !== null) idIndex.set(Number(p.id), p);
    if (p.sku) skuIndex.set(String(p.sku).trim().toUpperCase(), p);
    if (p.barcode) barcodeIndex.set(String(p.barcode).trim(), p);
    if (p.qrCode) qrIndex.set(String(p.qrCode).trim().toUpperCase(), p);
    if (p.rfid) rfidIndex.set(String(p.rfid).trim().toUpperCase(), p);
    if (p.rfidEpc) rfidIndex.set(String(p.rfidEpc).trim().toUpperCase(), p);
  }

  function emitCatalogChanged(detail) {
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      try {
        const ev = new CustomEvent("merox_catalog_changed", { detail: detail || {} });
        window.dispatchEvent(ev);
      } catch (e) {}
    }
  }

  function saveCatalogState() {
    try {
      if (typeof localStorage === "undefined") return;
      const overrides = {
        updated: {},
        created: [],
        timestamp: new Date().toISOString()
      };
      
      PRODUCTS.forEach(p => {
        if (p.id > 30) {
          overrides.created.push(p);
        } else {
          overrides.updated[p.id] = {
            name: p.name,
            price: p.price,
            discount: p.discount,
            stock: p.stock,
            stockQuantity: p.stockQuantity,
            stockStatus: p.stockStatus,
            status: p.status,
            storeId: p.storeId,
            location: p.location,
            tryOnType: p.tryOnType,
            tryOnStatus: p.tryOnStatus,
            description: p.description,
            tags: p.tags,
            colors: p.colors,
            sizes: p.sizes,
            updatedAt: p.updatedAt
          };
        }
      });
      localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
    } catch (e) {
      console.warn("MeroX Catalog: LocalStorage write notice:", e);
    }
  }

  function loadCatalogState() {
    try {
      if (typeof localStorage === "undefined") return;
      const raw = localStorage.getItem(OVERRIDE_KEY);
      if (!raw) return;
      const overrides = JSON.parse(raw);
      if (overrides && overrides.updated) {
        Object.keys(overrides.updated).forEach(idStr => {
          const id = Number(idStr);
          const p = PRODUCTS.find(item => item.id === id);
          if (p) {
            Object.assign(p, overrides.updated[idStr]);
            p.stockQuantity = p.stock;
            if (p.stock > 5) p.stockStatus = "In Stock";
            else if (p.stock > 0) p.stockStatus = "Low Stock";
            else p.stockStatus = "Out of Stock";
          }
        });
      }
      if (overrides && Array.isArray(overrides.created)) {
        overrides.created.forEach(newP => {
          if (!PRODUCTS.some(item => item.id === newP.id || item.sku === newP.sku)) {
            PRODUCTS.push(newP);
          }
        });
      }
    } catch (e) {
      console.warn("MeroX Catalog: LocalStorage read notice:", e);
    }
  }

  // Populate indices for all base products
  PRODUCTS.forEach(indexProduct);
  // Overlay any dynamically persisted admin modifications
  loadCatalogState();
  // Re-index to ensure any overrides are indexed
  PRODUCTS.forEach(indexProduct);

  /**
   * Normalize search string: trims whitespace, lowers case, removes punctuation
   */
  function normalizeQuery(q) {
    if (!q || typeof q !== "string") return "";
    return q
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, " ");
  }

  /**
   * Search catalog products by keywords, tags, brand, category, and plural aliases
   */
  function searchProducts(rawQuery) {
    const query = normalizeQuery(rawQuery);
    if (!query) return [];

    // Check if query directly matches any known category alias
    let targetCategory = null;
    for (const [cat, aliases] of Object.entries(CATEGORY_ALIASES)) {
      if (aliases.some(alias => query === alias || query.startsWith(alias + " ") || query.endsWith(" " + alias))) {
        targetCategory = cat;
        break;
      }
    }

    // If query matches a category alias, return complete relevant collection
    if (targetCategory) {
      if (query === "shirt" || query === "shirts") {
        return PRODUCTS.filter(p => p.category === "shirt" || p.category === "tshirt");
      }
      return PRODUCTS.filter(p => p.category === targetCategory);
    }

    // Token-based fuzzy search against name, category, tags, brand, color, description, subcategory
    const tokens = query.split(/\s+/).filter(Boolean);

    return PRODUCTS.filter(p => {
      const searchTarget = [
        p.name.toLowerCase(),
        p.category.toLowerCase(),
        (p.subcategory || "").toLowerCase(),
        p.brand.toLowerCase(),
        p.color.toLowerCase(),
        p.description.toLowerCase(),
        (p.sku || "").toLowerCase(),
        ...(p.tags || []).map(t => t.toLowerCase())
      ].join(" ");

      return tokens.every(token => {
        // Handle singular/plural tolerance (e.g. "shoes" -> "shoe", "shirts" -> "shirt")
        const dePlural = token.endsWith("s") ? token.slice(0, -1) : token;
        return searchTarget.includes(token) || searchTarget.includes(dePlural);
      });
    });
  }

  /**
   * Catalog API with O(1) Indexing & Retail Store Support
   */
  const MeroXCatalog = {
    getAll: () => [...PRODUCTS],
    getById: (id) => idIndex.get(Number(id)) || PRODUCTS.find(p => p.id === Number(id)) || null,
    
    // O(1) Retail Index Lookups
    bySku: (sku) => {
      if (!sku) return null;
      return skuIndex.get(String(sku).trim().toUpperCase()) || null;
    },
    
    byBarcode: (barcode) => {
      if (!barcode) return null;
      return barcodeIndex.get(String(barcode).trim()) || null;
    },
    
    byQr: (qrString) => {
      if (!qrString) return null;
      const str = String(qrString).trim().toUpperCase();
      if (qrIndex.has(str)) return qrIndex.get(str);
      // If QR format is MEROX:SKU:<sku> or contains SKU
      const match = str.match(/MEROX:SKU:([A-Z0-9-]+)/) || str.match(/(MEROX-[A-Z]+-[0-9]+)/);
      if (match && match[1]) {
        return skuIndex.get(match[1]) || null;
      }
      return null;
    },

    byRfid: (rfid) => {
      if (!rfid) return null;
      return rfidIndex.get(String(rfid).trim().toUpperCase()) || null;
    },

    /**
     * Unified Resolver: Resolves any identifier: Barcode, SKU, QR string, RFID, numeric ID, or exact name
     */
    findAny: (identifier) => {
      if (!identifier && identifier !== 0) return null;
      const str = String(identifier).trim();
      if (!str) return null;

      // 1. Try Barcode
      const fromBarcode = barcodeIndex.get(str);
      if (fromBarcode) return fromBarcode;

      // 2. Try SKU
      const fromSku = skuIndex.get(str.toUpperCase());
      if (fromSku) return fromSku;

      // 3. Try QR
      const fromQr = MeroXCatalog.byQr(str);
      if (fromQr) return fromQr;

      // 4. Try RFID
      const fromRfid = rfidIndex.get(str.toUpperCase());
      if (fromRfid) return fromRfid;

      // 5. Try numeric ID
      const num = Number(str);
      if (!isNaN(num) && idIndex.has(num)) {
        return idIndex.get(num);
      }

      // 6. Try exact or normalized name match
      const lower = str.toLowerCase();
      const byName = PRODUCTS.find(p => p.name.toLowerCase() === lower);
      if (byName) return byName;

      return null;
    },

    getByCategory: (category) => {
      const cat = (category || "").toLowerCase().trim();
      return PRODUCTS.filter(p => p.category === cat);
    },

    getByStore: (storeId) => {
      if (!storeId) return [...PRODUCTS];
      const sid = String(storeId).trim();
      return PRODUCTS.filter(p => p.storeId === sid);
    },

    getAllStores: () => [...STORES],

    search: searchProducts,

    // The 5 locked recommended products on Dashboard
    getRecommended: () => [
      PRODUCTS.find(p => p.id === 6),  // Men Shirt (₹899)
      PRODUCTS.find(p => p.id === 11), // T-Shirt (₹499)
      PRODUCTS.find(p => p.id === 1),  // Cotton Pant / Jeans (₹1,199 / ₹1,499)
      PRODUCTS.find(p => p.id === 5),  // Blue Jeans / Classic Denim (₹1,499)
      PRODUCTS.find(p => p.id === 21)  // Goggles (₹699)
    ].filter(Boolean),

    // Safe image fallback
    getImageFallback: (category) => {
      return "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20fill%3D%22%23888%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%3EMeroX%20Product%3C%2Ftext%3E%3C%2Fsvg%3E";
    },

    /**
     * Scalable Catalog Onboarding: JSON array or CSV string import
     * Validates required fields, checks for duplicate SKUs, updates indices
     */
        /**
     * Enhanced Scalable Catalog Onboarding: JSON array or CSV string import
     * Supports Step 1 (dryRun: true) for preview & validation matrix, and Step 2 commit
     */
    importProducts: (input, options = {}) => {
      const dryRun = Boolean(options.dryRun);
      const actor = options.actor || "Store Admin";
      const errors = [];
      const rowResults = [];
      let records = [];

      try {
        if (typeof input === "string") {
          const trimmed = input.trim();
          if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
            const parsed = JSON.parse(trimmed);
            records = Array.isArray(parsed) ? parsed : [parsed];
          } else {
            // Parse CSV format
            const lines = trimmed.split(/\r?\n/).filter(line => line.trim().length > 0);
            if (lines.length > 1) {
              const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
              for (let i = 1; i < lines.length; i++) {
                const rowStr = lines[i];
                const values = [];
                let inQuotes = false;
                let curVal = "";
                for (let c = 0; c < rowStr.length; c++) {
                  const ch = rowStr[c];
                  if (ch === '"' && (c === 0 || rowStr[c - 1] !== '\\')) {
                    inQuotes = !inQuotes;
                  } else if (ch === ',' && !inQuotes) {
                    values.push(curVal.trim().replace(/^["']|["']$/g, ""));
                    curVal = "";
                  } else {
                    curVal += ch;
                  }
                }
                values.push(curVal.trim().replace(/^["']|["']$/g, ""));
                const row = {};
                headers.forEach((h, idx) => {
                  row[h] = values[idx] || "";
                });
                records.push(row);
              }
            } else {
              return { success: false, importedCount: 0, dryRun, errors: ["CSV input has no data rows"], rows: [] };
            }
          }
        } else if (Array.isArray(input)) {
          records = input;
        } else if (input && typeof input === "object") {
          records = [input];
        } else {
          return { success: false, importedCount: 0, dryRun, errors: ["Invalid input format"], rows: [] };
        }
      } catch (e) {
        return { success: false, importedCount: 0, dryRun, errors: ["Failed to parse import payload: " + e.message], rows: [] };
      }

      let validCount = 0;
      const seenBatchSkus = new Set();
      const seenBatchBarcodes = new Set();

      records.forEach((record, idx) => {
        const rowNum = idx + 1;
        const rowErrors = [];

        if (!record.sku || !String(record.sku).trim()) {
          rowErrors.push("Missing required field 'sku'");
        }
        const skuKey = String(record.sku || "").trim().toUpperCase();
        if (skuKey) {
          if (skuIndex.has(skuKey) || seenBatchSkus.has(skuKey)) {
            rowErrors.push(`Duplicate SKU '${skuKey}' rejected`);
          }
        }

        if (!record.name || !String(record.name).trim()) {
          rowErrors.push("Missing required field 'name'");
        }
        if (!record.category || !String(record.category).trim()) {
          rowErrors.push("Missing required field 'category'");
        }

        const priceNum = Number(record.price);
        if (isNaN(priceNum) || priceNum <= 0) {
          rowErrors.push(`Invalid or missing price '${record.price}'`);
        }

        const rawStock = record.stock !== undefined ? record.stock : record.stockQuantity;
        const stockNum = rawStock !== undefined ? Number(rawStock) : 10;
        if (isNaN(stockNum) || stockNum < 0) {
          rowErrors.push(`Invalid stock value '${record.stock}'`);
        }

        if (record.barcode) {
          const bc = String(record.barcode).trim();
          if (barcodeIndex.has(bc) || seenBatchBarcodes.has(bc)) {
            rowErrors.push(`Duplicate barcode '${bc}' rejected`);
          }
        }

        if (rowErrors.length > 0) {
          rowResults.push({
            rowNum,
            sku: skuKey || `ROW-${rowNum}`,
            name: record.name || "Unknown",
            status: "error",
            errors: rowErrors
          });
          errors.push(`Row ${rowNum}: ${rowErrors.join(", ")}`);
          return;
        }

        seenBatchSkus.add(skuKey);
        if (record.barcode) seenBatchBarcodes.add(String(record.barcode).trim());

        const newId = PRODUCTS.length > 0 ? Math.max(...PRODUCTS.map(p => p.id || 0)) + 1 : 1;
        const defaultBarcode = record.barcode || ("8901234" + String(newId).padStart(6, "0"));
        const defaultQr = record.qrCode || `MEROX:SKU:${skuKey}`;
        const defaultRfid = record.rfid || `RFID-9901-${String(newId).padStart(3, "0")}`;
        const defaultEpc = record.rfidEpc || `EPC-96-A01B2C${String(newId).padStart(3, "0")}`;

        const newProduct = {
          id: newId,
          productId: record.productId || `PROD-${String(newId).padStart(3, "0")}`,
          sku: skuKey,
          name: String(record.name).trim(),
          category: String(record.category).trim().toLowerCase(),
          subcategory: record.subcategory || "General Fashion",
          price: priceNum,
          discount: Number(record.discount) || 0,
          currency: record.currency || "INR",
          currencySymbol: record.currencySymbol || "₹",
          image: record.image || MeroXCatalog.getImageFallback(record.category),
          images: Array.isArray(record.images) ? record.images : [record.image || MeroXCatalog.getImageFallback(record.category)],
          thumbnail: record.thumbnail || record.image || MeroXCatalog.getImageFallback(record.category),
          tryOnAsset: record.tryOnAsset || record.image || MeroXCatalog.getImageFallback(record.category),
          tryOnType: record.tryOnType || (record.category === "goggles" ? "goggles" : record.category === "cap" ? "cap" : record.category === "shoe" ? "footwear_preview" : "garment_preview"),
          tryOnStatus: record.tryOnStatus || "available",
          description: record.description || `${record.name} - Quality retail merchandise`,
          brand: record.brand || "MeroX Retail",
          tags: Array.isArray(record.tags) ? record.tags : (record.tags ? String(record.tags).split(",").map(t => t.trim()) : [record.category]),
          gender: record.gender || "Unisex",
          color: record.color || "Standard",
          colors: Array.isArray(record.colors) ? record.colors : [record.color || "Standard"],
          availableSizes: Array.isArray(record.availableSizes) ? record.availableSizes : ["S", "M", "L", "XL"],
          sizes: Array.isArray(record.sizes) ? record.sizes : ["S", "M", "L", "XL"],
          rating: Number(record.rating) || 4.5,
          stock: stockNum,
          stockQuantity: stockNum,
          stockStatus: stockNum > 5 ? "In Stock" : stockNum > 0 ? "Low Stock" : "Out of Stock",
          status: record.status || "active",
          storeId: record.storeId || "STORE-MUM-01",
          storeName: record.storeName || "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
          location: record.location || "Floor 2, Men's Section",
          barcode: defaultBarcode,
          qrCode: defaultQr,
          rfid: defaultRfid,
          rfidEpc: defaultEpc,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metadata: record.metadata || { imported: true, importTimestamp: new Date().toISOString() }
        };

        rowResults.push({
          rowNum,
          sku: skuKey,
          name: newProduct.name,
          status: "valid",
          productPreview: newProduct
        });
        validCount++;

        if (!dryRun) {
          PRODUCTS.push(newProduct);
          indexProduct(newProduct);
        }
      });

      if (!dryRun && validCount > 0) {
        saveCatalogState();
        MeroXCatalog.logAudit("IMPORT", `BATCH-${Date.now()}`, `Imported ${validCount} products successfully`, actor);
        emitCatalogChanged({ action: "IMPORT", count: validCount });
      }

      return {
        success: validCount > 0,
        dryRun,
        importedCount: dryRun ? 0 : validCount,
        validCount,
        errorCount: errors.length,
        rows: rowResults,
        errors
      };
    },

    // =========================================================================
    // STORE ADMIN & INVENTORY MANAGEMENT SUITE (Phase 11)
    // =========================================================================

    /**
     * Get Filtered Products with Pagination, Facets, and Multi-Store Support
     */
    getFilteredProducts: (options = {}) => {
      const {
        search = "",
        category = "all",
        stockStatus = "all",
        status = "all",
        storeId = "all",
        tryOnStatus = "all",
        sortBy = "id",
        sortOrder = "asc",
        page = 1,
        pageSize = 10
      } = options;

      let filtered = [...PRODUCTS];

      // Status filter (active/inactive/all)
      if (status && status !== "all") {
        filtered = filtered.filter(p => (p.status || "active").toLowerCase() === status.toLowerCase());
      }

      // Category filter
      if (category && category !== "all") {
        const cat = category.toLowerCase().trim();
        filtered = filtered.filter(p => (p.category || "").toLowerCase() === cat);
      }

      // Store filter
      if (storeId && storeId !== "all") {
        filtered = filtered.filter(p => p.storeId === storeId);
      }

      // Stock Status filter
      if (stockStatus && stockStatus !== "all") {
        const target = stockStatus.toLowerCase().replace(/[\s_-]/g, "");
        filtered = filtered.filter(p => {
          const s = (p.stockStatus || "instock").toLowerCase().replace(/[\s_-]/g, "");
          return s === target;
        });
      }

      // Try-on status filter
      if (tryOnStatus && tryOnStatus !== "all") {
        filtered = filtered.filter(p => (p.tryOnStatus || "available").toLowerCase() === tryOnStatus.toLowerCase());
      }

      // Live search filter across SKU, Barcode, Name, Brand, Tags
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter(p => {
          return (
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.sku && p.sku.toLowerCase().includes(q)) ||
            (p.barcode && p.barcode.includes(q)) ||
            (p.brand && p.brand.toLowerCase().includes(q)) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
          );
        });
      }

      // Sort
      filtered.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();
        if (valA < valB) return sortOrder === "desc" ? 1 : -1;
        if (valA > valB) return sortOrder === "desc" ? -1 : 1;
        return 0;
      });

      const totalCount = filtered.length;
      const validPageSize = Math.max(1, Number(pageSize) || 10);
      const totalPages = Math.ceil(totalCount / validPageSize) || 1;
      const validPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
      const startIndex = (validPage - 1) * validPageSize;
      const paginatedItems = filtered.slice(startIndex, startIndex + validPageSize);

      return {
        items: paginatedItems,
        totalCount,
        page: validPage,
        pageSize: validPageSize,
        totalPages
      };
    },

    /**
     * Create Product with strict validation & index updates
     */
    createProduct: (data, actor = "Store Admin") => {
      if (!data || typeof data !== "object") {
        return { success: false, error: "Invalid product data payload." };
      }

      const name = String(data.name || "").trim();
      if (!name) return { success: false, error: "Product name is required." };

      const category = String(data.category || "").trim().toLowerCase();
      if (!category) return { success: false, error: "Product category is required." };

      const price = Number(data.price);
      if (isNaN(price) || price <= 0) return { success: false, error: "Price must be a positive number." };

      const stockNum = Number(data.stock !== undefined ? data.stock : 10);
      if (isNaN(stockNum) || stockNum < 0) return { success: false, error: "Stock count cannot be negative." };

      const newId = PRODUCTS.length > 0 ? Math.max(...PRODUCTS.map(p => p.id || 0)) + 1 : 1;

      // SKU validation & generation
      let skuKey = data.sku ? String(data.sku).trim().toUpperCase() : `MEROX-${category.substring(0, 3).toUpperCase()}-${String(newId).padStart(3, "0")}`;
      if (skuIndex.has(skuKey)) {
        return { success: false, error: `SKU '${skuKey}' already exists in catalog.` };
      }

      // Barcode validation & generation
      let barcodeStr = data.barcode ? String(data.barcode).trim() : `8901234${String(newId).padStart(6, "0")}`;
      if (barcodeIndex.has(barcodeStr)) {
        return { success: false, error: `Barcode '${barcodeStr}' already exists in catalog.` };
      }

      const defaultQr = data.qrCode || `MEROX:SKU:${skuKey}`;
      const defaultRfid = data.rfid || `RFID-9901-${String(newId).padStart(3, "0")}`;
      const defaultEpc = data.rfidEpc || `EPC-96-A01B2C${String(newId).padStart(3, "0")}`;
      const fallbackImg = MeroXCatalog.getImageFallback(category);
      const img = data.image || fallbackImg;

      const newProduct = {
        id: newId,
        productId: data.productId || `PROD-${String(newId).padStart(3, "0")}`,
        sku: skuKey,
        name: name,
        category: category,
        subcategory: data.subcategory || "General Fashion",
        brand: data.brand ? String(data.brand).trim() : "MeroX Retail",
        description: data.description ? String(data.description).trim() : `${name} - Exclusive retail merchandise`,
        price: price,
        discount: Number(data.discount) || 0,
        currency: data.currency || "INR",
        currencySymbol: data.currencySymbol || "₹",
        image: img,
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [img],
        thumbnail: data.thumbnail || img,
        tryOnAsset: data.tryOnAsset || img,
        tryOnType: data.tryOnType || (category === "goggles" ? "goggles" : category === "cap" ? "cap" : category === "shoe" ? "footwear_preview" : "garment_preview"),
        tryOnStatus: data.tryOnStatus || "available",
        tags: Array.isArray(data.tags) ? data.tags : (data.tags ? String(data.tags).split(",").map(t => t.trim()) : [category]),
        gender: data.gender || "Unisex",
        color: data.color || "Standard",
        colors: Array.isArray(data.colors) ? data.colors : [data.color || "Standard"],
        availableSizes: Array.isArray(data.availableSizes) ? data.availableSizes : ["S", "M", "L", "XL"],
        sizes: Array.isArray(data.sizes) ? data.sizes : ["S", "M", "L", "XL"],
        rating: Number(data.rating) || 4.5,
        stock: stockNum,
        stockQuantity: stockNum,
        stockStatus: stockNum > 5 ? "In Stock" : stockNum > 0 ? "Low Stock" : "Out of Stock",
        status: data.status || "active",
        storeId: data.storeId || "STORE-MUM-01",
        storeName: data.storeName || "MeroX Flagship Kiosk — Mumbai Phoenix Mall",
        location: data.location || "Floor 2, Retail Floor",
        barcode: barcodeStr,
        qrCode: defaultQr,
        rfid: defaultRfid,
        rfidEpc: defaultEpc,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: data.metadata || { adminCreated: true }
      };

      PRODUCTS.push(newProduct);
      indexProduct(newProduct);
      saveCatalogState();

      MeroXCatalog.logAudit("CREATE", newProduct.sku, `Created product '${newProduct.name}' (Price: ₹${newProduct.price}, Stock: ${newProduct.stock})`, actor);
      emitCatalogChanged({ action: "CREATE", product: newProduct });

      return { success: true, product: newProduct };
    },

    /**
     * Update Existing Product
     */
    updateProduct: (idOrSku, updates = {}, actor = "Store Admin") => {
      const p = MeroXCatalog.findAny(idOrSku);
      if (!p) return { success: false, error: `Product '${idOrSku}' not found.` };

      // Validate SKU uniqueness if changing SKU
      if (updates.sku) {
        const newSku = String(updates.sku).trim().toUpperCase();
        if (newSku !== p.sku && skuIndex.has(newSku)) {
          return { success: false, error: `SKU '${newSku}' already in use by another product.` };
        }
        skuIndex.delete(p.sku);
        p.sku = newSku;
        skuIndex.set(newSku, p);
      }

      // Validate Barcode uniqueness if changing Barcode
      if (updates.barcode) {
        const newBarcode = String(updates.barcode).trim();
        if (newBarcode !== p.barcode && barcodeIndex.has(newBarcode)) {
          return { success: false, error: `Barcode '${newBarcode}' already in use.` };
        }
        barcodeIndex.delete(p.barcode);
        p.barcode = newBarcode;
        barcodeIndex.set(newBarcode, p);
      }

      // Validate Price
      if (updates.price !== undefined) {
        const pr = Number(updates.price);
        if (isNaN(pr) || pr <= 0) return { success: false, error: "Price must be a positive number." };
        p.price = pr;
      }

      // Validate Stock & update stockStatus
      if (updates.stock !== undefined || updates.stockQuantity !== undefined) {
        const raw = updates.stock !== undefined ? updates.stock : updates.stockQuantity;
        const st = Number(raw);
        if (isNaN(st) || st < 0) return { success: false, error: "Stock count cannot be negative." };
        p.stock = st;
        p.stockQuantity = st;
        p.stockStatus = st > 5 ? "In Stock" : st > 0 ? "Low Stock" : "Out of Stock";
      }

      // General string/array fields
      if (updates.name) p.name = String(updates.name).trim();
      if (updates.category) p.category = String(updates.category).trim().toLowerCase();
      if (updates.subcategory) p.subcategory = String(updates.subcategory).trim();
      if (updates.brand) p.brand = String(updates.brand).trim();
      if (updates.description) p.description = String(updates.description).trim();
      if (updates.discount !== undefined) p.discount = Number(updates.discount) || 0;
      if (updates.image) {
        p.image = updates.image;
        p.images = [updates.image];
        p.thumbnail = updates.image;
      }
      if (updates.tryOnAsset) p.tryOnAsset = updates.tryOnAsset;
      if (updates.tryOnType) p.tryOnType = updates.tryOnType;
      if (updates.tryOnStatus) p.tryOnStatus = updates.tryOnStatus;
      if (updates.status) p.status = updates.status;
      if (updates.storeId) p.storeId = updates.storeId;
      if (updates.location) p.location = updates.location;
      if (updates.tags) p.tags = Array.isArray(updates.tags) ? updates.tags : String(updates.tags).split(",").map(t => t.trim());
      if (updates.sizes) p.sizes = Array.isArray(updates.sizes) ? updates.sizes : String(updates.sizes).split(",").map(s => s.trim());
      if (updates.colors) p.colors = Array.isArray(updates.colors) ? updates.colors : String(updates.colors).split(",").map(c => c.trim());

      p.updatedAt = new Date().toISOString();

      // Refresh index
      indexProduct(p);
      saveCatalogState();

      MeroXCatalog.logAudit("UPDATE", p.sku, `Updated product fields: ${Object.keys(updates).join(", ")}`, actor);
      emitCatalogChanged({ action: "UPDATE", product: p });

      return { success: true, product: p };
    },

    /**
     * Fast Inline Stock Update
     */
    updateStock: (idOrSku, newStock, storeId, actor = "Store Admin") => {
      const p = MeroXCatalog.findAny(idOrSku);
      if (!p) return { success: false, error: `Product '${idOrSku}' not found.` };

      const st = Number(newStock);
      if (isNaN(st) || st < 0) return { success: false, error: "Stock count cannot be negative." };

      const oldStock = p.stock;
      p.stock = st;
      p.stockQuantity = st;
      p.stockStatus = st > 5 ? "In Stock" : st > 0 ? "Low Stock" : "Out of Stock";
      if (storeId) p.storeId = storeId;
      p.updatedAt = new Date().toISOString();

      saveCatalogState();

      MeroXCatalog.logAudit("STOCK_CHANGE", p.sku, `Stock updated from ${oldStock} to ${st} (${p.stockStatus})`, actor);
      emitCatalogChanged({ action: "STOCK_CHANGE", product: p });

      return { success: true, product: p };
    },

    /**
     * Deactivate Product (soft delete)
     */
    deactivateProduct: (idOrSku, actor = "Store Admin") => {
      const p = MeroXCatalog.findAny(idOrSku);
      if (!p) return { success: false, error: `Product '${idOrSku}' not found.` };
      p.status = "inactive";
      p.updatedAt = new Date().toISOString();
      saveCatalogState();
      MeroXCatalog.logAudit("DEACTIVATE", p.sku, `Product '${p.name}' deactivated`, actor);
      emitCatalogChanged({ action: "DEACTIVATE", product: p });
      return { success: true, product: p };
    },

    /**
     * Reactivate Product
     */
    reactivateProduct: (idOrSku, actor = "Store Admin") => {
      const p = MeroXCatalog.findAny(idOrSku);
      if (!p) return { success: false, error: `Product '${idOrSku}' not found.` };
      p.status = "active";
      p.updatedAt = new Date().toISOString();
      saveCatalogState();
      MeroXCatalog.logAudit("REACTIVATE", p.sku, `Product '${p.name}' reactivated`, actor);
      emitCatalogChanged({ action: "REACTIVATE", product: p });
      return { success: true, product: p };
    },

    /**
     * Delete Product (removes dynamically created products, deactivates baseline items)
     */
    deleteProduct: (idOrSku, actor = "Store Admin") => {
      const p = MeroXCatalog.findAny(idOrSku);
      if (!p) return { success: false, error: `Product '${idOrSku}' not found.` };

      if (p.id <= 30) {
        // Base product: soft deactivate to preserve baseline test integrity
        p.status = "inactive";
        p.updatedAt = new Date().toISOString();
        saveCatalogState();
        MeroXCatalog.logAudit("DEACTIVATE", p.sku, `Baseline product marked inactive (delete protected)`, actor);
        emitCatalogChanged({ action: "DEACTIVATE", product: p });
        return { success: true, message: "Baseline product archived and hidden from customer view." };
      }

      // Dynamically added product: remove completely
      const idx = PRODUCTS.findIndex(item => item.id === p.id);
      if (idx !== -1) {
        PRODUCTS.splice(idx, 1);
        skuIndex.delete(p.sku);
        if (p.barcode) barcodeIndex.delete(p.barcode);
        if (p.id) idIndex.delete(p.id);
        saveCatalogState();
        MeroXCatalog.logAudit("DELETE", p.sku, `Custom product '${p.name}' deleted`, actor);
        emitCatalogChanged({ action: "DELETE", sku: p.sku });
        return { success: true, message: `Product '${p.name}' deleted successfully.` };
      }

      return { success: false, error: "Could not remove product from catalog array." };
    },

    /**
     * Export Catalog to JSON or CSV RFC-4180 format
     */
    exportCatalog: (format = "json") => {
      if (format === "json") {
        return JSON.stringify(PRODUCTS, null, 2);
      }
      if (format === "csv") {
        const columns = [
          "id", "productId", "sku", "name", "category", "subcategory", "brand",
          "price", "discount", "currency", "stock", "stockStatus", "status",
          "barcode", "qrCode", "rfid", "rfidEpc", "storeId", "location", "tryOnType", "tryOnStatus"
        ];
        const escapeCsv = (val) => {
          if (val === null || val === undefined) return '""';
          const s = String(val).replace(/"/g, '""');
          return `"${s}"`;
        };
        const headerRow = columns.join(",");
        const rows = PRODUCTS.map(p => {
          return columns.map(c => escapeCsv(p[c])).join(",");
        });
        return [headerRow, ...rows].join("\r\n");
      }
      return "";
    },

    /**
     * Real-time Inventory KPI Metrics & Store Distribution
     */
    getInventoryStats: () => {
      let inStock = 0;
      let lowStock = 0;
      let outOfStock = 0;
      let totalValuation = 0;
      let activeCount = 0;
      let tryOnReady = 0;
      const categories = {};
      const stores = {};

      PRODUCTS.forEach(p => {
        const s = Number(p.stock !== undefined ? p.stock : p.stockQuantity) || 0;
        const price = Number(p.price) || 0;
        totalValuation += s * price;

        if (p.status !== "inactive" && p.status !== "archived") {
          activeCount++;
        }

        if (s > 5) inStock++;
        else if (s > 0) lowStock++;
        else outOfStock++;

        if (p.tryOnStatus === "available" || p.tryOnType) tryOnReady++;

        const cat = p.category || "uncategorized";
        categories[cat] = (categories[cat] || 0) + 1;

        const store = p.storeId || "STORE-MUM-01";
        stores[store] = (stores[store] || 0) + 1;
      });

      return {
        totalProducts: PRODUCTS.length,
        activeProducts: activeCount,
        inStockCount: inStock,
        lowStockCount: lowStock,
        outOfStockCount: outOfStock,
        totalInventoryValue: totalValuation,
        categoriesCount: Object.keys(categories).length,
        storesCount: Object.keys(stores).length,
        tryOnReadyCount: tryOnReady,
        categoryBreakdown: categories,
        storeBreakdown: stores
      };
    },

    /**
     * Audit Activity Log Methods
     */
    getAuditLog: () => {
      try {
        if (typeof localStorage === "undefined") return [];
        const raw = localStorage.getItem(AUDIT_LOG_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    logAudit: (action, sku, details, actor = "Store Admin") => {
      try {
        if (typeof localStorage === "undefined") return null;
        const entry = {
          id: "AUDIT-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
          timestamp: new Date().toISOString(),
          action: String(action).toUpperCase(),
          sku: sku ? String(sku) : "N/A",
          details: String(details || ""),
          actor: String(actor || "Store Admin")
        };
        const current = MeroXCatalog.getAuditLog();
        current.unshift(entry);
        if (current.length > 500) current.length = 500;
        localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(current));
        return entry;
      } catch (e) {
        console.warn("Audit log notice:", e);
        return null;
      }
    },

    clearAuditLog: () => {
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem(AUDIT_LOG_KEY);
        }
      } catch (e) {}
    },

    /**
     * Reset to Factory Baseline (removes dynamic overrides, restores 30 baseline products)
     */
    resetToDefault: (actor = "Store Admin") => {
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem(OVERRIDE_KEY);
        }
      } catch (e) {}
      while (PRODUCTS.length > 30) {
        PRODUCTS.pop();
      }
      skuIndex.clear();
      barcodeIndex.clear();
      qrIndex.clear();
      rfidIndex.clear();
      idIndex.clear();
      PRODUCTS.forEach(p => {
        p.status = "active";
        p.tryOnStatus = "available";
        indexProduct(p);
      });
      MeroXCatalog.logAudit("RESET", "CATALOG", "Catalog reset to default 30 baseline products", actor);
      emitCatalogChanged({ action: "RESET" });
      return { success: true, message: "Catalog reset to default 30 baseline products." };
    }
  };

  // Expose as global for browser scripts (backwards compatible with window.products)
  global.products = PRODUCTS;
  global.MeroXProducts = PRODUCTS;
  global.MeroXCatalog = MeroXCatalog;

  // CommonJS export if used in node test scripts
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { PRODUCTS, MeroXCatalog, searchProducts };
  }
})(typeof window !== "undefined" ? window : globalThis);
