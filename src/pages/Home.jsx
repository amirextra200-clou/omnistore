import React, { useState } from 'react';

export default function Home({ products, addToCart, searchQuery }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'electronics', 'watches', 'skincare', 'haircare', 'fashion', 'groceries'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="container">
      <h2>Explore Products</h2>
      
      <div className="category-filters">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`cat-btn ${selectedCategory === cat ? 'active' : 'inactive'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-img" />
              <div className="product-info">
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>{product.category}</span>
                  <h4 style={{ fontSize: '16px', margin: '4px 0 8px 0', color: '#0f172a' }}>{product.name}</h4>
                </div>
                <div>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a', marginBottom: '10px' }}>${product.price.toFixed(2)}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="add-cart-btn"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}