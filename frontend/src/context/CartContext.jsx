import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const updateCartItems = (items) => {
    setCartItems(items);
  };

  const getTotalItems = () => {
    return cartItems.length;
  };

  return (
    <CartContext.Provider value={{ cartItems, updateCartItems, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
};
