import axios from 'axios';
import { useEffect, useContext, useState } from 'react';
import CartContext from '../../context/CartContext';
import LoadingIndicator from 'react-loading-indicator';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { AiFillDelete } from 'react-icons/ai';
import { FiPlus, FiMinus } from 'react-icons/fi';
import {BsArrowLeft} from 'react-icons/bs';
import { Link } from 'react-router-dom';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});
const Cart = () => {
  const [cartData, updateCartData] = useContext(CartContext);
  const [cartProductData, setCartProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  console.log();
  //const customerID = localStorage.getItem('customerID');
  const customerID = 3;
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/cart/${customerID}`)
      .then((response) => {
        console.log(response.data.data);
        updateCartData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [customerID]);
  useEffect(() => {
    if (cartData.length > 0) {
      setIsLoading(true);
      var requestArray = [];
      cartData.forEach((cartItem) => {
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
          console.log(response.data.data);
          const dataArray = response.data.data.map((item) => {
            const cartInfo = cartData.find(
              (cartItem) => cartItem.productID === item.data.product_id
            );
            return {
              ...item.data,
              quantity: cartInfo.quantity,
            };
          });
          console.log(JSON.stringify(dataArray));
          setCartProductData(dataArray);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [cartData]);
  return (
    <div>
      <table className="border-collapse mt-4 mb-8 text-base w-3/5 ml-48">
      <thead>
        <tr>
          <th>Your Cart({cartData.length})</th>
          <th>Product</th>
          <th>Price</th>
          <th className="text-center">Quantity</th>
          <th className="pl-6">Total</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          cartProductData.map((cartItem, index) => (
            <tr
              key={`${cartItem.product_ID}-${index}`}
              className="border-t-2 border-b-2 border-black"
            >
              <td className="flex flew-row py-6">
                <AdvancedImage
                  cldImg={cld.image(cartItem.image_url.split(',')[0])}
                  className="w-72 h-48 "
                />
              </td>
              <td>
                <b>{cartItem.product_name}</b>
                <p>category: {cartItem.category_name}</p>
                <p>brand :{cartItem.brand_name}</p>
              </td>
              <td>${cartItem.price}</td>
              <td >
                <div className='flex flex-row justify-evenly'>
                <button className='flex items-center justify-center w-8 h-8 bg-red-200 rounded-full'>
                  <FiMinus size={20} />
                </button>
                {cartItem.quantity}
                <button className='flex items-center justify-center w-8 h-8 bg-green-200 rounded-full'>
                  <FiPlus size={20}/>
                </button>
                </div>
              
              </td>

              <td className="pl-6">
                <b>
                  ${parseFloat(cartItem.price * cartItem.quantity).toFixed(2)}
                </b>
              </td>
              <td>
                <button className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                  <AiFillDelete size={20} color='red' />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    <button>
      <Link to="#" className='ml-48 text-base flex flex-row text-blue-800 '><BsArrowLeft size={24}/><b>Continue Shipping</b></Link>
    </button>
    </div>
    
  );
};

export default Cart;
