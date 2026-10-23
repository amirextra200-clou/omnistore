import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cart from './pages/Cart';

function App() {
  // Cart state with localStorage persistence
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
    { id: 1, title: 'Mechanical Gaming Keyboard', price: 62.54, category: 'ELECTRONICS', image: 'https://via.placeholder.com/150/1e293b/ffffff?text=Keyboard' },
    { id: 2, title: 'Wireless RGB Gaming Mouse', price: 29.99, category: 'ELECTRONICS', image: 'https://via.placeholder.com/150/1e293b/ffffff?text=Mouse' },
    { id: 3, title: 'UltraWide Gaming Monitor', price: 249.99, category: 'ELECTRONICS', image: 'https://via.placeholder.com/150/1e293b/ffffff?text=Monitor' },
    { id: 4, title: 'Classic Leather Strap Watch', price: 120.00, category: 'WATCHES', image: 'https://via.placeholder.com/150/334155/ffffff?text=Watch' },
    { id: 5, title: 'Smart Fitness Watch', price: 89.99, category: 'WATCHES', image: 'https://via.placeholder.com/150/334155/ffffff?text=SmartWatch' }
  ]);

  // Admin Panel New Product Input Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('ELECTRONICS');

  // Active Category Filter for Store Front
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('omnistore_cart', JSON.stringify(cart));
  }, [cart]);

  // Add Product to Cart
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

  // Remove Product from Cart
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Update Item Quantity in Cart
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCart(prevCart =>
      prevCart.map(item => item.id === id ? { ...item, quantity: newQty } : item)
    );
  };

  // Clear Entire Cart
  const clearCart = () => {
    setCart([]);
  };

  // Add New Product via Admin Panel
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    const newProduct = {
      id: Date.now(),
      title: newTitle,
      price: parseFloat(newPrice),
      category: newCategory,
      image: 'https://via.placeholder.com/150/1e293b/ffffff?text=Product'
    };
    setProducts([...products, newProduct]);
    setNewTitle('');
    setNewPrice('');
  };

  // Delete Product via Admin Panel
  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Filter Products for Store Front
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalCartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <Router>
      {/* Navigation Header */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', background: '#0f172a', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>🛍️ OmniStore Mart</h2>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '300px', padding: '8px 15px', borderRadius: '5px', border: '1px solid #334155', background: '#fff', outline: 'none' }}
        />

        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Store Front</Link>
          <Link to="/admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Admin Panel</Link>
          <Link to="/cart" style={{ background: '#22c55e', padding: '8px 18px', borderRadius: '6px', color: '#fff', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
            🛒 Cart ({totalCartCount})
          </Link>
        </div>
      </nav>

      <Routes>
        {/* Store Front Page */}
        <Route
          path="/"
          element={
            <div style={{ padding: '30px 40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🛍️ Explore Products</h2>

              {/* Category Filter Badges */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
                {['ALL', 'ELECTRONICS', 'WATCHES', 'FASHION'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      background: selectedCategory === cat ? '#2563eb' : '#e2e8f0',
                      color: selectedCategory === cat ? '#fff' : '#1e293b',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Product Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' }}>
                {filteredProducts.map(product => (
                  <div key={product.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ height: '140px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                      {product.title}
                    </div>
                    <div style={{ padding: '15px' }}>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>{product.category}</span>
                      <h4 style={{ margin: '5px 0 10px 0', fontSize: '16px', color: '#0f172a' }}>{product.title}</h4>
                      <p style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '18px', margin: '0 0 15px 0' }}>${product.price.toFixed(2)}</p>
                      <button
                        onClick={() => addToCart(product)}
                        style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
                      >
                        Add to Cart 🛒
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
            <div style={{ padding: '30px 40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
              <h2>⚙️ Admin Panel</h2>

              {/* Add New Product Form */}
              <form onSubmit={handleAddProduct} style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Product Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ flex: 2, minWidth: '200px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '5px' }}
                />
                <input
                  type="number"
                  placeholder="Price ($)"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  style={{ flex: 1, minWidth: '100px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '5px' }}
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '5px' }}
                >
                  <option value="ELECTRONICS">ELECTRONICS</option>
                  <option value="WATCHES">WATCHES</option>
                  <option value="FASHION">FASHION</option>
                </select>
                <button type="submit" style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Add Product +
                </button>
              </form>

              {/* Products Table */}
              <h3>Existing Products</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '10px' }}>Title</th>
                    <th style={{ padding: '10px' }}>Category</th>
                    <th style={{ padding: '10px' }}>Price</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px' }}>{p.title}</td>
                      <td style={{ padding: '10px' }}>{p.category}</td>
                      <td style={{ padding: '10px' }}>${p.price.toFixed(2)}</td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>
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