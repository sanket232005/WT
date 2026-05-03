import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  return (
    <div className="cart-item">
      <div className="cart-item-image-container">
        <img src={item.image} alt={item.name} className="cart-item-image" />
      </div>
      
      <div className="cart-item-info">
        <h4 className="cart-item-name">{item.name}</h4>
        <span className="cart-item-price">${item.price.toFixed(2)}</span>
      </div>

      <div className="cart-item-controls">
        <div className="quantity-controls">
          <button 
            className="btn-icon" 
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="quantity-value">{item.quantity}</span>
          <button 
            className="btn-icon" 
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
        <div className="item-total-price">
          ${(item.price * item.quantity).toFixed(2)}
        </div>
        <button 
          className="btn-icon btn-danger" 
          onClick={() => onRemoveItem(item.id)}
          title="Remove Item"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CartItem;
