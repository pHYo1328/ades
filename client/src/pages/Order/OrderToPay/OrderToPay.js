import React, { useEffect, useState } from 'react';
import ItemList from '../../../components/ItemList/orderList';
import api from '../../../index';
import { FadeLoader } from 'react-spinners';
const OrderToPay = () => {
  const userId = localStorage.getItem('userid');
  const [orderItems, setOrderItems] = useState(null);
  const [shippingMethods, setShippingMethods] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const response = await api.get(
        `/api/order/getOrderDetailByOrderStatus?customerID=${userId}&orderStatus=order_received`
      );
      console.log(response);
      setOrderItems(response.data.data);
      const shippingMethods = await api.get(`/api/shipping`);
      console.log(shippingMethods.data.data);
      setShippingMethods(shippingMethods);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return isLoading ? (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-row">
        <FadeLoader
          color={'navy'}
          loading={isLoading}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <p>Loading...</p>
      </div>
    </div>
  ) : (
    <ItemList items={orderItems}></ItemList>
  );
};

export default OrderToPay;
