import React, { useEffect, useState } from 'react';
import api from '../../../index';
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

  return (
    <div>
      {orders.map((order) => (
        <div key={order.order_id}>
          <label className="flex flex-row">
            <input
              type="checkbox"
              value={order.order_id}
              checked={selectedOptions.includes(order.order_id)}
              onChange={handleOptionChange}
            />
            <div className="flex flex-row">
              <p className="px-12   ">{order.order_id}</p>
              <p>{order.order_status}</p>
            </div>
          </label>
        </div>
      ))}
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
  );
};
export default OrderAdmin;
