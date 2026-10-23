import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cart from './components/Cart'; // Agar path alag ho toh apne folder ke mutabiq check kar lein

function App() {
  // Cart ki main state jo saare items ko store karegi
  const [cart, setCart] = useState([]);

  // Product ko cart mein add karne ka function
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

  // Cart se item remove karne ka function
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Quantity increase/decrease karne ka function
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCart(prevCart => 
      prevCart.map(item => item.id === id ? { ...item, quantity: newQty } : item)
    );
  };

  // Saara cart clear karne ka function
  const clearCart = () => {
    setCart([]);
  };

  // Header ke liye total quantity count (quantities ka sum)
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

      {/* Routes Setup */}
      <Routes>
        {/* Cart Page Route - Yahan 'cart' state ko 'cartItems' ke tor par pass kiya gaya hai */}
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