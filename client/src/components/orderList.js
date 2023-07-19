import React, { useState, useEffect } from 'react';
import ItemImage from './ItemImage';
import {
  FaEdit,
  FaClipboard,
  FaWallet,
  FaMapMarkedAlt,
  FaRegCalendarAlt,
  FaBox,
} from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import OrderListHeader from './OrderListHeader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../index';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const OrderList = ({
  items,
  setItems,
  customerID,
  renderButton,
  orderStatus,
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
          payment_date: order.payment_date,
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

  const filterOrdersByDate = (orders) => {
    if (!startDate || !endDate) {
      return orders; // return all orders if no dates are selected
    }
    return orders.filter((order) => {
      const orderDate = new Date(order.order_date);
      return orderDate >= startDate && orderDate <= endDate;
    });
  };
  const clearedItems = combineOrders(items);
  const filteredItems = filterOrdersByDate(clearedItems);
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

  if (items.length === 0) {
    return (
      <div className="p-8">
        <h2 className="mx-4 my-6 font-breezeBold font-bold text-3xl md:text-4xl flex flex-row">
          {orderStatus === 'paid' ? (
            <>
              Orders To Ship
              <FaBox className="sm:ml-3 animate-shake-custom text-amber-500" />
            </>
          ) : (
            <>
              Orders To Pay
              <FaWallet className="sm:ml-3 animate-shake-custom text-amber-950" />
            </>
          )}
        </h2>
        <div className="flex items-center justify-center align-middle py-5">
          <h2>
            No Items to{' '}
            {orderStatus == 'paid' ? `deliver to you` : `pay for order`}
          </h2>
        </div>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="p-8">
        <h2 className="mx-4 my-6 font-breezeBold font-bold text-3xl md:text-4xl flex flex-row">
          {orderStatus === 'paid' ? (
            <>
              Orders To Ship
              <FaBox className="sm:ml-3 animate-shake-custom text-amber-500" />
            </>
          ) : (
            <>
              Orders To Pay
              <FaWallet className="sm:ml-3 animate-shake-custom text-amber-950" />
            </>
          )}
        </h2>
        <div className="flex justify-end">
          <DatePicker
            showIcon
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            isClearable
            closeOnScroll={true}
          />
          <DatePicker
            showIcon
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            isClearable
            closeOnScroll={true}
          />
        </div>
        <div className="flex items-center justify-center align-middle py-5">
          <h2>There are no orders between the selected dates.</h2>
        </div>
      </div>
    );
  }

  return (
    <ul className="sm:p-8">
      <h2 className="mx-4 my-6 font-breezeBold font-bold text-3xl md:text-4xl flex flex-row">
        {orderStatus === 'paid' ? (
          <>
            Orders To Ship
            <FaBox className="sm:ml-3 animate-shake-custom text-amber-500" />
          </>
        ) : (
          <>
            Orders To Pay
            <FaWallet className="sm:ml-3 animate-shake-custom text-amber-950" />
          </>
        )}
      </h2>
      <div className="flex justify-end">
        <DatePicker
          showIcon
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          isClearable
          closeOnScroll={true}
        />
        <DatePicker
          showIcon
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          isClearable
          closeOnScroll={true}
        />
      </div>
      {filteredItems
        .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
        .map((item, index) => (
          <li key={index}>
            <div className="font-breezeRegular sm:mx-1 md:mx-4 sm:mt-12 sm:mb-12 shadow-lg p-2 sm:p-6 sm:rounded-lg">
              <OrderListHeader
                item={item}
                renderButton={renderButton}
                renderOrderDate={renderButton}
                items={items}
                clearedItems={filteredItems}
                setItems={setItems}
                customerID={customerID}
                index={index}
              />

              {item.order_items.length > 0 && (
                <div className="text-base ml-1 mr-1 mt-4 mb-4 sm:ml-12 sm:mr-12 sm:mt-12 sm:mb-12">
                  <table className="table-auto w-full">
                    <thead>
                      <tr className="hidden md:table-row">
                        <th className="w-36">Product</th>
                        <th className="w-60"></th>
                        <th className="w-40 text-center">Price</th>
                        <th className="w-44 text-center">
                          <span className="lg:hidden">Qty</span>
                          <span className="hidden lg:inline">Quantity</span>
                        </th>
                        <th className="w-80 text-center">
                          <span className="lg:hidden">total</span>
                          <span className="hidden lg:inline">Total Amount</span>
                        </th>
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
                          <td className="text-left px-1">
                            <b className="inline-block w-24 sm:w-60 overflow-auto whitespace-normal break-words">
                              {orderItem.product_name}
                            </b>
                            <p className="block md:hidden">
                              Qty: {orderItem.quantity}
                            </p>
                            <p className="block md:hidden">
                              total: $
                              {(orderItem.price * orderItem.quantity).toFixed(
                                2
                              )}
                            </p>
                          </td>
                          <td className="text-center hidden md:table-cell">
                            ${orderItem.price}
                          </td>
                          <td className="text-center hidden md:table-cell">
                            {orderItem.quantity}
                          </td>
                          <td className="text-center hidden md:table-cell">
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
                              className="my-3 text-white bg-red-600 px-2 py-2 rounded text-sm sm:text-base hover:bg-red-800"
                            >
                              cancel
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
