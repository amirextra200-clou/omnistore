import React, { useState } from 'react';

export default function Cart({ cart, removeFromCart, clearCart, placeOrder }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    placeOrder(formData);
    setShowModal(false);
    setFormData({ name: '', phone: '', address: '' });
  };

  if (cart.length === 0) {
    return (
      <main className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <h2>🛒 Your Shopping Cart is Empty</h2>
      </main>
    );
  }

  return (
    <main className="container">
      <h2>🛒 Shopping Cart</h2>
      <div style={{ maxWidth: '800px', margin: '20px auto' }}>
        {cart.map((item, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '10px' }}>
            <div>
              <h4>{item.name}</h4>
              <p style={{ color: '#16a34a', fontWeight: 'bold' }}>${parseFloat(item.price).toFixed(2)}</p>
            </div>
            <button onClick={() => removeFromCart(index)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>Remove</button>
          </div>
        ))}

        <div style={{ textAlign: 'right', marginTop: '20px', background: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>Total: ${total.toFixed(2)}</h3>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
            <button onClick={clearCart} style={{ background: '#64748b', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer' }}>Clear Cart</button>
            <button onClick={() => setShowModal(true)} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Place Order 🚀</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '400px' }}>
            <h3>Confirm Mart Order</h3>
            <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
              <input type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="Phone Number" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <textarea placeholder="Address" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#16a34a', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>Confirm</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: '#64748b', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}