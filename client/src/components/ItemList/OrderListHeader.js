import React, { useState } from 'react';
import {
  FaEdit,
  FaClipboard,
  FaWallet,
  FaMapMarkedAlt,
  FaRegCalendarAlt,
} from 'react-icons/fa';
import { RiTruckLine } from 'react-icons/ri';
import api from '../../index';
import { useNavigate } from 'react-router-dom';
import UserTimezoneDate from '../UserTimeZoneDate';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { validateAddress } from '../../utils/addressUtils';
const OrderListHeader = ({
  item,
  renderButton,
  clearedItems,
  items,
  setItems,
  customerID,
  index,
}) => {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedShippingAddress, setEditedShippingAddress] = useState('');
  const [isInvalidAddress, setIsInvalidAddress] = useState(false);
  const navigate = useNavigate();
  const handleEditClick = (index) => {
    console.log(clearedItems);
    setEditingIndex(index);
    setEditedShippingAddress(clearedItems[index].shipping_address);
  };
  const handleSaveClick = (orderId) => {
    validateAddress(editedShippingAddress).then(async (result) => {
      setIsInvalidAddress(result);
      console.log(result);
      if (!result) {
        const response = await api.put(
          `/api/order/updateShippingDetails/${customerID}`,
          {
            orderId,
            shippingAddr: editedShippingAddress,
          }
        );

        if (response.status === 200) {
          const updatedItemList = items.map((item) =>
            item.order_id === orderId
              ? { ...item, shipping_address: editedShippingAddress }
              : item
          );

          setItems(updatedItemList);
          setEditingIndex(-1);
        }
      } else {
        return;
      }
    });
  };
  // same concept with inventory checking in cart
  // fetch all items according to order list and check quantity
  // if one item cannot make it, must cancel that order item
  const payButtonHandler = async (orderId) => {
    let isStockAvailable = true;
    const products = items.filter((item) => item.order_id === orderId);
    const productIds = products.map((item) => item.product_id);
    console.log(productIds);
    const productIdsWithQuantity = products.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));
    api
      .get(`/api/inventory/checkQuantity?productIDs=${productIds.join(',')}`)
      .then((response) => {
        response.data.data.forEach((inventory) => {
          const quantityIndex = productIdsWithQuantity.findIndex(
            (item) => item.productId == inventory.product_id
          );
          if (
            quantityIndex !== -1 &&
            inventory.quantity < productIdsWithQuantity[quantityIndex].quantity
          ) {
            isStockAvailable = false;
          }

          if (!isStockAvailable) {
            toast.warn(
              'Sorry,items in your orders are no more stock. Please cancel',
              {
                autoClose: 3000,
                pauseOnHover: true,
                style: { fontSize: '16px' },
              }
            );
          } else {
            navigate(`/payment/${orderId}`);
          }
        });
      });
  };
  return (
    <div className="ml-1 mr-1 md:ml-6 md:mr-6 md:mt-6 md:mb-6 pl-2 pr-2 md:pl-6 md:pr-6 py-3 bg-gray-100 rounded-md">
      <div className="flex flex-row items-center">
        <table className="table-auto text-base flex-grow hidden lg:block">
          <thead>
            <tr>
              <th className="w-1/6 p-2">
                <p className="flex flex-row items-center">
                  <FaClipboard className="text-green-700 mr-2" />
                  Order ID
                </p>
              </th>
              <th className="w-1/6 p-2">
                <p className="flex flex-row items-center space-x-1">
                  <FaRegCalendarAlt className="text-green-700 mr-2" />
                  Order Date
                </p>
              </th>
              {item.payment_date && (
                <th className="w-1/6 p-2">
                  <p className="flex flex-row items-center space-x-1">
                    <FaRegCalendarAlt className="text-green-700 mr-2" />
                    Payment Date
                  </p>
                </th>
              )}
              <th className="w-1/6 p-2">
                <p className="flex flex-row items-center space-x-2">
                  <RiTruckLine className="text-green-700 mr-2" />
                  Shipping Method
                </p>
              </th>
              <th className="w-1/5 p-2">
                <p className="flex flex-row items-center space-x-1">
                  <FaMapMarkedAlt className="text-green-700 mr-2" />
                  Shipping Address
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 align-top">{item.order_id}</td>
              <td className="p-2 align-top">
                <UserTimezoneDate date={item.order_date} />
              </td>
              {item.payment_date && (
                <td className="p-2 align-top">
                  <UserTimezoneDate date={item.payment_date} />
                </td>
              )}
              <td className="p-2 align-top">{item.shipping_method}</td>
              <td className="p-2 align-top">
                {editingIndex === index ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={editedShippingAddress}
                      onChange={(event) =>
                        setEditedShippingAddress(event.target.value)
                      }
                      className="border border-gray-300 rounded flex-grow"
                    />
                    {isInvalidAddress && (
                      <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-3/4 p-2 mt-1 rounded-md bg-red-500 text-white text-sm">
                        Invalid Address
                        <div className="tooltip-arrow" data-popper-arrow></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>{item.shipping_address}</p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div className=" min-w-max hidden lg:flex">
          {editingIndex === index ? (
            <button
              onClick={() => handleSaveClick(item.order_id)}
              className="bg-green-700 px-4 py-2 rounded text-white"
            >
              Save
            </button>
          ) : (
            <>
              <button
                onClick={() => handleEditClick(index)}
                className="bg-gray-600 hover:bg-gray-800 h-10 px-4 rounded text-white flex flex-row items-center text-sm mr-3"
              >
                <FaEdit></FaEdit>Edit Address
              </button>
              {renderButton && (
                <button
                  onClick={() => {
                    payButtonHandler(item.order_id);
                  }}
                  className="bg-green-600 h-10 px-4 hover:bg-green-800 text-white rounded flex flex-row items-center text-sm"
                >
                  <FaWallet className="mr-3" />
                  Pay
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="text-base lg:hidden">
        <div className="sm:flex flex-row py-4 justify-between border-b-2 border-gray-300">
          <p className="flex flex-row items-center mr-6 whitespace-nowrap">
            <FaClipboard className="text-green-700 mr-2" />
            Order ID
            <span className="md:hidden">:</span>
          </p>
          <p>{item.order_id}</p>
        </div>
        <div className="sm:flex flex-row py-4 justify-between border-b-2 border-gray-300">
          <p className="flex flex-row items-center space-x-1">
            <FaRegCalendarAlt className="text-green-700 mr-2" />
            Order Date
            <span className="md:hidden">:</span>
          </p>
          <UserTimezoneDate date={item.order_date} />
        </div>
        {item.payment_date && (
          <div className="sm:flex flex-row py-4 justify-between border-b-2 border-gray-300">
            <p className="flex flex-row items-center space-x-1">
              <FaRegCalendarAlt className="text-green-700 mr-2" />
              Payment Date
              <span className="md:hidden">:</span>
            </p>
            <UserTimezoneDate date={item.payment_date} />
          </div>
        )}
        <div className="sm:flex flex-row py-4 justify-between border-b-2 border-gray-300">
          <p className="flex flex-row items-center space-x-1">
            <RiTruckLine className="text-green-700 mr-2" />
            Shipping Method
            <span className="md:hidden">:</span>
          </p>
          <p>{item.shipping_method}</p>
        </div>
        <div className="sm:flex flex-row py-4 justify-between border-b-2 border-gray-300">
          <p className="flex flex-row items-center space-x-1">
            <FaMapMarkedAlt className="text-green-700 mr-2" />
            Shipping Address
          </p>
          {editingIndex === index ? (
            <div className="relative">
              <input
                type="text"
                value={editedShippingAddress}
                onChange={(event) =>
                  setEditedShippingAddress(event.target.value)
                }
                className="border border-gray-300 rounded w-full"
              />
              {isInvalidAddress && (
                <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-3/4 p-2 mt-1 rounded-md bg-red-500 text-white text-sm">
                  Invalid Address
                  <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
              )}
            </div>
          ) : (
            <p>{item.shipping_address}</p>
          )}
        </div>
        <div className="flex flex-row space-x-4 py-4">
          {editingIndex === index ? (
            <button
              onClick={() => handleSaveClick(item.order_id)}
              className="bg-green-700 px-4 py-2 rounded text-white w-full"
            >
              Save
            </button>
          ) : (
            <>
              <button
                onClick={() => handleEditClick(index)}
                className="bg-gray-600 hover:bg-gray-800 h-10 px-4 rounded text-white flex flex-row items-center text-sm w-full"
              >
                <FaEdit></FaEdit>Edit Address
              </button>
              {renderButton && (
                <button
                  onClick={() => {
                    payButtonHandler(item.order_id);
                  }}
                  className="bg-green-600 h-10 px-4 hover:bg-green-800 text-white rounded flex flex-row items-center text-sm w-full"
                >
                  <FaWallet className="mr-3" />
                  Pay
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderListHeader;
