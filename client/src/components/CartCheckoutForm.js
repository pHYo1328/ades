import { useState } from 'react';
import TextInput from './TextInput';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../index';
import LoadingIndicator from 'react-loading-indicator';
import Button from './Button';
const InputField = ({
  label,
  placeholder,
  name,
  value,
  handleChange,
  type = 'text',
}) => (
  <div className="flex flex-row items-center">
    <label
      htmlFor={name}
      className="block text-base font-medium text-white w-28"
    >
      {label} :
    </label>
    <TextInput
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      func={handleChange}
      className="px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none flex-grow"
    />
  </div>
);
const CartCheckoutForm = ({
  shippingMethod,
  setOrderId,
  totalAmount,
  setCheckoutSuccessful,
  showCheckout,
  customerID,
  cartProductData,
}) => {
  const [shippingId, setShippingId] = useState(null);
  const [shippingFee, setShippingFee] = useState(0.0);
  const [address, setAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    state: '',
    postalCode: '',
  });

  const handleChange = (event) => {
    // handler for all changes for shipping address input
    setAddress({
      ...address,
      [event.target.name]: event.target.value,
    });
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
              `Sorry, ${
                inventory.product_name
              } cannot provide the quantity you are asking for. Please reduce your quantity by ${
                cartData[quantityIndex].quantity - inventory.quantity
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
  return (
    <div
      className={` ${
        showCheckout ? 'block flex-grow' : 'hidden lg:block flex-grow'
      }`}
    >
      <div className="w-full bg-light-blue p-4 lg:ml-12  mt-5 rounded-lg shadow-lg">
        <div className="space-y-4 ">
          {/* ... (UI Code) */}
          <InputField
            label="Address line 1"
            placeholder="Enter Your Address"
            name="addressLine1"
            value={address.addressLine1}
            handleChange={handleChange}
          />
          <InputField
            label="Address line 2"
            placeholder="Apartment, suite, unit, building, floor, etc."
            name="addressLine2"
            value={address.addressLine2}
            handleChange={handleChange}
          />
          <InputField
            label="State"
            placeholder="State"
            name="state"
            value={address.state}
            handleChange={handleChange}
          />
          <InputField
            label="Postal Code"
            placeholder="Postal Code"
            name="postalCode"
            value={address.postalCode}
            handleChange={handleChange}
            type="number"
          />
          {/* ... (Remaining UI Code) */}
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
            ${(parseFloat(totalAmount) + parseFloat(shippingFee)).toFixed(2)}
          </p>
        </div>
        <div>
          <Button
            onClick={() =>
              checkOutHandler(
                customerID,
                address,
                totalAmount,
                shippingId,
                cartProductData
              )
            }
            content={'Check Out'}
          />
          <ToastContainer
            limit={2}
            newestOnTop={true}
            position="top-center"
            style={{ width: '600px', height: '200px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default CartCheckoutForm;
