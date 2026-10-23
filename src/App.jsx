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

  // Initial Products Database
  const [products, setProducts] = useState([
    { id: 1, title: 'Wireless RGB Gaming Mouse', category: 'ELECTRONICS', price: 78.75, icon: '⚡' },
    { id: 2, title: 'Mechanical Gaming Keyboard', category: 'ELECTRONICS', price: 62.54, icon: '⚡' },
    { id: 3, title: 'Noise Cancelling Headphones', category: 'ELECTRONICS', price: 42.30, icon: '⚡' },
    { id: 4, title: 'Ultra HD 4K Gaming Monitor', category: 'ELECTRONICS', price: 57.07, icon: '⚡' },
    { id: 5, title: 'Classic Leather Strap Watch', category: 'WATCHES', price: 120.00, icon: '⌚' },
    { id: 6, title: 'Hydrating Hyaluronic Serum', category: 'SKINCARE', price: 19.99, icon: '💧' },
    { id: 7, title: 'Argan Oil Repair Shampoo', category: 'HAIR CARE', price: 14.50, icon: '🌿' },
    { id: 8, title: 'Classic Denim Jacket', category: 'FASHION', price: 55.00, icon: '👕' },
    { id: 9, title: 'Organic Cold Pressed Olive Oil', category: 'GROCERIES', price: 22.00, icon: '🛒' },
  ]);

  // Admin Form States
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

  // Cart Handlers
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

  // Admin Panel Actions
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    const newProduct = {
      id: Date.now(),
      title: newTitle,
      price: parseFloat(newPrice),
      category: newCategory.toUpperCase(),
      icon: '🛍️'
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
    const catMatch = selectedCategory === 'All' || product.category.toLowerCase().replace(' ', '') === selectedCategory.toLowerCase().replace(' ', '');
    const searchMatch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  const totalCartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <Router>
      {/* Exact Dark Header */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 40px', background: '#0f172a', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🛍️</span>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>OmniStore</h2>
        </div>

        {/* Center Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '320px', padding: '8px 16px', borderRadius: '6px', border: 'none', outline: 'none', fontSize: '14px' }}
        />

        {/* Header Links */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Home</Link>
          <Link to="/admin" style={{ color: '#facc15', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' }}>Admin Panel</Link>
          <Link to="/cart" style={{ background: '#22c55e', padding: '8px 18px', borderRadius: '6px', color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🛒 Cart ({totalCartCount})
          </Link>
        </div>
      </nav>

      <Routes>
        {/* Store Front Page */}
        <Route
          path="/"
          element={
            <div style={{ padding: '30px 40px', maxWidth: '1300px', margin: '0 auto', fontFamily: 'sans-serif' }}>
              <h1 style={{ textAlign: 'center', fontSize: '32px', color: '#1e293b', fontWeight: '800', marginBottom: '25px' }}>Explore Products</h1>

              {/* Exact Pill Shaped Category Filters */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '35px' }}>
                {['All', 'Electronics', 'Watches', 'Skincare', 'Hair Care', 'Fashion', 'Groceries'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '8px',
                      border: selectedCategory === cat ? 'none' : '1px solid #cbd5e1',
                      background: selectedCategory === cat ? '#2563eb' : '#fff',
                      color: selectedCategory === cat ? '#fff' : '#334155',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Product Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
                {filteredProducts.map(product => (
                  <div key={product.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    
                    {/* Dark Blue Box for Image/Icon */}
                    <div style={{ height: '170px', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '15px', textAlign: 'center' }}>
                      <div style={{ background: '#1e293b', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '10px' }}>
                        {product.icon}
                      </div>
                      <span style={{ fontWeight: '600', fontSize: '13px' }}>{product.title}</span>
                    </div>

                    {/* Content Details */}
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a', fontWeight: 'bold' }}>{product.title}</h3>
                      <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>{product.category}</span>
                      <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '20px', margin: '10px 0 15px 0' }}>
                        ${product.price.toFixed(2)}
                      </p>
                      <button
                        onClick={() => addToCart(product)}
                        style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '14px' }}
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
            <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
              <h2 style={{ fontSize: '26px', color: '#0f172a', marginBottom: '20px' }}>⚙️ Admin Panel - Product Management</h2>

              {/* Add Product Form */}
              <form onSubmit={handleAddProduct} style={{ background: '#f8fafc', padding: '25px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '35px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Product Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ flex: 2, minWidth: '200px', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}
                />
                <input
                  type="number"
                  placeholder="Price ($)"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  style={{ flex: 1, minWidth: '100px', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}
                >
                  <option value="ELECTRONICS">ELECTRONICS</option>
                  <option value="WATCHES">WATCHES</option>
                  <option value="SKINCARE">SKINCARE</option>
                  <option value="HAIR CARE">HAIR CARE</option>
                  <option value="FASHION">FASHION</option>
                  <option value="GROCERIES">GROCERIES</option>
                </select>
                <button type="submit" style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Add Product +
                </button>
              </form>

              {/* Product List Table */}
              <h3 style={{ color: '#0f172a', marginBottom: '15px' }}>Current Store Products</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '12px 16px' }}>Title</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Price</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '600' }}>{p.title}</td>
                      <td style={{ padding: '12px 16px', color: '#64748b' }}>{p.category}</td>
                      <td style={{ padding: '12px 16px', color: '#16a34a', fontWeight: 'bold' }}>${p.price.toFixed(2)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
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

        {/* Cart Page */}
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