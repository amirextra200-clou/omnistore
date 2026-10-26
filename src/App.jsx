import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
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

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track button feedback for green state
  const [addedItems, setAddedItems] = useState({});

  // Fetch products from Firebase Firestore on load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products from Firestore: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

    setAddedItems(prev => ({ ...prev, [product.id]: true }));

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

  // Add product to Firebase Firestore
  const addProduct = async (newProduct) => {
    try {
      // Remove local static id so Firestore auto-generates a clean document ID
      const { id, ...productData } = newProduct;
      const docRef = await addDoc(collection(db, 'products'), productData);
      
      const createdProduct = { id: docRef.id, ...productData };
      setProducts([createdProduct, ...products]);
    } catch (error) {
      console.error("Error adding product to Firestore: ", error);
    }
  };

  // Delete product from Firebase Firestore
  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting product from Firestore: ", error);
    }
  };

  const filteredProducts = products.filter(product => {
    const categoryStr = product.category || '';
    const catMatch = selectedCategory === 'All' || categoryStr.toLowerCase().replace(/\s+/g, '') === selectedCategory.toLowerCase().replace(/\s+/g, '');
    const titleStr = product.title || '';
    const searchMatch = titleStr.toLowerCase().includes(searchQuery.toLowerCase());
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

                  {loading ? (
                    <p style={{ textAlign: 'center', color: '#64748b', fontSize: '16px' }}>Loading products from Firebase...</p>
                  ) : filteredProducts.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#64748b', fontSize: '16px' }}>No products found in database.</p>
                  ) : (
                    /* 5-Column Grid Layout */
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px' }}>
                      {filteredProducts.map(product => {
                        const isAdded = addedItems[product.id];

                        return (
                          <div key={product.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            
                            <div style={{ height: '110px', background: product.color || '#1a2238', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '10px', textAlign: 'center', position: 'relative' }}>
                              {product.image ? (
                                <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <>
                                  <span style={{ fontSize: '20px', marginBottom: '6px' }}>{product.icon || '📦'}</span>
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
                                ${Number(product.price || 0).toFixed(2)}
                              </p>
                              
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
                  )}

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