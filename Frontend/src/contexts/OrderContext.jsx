import React, { createContext, useState, useContext } from 'react';

export const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateDeliveryFee = () => {
    return 5;
  }

  const calculateTotal = (subtotal, tax, deliveryFee) => {
    return subtotal + tax + deliveryFee;
  }

  const fetchOrders = async () => {
    return [
      { id: 1, items: [{ name: 'Pizza', price: 15 }], total: 15 }
    ];
  };

  return (
    <OrderContext.Provider value={{ cart, addToCart, calculateTotal, removeFromCart, fetchOrders, calculateSubtotal, calculateTax, calculateDeliveryFee }}>
      {children}
    </OrderContext.Provider>
  );
};
