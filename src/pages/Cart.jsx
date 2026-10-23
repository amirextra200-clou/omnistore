import React from 'react';

const Cart = ({ cartItems = [], updateQuantity, removeFromCart, clearCart }) => {
  const safeItems = Array.isArray(cartItems) ? cartItems : [];

  const calculateTotal = () => {
    return safeItems
      .reduce((total, item) => total + (Number(item?.price) || 0) * (Number(item?.quantity) || 1), 0)
      .toFixed(2);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>🛒 Shopping Cart</h2>

      {safeItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <h3>Your cart is empty!</h3>
          <p style={{ color: '#666' }}>Add some products to see them here.</p>
        </div>
      ) : (
        <div>
          {safeItems.map((item, index) => {
            const currentQty = item?.quantity || 1;
            const itemPrice = Number(item?.price) || 0;

            return (
              <div 
                key={item?.id || index} 
                style={{
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '15px', 
                  marginBottom: '15px', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ flex: 2 }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{item?.title || item?.name || 'Product'}</h3>
                  <p style={{ margin: 0, color: '#28a745', fontWeight: 'bold' }}>
                    ${itemPrice.toFixed(2)}
                  </p>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <button 
                    onClick={() => updateQuantity && updateQuantity(item.id, currentQty - 1)}
                    disabled={currentQty <= 1}
                    style={{
                      padding: '5px 12px',
                      fontSize: '16px',
                      cursor: currentQty <= 1 ? 'not-allowed' : 'pointer',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  >
                    -
                  </button>
                  
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Qty: {currentQty}
                  </span>

                  <button 
                    onClick={() => updateQuantity && updateQuantity(item.id, currentQty + 1)}
                    style={{
                      padding: '5px 12px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  >
                    +
                  </button>
                </div>

                <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
                  ${(itemPrice * currentQty).toFixed(2)}
                </div>

                <div style={{ flex: 1, textAlign: 'right' }}>
                  <button 
                    onClick={() => removeFromCart && removeFromCart(item.id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <div style={{
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: '25px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <button 
              onClick={() => clearCart && clearCart()} 
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Clear Cart
            </button>

            <div style={{ textAlign: 'right' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Total: ${calculateTotal()}</h3>
              <button 
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '5px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Place Order 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;