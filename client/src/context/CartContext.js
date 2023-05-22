import React, { useState, useEffect, useRef } from 'react';
import api from '../index';
import PropTypes from 'prop-types';

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState([]);
  console.log(cartData);

  // useEffect(() => {
  //   // Side effect to handle cart data changes
  //   const updateCartData = async () => {
  //     const userId = userIdRef.current;
  //     console.log(userId);
  //     api
  //       .post(`/api/cart/${userId}`, {
  //         cartData: cartData,
  //       })
  //       .then((response) => {
  //         console.log(response);
  //       });
  //   };
  //   updateCartData();
  // }, [cartData]);
  return (
    <CartContext.Provider value={{ cartData, setCartData }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default CartContext;
