import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState([]);
  const updateCartData = (newCartData) => {
    setCartData(newCartData);
  };
  return (
    <CartContext.Provider value={[cartData, updateCartData]}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default CartContext;
