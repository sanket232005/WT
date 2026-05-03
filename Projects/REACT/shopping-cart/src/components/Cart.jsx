import React from 'react';
import CartItem from './CartItem';

const Cart = ({ cart, onUpdateQuantity, onRemoveItem, onClearCart }) => {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="section-title">Your Cart</h2>
        <span className="cart-badge">{totalItems} Items</span>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <CartItem 
                key={item.id} 
                item={item} 
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
              />
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-row">
              <span>Total:</span>
              <span className="summary-total">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="cart-actions">
              <button className="btn btn-outline" onClick={onClearCart}>
                Clear Cart
              </button>
              <button className="btn btn-primary btn-block">
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
