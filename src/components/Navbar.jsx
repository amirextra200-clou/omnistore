import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ cartCount, searchQuery, setSearchQuery }) {
  return (
    <header className="navbar-header">
      <div className="brand-logo-wrapper">
        <Link to="/" className="brand-logo">
          🛍️ OmniStore Mart
        </Link>
      </div>

      <div className="search-box-wrapper">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="nav-links-wrapper">
        <Link to="/" className="nav-link">
          Store Front
        </Link>
        <Link to="/admin" className="nav-link">
          Admin Panel
        </Link>
        <Link to="/cart" className="cart-link-btn">
          🛒 Cart ({cartCount})
        </Link>
      </div>
    </header>
  );
}