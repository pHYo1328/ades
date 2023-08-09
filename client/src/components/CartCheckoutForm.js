import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../index';
import Button from './Button';
import Select from 'react-select';
import { getNames, getCode } from 'country-list';
import CheckoutInput from './CheckoutInput';
import { validateAddress, validatePostalCode } from '../utils/addressUtils';

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
    country: '',
    postalCode: '',
  });
  const [isInvalidAddress, setIsInvalidAddress] = useState(false);
  const [isInvalidPostalCode, setIsInvalidPostalCode] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Singapore');
  const countryOptions = getNames().map((name) => ({
    label: name,
    value: name,
  }));
  const handleValidation = async () => {
    const addressValidity = await validateAddress(
      `${address.addressLine1}`,
      getCode(selectedCountry)
    );

    setIsInvalidAddress(addressValidity);

    let postalCodeValidity = false; // define with default value

    if (address.postalCode.length > 0) {
      postalCodeValidity = await validatePostalCode(
        `${address.postalCode}`,
        getCode(selectedCountry)
      );
      setIsInvalidPostalCode(postalCodeValidity);
    }
    return !(addressValidity || postalCodeValidity);
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
        style: { fontSize: '16px' },
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
        style: { fontSize: '16px' },
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
              style: { fontSize: '16px' },
            });
          });
          return;
        }
        handleValidation().then((result) => {
          if (result) {
            const requestBody = {
              shippingAddr: `${address.addressLine1} ${address.addressLine2} ${address.postalCode} ${address.country} `,
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
          }
        });
        //if all instock send data to database and set CheokoutSuccessful status
      })
      .catch((error) => {
        console.log(error);
      });
  };
  CartCheckoutForm.propTypes = {
    shippingMethod: PropTypes.array,
    setOrderId: PropTypes.func.isRequired,
    totalAmount: PropTypes.number.isRequired,
    setCheckoutSuccessful: PropTypes.func.isRequired,
    showCheckout: PropTypes.bool.isRequired,
    customerID: PropTypes.string.isRequired,
    cartProductData: PropTypes.array,
  };
  return (
    <div
      className={`col-span-full lg:col-span-4 sm:ml-24 sm:mr-24 lg:ml-0 lg:mr-0 ${
        showCheckout ? 'block flex-grow' : 'hidden lg:block flex-grow'
      }`}
    >
      <div className="w-full bg-light-blue p-4 lg:ml-12  mt-5 rounded-lg shadow-lg">
        <div className="space-y-4 ">
          <div className="flex flex-row items-center">
            <label
              htmlFor="selectCountry"
              className="block text-base font-medium text-white w-28"
            >
              Country :
            </label>
            <Select
              inputId="selectCountry"
              aria-labelledby="selectCountry"
              options={countryOptions}
              onChange={(selectedOption) => {
                const selectedCountry = selectedOption.value;
                setSelectedCountry(selectedCountry);
                setAddress({
                  ...address,
                  country: selectedCountry,
                });
              }}
              value={{ label: selectedCountry, value: selectedCountry }}
              className="w-full"
              styles={{
                control: (provided) => ({
                  ...provided,
                  fontSize: '18px',
                }),
                option: (provided) => ({
                  ...provided,
                  fontSize: '18px',
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: '#9CA3AF',
                }),
              }}
            />
          </div>

          <div className="flex flex-row items-center relative">
            <label
              htmlFor="addressLine1"
              className="block text-base font-medium text-white w-28"
            >
              Address Line 1 :
            </label>
            <CheckoutInput
              countryCode={getCode(selectedCountry).toLowerCase()}
              address={address}
              setAddress={setAddress}
              id="addressLine1"
              isInvalid={isInvalidAddress}
            />
            {isInvalidAddress && (
              <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 p-2 mt-1 rounded-md bg-red-500 text-white text-sm">
                {'Invalid Address'}
                <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
            )}
          </div>
          <div className="flex flex-row items-center">
            <label
              htmlFor="addressLine2"
              className="block text-base font-medium text-white w-28"
            >
              Address line 2 :
            </label>
            <input
              type="text"
              placeholder="Apartment, suite, unit, building, floor, etc."
              name="addressLine2"
              value={address.addressLine2}
              onChange={(event) => {
                setAddress({ ...address, addressLine2: event.target.value });
              }}
              className={`placeholder-gray-400 text-gray-900 rounded focus:outline-none w-full border-2
        }`}
              id="addressLine2"
            />
          </div>
          <div className="flex flex-row items-center relative">
            <label
              htmlFor="postalCode"
              className="block text-base font-medium text-white w-28"
            >
              Postal Code :
            </label>
            <input
              type="text"
              placeholder="Enter postal code"
              name="postalCode"
              value={address.postalCode}
              onChange={(event) => {
                setAddress({ ...address, postalCode: event.target.value });
              }}
              className={`placeholder-gray-400 text-gray-900 rounded focus:outline-none w-full border-2 ${
                isInvalidPostalCode ? 'border-red-500' : ''
              }`}
              id="postalCode"
            />
            {isInvalidPostalCode && (
              <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 p-2 mt-1 rounded-md bg-red-500 text-white text-sm">
                {'Invalid Postal Code'}
                <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
            )}
          </div>
        </div>
        <label htmlFor="shippingMethods" className="text-white text-base">
          Choose shipping methods:
        </label>
        <select
          required
          name="shippingMethods"
          className="form-select mb-3"
          defaultValue="" // Set the default value here
          onChange={(event) => {
            setShippingFee(event.target.value);
            setShippingId(event.target.selectedIndex);
          }}
          id="shippingMethods"
        >
          <option disabled value="">
            -- Shipping Method --
          </option>
          {shippingMethod &&
            shippingMethod.map((method) => (
              <option key={method.shipping_id} value={method.fee}>
                {method.shipping_method}
              </option>
            ))}
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
        <div className=" text-white border-b-2 border-white flex flex-row justify-between py-2 mb-3">
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
