import React, { useState } from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import { products } from './data';
import './index.css';

function App() {
  const [cart, setCart] = useState([]);

  // Add a product to the cart
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // If it exists, increase quantity
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // If it's a new item, add to cart with quantity 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Update quantity of a cart item
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent 0 or negative quantities
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const handleRemoveItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Clear entire cart
  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="logo">Tech<span>Store</span></h1>
          <p className="subtitle">Premium Gadgets & Accessories</p>
        </div>
      </header>
      
      <main className="main-content">
        <ProductList 
          products={products} 
          onAddToCart={handleAddToCart} 
        />
        <Cart 
          cart={cart} 
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />
      </main>
    </div>
  );
}

export default App;
