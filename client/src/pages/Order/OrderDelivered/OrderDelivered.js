import React, { useEffect, useState } from 'react';
import CompletedItemList from '../../../components/ItemList/completedItemList';
import api from '../../../index';
import { FadeLoader } from 'react-spinners';
const OrderDelivered = () => {
  const userId = localStorage.getItem('userid');
  const [orderItems, setOrderItems] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const response = await api.get(
        `/api/order/getOrderDetailByOrderStatus?customerID=${userId}&orderStatus=delivered`
      );
      console.log(response);
      setOrderItems(response.data.data);
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
    <CompletedItemList
      items={orderItems}
      customerID={userId}
    ></CompletedItemList>
  );
};

export default OrderDelivered;
