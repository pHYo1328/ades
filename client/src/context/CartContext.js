import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState([]);
  return (
    <CartContext.Provider value={[cartData, setCartData]}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default CartContext;
