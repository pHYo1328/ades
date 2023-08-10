import React, { useEffect, useState } from 'react';
import api from '../../../index';
const OrderRefund = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get('/api/admin/refund');
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

  

  const updateRefundStatusHandler = async (orderIDs, refundStatus) => {


    // if (orderIDs.length === 0) {
    //   window.alert('Please select orders to refund.');
    //   return;
    // }else if (refundStatus === 'refunded') {
    //   window.alert(
    //     "Cannot update to anymore!."
    //   );
    // }
      
    try {
      await Promise.all(orderIDs.map(async (orderID) => {
        const processRefundResult = await api.post(`/processRefund/${orderID}`);
        console.log(processRefundResult);
      }));
      
    const result = await api.put(`/api/admin/refund`, {
      orderIDs: orderIDs,
      refundStatus: refundStatus,
    });
    console.log(result);

    const updatedOrders = orders.map((order) => {
      // If the order is in the list of selected orders, update its status
      if (orderIDs.includes(order.order_id)) {
        return { ...order, refunded_status: refundStatus };
      }
      // If not, return the order as is
      return order;
    });
    setOrders(updatedOrders);
    // Clear out the selected options
    setSelectedOptions([]);

  } catch (error) {
    console.error("Error:", error);
  }
};

  return (
    <div className="text-lg m-12 ">
      <table className="mb-48">
        <thead>
          <tr>
            <th className="px-6"></th>
            <th>Order ID</th>
            <th className="px-12">Amount Total</th>
            <th className="px-10">Customer ID</th>
            <th>Status</th>
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
                <p className="bg-gray-500 text-white px-3 py-2">
                  {order.refunded_amount}
                </p>
              </td>
              <td>
                <p className="bg-gray-500 text-white px-3 py-2">
                  {order.customer_id}
                </p>
              </td>
              <td>
                <p
                  className={`px-12 py-2 text-center ${
                    order.refunded_status === 'pending'
                      ? 'bg-amber-500'
                      : 'bg-green-500'
                  }`}
                >
                  {order.refunded_status}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="fixed bottom-0 w-full h-1/5 z-10 bg-white py-3 flex items-center justify-center">
        <button
          onClick={() => {
            updateRefundStatusHandler(selectedOptions, 'refunded');
          }}
          className="px-3 mx-3 py-2 bg-blue-600 text-white rounded-md text-base font-roboto"
        >
          Update To refunded
        </button>
    
      </div>
    </div>
  );
};
export default OrderRefund;
