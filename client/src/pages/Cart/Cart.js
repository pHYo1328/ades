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
import { FaShoppingCart } from 'react-icons/fa';
import api from '../../index';
const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

const plusButtonHandler = (cartData, productId, updateCartData) => {
  //create a new array with new data for the cart 
  const updatedCart = cartData.map((item) =>
    // find the item with productId
    item.productId == productId
      // if it exists, update the quantity plus one
      ? { ...item, quantity: item.quantity + 1 }
      // else. return that item
      : item
  );
  console.log(updatedCart);
  updateCartData([...updatedCart]);
};

const minusButtonHandler = (cartData, productID, updateCartData) => {
  const updatedCart = cartData.map((item) =>
    // same concept with plus button handler but here it cannot go under 1
    item.productId == productID && item.quantity > 1
      ? { ...item, quantity: item.quantity - 1 }
      : item
  );
  updateCartData([...updatedCart]);
};

const deleteButtonHandler = (
  cartData,
  productID,
  updateCartData,
  setTotalAmount
) => {
  confirmAlert({
    title: 'Confirm to delete',
    message: 'Are you sure you want to delete this item?',
    buttons: [
      {
        label: 'Yes',
        onClick: () => {
          // filter out the deleted item productID and create a new array without that 
          const filteredProducts = cartData.filter(
            (item) => item.productId != productID
          );
          console.log(filteredProducts);
          updateCartData(filteredProducts);
          // recalulate the total amount after the deletion 
          // with reduce, set the intial value as 0 sum all the data
          const overallTotalAmount = filteredProducts
            .reduce((total, item) => total + parseFloat(item.totalAmount), 0)
            .toFixed(2);
          setTotalAmount(overallTotalAmount);
        },
      },
      {
        label: 'No',
        onClick: () => { },
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
  const [totalAmount, setTotalAmount] = useState(0.0);
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    postalCode: '',
  });
  const [shippingFee, setShippingFee] = useState(0.0);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [shippingId, setShippingId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [checkoutSuccessful, setCheckoutSuccessful] = useState(false);
  const checkoutSuccessfulRef = useRef(checkoutSuccessful);
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();
  const handleContinueToCheckout = () => {
    setShowCheckout(!showCheckout);
  };
  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem('roles'));
    console.log(roles);
    if (!roles) {
      // User does not have the required role(s), redirect them to the homepage or show an error message
      // alert("you're not admin");
      console.log('Redirecting to homepage-admin');
      navigate('/login');
    } else {
      const isCustomer = roles.includes('customer');
      console.log(isCustomer);
      if (!isCustomer) {
        // User does not have the required role(s), redirect them to the homepage or show an error message
        // alert("you're not admin");
        console.log('Redirecting to homepage-admin');
        navigate('/login');
      }
    }
  }, []);
  const customerID = localStorage.getItem('userid');
  const combineCartDataAndProductDetails = () => {
    // cart data:{productId: , quantity: }
    // productDetails:{ all data from database}
    // create new array of cartData with details with map
    const itemsDetailsToShow = cartData
      .map((cartItem) => {
        // find product which contains the same productId
        const cartInfo = productDetails.find(
          (item) => cartItem.productId == item.product_id
        );

        // if found, calculate total amount for that cart item and combine two data from productDetails and cartData
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
      .filter((item) => item !== null); // Filter out the null values means inside database this cart item is not available anymore
    console.log(itemsDetailsToShow);
    // same concept as above calculate total amount for all cart items
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
    // if user never choose shipping method prompt here to choose
    if (!shippingMethod) {
      toast.error('Please select shipping method', {
        autoClose: 3000,
        pauseOnHover: true,
        style: { 'font-size': '16px' },
      });
      return;
    }
    let isStockAvailable = true;
    let alertString = [];
    // if user check out with empty cart, say error 
    if (!cartProductData) {
      toast.error('Please add items to cart to checkout', {
        autoClose: 3000,
        pauseOnHover: true,
        style: { 'font-size': '16px' },
      });
      return;
    }
    // make new array with map to fetch inventory quantity to check in Stock 
    const productIDs = cartProductData.map((item) => item.product_id);
    // make new array with map to check inventory quantity with the data from database
    const cartData = cartProductData.map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
    }));
    // fetch inventory quantity
    api
      .get(`/api/inventory/checkQuantity?productIDs=${productIDs.join(',')}`)
      .then((response) => {
        console.log(response.data.data);
        // for all the data inside response from database
        response.data.data.forEach((inventory) => {
          // find index of particular product id 
          const quantityIndex = cartData.findIndex(
            (item) => item.productId == inventory.product_id
          );
          // and check that quantity index is -1 or less the cart quantity
          // if less then cart quantity, change the state and make alert string to tell user which order is not avaliable
          if (
            quantityIndex !== -1 &&
            inventory.quantity < cartData[quantityIndex].quantity
          ) {
            isStockAvailable = false;
            alertString.push(
              `Sorry, ${inventory.product_name
              } cannot provide the quantity you are asking for. Please reduce your quantity by ${cartData[quantityIndex].quantity - inventory.quantity
              }.`
            );
          }
        });
        if (!isStockAvailable) {
          // to alert all strings value use forEach method
          alertString.forEach((string) => {
            toast.error(string, {
              autoClose: 3000,
              pauseOnHover: true,
              style: { 'font-size': '16px' },
            });
          });
          return;
        }
        // if all instock send data to database and set CheokoutSuccessful status
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
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch oncnce all data from database
        setIsLoading(true);
        const response = await api.get(`api/cart/${customerID}`);
        const cartData = response.data.data;
        setCartData(cartData);
        const shippingData = await api.get(`api/shipping`);
        setShippingMethod(shippingData.data.data);
        if (cartData.length > 0) {
          var productIDs = [];
          // fetch all products accroding cart data
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
      // clear function after component dismounted
      // need to update only when lastCartData is existed
      if (latestCartData.current.length >= 0) {
        if (!checkoutSuccessfulRef.current) {
          // if checkoutSuccessful is still false mean never checkout so
          // keep the data to redis and database
          api
            .post(`/api/cart/${customerID}`, {
              cartData: latestCartData.current,
            })
            .then((response) => {
              console.log(response);
            });
        } else {
          // checkout successful, delete all the cart data from both 
          api.delete(`/api/cart/${customerID}`).then((response) => {
            console.log(response);
          });
        }
      }
    };
  }, []);

  useEffect(() => {
    // once checkout chnage make ref.current to checkoutsuccessful;
    checkoutSuccessfulRef.current = checkoutSuccessful;
    if (checkoutSuccessful) {
      navigate(`/payment/${orderId}`);
    }
  }, [checkoutSuccessful]);
  const handleChange = (event) => {
    // handler for all changes for shipping address input
    setAddress({
      ...address,
      [event.target.name]: event.target.value,
    });
  };
  useEffect(() => {
    // this useEffect is for everytime cartData or productdetails change remanipulate all data to show
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
  const checkoutDynamicClassName = `lg:mr-36 ${showCheckout ? 'block' : 'hidden lg:block'
    } mb-48 w-9/10 `;
  const cartListDynamicClassName = `mt-4 mb-48 sm:mb-64 mr-4 w-full ml-4 lg:w-3/5 lg:ml-24 ${showCheckout ? 'hidden' : 'block'
    }`;
  return (
    <div className="flex flex-row">
      <div className={cartListDynamicClassName}>
        <h2 className="font-roboto py-4 flex flex-row">
          My Shopping Cart <FaShoppingCart />
        </h2>
        <table className="border-collapse w-full text-base md:text-lg border-t-2  border-black">
          <thead className=" text-base border-b-2 md:text-xl">
            <tr>
              <th className="w-1/8">My Cart</th>
              <th className="w-1/4">Product</th>
              <th className="hidden lg:table-cell w-1/6">Price</th>
              <th className="lg:w-1/12 text-center hidden sm:table-cell">
                Quantity
              </th>
              <th className="lg:w-1/5 text-center hidden sm:table-cell">
                Total
              </th>
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
                  className=" border-b-2 border-grey"
                >
                  <td className="flex flew-row py-6 w-48 h-56 md:w-64 md:h-64 ">
                    <AdvancedImage
                      cldImg={cld.image(cartItem.image_url)}
                      className="rounded"
                    />
                  </td>
                  <td>
                    <b className="hidden md:block">{cartItem.product_name}</b>
                    <Link to={`/product/${cartItem.product_id}`} onClick={() => window.scrollTo(0, 0)}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {cartItem.product_name}
                    </Link>
                    <p className="hidden md:flex flex-row">
                      <b className="hidden lg:block">category:</b>{' '}
                      {cartItem.category}
                    </p>
                    <p className="hidden md:flex flex-row">
                      <b className="hidden lg:block">brand :</b>
                      {cartItem.brand}
                    </p>
                    <div className="block lg:hidden">{cartItem.price}</div>
                    <div className=" justify-evenly border-2 border-gray-400 rounded flex flex-row md:hidden my-2">
                      <button
                        className="flex items-center justify-center "
                        onClick={() =>
                          minusButtonHandler(
                            cartData,
                            cartItem.product_id,
                            setCartData
                          )
                        }
                      >
                        <FiMinus size={16} />
                      </button>
                      <p className="border-l-2 border-r-2 w-8 text-center border-gray-400">
                        {cartItem.quantity}
                      </p>
                      <button
                        className="flex items-center justify-center"
                        onClick={() =>
                          plusButtonHandler(
                            cartData,
                            cartItem.product_id,
                            setCartData
                          )
                        }
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                    <div className="w-20 text-center block md:hidden">
                      <b>${cartItem.totalAmount}</b>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell">${cartItem.price}</td>
                  <td>
                    <div className=" justify-evenly border-2 border-gray-400 rounded hidden md:flex flex-row">
                      <button
                        className="flex items-center justify-center "
                        onClick={() =>
                          minusButtonHandler(
                            cartData,
                            cartItem.product_id,
                            setCartData
                          )
                        }
                      >
                        <FiMinus size={16} />
                      </button>
                      <p className="border-l-2 border-r-2 w-8 text-center border-gray-400">
                        {cartItem.quantity}
                      </p>
                      <button
                        className="flex items-center justify-center"
                        onClick={() =>
                          plusButtonHandler(
                            cartData,
                            cartItem.product_id,
                            setCartData
                          )
                        }
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="w-40 text-center hidden md:table-cell">
                    <b>${cartItem.totalAmount}</b>
                  </td>
                  <td className="pl-4">
                    <button
                      className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded-full"
                      onClick={() =>
                        deleteButtonHandler(
                          cartData,
                          cartItem.product_id,
                          setCartData,
                          setTotalAmount
                        )
                      }
                    >
                      <AiFillDelete
                        size={20}
                        color="white"
                        className="hidden md:block"
                      />
                      <AiFillDelete
                        size={16}
                        color="white"
                        className="block md:hidden"
                      />
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
      </div>
      <div className={checkoutDynamicClassName}>
        <div className="w-full bg-light-blue p-4 lg:ml-12  mt-5 rounded-lg shadow-lg">
          <div className="space-y-4 ">
            <h1 className="text-lg font-bold text-white">Shipping Address</h1>
            <div className="flex flex-row items-center">
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
            <div className="flex flex-row items-center">
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
            <div className="flex flex-row items-center">
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
            <div className="flex flex-row items-center">
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
            <label htmlFor="shippingMethods" className="text-white text-base">
              Choose shipping methods:
            </label>
            <select
              required
              name="shippingMethods"
              className="form-select form-select-sm"
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
            <div className="flex flex-column text-base text-white border-t-2 border-b-2 border-white py-2">
              <div className="flex flex-row justify-between">
                <p className="uppercase">subTotal : </p>
                <p>${totalAmount}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>shipping : </p>
                <p> ${shippingFee}</p>
              </div>
            </div>
            <div className=" text-white border-b-2 border-white flex flex-row justify-between pb-3">
              <p className="uppercase text-xl">Estimated total :</p>
              <p className="text-base">
                $
                {(parseFloat(totalAmount) + parseFloat(shippingFee)).toFixed(2)}
              </p>
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
                className="w-full px-3 py-2 bg-dark-blue text-white rounded-md text-base font-roboto"
              >
                Check out
              </button>
              <ToastContainer
                limit={2}
                newestOnTop={true}
                position="top-center"
                style={{ width: '600px', height: '200px' }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 w-full h-1/5 z-10 bg-white py-3">
        {!showCheckout ? (
          <div className="py-6 flex flex-row justify-around lg:justify-normal">
            <Link to="/products">
              <button className="ml-4 lg:ml-48 text-sm md:text-xl py-2 px-2 text-white bg-green-800 hover:bg-green-900 flex flex-row  rounded items-center">
                <BsArrowLeft size={24} className="mr-1 lg:mr-5" />
                <p>Continue Shopping</p>
              </button>
            </Link>
            <button
              className="block lg:hidden text-sm md:text-xl py-2 px-2 md:py-2 md:px-4 border-green-800 border-2 hover:border-green-950 rounded"
              onClick={handleContinueToCheckout}
            >
              Continue to Checkout
            </button>
          </div>
        ) : (
          <div className="py-6 flex flex-row justify-around lg:justify-normal">
            <button
              className="ml-4 lg:ml-48 text-sm md:text-xl py-2 px-2 text-white bg-green-800 hover:bg-green-900 flex flex-row  rounded items-center"
              onClick={handleContinueToCheckout}
            >
              <BsArrowLeft size={24} className="mr-1 lg:mr-5" />
              <p>Go back to Cart Lists</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
