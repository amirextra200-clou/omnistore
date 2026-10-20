import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import AiChat from './components/AiChat';
import { initialProducts } from './data/products';
import './App.css';

export default function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('customProducts');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('martOrders');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('customProducts', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('martOrders', JSON.stringify(orders));
  }, [orders]);

  const addProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (orderDetails) => {
    setOrders(prev => [...prev, orderDetails]);
    clearCart();
  };

  return (
    <Router>
      <Navbar 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home products={products} addToCart={addToCart} searchQuery={searchQuery} />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} placeOrder={placeOrder} />} />
          <Route path="/admin" element={<Admin products={products} addProduct={addProduct} deleteProduct={deleteProduct} orders={orders} />} />
        </Routes>
      </div>
      <AiChat />
      <footer>
        <p>&copy; 2026 OmniStore Mart. All Rights Reserved.</p>
      </footer>
    </Router>
  );
}