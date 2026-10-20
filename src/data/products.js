const categoryThemes = {
  electronics: { bg: "#1e293b", icon: "⚡" },
  watches: { bg: "#422006", icon: "⌚" },
  skincare: { bg: "#0284c7", icon: "💧" },
  haircare: { bg: "#064e3b", icon: "🌿" },
  fashion: { bg: "#312e81", icon: "👕" },
  groceries: { bg: "#78350f", icon: "🛒" }
};

export function createCategorySvg(title, category) {
  const theme = categoryThemes[category.toLowerCase()] || categoryThemes.electronics;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
      <rect width="300" height="200" fill="${theme.bg}"/>
      <text x="150" y="85" fill="#ffffff" font-family="sans-serif" font-size="36" text-anchor="middle">${theme.icon}</text>
      <text x="150" y="130" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">${title}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

export const initialProducts = [
  { id: 1, name: "Wireless RGB Gaming Mouse", category: "electronics", price: 78.75, image: createCategorySvg("Wireless RGB Gaming Mouse", "electronics") },
  { id: 2, name: "Mechanical Gaming Keyboard", category: "electronics", price: 62.54, image: createCategorySvg("Mechanical Gaming Keyboard", "electronics") },
  { id: 3, name: "Noise Cancelling Headphones", category: "electronics", price: 42.30, image: createCategorySvg("Noise Cancelling Headphones", "electronics") },
  { id: 4, name: "Ultra HD 4K Monitor", category: "electronics", price: 210.00, image: createCategorySvg("Ultra HD 4K Monitor", "electronics") },
  { id: 5, name: "Fast USB-C Charger", category: "electronics", price: 19.99, image: createCategorySvg("Fast USB-C Charger", "electronics") },
  
  { id: 11, name: "Classic Leather Strap Watch", category: "watches", price: 120.00, image: createCategorySvg("Classic Leather Strap Watch", "watches") },
  { id: 12, name: "Smart Fitness Watch", category: "watches", price: 89.99, image: createCategorySvg("Smart Fitness Watch", "watches") },
  { id: 13, name: "Minimalist Steel Watch", category: "watches", price: 150.00, image: createCategorySvg("Minimalist Steel Watch", "watches") },

  { id: 21, name: "Hydrating Hyaluronic Serum", category: "skincare", price: 24.99, image: createCategorySvg("Hydrating Hyaluronic Serum", "skincare") },
  { id: 22, name: "Vitamin C Brightening Cream", category: "skincare", price: 29.50, image: createCategorySvg("Vitamin C Brightening Cream", "skincare") },
  { id: 23, name: "Daily Sunscreen SPF 50", category: "skincare", price: 18.00, image: createCategorySvg("Daily Sunscreen SPF 50", "skincare") },

  { id: 31, name: "Argan Oil Repair Shampoo", category: "haircare", price: 16.50, image: createCategorySvg("Argan Oil Repair Shampoo", "haircare") },
  { id: 32, name: "Keratin Smooth Hair Mask", category: "haircare", price: 22.00, image: createCategorySvg("Keratin Smooth Hair Mask", "haircare") },

  { id: 41, name: "Classic Denim Jacket", category: "fashion", price: 55.00, image: createCategorySvg("Classic Denim Jacket", "fashion") },
  { id: 42, name: "Casual Cotton Hoodie", category: "fashion", price: 38.00, image: createCategorySvg("Casual Cotton Hoodie", "fashion") },

  { id: 51, name: "Organic Cold Pressed Olive Oil", category: "groceries", price: 14.99, image: createCategorySvg("Organic Cold Pressed Olive Oil", "groceries") },
  { id: 52, name: "Premium Arabica Coffee Beans", category: "groceries", price: 21.50, image: createCategorySvg("Premium Arabica Coffee Beans", "groceries") }
];