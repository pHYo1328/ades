import React, {
  useEffect,
  useState,
  useRef,
  useContext,
} from 'react';
import { AuthContext } from '../../AuthContext';
import { BsArrowLeft, BsCart4 } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../index';
import { CartTable } from '../../components/CartTable';
import CartCheckoutForm from '../../components/CartCheckoutForm';
const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [cartProductData, setCartProductData] = useState(null);
  const [productDetails, setProductsDetails] = useState(null);
  const latestCartData = useRef(cartData);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0.0);
  const [shippingMethod, setShippingMethod] = useState(null);
  const { userData } = useContext(AuthContext);
  const [checkoutSuccessful, setCheckoutSuccessful] = useState(false);
  const checkoutSuccessfulRef = useRef(checkoutSuccessful);
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();
  const handleContinueToCheckout = () => {
    setShowCheckout(!showCheckout);
  };

  useEffect(() => {
    if (!userData.isSignedIn) {
      console.log('Redirecting to homepage');
      navigate('/login');
    } else {
      // add whatever else validation
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
    // same concept as above calculate total amount for all cart items
    const overallTotalAmount = itemsDetailsToShow
      .reduce((total, item) => total + parseFloat(item.totalAmount), 0)
      .toFixed(2);
    setTotalAmount(overallTotalAmount);
    setCartProductData(itemsDetailsToShow);
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

  useEffect(() => {
    // this useEffect is for everytime cartData or productdetails change remanipulate all data to show
    latestCartData.current = cartData;
    if (cartData.length > 0) {
      if (productDetails && productDetails.length > 0) {
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
    <div className=" ml-4 mr-4 lg:mr-24 lg:ml-24 2xl:ml-72 2xl:mr-72 mt-4 mb-24 sm:mb-18 font-breezeRegular sm:px-3 grid grid-cols-12 gap-4">
      <div
        className={`flex-grow ${
          showCheckout ? 'hidden' : 'block'
        } col-span-full lg:col-span-8`}
      >
        <h2 className="font-breezeBold py-4 flex flex-row text-5xl font-bold">
          Shopping Cart{' '}
          <BsCart4
            className="ml-3 animate-shake-custom text-teal-700"
            size={40}
          />
        </h2>
        <CartTable
          isLoading={isLoading}
          cartProductData={cartProductData}
          cartData={cartData}
          setCartData={setCartData}
          setTotalAmount={setTotalAmount}
          productDetails={productDetails}
          customerID={customerID}
        />
      </div>
      <CartCheckoutForm
        shippingMethod={shippingMethod}
        setOrderId={setOrderId}
        totalAmount={totalAmount}
        setCheckoutSuccessful={setCheckoutSuccessful}
        showCheckout={showCheckout}
        customerID={customerID}
        cartProductData={cartProductData}
      />
      <div className="fixed bottom-0 w-full h-[80px] z-10  bg-white">
        {!showCheckout ? (
          <div className="py-6 flex flex-row justify-around lg:justify-normal">
            <Link to="/products">
              <button className="ml-4 text-sm md:text-xl py-2 px-2 text-white bg-green-800 hover:bg-green-900 flex flex-row  rounded items-center">
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
