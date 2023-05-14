import axios from 'axios';
import { useEffect, useContext, useState } from 'react';
import CartContext from '../../context/CartContext';
import LoadingIndicator from 'react-loading-indicator';
const Cart = () => {
  const [cartData, updateCartData] = useContext(CartContext);
  const [currentCartData, setCurrentCartData] = useState([]);
  const [cartProductData, setCartProductData] = useState(null);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  console.log();
  //const customerID = localStorage.getItem('customerID');
  const customerID = 3;
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/Cart/${customerID}`)
      .then((response) => {
        console.log(response);
        updateCartData(response.data.data);
        setCartProductData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [customerID]);
  useEffect(() => {
    if (cartData.length > 0) {
      var requestArray = [];
      cartData.forEach((cartItem) => {
        console.log(cartItem);
        requestArray.push({
          method: 'GET',
          endpoint: `/api/getCartItemData/${cartItem.productID}`,
        });
      });
      axios
        .post(`${baseUrl}/api/cartdetails/getCartProductData`, {
          requests: requestArray,
        })
        .then((response) => {
          const dataArray = response.data.data.map((item) => item.data);
          console.log(JSON.stringify(dataArray));
          setCartProductData(dataArray);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [cartData]);
  return (
    <div>
      <p>Cart items are</p>
      {cartProductData ? (
        cartProductData.map((cartItem,index) =>(
          
          <li key={`${cartItem.product_ID}-${index}`}>
            <p>{cartItem.product_name}</p>
            <img src={`${cartItem.image_url}`} alt='cartImage' />
            <p></p>
          </li>
        ))
      ) : (
        <LoadingIndicator />
      )}
    </div>
  );
};

export default Cart;
