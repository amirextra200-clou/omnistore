import React, { useState } from 'react';
import { createCategorySvg } from '../data/products';

export default function Admin({ products, addProduct, deleteProduct, orders }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('electronics');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const finalImage = imageFile !== '' 
      ? imageFile 
      : createCategorySvg(name, category);

    const newProd = {
      id: Date.now(),
      name,
      category,
      price: parseFloat(price),
      image: finalImage
    };

    addProduct(newProd);
    setName('');
    setPrice('');
    setImageFile('');
    alert(`"${name}" added to Mart Inventory successfully!`);
  };

  return (
    <main className="container">
      <h2>🏪 Mart Owner Dashboard</h2>

      <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', flex: 1, border: '1px solid #e2e8f0' }}>
          <p>Total Products in Mart</p>
          <h3>{products.length}</h3>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', flex: 1, border: '1px solid #e2e8f0' }}>
          <p>Mart Orders Received</p>
          <h3 style={{ color: '#16a34a' }}>{orders.length}</h3>
        </div>
      </div>

      {/* Product Add Form */}
      <div style={{ background: 'white', padding: '25px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
        <h3>➕ Add Product to Mart</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
          <input 
            type="text" 
            placeholder="Product Name" 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
          />
          
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="electronics">Electronics</option>
            <option value="watches">Watches</option>
            <option value="skincare">Skincare</option>
            <option value="haircare">Hair Care</option>
            <option value="fashion">Fashion</option>
            <option value="groceries">Groceries</option>
          </select>

          <input 
            type="number" 
            step="0.01" 
            placeholder="Price ($)" 
            required 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>Select Product Picture from PC:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', background: '#f8fafc', cursor: 'pointer' }} 
            />
          </div>

          <button 
            type="submit" 
            style={{ background: '#2563eb', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}
          >
            Save Product
          </button>
        </form>
      </div>

      {/* Inventory Items Management & Delete Section */}
      <div style={{ background: 'white', padding: '25px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
        <h3>📦 Manage Mart Inventory</h3>
        <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {products.length === 0 ? (
            <p style={{ color: '#64748b' }}>No products in inventory.</p>
          ) : (
            products.map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 15px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <strong>{p.name}</strong>
                    <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '10px', textTransform: 'capitalize' }}>({p.category})</span>
                    <p style={{ margin: 0, fontSize: '14px', color: '#16a34a', fontWeight: 'bold' }}>${p.price.toFixed(2)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteProduct(p.id)} 
                  style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  🗑️ Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Customer Orders Log */}
      <div style={{ background: 'white', padding: '25px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <h3>📋 Mart Customer Orders Log</h3>
        {orders.length === 0 ? (
          <p style={{ color: '#64748b', marginTop: '10px' }}>No orders recorded yet.</p>
        ) : (
          orders.slice().reverse().map((ord, idx) => (
            <div key={idx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
              <p><strong>Customer:</strong> {ord.name} | <strong>Phone:</strong> {ord.phone}</p>
              <p><strong>Items:</strong> {ord.items}</p>
              <p style={{ color: '#16a34a', fontWeight: 'bold' }}>Total: ${ord.total}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}