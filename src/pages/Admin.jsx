import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Admin = ({ addProduct }) => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Watches');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

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

    addProduct(newProduct);
    setProductName('');
    setPrice('');
    setStockQuantity('1');
    setImageUrl('');
    setImagePreview(null);
    alert('Product added successfully to store!');
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', background: '#0b1329', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🛍️</span>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>OmniStore Admin</h2>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Store Front</Link>
          <Link to="/admin" style={{ color: '#facc15', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' }}>Admin Panel</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '40px auto', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', padding: '40px' }}>
        
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '22px', color: '#0f172a', marginBottom: '30px', fontWeight: 'bold' }}>
          <span style={{ color: '#7c3aed', fontSize: '24px' }}>+</span> Add New Product
        </h2>

        <form onSubmit={handleSubmit}>
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

      </div>
    </div>
  );
};

export default Admin;