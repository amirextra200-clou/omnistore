import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../firebase';
import AuthModal from './AuthModal';

const auth = getAuth(app);

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // User ke login status ko track karne ke liye
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', background: '#0b1329', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🛍️</span>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>OmniStore</h2>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Store Front</Link>
          <Link to="/admin" style={{ color: '#facc15', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' }}>Admin Panel</Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', background: '#1e293b', color: '#38bdf8', padding: '5px 10px', borderRadius: '20px', fontWeight: '500' }}>
                👤 {user.email}
              </span>
              <button
                onClick={handleLogout}
                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 2px 4px rgba(37,99,235,0.2)' }}
            >
              Login / Sign Up 🚀
            </button>
          )}
        </div>
      </nav>

      {/* Auth Modal Component */}
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Navbar;