import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cart from './pages/Cart';

function App() {
  // Cart State with LocalStorage Sync
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('omnistore_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Exact Products List Matching Screenshot
  const [products] = useState([
    { id: 1, title: 'Wireless RGB Gaming Mouse', category: 'ELECTRONICS', price: 78.75, icon: '⚡', color: '#1e293b' },
    { id: 2, title: 'Mechanical Gaming Keyboard', category: 'ELECTRONICS', price: 62.54, icon: '⚡', color: '#1e293b' },
    { id: 3, title: 'Noise Cancelling Headphones', category: 'ELECTRONICS', price: 42.30, icon: '⚡', color: '#1e293b' },
    { id: 4, title: 'Classic Leather Strap Watch', category: 'WATCHES', price: 120.00, icon: '⌚', color: '#451a03' },
    { id: 5, title: 'Hydrating Hyaluronic Serum', category: 'SKINCARE', price: 19.99, icon: '💧', color: '#0284c7' },
    { id: 6, title: 'Argan Oil Repair Shampoo', category: 'HAIRCARE', price: 14.50, icon: '🌿', color: '#064e3b' },
    { id: 7, title: 'Classic Denim Jacket', category: 'FASHION', price: 55.00, icon: '👕', color: '#312e81' },
    { id: 8, title: 'Organic Cold Pressed Olive Oil', category: 'GROCERIES', price: 22.00, icon: '🛒', color: '#78350f' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('ALL');
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

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCart(prevCart =>
      prevCart.map(item => item.id === id ? { ...item, quantity: newQty } : item)
    );
  };

  const clearCart = () => setCart([]);

  // Filter Products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalCartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <Router>
      {/* Dark Navbar Matching Screenshot */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 30px', background: '#0b1329', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🛍️</span>
          <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '18px', color: '#fff' }}>OmniStore Mart</h3>
        </div>

        {/* Center Search Input */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '320px', padding: '6px 14px', borderRadius: '4px', border: 'none', outline: 'none', fontSize: '14px' }}
        />

        {/* Header Links */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Store Front</Link>
          <Link to="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Admin Panel</Link>
          <Link to="/cart" style={{ background: '#22c55e', padding: '6px 14px', borderRadius: '5px', color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            🛒 Cart ({totalCartCount})
          </Link>
        </div>
      </nav>

      <Routes>
        {/* Store Front Page */}
        <Route
          path="/"
          element={
            <div style={{ padding: '30px 40px', maxWidth: '1280px', margin: '0 auto', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
              <h2 style={{ margin: '0 0 15px 0', fontSize: '26px', color: '#0f172a', fontWeight: '800' }}>Explore Products</h2>

              {/* Category Badges with Outline Borders */}
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '25px' }}>
                {['ALL', 'ELECTRONICS', 'WATCHES', 'SKINCARE', 'HAIRCARE', 'FASHION', 'GROCERIES'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '4px 10px',
                      border: '1px solid #64748b',
                      background: selectedCategory === cat ? '#0f172a' : '#fff',
                      color: selectedCategory === cat ? '#fff' : '#0f172a',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '12px',
                      borderRadius: '2px'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 4-Column Product Grid Matching Screenshot */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {filteredProducts.map(product => (
                  <div key={product.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    
                    {/* Colored Icon Header Box */}
                    <div style={{ height: '150px', background: product.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '15px', textAlign: 'center' }}>
                      <span style={{ fontSize: '30px', marginBottom: '10px' }}>{product.icon}</span>
                      <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{product.title}</span>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '15px' }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#0f172a', fontWeight: 'bold' }}>{product.title}</h4>
                      <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>{product.category}</span>
                      <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '18px', margin: '10px 0 15px 0' }}>
                        ${product.price.toFixed(2)}
                      </p>
                      <button
                        onClick={() => addToCart(product)}
                        style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '14px' }}
                      >
                        Add to Cart
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          }
        />

        {/* Admin Panel Page */}
        <Route
          path="/admin"
          element={
            <div style={{ padding: '30px 40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
              <h2>⚙️ Admin Panel</h2>
              <p>Manage your products and store settings here.</p>
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