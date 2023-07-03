import React, { useEffect, useState } from 'react';
import api from '../../../index';
import { format, utcToZonedTime } from 'date-fns-tz';
const OrderAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get('/api/admin/order');
      console.log(response.data.data);
      setOrders(response.data.data);
    };
    fetchData();
  }, []);
  const handleOptionChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedOptions([...selectedOptions, value]);
    } else {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    }
  };

  const updateOrderStatusHandler = async (orderIDs, orderStatus) => {
    const selectedOrders = orders.filter((order) =>
      orderIDs.includes(order.order_id)
    );
    const hasPaidOrder = selectedOrders.some(
      (order) => order.order_status === 'paid'
    );

    if (orderStatus === 'delivered' && hasPaidOrder) {
      window.alert(
        "Cannot update to 'Delivered'. Selected orders are currently in 'Paid' status and need to be 'Delivering' before they can be 'Delivered'."
      );
      return;
    }
    const result = await api.put(`api/admin/order`, {
      orderIDs: orderIDs,
      orderStatus: orderStatus,
    });
    console.log(result);
    const updatedOrders = orders.map((order) => {
      // If the order is in the list of selected orders, update its status
      if (orderIDs.includes(order.order_id)) {
        return { ...order, order_status: orderStatus };
      }
      // If not, return the order as is
      return order;
    });
    setOrders(updatedOrders);
    // Clear out the selected options
    setSelectedOptions([]);
  };
  const getUserTimeZone = () => {
    if (typeof Intl === 'object' && typeof Intl.DateTimeFormat === 'function') {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } else {
      // Fallback to a default time zone if Intl API is not supported
      console.log('Intl API is not supported');
      return 'UTC';
    }
  };
  const userTimeZone = getUserTimeZone();
  return (
    <div className="text-lg m-12 ">
      <table className="mb-48">
        <thead>
          <tr>
            <th className="px-6"></th>
            <th>Order ID</th>
            <th className="px-12">Order Status</th>
            <th className="px-10">Payment Date</th>
            <th>Delivery Address</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.order_id}
              className="border-b-2 border-t-2 border-blue-950"
            >
              <td className="py-3 ">
                <input
                  type="checkbox"
                  value={order.order_id}
                  checked={selectedOptions.includes(order.order_id)}
                  onChange={handleOptionChange}
                />
              </td>
              <td>
                <p>{order.order_id}</p>
              </td>
              <td>
                <p
                  className={`px-12 py-2 text-center ${
                    order.order_status === 'paid'
                      ? 'bg-amber-500'
                      : 'bg-green-500'
                  }`}
                >
                  {order.order_status}
                </p>
              </td>
              <td>
                <p className="px-10">
                  {format(
                    utcToZonedTime(order.payment_date, userTimeZone),
                    'yyyy-MM-dd EEE HH:mm:ss'
                  )}
                </p>
              </td>
              <td>
                <p className="bg-gray-500 text-white px-3 py-2">
                  {order.shipping_address}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="fixed bottom-0 w-full h-1/5 z-10 bg-white py-3 flex items-center justify-center">
        <button
          onClick={() => {
            updateOrderStatusHandler(selectedOptions, 'delivering');
          }}
          className="px-3 mx-3 py-2 bg-blue-600 text-white rounded-md text-base font-roboto"
        >
          Update To delivering
        </button>
        <button
          onClick={() => {
            updateOrderStatusHandler(selectedOptions, 'delivered');
          }}
          className="px-3 py-2 bg-blue-600 text-white rounded-md text-base font-roboto"
        >
          Update To delivered
        </button>
      </div>
    </div>
  );
};
export default OrderAdmin;
