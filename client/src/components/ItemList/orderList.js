import React, { useState, useEffect } from 'react';
import api from '../../index';
import { useNavigate } from 'react-router-dom';
import ItemImage from '../ItemImage';
import './orderList.css';
import {
  FaEdit,
  FaClipboard,
  FaWallet,
  FaMapMarkedAlt,
  FaRegCalendarAlt,
} from 'react-icons/fa';
import { RiTruckLine } from 'react-icons/ri';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserTimezoneDate from '../UserTimeZoneDate';
import { validateAddress } from '../../utils/addressUtils';
const OrderList = ({
  items,
  setItems,
  customerID,
  renderButton,
  orderStatus,
}) => {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedShippingAddress, setEditedShippingAddress] = useState('');
  const [isInvalidAddress, setIsInvalidAddress] = useState(false);
  const navigate = useNavigate();
  const handleEditClick = (index) => {
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

  const combineOrders = (orders) => {
    // to organize the data from database, use reduce and find to bulid 2 dimensional array
    // first accumulator with [] and find the order id
    // if order id found make it push to existing order array or make a new array
    const combinedOrders = orders.reduce((acc, order) => {
      const existingOrder = acc.find((o) => o.order_id === order.order_id);
      if (existingOrder) {
        existingOrder.order_items.push({
          product_name: order.product_name,
          product_id: order.product_id,
          price: order.price,
          image_url: order.image_url || null,
          quantity: order.quantity,
        });
      } else {
        acc.push({
          order_id: order.order_id,
          shipping_id: order.shipping_id,
          shipping_method: order.shipping_method,
          shipping_address: order.shipping_address,
          order_date: order.order_date,
          order_items: [
            {
              product_name: order.product_name,
              product_id: order.product_id,
              price: order.price,
              image_url: order.image_url || null,
              quantity: order.quantity,
            },
          ],
        });
      }
      return acc;
    }, []);

    return combinedOrders;
  };
  const clearedItems = combineOrders(items);

  const handleDeleteItem = async (orderId, productId, quantity) => {
    confirmAlert({
      title: 'Confirm to cancel the order',
      message: 'Are you sure you want to cancel this item?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const result = await api.delete(
                `/api/order?orderId=${orderId}&productID=${productId}&quantity=${quantity}&orderStatus=${orderStatus}`
              );
              console.log('Deleted Item:', orderId, productId);
              console.log(result);
              // Remove the deleted item from state
              // re render the UI
              const updatedItemList = items.filter(
                (item) =>
                  item.order_id !== orderId || item.product_id !== productId
              );
              setItems(updatedItemList);
            } catch (error) {
              console.error('Error deleting item:', error);
            }
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
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

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center align-middle py-5">
        <h2>
          No Items to{' '}
          {orderStatus == 'paid' ? `deliver to you` : `pay for order`}
        </h2>
      </div>
    );
  }

  return (
    <ul className="p-8">
      <h2 className="mx-4 my-6 font-breezeBold font-bold text-4xl flex flex-row">
        Orders To Pay <FaWallet className="ml-3 shake text-amber-950" />
      </h2>
      {clearedItems
        .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
        .map((item, index) => (
          <li key={index}>
            <div className="font-breezeRegular mx-4 my-12 shadow-lg shadow-black p-6 rounded-lg">
              <div className="mx-6 px-6 py-3 bg-gray-100 rounded-md">
                <table className="table-fixed text-base">
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
                      <th className="w-1/6 p-2">
                        <p className="flex flex-row items-center space-x-2">
                          <RiTruckLine className="text-green-700 mr-2" />
                          Shipping Method
                        </p>
                      </th>
                      <th className="w-1/3 p-2">
                        <p className="flex flex-row items-center space-x-1">
                          <FaMapMarkedAlt className="text-green-700 mr-2" />
                          Shipping Address
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
                      <th className="w-1/6 p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 align-top">{item.order_id}</td>
                      <td className="p-2 align-top">
                        <UserTimezoneDate date={item.order_date} />
                      </td>
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
                              className="border border-gray-300 rounded px-2 flex-grow"
                            />
                            {isInvalidAddress && (
                              <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 p-2 mt-1 rounded-md bg-red-500 text-white text-sm">
                                Invalid Address
                                <div
                                  className="tooltip-arrow"
                                  data-popper-arrow
                                ></div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p>{item.shipping_address}</p>
                        )}
                      </td>
                      {item.payment_date && (
                        <td className="p-2 align-top">
                          <UserTimezoneDate date={item.payment_date} />
                        </td>
                      )}
                      <td className="p-2 flex space-x-4">
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
                              className="bg-gray-600 hover:bg-gray-800 h-10 px-4 rounded text-white flex flex-row items-center text-sm"
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
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {item.order_items.length > 0 && (
                <div className="text-base m-12">
                  <table className="table-fixed w-full">
                    <thead>
                      <tr>
                        <th className="w-36">Product</th>
                        <th className="w-60"></th>
                        <th className="w-40 text-center">Price</th>
                        <th className="w-44 text-center">Quantity</th>
                        <th className="w-80 text-center">Total Amount</th>
                        <th className="w-40"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.order_items.map((orderItem, orderIndex) => (
                        <tr
                          key={orderIndex}
                          className="border-t-2 border-b-2 border-gray-300"
                        >
                          <td className="py-4">
                            <ItemImage imageUrl={orderItem.image_url} />
                          </td>
                          <td className="text-left">
                            <b>{orderItem.product_name}</b>
                          </td>
                          <td className="text-center">${orderItem.price}</td>
                          <td className="text-center">{orderItem.quantity}</td>
                          <td className="text-center">
                            ${(orderItem.price * orderItem.quantity).toFixed(2)}
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() =>
                                handleDeleteItem(
                                  item.order_id,
                                  orderItem.product_id,
                                  orderItem.quantity
                                )
                              }
                              className="my-3 text-white bg-red-600 px-3 py-2 rounded text-base hover:bg-red-800"
                            >
                              cancel order
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </li>
        ))}
    </ul>
  );
};

export default OrderList;
