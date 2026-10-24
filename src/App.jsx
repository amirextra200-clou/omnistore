import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cart from './pages/Cart';
import Admin from './pages/Admin';

function App() {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('omnistore_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [products, setProducts] = useState([
    { id: 1, title: 'Wireless RGB Gaming Mouse', category: 'ELECTRONICS', price: 68.43, stock: 15, icon: '⚡', color: '#1a2238', image: '' },
    { id: 2, title: 'Mechanical Gaming Keyboard', category: 'ELECTRONICS', price: 59.81, stock: 10, icon: '⚡', color: '#1a2238', image: '' },
    { id: 3, title: 'Noise Cancelling Headphones', category: 'ELECTRONICS', price: 65.25, stock: 8, icon: '⚡', color: '#1a2238', image: '' },
    { id: 4, title: 'Ultra HD 4K Gaming Monitor', category: 'ELECTRONICS', price: 68.39, stock: 5, icon: '⚡', color: '#1a2238', image: '' },
    { id: 5, title: 'Smart Fitness Watch Series 7', category: 'ELECTRONICS', price: 71.98, stock: 12, icon: '⚡', color: '#1a2238', image: '' },
    { id: 6, title: 'Bluetooth Portable Speaker', category: 'ELECTRONICS', price: 69.81, stock: 20, icon: '⚡', color: '#1a2238', image: '' },
    { id: 7, title: 'Fast Wireless Charging Pad', category: 'ELECTRONICS', price: 12.07, stock: 25, icon: '⚡', color: '#1a2238', image: '' },
    { id: 8, title: '1080p HD Webcam with Mic', category: 'ELECTRONICS', price: 70.65, stock: 14, icon: '⚡', color: '#1a2238', image: '' },
    { id: 9, title: 'RGB LED Desk Light Bar', category: 'ELECTRONICS', price: 39.91, stock: 18, icon: '⚡', color: '#1a2238', image: '' },
    { id: 10, title: 'Type-C Multi-Port Hub Adapter', category: 'ELECTRONICS', price: 61.77, stock: 30, icon: '⚡', color: '#1a2238', image: '' },

    { id: 11, title: 'Hydrating Facial Cream', category: 'SKINCARE', price: 55.37, stock: 15, icon: '✨', color: '#831843', image: '' },
    { id: 12, title: 'Vitamin C Glow Serum', category: 'SKINCARE', price: 15.08, stock: 22, icon: '✨', color: '#831843', image: '' },
    { id: 13, title: 'Aloe Vera Soothing Gel', category: 'SKINCARE', price: 45.04, stock: 19, icon: '✨', color: '#831843', image: '' },
    { id: 14, title: 'Exfoliating Face Scrub Mask', category: 'SKINCARE', price: 15.65, stock: 25, icon: '✨', color: '#831843', image: '' },
    { id: 15, title: 'Anti-Aging Night Repair Cream', category: 'SKINCARE', price: 21.87, stock: 10, icon: '✨', color: '#831843', image: '' },

    { id: 16, title: 'Nourishing Hair Shampoo', category: 'HAIR CARE', price: 21.39, stock: 25, icon: '🌿', color: '#064e3b', image: '' },
    { id: 17, title: 'Argan Hair Conditioning Oil', category: 'HAIR CARE', price: 51.27, stock: 15, icon: '🌿', color: '#064e3b', image: '' },
    { id: 18, title: 'Keratin Smooth Hair Mask', category: 'HAIR CARE', price: 71.02, stock: 12, icon: '🌿', color: '#064e3b', image: '' },

    { id: 19, title: 'Classic Denim Jacket', category: 'FASHION', price: 55.00, stock: 8, icon: '👕', color: '#312e81', image: '' },
    { id: 20, title: 'Rolex Watch', category: 'WATCHES', price: 400.00, stock: 1, icon: '⌚', color: '#451a03', image: '' }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track button feedback for green state
  const [addedItems, setAddedItems] = useState({});

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

    // Set green feedback for this specific product ID
    setAddedItems(prev => ({ ...prev, [product.id]: true }));

    // Reset back to blue after 1.5 seconds
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCart(prevCart => prevCart.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const removeFromCart = (id) => setCart(prevCart => prevCart.filter(item => item.id !== id));
  const clearCart = () => setCart([]);

  const addProduct = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(product => {
    const catMatch = selectedCategory === 'All' || product.category.toLowerCase().replace(/\s+/g, '') === selectedCategory.toLowerCase().replace(/\s+/g, '');
    const searchMatch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  const totalCartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
              
              {/* Header Navigation Bar */}
              <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 25px', background: '#0b1329', color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '18px' }}>🛍️</span>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>OmniStore</h2>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '280px', padding: '5px 12px', borderRadius: '4px', border: 'none', outline: 'none', fontSize: '13px' }}
                />
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Home</Link>
                  <Link to="/admin" style={{ color: '#facc15', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>Admin Panel</Link>
                  <Link to="/cart" style={{ background: '#22c55e', padding: '6px 14px', borderRadius: '5px', color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    🛒 Cart ({totalCartCount})
                  </Link>
                </div>
              </nav>

              {/* Main Products Area */}
              <div style={{ flex: 1, padding: '25px 0' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 15px', fontFamily: 'sans-serif' }}>
                  <h2 style={{ textAlign: 'center', fontSize: '24px', color: '#0f172a', fontWeight: '800', marginBottom: '20px' }}>Explore Products</h2>

                  {/* Category Pills */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '30px' }}>
                    {['All', 'Electronics', 'Skincare', 'Hair Care', 'Fashion', 'Watches'].map(cat => (
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

                  {/* 5-Column Grid Layout */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px' }}>
                    {filteredProducts.map(product => {
                      const isAdded = addedItems[product.id];

                      return (
                        <div key={product.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          
                          <div style={{ height: '110px', background: product.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '10px', textAlign: 'center', position: 'relative' }}>
                            {product.image ? (
                              <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <>
                                <span style={{ fontSize: '20px', marginBottom: '6px' }}>{product.icon}</span>
                                <span style={{ fontWeight: '600', fontSize: '11px', lineHeight: '1.2' }}>{product.title}</span>
                              </>
                            )}
                          </div>

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
                            
                            {/* Dynamic Green State Button */}
                            <button
                              onClick={() => addToCart(product)}
                              style={{ 
                                background: isAdded ? '#22c55e' : '#2563eb', 
                                color: '#fff', 
                                border: 'none', 
                                padding: '6px', 
                                borderRadius: '4px', 
                                cursor: 'pointer', 
                                width: '100%', 
                                fontWeight: 'bold', 
                                fontSize: '12px',
                                transition: 'background-color 0.3s ease'
                              }}
                            >
                              {isAdded ? 'Added ✓' : 'Add to Cart'}
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* Bottom Footer */}
              <footer style={{ background: '#0b1329', color: '#94a3b8', textAlign: 'center', padding: '15px 20px', fontSize: '13px', borderTop: '1px solid #1e293b' }}>
                <p style={{ margin: 0 }}>© {new Date().getFullYear()} OmniStore Mart. All Rights Reserved.</p>
              </footer>

            </div>
          }
        />

        <Route
          path="/admin"
          element={<Admin products={products} addProduct={addProduct} deleteProduct={deleteProduct} />}
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