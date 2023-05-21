import React, { useState } from 'react';
import api from '../index';
import PropTypes from 'prop-types';

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState([]);
  const addToCart = async(userid,productId,quantity)=>{
    const latestCartData = [...cartData, {productId:productId, quantity:quantity}]
    setCartData(latestCartData)
    api
        .post(`/api/cart/${userid}`, {
          cartData: latestCartData,
        })
        .then((response) => {
          console.log(response);
        });
        console.log(cartData);
  }
  return (
    <CartContext.Provider value={[cartData,setCartData,addToCart]}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default CartContext;
