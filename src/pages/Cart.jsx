import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const Cart = ({ cartItems = [], updateQuantity, removeFromCart, clearCart }) => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const safeItems = Array.isArray(cartItems) ? cartItems : [];

  const calculateTotal = () => {
    return safeItems
      .reduce((total, item) => total + (Number(item?.price) || 0) * (Number(item?.quantity) || 1), 0)
      .toFixed(2);
  };

  const totalCartCount = safeItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Professional Order Placement Handler with Firebase Integration
  const handlePlaceOrder = async () => {
    if (safeItems.length === 0 || loading) return;

    setLoading(true);

    try {
      const generatedOrderId = 'OMNI-' + Math.floor(100000 + Math.random() * 900000);
      const totalAmount = calculateTotal();

      // Save order to Firebase Firestore 'orders' collection
      await addDoc(collection(db, 'orders'), {
        orderId: generatedOrderId,
        items: safeItems.map(item => ({
          id: item.id || '',
          title: item.title || item.name || 'Product',
          price: Number(item.price) || 0,
          quantity: item.quantity || 1
        })),
        total: Number(totalAmount),
        itemCount: totalCartCount,
        createdAt: serverTimestamp()
      });

      setOrderDetails({
        orderId: generatedOrderId,
        total: totalAmount,
        itemCount: totalCartCount
      });

      setOrderPlaced(true);

      if (clearCart) {
        clearCart();
      }
    } catch (error) {
      console.error("Error saving order to Firebase: ", error);
      alert("Failed to place order. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
      
      <div>
        {/* Top Navigation Header */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 25px', background: '#0b1329', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>🛍️</span>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>OmniStore</h2>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Home</Link>
            <Link to="/admin" style={{ color: '#facc15', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>Admin Panel</Link>
            <Link to="/cart" style={{ background: '#22c55e', padding: '6px 14px', borderRadius: '5px', color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              🛒 Cart ({totalCartCount})
            </Link>
          </div>
        </nav>

        {/* Cart Main Content */}
        <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px' }}>
          
          {/* Real Success Confirmation Card */}
          {orderPlaced ? (
            <div style={{
              background: '#fff',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '40px 20px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(34,197,94,0.1)'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: '#dcfce7',
                color: '#16a34a',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                margin: '0 auto 20px auto'
              }}>
                ✓
              </div>

              <h2 style={{ fontSize: '26px', color: '#0f172a', margin: '0 0 10px 0', fontWeight: 'bold' }}>
                Order Placed Successfully!
              </h2>

              <p style={{ color: '#64748b', fontSize: '15px', margin: '0 0 20px 0' }}>
                Thank you for your purchase. Your order has been securely saved to the cloud database.
              </p>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '15px',
                maxWidth: '400px',
                margin: '0 auto 25px auto',
                fontSize: '14px',
                color: '#334155',
                textAlign: 'left'
              }}>
                <p style={{ margin: '0 0 8px 0' }}><strong>Order Number:</strong> {orderDetails?.orderId}</p>
                <p style={{ margin: '0 0 8px 0' }}><strong>Total Amount:</strong> ${orderDetails?.total}</p>
                <p style={{ margin: 0 }}><strong>Estimated Delivery:</strong> 3-5 Business Days 🚚</p>
              </div>

              <Link 
                to="/" 
                onClick={() => setOrderPlaced(false)}
                style={{ 
                  display: 'inline-block', 
                  background: '#2563eb', 
                  color: '#fff', 
                  padding: '12px 28px', 
                  borderRadius: '6px', 
                  textDecoration: 'none', 
                  fontWeight: 'bold',
                  fontSize: '15px'
                }}
              >
                Continue Shopping 🛍️
              </Link>
            </div>
          ) : (
            <>
              <h2 style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px', color: '#0f172a' }}>🛒 Shopping Cart</h2>

              {safeItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <h3 style={{ fontSize: '20px', color: '#1e293b' }}>Your cart is empty!</h3>
                  <p style={{ color: '#64748b' }}>Add some products to see them here.</p>
                  <Link to="/" style={{ display: 'inline-block', marginTop: '15px', background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                    Go to Store Front 🛍️
                  </Link>
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
                          padding: '15px 20px', 
                          marginBottom: '15px', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          backgroundColor: '#fff',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                        }}
                      >
                        <div style={{ flex: 2 }}>
                          <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#0f172a' }}>{item?.title || item?.name || 'Product'}</h3>
                          <p style={{ margin: 0, color: '#16a34a', fontWeight: 'bold', fontSize: '15px' }}>
                            ${itemPrice.toFixed(2)}
                          </p>
                        </div>

                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                          <button 
                            onClick={() => updateQuantity && updateQuantity(item.id, currentQty - 1)}
                            disabled={currentQty <= 1}
                            style={{
                              padding: '4px 10px',
                              fontSize: '14px',
                              cursor: currentQty <= 1 ? 'not-allowed' : 'pointer',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              background: '#f8fafc'
                            }}
                          >
                            -
                          </button>
                          
                          <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>
                            Qty: {currentQty}
                          </span>

                          <button 
                            onClick={() => updateQuantity && updateQuantity(item.id, currentQty + 1)}
                            style={{
                              padding: '4px 10px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              background: '#f8fafc'
                            }}
                          >
                            +
                          </button>
                        </div>

                        <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#0f172a', fontSize: '16px' }}>
                          ${(itemPrice * currentQty).toFixed(2)}
                        </div>

                        <div style={{ flex: 1, textAlign: 'right' }}>
                          <button 
                            onClick={() => removeFromCart && removeFromCart(item.id)}
                            style={{
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '13px'
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
                    padding: '20px 25px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                  }}>
                    <button 
                      onClick={() => clearCart && clearCart()} 
                      style={{
                        backgroundColor: '#64748b',
                        color: 'white',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '13px'
                      }}
                    >
                      Clear Cart
                    </button>

                    <div style={{ textAlign: 'right' }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#0f172a' }}>Total: ${calculateTotal()}</h3>
                      <button 
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        style={{
                          backgroundColor: loading ? '#94a3b8' : '#22c55e',
                          color: 'white',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '6px',
                          fontSize: '15px',
                          fontWeight: 'bold',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          boxShadow: '0 2px 4px rgba(34,197,94,0.3)'
                        }}
                      >
                        {loading ? 'Processing...' : 'Place Order 🚀'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* Bottom Footer Section */}
      <footer style={{ background: '#0b1329', color: '#94a3b8', textAlign: 'center', padding: '15px 20px', fontSize: '13px', borderTop: '1px solid #1e293b', marginTop: '40px' }}>
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} OmniStore Mart. All Rights Reserved.</p>
      </footer>

    </div>
  );
};

export default Cart;