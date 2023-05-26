import axios from 'axios';
import { useEffect, useContext, useState, useRef } from 'react';
import LoadingIndicator from 'react-loading-indicator';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { AiFillDelete } from 'react-icons/ai';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { BsArrowLeft } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../index';
const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

const plusButtonHandler = (cartData, productId, updateCartData) => {
  const updatedCart = cartData.map((item) =>
    item.productId == productId
      ? { ...item, quantity: item.quantity + 1 }
      : item
  );
  console.log(updatedCart);
  updateCartData([...updatedCart]);
};

const minusButtonHandler = (cartData, productID, updateCartData) => {
  const updatedCart = cartData.map((item) =>
    item.productId == productID && item.quantity > 1
      ? { ...item, quantity: item.quantity - 1 }
      : item
  );
  updateCartData([...updatedCart]);
};

const deleteButtonHandler = (cartData, productID, updateCartData) => {
  confirmAlert({
    title: 'Confirm to delete',
    message: 'Are you sure you want to delete this item?',
    buttons: [
      {
        label: 'Yes',
        onClick: () => {
          const filteredProducts = cartData.filter(
            (item) => item.productId != productID
          );
          console.log(filteredProducts);
          updateCartData(filteredProducts);
        },
      },
      {
        label: 'No',
        onClick: () => {},
      },
    ],
  });
};
const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [cartProductData, setCartProductData] = useState(null);
  const [productDetails, setProductsDetails] = useState(null);
  const latestCartData = useRef(cartData);
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    postalCode: '',
  });
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [shippingId, setShippingId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [checkoutSuccessful, setCheckoutSuccessful] = useState(false);
  const checkoutSuccessfulRef = useRef(checkoutSuccessful);
  const customerID = localStorage.getItem('userid');
  const navigate = useNavigate();
  const combineCartDataAndProductDetails = () => {
    const itemsDetailsToShow = cartData
      .map((cartItem) => {
        const cartInfo = productDetails.find(
          (item) => cartItem.productId == item.product_id
        );

        if (cartInfo) {
          const totalAmount = parseFloat(
            cartInfo.price * cartItem.quantity
          ).toFixed(2);
          return {
            ...cartInfo,
            quantity: cartItem.quantity,
            totalAmount: totalAmount,
          };
        } else {
          return null;
        }
      })
      .filter((item) => item !== null); // Filter out the null values
    console.log(itemsDetailsToShow);
    const overallTotalAmount = itemsDetailsToShow
      .reduce((total, item) => total + parseFloat(item.totalAmount), 0)
      .toFixed(2);
    setTotalAmount(overallTotalAmount);
    setCartProductData(itemsDetailsToShow);
  };
  const checkOutHandler = (
    customerId,
    address,
    totalPrice,
    shippingMethod,
    cartProductData
  ) => {
    if (!shippingMethod) {
      toast.error('Please select shipping method',{
        autoClose: 3000,
        pauseOnHover: true,
        style: { 'font-size': '16px' },
      });
      return;
    }
    let isStockAvailable = true;
    let alertString = [];
    const productIDs = cartProductData.map((item)=>item.product_id);
    const cartData = cartProductData.map((item)=>({productId: item.product_id, quantity: item.quantity}))
    api.get(`/api/inventory/checkQuantity?productIDs=${productIDs.join(
      ','
    )}`).then((response)=>{
      console.log(response.data.data)
      response.data.data.forEach((inventory)=>{
        const quantityIndex= cartData.findIndex((item)=>item.productId==inventory.product_id)
        if (quantityIndex !== -1 && inventory.quantity < cartData[quantityIndex].quantity) {
          isStockAvailable=false;
          alertString.push(`Sorry, ${inventory.product_name} cannot provide the quantity you are asking for. Please reduce your quantity by ${cartData[quantityIndex].quantity-inventory.quantity}.`);
        }
      })
      if(!isStockAvailable){
        alertString.forEach((string)=>{
          toast.error(string,{
            autoClose: 3000,
            pauseOnHover: true,
            style: { 'font-size': '16px' },
          });
        })
        return;
      }
      
      const requestBody = {
        shippingAddr: `${address.addressLine1} ${address.addressLine2} ${address.state} ${address.postalCode}`,
        totalPrice: totalPrice,
        shippingMethod: shippingMethod,
        orderItems: cartData,
      };
      api
        .post(`/api/order/${customerId}`, requestBody)
        .then((response) => {
          setCheckoutSuccessful(true);
          setOrderId(response.data.data);
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    }).catch(error =>{
      console.log(error)
    })
    
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`api/cart/${customerID}`);
        const cartData = response.data.data;
        setCartData(cartData);
        const shippingData = await api.get(`api/shipping`);
        setShippingMethod(shippingData.data.data);
        if (cartData.length > 0) {
          var productIDs = [];
          cartData.forEach((cartItem) => {
            productIDs.push(cartItem.productId);
          });
          const productResponse = await api.get(
            `/api/cartdetails/getCartProductData?productIDs=${productIDs.join(
              ','
            )}`
          );
          console.log(productResponse.data.data);
          setProductsDetails(productResponse.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [customerID]);
  useEffect(() => {
    return () => {
      console.log(checkoutSuccessfulRef.current);
      if (!checkoutSuccessfulRef.current) {
        api
          .post(`/api/cart/${customerID}`, {
            cartData: latestCartData.current,
          })
          .then((response) => {
            console.log(response);
          });
      } else {
        api.delete(`/api/cart/${customerID}`).then((response) => {
          console.log(response);
        });
      }
    };
  }, []);

  useEffect(() => {
    checkoutSuccessfulRef.current = checkoutSuccessful;
    if (checkoutSuccessful) {
      navigate(`/payment/${orderId}`);
    }
  }, [checkoutSuccessful]);
  const handleChange = (event) => {
    setAddress({
      ...address,
      [event.target.name]: event.target.value,
    });
  };
  useEffect(() => {
    latestCartData.current = cartData;
    if (cartData.length > 0) {
      if (productDetails && productDetails.length > 0) {
        console.log(cartData);
        combineCartDataAndProductDetails();
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [cartData, productDetails]);
  return (
    <div className="flex flex-row ">
      <table className="border-collapse mt-4 mb-48 text-base w-3/5 ml-36">
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
            <tr className="flex justify-center items-center">
              <LoadingIndicator />
            </tr>
          ) : cartProductData &&
            cartData.length > 0 &&
            productDetails.length > 0 ? (
            cartProductData.map((cartItem, index) => (
              <tr
                key={`${cartItem.product_ID}-${index}`}
                className="border-t-2 border-b-2 border-black"
              >
                <td className="flex flew-row py-6">
                  <AdvancedImage
                    cldImg={cld.image(cartItem.image_url)}
                    className="w-64 h-48 "
                  />
                </td>
                <td>
                  <b>{cartItem.product_name}</b>
                  <p>category: {cartItem.category_name}</p>
                  <p>brand :{cartItem.brand_name}</p>
                </td>
                <td>${cartItem.price}</td>
                <td>
                  <div className="flex flex-row justify-evenly space-x-2">
                    <button
                      className="flex items-center justify-center w-8 h-8 bg-red-400 border-2 border-black"
                      onClick={() =>
                        minusButtonHandler(
                          cartData,
                          cartItem.product_id,
                          setCartData
                        )
                      }
                    >
                      <FiMinus size={20} />
                    </button>
                    <p>{cartItem.quantity}</p>
                    <button
                      className="flex items-center justify-center w-8 h-8 bg-green-400 border-2 border-black"
                      onClick={() =>
                        plusButtonHandler(
                          cartData,
                          cartItem.product_id,
                          setCartData
                        )
                      }
                    >
                      <FiPlus size={20} />
                    </button>
                  </div>
                </td>

                <td className="pl-6">
                  <b>${cartItem.totalAmount}</b>
                </td>
                <td className="pl-4">
                  <button
                    className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full"
                    onClick={() =>
                      deleteButtonHandler(
                        cartData,
                        cartItem.product_id,
                        setCartData
                      )
                    }
                  >
                    <AiFillDelete size={24} color="red" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="flex justify-center item-center">
                There is nothing in your cart.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="w-1/4  bg-black p-4 ml-12 mr-36 mt-5 rounded-lgz`">
        <div className="space-y-4 ">
          <h1 className="text-lg font-bold text-white">Shipping Address</h1>
          <div className="flex flex-row item-center ">
            <label
              htmlFor="firstName"
              className="block text-base font-medium text-white w-28"
            >
              First Name :
            </label>
            <input
              required
              type="text"
              name="firstName"
              value={address.firstName}
              onChange={handleChange}
              className="px-3 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none flex-grow"
              placeholder="First Name"
            />
          </div>

          <div className="flex flex-row">
            <label
              htmlFor="lastName"
              className="block text-base font-medium text-white w-28"
            >
              Last Name :
            </label>
            <input
              required
              type="text"
              name="lastName"
              value={address.lastName}
              onChange={handleChange}
              className="px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none flex-grow"
              placeholder="Last Name"
            />
          </div>
          <div className="flex flex-row">
            <label
              htmlFor="addressLine1"
              className="block text-base font-medium text-white w-28"
            >
              Address line 1 :
            </label>
            <input
              required
              type="text"
              name="addressLine1"
              value={address.addressLine1}
              onChange={handleChange}
              className="px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none flex-grow"
              placeholder="Address Line 1"
            />
          </div>
          <div className="flex flex-row">
            <label
              htmlFor="addressLine2"
              className="block text-base font-medium text-white w-28"
            >
              Address line 2:
            </label>
            <input
              required
              type="text"
              name="addressLine2"
              value={address.addressLine2}
              onChange={handleChange}
              className="px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none flex-grow"
              placeholder="Address Line 2"
            />
          </div>
          <div className="flex flex-row">
            <label
              htmlFor="state"
              className="block text-base font-medium text-white w-28"
            >
              State :
            </label>
            <input
              required
              type="text"
              name="state"
              value={address.state}
              onChange={handleChange}
              className="px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none flex-grow"
              placeholder="State"
            />
          </div>
          <div className="flex flex-row">
            <label
              htmlFor="postalCode"
              className="block text-base font-medium text-white w-28"
            >
              Postal Code :
            </label>
            <input
              required
              type="number"
              name="postalCode"
              value={address.postalCode}
              onChange={handleChange}
              className="px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none flex-grow"
              placeholder="Postal Code"
            />
          </div>
          <div>
          <button
            onClick={() =>
              checkOutHandler(
                customerID,
                address,
                totalAmount,
                shippingId,
                cartProductData
              )
            }
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md text-base font-roboto"
          >
            Check out
          </button>
          <ToastContainer limit={2} newestOnTop={true} position='top-center' style={{width:'600px',height:'200px'}}/>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0  w-3/4 h-1/5 z-1 bg-white py-3">
        <div className="flex flex-row justify-between">
          <button>
            <Link
              to="/products"
              className="ml-48 text-base flex flex-row text-blue-800 "
            >
              <BsArrowLeft size={24} />
              <b>Continue Shipping</b>
            </Link>
          </button>
          <div className="col-3">
            <select
              required
              class="form-select form-select-sm"
              onChange={(event) => {
                setShippingFee(event.target.value);
                setShippingId(event.target.selectedIndex);
              }}
            >
              <option disabled selected value="0">
                -- Shipping Method --
              </option>
              {shippingMethod ? (
                shippingMethod.map((method) => (
                  <option key={method.shipping_id} value={method.fee}>
                    {method.shipping_method}
                  </option>
                ))
              ) : (
                <LoadingIndicator />
              )}
            </select>
          </div>
          <div className="flex flex-column text-base ">
            <p>subTotal : ${totalAmount}</p>
            <p>
              total : $
              {(parseFloat(totalAmount) + parseFloat(shippingFee)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
