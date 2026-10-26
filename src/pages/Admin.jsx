import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { auth } from '../firebase';

const Admin = ({ products = [], addProduct, deleteProduct }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Product form states
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Watches');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // Listen to Firebase Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productName || !price) return;

    let catColor = '#1a2238';
    const catUpper = category.toUpperCase();
    if (catUpper.includes('SKIN')) catColor = '#831843';
    else if (catUpper.includes('HAIR')) catColor = '#064e3b';
    else if (catUpper.includes('FASHION')) catColor = '#312e81';
    else if (catUpper.includes('WATCH')) catColor = '#451a03';

    const newProduct = {
      id: Date.now(),
      title: productName,
      category: catUpper,
      price: parseFloat(price),
      stock: parseInt(stockQuantity) || 1,
      image: imagePreview || imageUrl || '',
      icon: '🛍️',
      color: catColor
    };

    if (addProduct) {
      addProduct(newProduct);
    }

    setProductName('');
    setPrice('');
    setStockQuantity('1');
    setImageUrl('');
    setImagePreview(null);
  };

  if (authLoading) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <p style={{ fontSize: '16px', color: '#64748b' }}>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Top Navbar Header */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', background: '#0b1329', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🛍️</span>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>OmniStore Admin</h2>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Store Front</Link>
          <Link to="/admin" style={{ color: '#facc15', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' }}>Admin Panel</Link>
          {user && (
            <button
              onClick={handleLogout}
              style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              Logout 🔒
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <div style={{ maxWidth: '900px', margin: '40px auto', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', padding: '40px' }}>

        {!user ? (
          /* Admin Login Form */
          <div style={{ maxWidth: '400px', margin: '20px auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', color: '#0f172a', marginBottom: '10px', fontWeight: 'bold' }}>Admin Secure Login</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>Please sign in to access the product management panel.</p>

            {loginError && (
              <div style={{ background: '#ffeeee', border: '1px solid #f87171', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px', wordBreak: 'break-word' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>Admin Email</label>
                <input
                  type="email"
                  placeholder="admin@omnistore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(37,99,235,0.2)' }}
              >
                Sign In to Admin Panel 🚀
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '22px', color: '#0f172a', margin: 0, fontWeight: 'bold' }}>
                <span style={{ color: '#7c3aed', fontSize: '24px' }}>+</span> Add New Product
              </h2>
              <span style={{ fontSize: '13px', background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>
                Logged in as: {user.email}
              </span>
            </div>

            {/* Add Product Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '40px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Product Name</label>
                  <input
                    type="text"
                    placeholder="Rolex watch"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', background: '#fff', outline: 'none' }}
                  >
                    <option value="Watches">Watches</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Skincare">Skincare</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="400.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Stock Quantity</label>
                  <input
                    type="number"
                    placeholder="1"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                  />
                </div>

              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Product Image (Browse File OR Enter URL)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <label style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                    Choose File
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>{imagePreview ? 'File selected' : 'no file chosen'}</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#64748b' }}>OR</span>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{ flex: 1, padding: '9px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                {(imagePreview || imageUrl) && (
                  <div style={{ marginTop: '15px' }}>
                    <img src={imagePreview || imageUrl} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>
                )}
              </div>

              <button
                type="submit"
                style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(37,99,235,0.2)' }}
              >
                Add Product to Store
              </button>
            </form>

            {/* Existing Products Management Table with Delete Buttons */}
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '30px 0' }} />

            <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '15px', fontWeight: 'bold' }}>
              Manage Existing Products ({products.length})
            </h3>

            {products.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '14px' }}>No products available in store.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '12px 16px', fontSize: '14px', color: '#334155' }}>Title</th>
                    <th style={{ padding: '12px 16px', fontSize: '14px', color: '#334155' }}>Category</th>
                    <th style={{ padding: '12px 16px', fontSize: '14px', color: '#334155' }}>Price</th>
                    <th style={{ padding: '12px 16px', fontSize: '14px', textAlign: 'right', color: '#334155' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{p.title}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>{p.category}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#16a34a', fontWeight: 'bold' }}>${Number(p.price).toFixed(2)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => deleteProduct && deleteProduct(p.id)}
                          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default Admin;