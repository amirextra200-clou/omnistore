import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cart from './pages/Cart';

function App() {
  // Cart State with LocalStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('omnistore_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Complete Products Database Matching exact Colors & Categories in Screenshot
  const [products, setProducts] = useState([
    // ELECTRONICS (Dark Blue Header)
    { id: 1, title: 'Wireless RGB Gaming Mouse', category: 'ELECTRONICS', price: 68.43, icon: '⚡', color: '#1a2238' },
    { id: 2, title: 'Mechanical Gaming Keyboard', category: 'ELECTRONICS', price: 59.81, icon: '⚡', color: '#1a2238' },
    { id: 3, title: 'Noise Cancelling Headphones', category: 'ELECTRONICS', price: 65.25, icon: '⚡', color: '#1a2238' },
    { id: 4, title: 'Ultra HD 4K Gaming Monitor', category: 'ELECTRONICS', price: 68.39, icon: '⚡', color: '#1a2238' },
    { id: 5, title: 'Smart Fitness Watch Series 7', category: 'ELECTRONICS', price: 71.98, icon: '⚡', color: '#1a2238' },
    { id: 6, title: 'Bluetooth Portable Speaker', category: 'ELECTRONICS', price: 69.81, icon: '⚡', color: '#1a2238' },
    { id: 7, title: 'Fast Wireless Charging Pad', category: 'ELECTRONICS', price: 12.07, icon: '⚡', color: '#1a2238' },
    { id: 8, title: '1080p HD Webcam with Mic', category: 'ELECTRONICS', price: 70.65, icon: '⚡', color: '#1a2238' },
    { id: 9, title: 'RGB LED Desk Light Bar', category: 'ELECTRONICS', price: 39.91, icon: '⚡', color: '#1a2238' },
    { id: 10, title: 'Type-C Multi-Port Hub Adapter', category: 'ELECTRONICS', price: 61.77, icon: '⚡', color: '#1a2238' },

    // SKINCARE (Pink/Magenta Header)
    { id: 11, title: 'Hydrating Facial Cream', category: 'SKINCARE', price: 55.37, icon: '✨', color: '#831843' },
    { id: 12, title: 'Vitamin C Glow Serum', category: 'SKINCARE', price: 15.08, icon: '✨', color: '#831843' },
    { id: 13, title: 'Aloe Vera Soothing Gel', category: 'SKINCARE', price: 45.04, icon: '✨', color: '#831843' },
    { id: 14, title: 'Exfoliating Face Scrub Mask', category: 'SKINCARE', price: 15.65, icon: '✨', color: '#831843' },
    { id: 15, title: 'Anti-Aging Night Repair Cream', category: 'SKINCARE', price: 21.87, icon: '✨', color: '#831843' },
    { id: 16, title: 'Hyaluronic Acid Hydrating Toner', category: 'SKINCARE', price: 50.96, icon: '✨', color: '#831843' },
    { id: 17, title: 'Daily Mineral Sunscreen SPF 50+', category: 'SKINCARE', price: 68.03, icon: '✨', color: '#831843' },
    { id: 18, title: 'Under-Eye Dark Circle Cream', category: 'SKINCARE', price: 11.33, icon: '✨', color: '#831843' },
    { id: 19, title: 'Charcoal Deep Cleansing Mud Mask', category: 'SKINCARE', price: 17.89, icon: '✨', color: '#831843' },
    { id: 20, title: 'Organic Rose Water Facial Spray', category: 'SKINCARE', price: 27.65, icon: '✨', color: '#831843' },

    // HAIRCARE (Green Header)
    { id: 21, title: 'Nourishing Hair Shampoo', category: 'HAIR CARE', price: 21.39, icon: '🌿', color: '#064e3b' },
    { id: 22, title: 'Argan Hair Conditioning Oil', category: 'HAIR CARE', price: 51.27, icon: '🌿', color: '#064e3b' },
    { id: 23, title: 'Keratin Smooth Hair Mask', category: 'HAIR CARE', price: 71.02, icon: '🌿', color: '#064e3b' },
    { id: 24, title: 'Anti-Dandruff Scalp Treatment', category: 'HAIR CARE', price: 25.68, icon: '🌿', color: '#064e3b' },
    { id: 25, title: 'Organic Onion Hair Growth Serum', category: 'HAIR CARE', price: 27.73, icon: '🌿', color: '#064e3b' },
    { id: 26, title: 'Professional Hair Styling Gel', category: 'HAIR CARE', price: 61.02, icon: '🌿', color: '#064e3b' },
    { id: 27, title: 'Heat Protectant Hair Spray', category: 'HAIR CARE', price: 74.94, icon: '🌿', color: '#064e3b' },
    { id: 28, title: 'Biotin Strengthening Conditioner', category: 'HAIR CARE', price: 29.23, icon: '🌿', color: '#064e3b' },
    { id: 29, title: 'Natural Coconut Hair Oil', category: 'HAIR CARE', price: 58.61, icon: '🌿', color: '#064e3b' },
    { id: 30, title: 'Leave-In Silk Repair Serum', category: 'HAIR CARE', price: 50.83, icon: '🌿', color: '#064e3b' },

    // FASHION (Purple Header)
    { id: 31, title: 'Classic Denim Jacket', category: 'FASHION', price: 55.00, icon: '👕', color: '#312e81' },
    { id: 32, title: 'Cotton Slim Fit T-Shirt', category: 'FASHION', price: 19.99, icon: '👕', color: '#312e81' },
    { id: 33, title: 'Casual Running Sneakers', category: 'FASHION', price: 64.50, icon: '👟', color: '#312e81' },
    { id: 34, title: 'Leather Travel Duffle Bag', category: 'FASHION', price: 89.00, icon: '🎒', color: '#312e81' },
    { id: 35, title: 'Polarized Sunglasses', category: 'FASHION', price: 35.00, icon: '🕶️', color: '#312e81' },
  ]);

  // Admin States
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('ELECTRONICS');

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // LocalStorage Sync
  useEffect(() => {
    localStorage.setItem('omnistore_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart Functions
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prevCart => prevCart.filter(item => item.id !== id));

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCart(prevCart => prevCart.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const clearCart = () => setCart([]);

  // Admin Form Submission
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    const catUpper = newCategory.toUpperCase();
    let catColor = '#1a2238';
    if (catUpper === 'SKINCARE') catColor = '#831843';
    if (catUpper === 'HAIR CARE') catColor = '#064e3b';
    if (catUpper === 'FASHION') catColor = '#312e81';

    const newProduct = {
      id: Date.now(),
      title: newTitle,
      price: parseFloat(newPrice),
      category: catUpper,
      icon: '🛍️',
      color: catColor
    };
    setProducts([...products, newProduct]);
    setNewTitle('');
    setNewPrice('');
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const catMatch = selectedCategory === 'All' || product.category.toLowerCase().replace(/\s+/g, '') === selectedCategory.toLowerCase().replace(/\s+/g, '');
    const searchMatch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  const totalCartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <Router>
      {/* Top Navbar Matching Screenshot */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 25px', background: '#0b1329', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '18px' }}>🛍️</span>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>OmniStore</h2>
        </div>

        {/* Center Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '280px', padding: '5px 12px', borderRadius: '4px', border: 'none', outline: 'none', fontSize: '13px' }}
        />

        {/* Header Navigation Links */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Home</Link>
          <Link to="/admin" style={{ color: '#facc15', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>Admin Panel</Link>
          <Link to="/cart" style={{ background: '#22c55e', padding: '6px 14px', borderRadius: '5px', color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            🛒 Cart ({totalCartCount})
          </Link>
        </div>
      </nav>

      <Routes>
        {/* Store Front Page */}
        <Route
          path="/"
          element={
            <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '25px 0' }}>
              
              {/* Centered Main Container Matching Screenshot Width */}
              <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 15px', fontFamily: 'sans-serif' }}>
                <h2 style={{ textAlign: 'center', fontSize: '24px', color: '#0f172a', fontWeight: '800', marginBottom: '20px' }}>Explore Products</h2>

                {/* Pill Shaped Category Buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '30px' }}>
                  {['All', 'Electronics', 'Skincare', 'Hair Care', 'Fashion'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '6px',
                        border: selectedCategory === cat ? 'none' : '1px solid #cbd5e1',
                        background: selectedCategory === cat ? '#2563eb' : '#fff',
                        color: selectedCategory === cat ? '#fff' : '#475569',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '13px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Exact 5-Column Grid Layout matching screenshot */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px' }}>
                  {filteredProducts.map(product => (
                    <div key={product.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      
                      {/* Top Colored Box */}
                      <div style={{ height: '110px', background: product.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '10px', textAlign: 'center' }}>
                        <span style={{ fontSize: '20px', marginBottom: '6px' }}>{product.icon}</span>
                        <span style={{ fontWeight: '600', fontSize: '11px', lineHeight: '1.2' }}>{product.title}</span>
                      </div>

                      {/* Card Content Details */}
                      <div style={{ padding: '12px 10px', textAlign: 'center' }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#0f172a', fontWeight: 'bold', height: '32px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {product.title}
                        </h4>
                        <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>
                          {product.category}
                        </span>
                        <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '14px', margin: '6px 0 10px 0' }}>
                          ${product.price.toFixed(2)}
                        </p>
                        <button
                          onClick={() => addToCart(product)}
                          style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '12px' }}
                        >
                          Add to Cart
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            </div>
          }
        />

        {/* Admin Panel Route */}
        <Route
          path="/admin"
          element={
            <div style={{ padding: '30px 20px', maxWidth: '850px', margin: '0 auto', fontFamily: 'sans-serif' }}>
              <h2 style={{ fontSize: '24px', color: '#0f172a', marginBottom: '20px' }}>⚙️ Admin Panel - Product Management</h2>

              {/* Add New Product Form */}
              <form onSubmit={handleAddProduct} style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Product Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ flex: 2, minWidth: '180px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '5px' }}
                />
                <input
                  type="number"
                  placeholder="Price ($)"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  style={{ flex: 1, minWidth: '90px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '5px' }}
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '5px' }}
                >
                  <option value="ELECTRONICS">ELECTRONICS</option>
                  <option value="SKINCARE">SKINCARE</option>
                  <option value="HAIR CARE">HAIR CARE</option>
                  <option value="FASHION">FASHION</option>
                </select>
                <button type="submit" style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Add Product +
                </button>
              </form>

              {/* Products Table */}
              <h3 style={{ color: '#0f172a', marginBottom: '15px' }}>Current Store Products</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '10px 14px' }}>Title</th>
                    <th style={{ padding: '10px 14px' }}>Category</th>
                    <th style={{ padding: '10px 14px' }}>Price</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 14px', fontWeight: '600' }}>{p.title}</td>
                      <td style={{ padding: '10px 14px', color: '#64748b' }}>{p.category}</td>
                      <td style={{ padding: '10px 14px', color: '#16a34a', fontWeight: 'bold' }}>${p.price.toFixed(2)}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        />

        {/* Cart Page Route */}
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;