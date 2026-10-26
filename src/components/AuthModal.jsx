import React, { useState } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { app } from '../firebase';

const auth = getAuth(app);

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Account successfully created & logged in!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Logged in successfully!');
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff', padding: '30px', borderRadius: '12px', width: '380px', position: 'relative', fontFamily: 'sans-serif', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ✕
        </button>

        <h2 style={{ marginBottom: '20px', color: '#0f172a', fontSize: '20px' }}>
          {isSignUp ? 'Create OmniStore Account' : 'Login to OmniStore'}
        </h2>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '8px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', wordBreak: 'break-word' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '5px' }}>Email</label>
            <input 
              type="email" 
              placeholder="user@example.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
              required 
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '5px' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
              required 
            />
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '11px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', margin: 0 }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span 
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isSignUp ? 'Login here' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;