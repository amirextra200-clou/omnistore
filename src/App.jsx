import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cart from './pages/Cart';

function App() {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('omnistore_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [products] = useState([
    { id: 1, title: 'Mechanical Gaming Keyboard', price: 62.54 },
    { id: 2, title: 'Wireless RGB Gaming Mouse', price: 29.99 },
    { id: 3, title: 'UltraWide Gaming Monitor', price: 249.99 },
  ]);

  useEffect(() => {
    localStorage.setItem('omnistore_cart', JSON.stringify(cart));
  }, [cart]);

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

  const clearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <Router>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#111', color: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
        <h2 style={{ margin: 0 }}>OmniStore Mart</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Store Front</Link>
          <Link to="/admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Admin Panel</Link>
          <Link to="/cart" style={{ background: '#28a745', padding: '8px 15px', borderRadius: '5px', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
            🛒 Cart ({totalCartCount})
          </Link>
        </div>
      </nav>

      <Routes>
        <Route 
          path="/" 
          element={
            <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🛍️ Featured Products</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {products.map(product => (
                  <div key={product.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', background: '#fff', width: '280px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{product.title}</h3>
                      <p style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px', marginBottom: '15px' }}>${product.price}</p>
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      style={{ background: '#007bff', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
                    >
                      Add to Cart 🛒
                    </button>
                  </div>
                ))}
              </div>
            </div>
          } 
        />

        <Route 
          path="/admin" 
          element={
            <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
              <h2>⚙️ Admin Panel</h2>
              <p>Welcome to the Admin Dashboard. Manage your products and store settings here.</p>
            </div>
          } 
        />

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