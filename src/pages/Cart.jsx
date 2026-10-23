// Sample Cart Component Fix
import React from 'react';

const Cart = ({ cartItems, updateQuantity, removeFromCart, clearCart }) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0).toFixed(2);
  };

  return (
    <div className="cart-container">
      <h2>🛒 Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0', padding: '10px', border: '1px solid #ddd' }}>
              <div>
                <h3>{item.name}</h3>
                <p>${item.price}</p>
              </div>

              {/* Quantity Controls (+ / -) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                  disabled={(item.quantity || 1) <= 1}
                >
                  -
                </button>
                <span>Quantity: {item.quantity || 1}</span>
                <button 
                  onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                >
                  +
                </button>
              </div>

              {/* Working Remove Button */}
              <button 
                onClick={() => removeFromCart(item.id)} 
                style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '8px 12px', cursor: 'pointer' }}
              >
                Remove
              </button>
            </div>
          ))}

          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <h3>Total: ${calculateTotal()}</h3>
            <button onClick={clearCart} style={{ marginRight: '10px' }}>Clear Cart</button>
            <button style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px 15px' }}>Place Order 🚀</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;