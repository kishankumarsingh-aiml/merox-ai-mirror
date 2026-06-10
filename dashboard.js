// ================= PRODUCT DATABASE =================
window.products = [
  // JEANS
  { name: "Blue Jeans", category: "jeans", price: 1499, img: "images/jeans1.png" },
  { name: "Black Jeans", category: "jeans", price: 1599, img: "images/jeans2.png" },
  { name: "Slim Fit Jeans", category: "jeans", price: 1399, img: "images/jeans3.png" },
  { name: "Ripped Jeans", category: "jeans", price: 1699, img: "images/jeans4.png" },
  { name: "Classic Denim", category: "jeans", price: 1299, img: "images/jeans5.png" },

  // TSHIRT
  { name: "Round Neck", category: "tshirt", price: 499, img: "images/tshirt1.png" },
  { name: "Oversize", category: "tshirt", price: 599, img: "images/tshirt2.png" },
  { name: "Printed", category: "tshirt", price: 549, img: "images/tshirt3.png" },
  { name: "Sports Tee", category: "tshirt", price: 649, img: "images/tshirt4.png" },
  { name: "Plain Tee", category: "tshirt", price: 399, img: "images/tshirt5.png" },

  // CAPS
  { name: "Black Cap", category: "cap", price: 299, img: "images/cap1.png" },
  { name: "Sports Cap", category: "cap", price: 349, img: "images/cap2.png" },
  { name: "White Cap", category: "cap", price: 279, img: "images/cap3.png" },
  { name: "Fashion Cap", category: "cap", price: 399, img: "images/cap4.png" },
  { name: "Classic Cap", category: "cap", price: 319, img: "images/cap5.png" },

  // GOGGLES
  { name: "Aviator", category: "goggles", price: 699, img: "images/goggles1.png" },
  { name: "Square", category: "goggles", price: 799, img: "images/goggles2.png" },
  { name: "Round", category: "goggles", price: 749, img: "images/goggles3.png" },
  { name: "Sports", category: "goggles", price: 899, img: "images/goggles4.png" },
  { name: "Black Shade", category: "goggles", price: 649, img: "images/goggles5.png" },

  // SHOES
  { name: "Running Shoes", category: "shoe", price: 1999, img: "images/shoe1.png" },
  { name: "Casual Shoes", category: "shoe", price: 1799, img: "images/shoe2.png" },
  { name: "Sneakers", category: "shoe", price: 1899, img: "images/shoe3.png" },
  { name: "Formal Shoes", category: "shoe", price: 2199, img: "images/shoe4.png" },
  { name: "White Shoes", category: "shoe", price: 1699, img: "images/shoe5.png" },
];

// SEARCH REDIRECT
function goToSearch(e){
  e.preventDefault();
  const q = document.getElementById("searchInput").value.trim();
  if(!q) return;
  window.location.href = `search.html?q=${q}`;
}