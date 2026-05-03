import React from 'react';
import ProductItem from './ProductItem';

const ProductList = ({ products, onAddToCart }) => {
  return (
    <div className="product-list-container">
      <h2 className="section-title">Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductItem 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
