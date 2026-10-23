import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cart from './pages/Cart'; // Sahi path: pages folder ke andar hai

function App() {
  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('omnistore_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Products state (Store Front ke liye)
  const [products, setProducts] = useState([
    { id: 1, title: 'Mechanical Gaming Keyboard', price: 62.54, image: '' },
    { id: 2, title: 'Wireless RGB Gaming Mouse', price: 29.99, image: '' },
    { id: 3, title: 'UltraWide Gaming Monitor', price: 249.99, image: '' },
  ]);

  // Save cart to localStorage so it doesn't disappear on reload
  useEffect(() => {
    localStorage.setItem('omnistore_cart', JSON.stringify(cart));
  }, [cart]);

  // Product add karne ka function
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

  // Item remove karne ka function
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Quantity update karne ka function
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCart(prevCart => 
      prevCart.map(item => item.id === id ? { ...item, quantity: newQty } : item)
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Total items count for header badge
  const totalCartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <Router>
      {/* Navigation Header */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#111', color: '#fff' }}>
        <h2 style={{ margin: 0 }}>OmniStore Mart</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Store Front</Link>
          <Link to="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Admin Panel</Link>
          <Link to="/cart" style={{ background: '#28a745', padding: '8px 15px', borderRadius: '5px', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
            🛒 Cart ({totalCartCount})
          </Link>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        {/* Store Front Page */}
        <Route 
          path="/" 
          element={
            <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
              <h2>🛍️ Featured Products</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {products.map(product => (
                  <div key={product.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', background: '#fff' }}>
                    <h3>{product.title}</h3>
                    <p style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px' }}>${product.price}</p>
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