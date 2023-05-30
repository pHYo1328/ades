import React, { useEffect, useState } from 'react';
import CompletedItemList from '../../../components/ItemList/completedItemList';
import api from '../../../index';
import { FadeLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
const OrderToDeliver = () => {
  const [orderItems, setOrderItems] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem('roles'));
    console.log(roles);
    if (!roles) {
      // User does not have the required role(s), redirect them to the homepage or show an error message
      // alert("you're not admin");
      console.log('Redirecting to homepage-admin');
      navigate('/login');
    } else {
      const isCustomer = roles.includes('customer');
      console.log(isCustomer);
      if (!isCustomer) {
        // User does not have the required role(s), redirect them to the homepage or show an error message
        // alert("you're not admin");
        console.log('Redirecting to homepage-admin');
        navigate('/login');
      }
    }
  }, []);
  const userId = localStorage.getItem('userid');
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const response = await api.get(
        `/api/order/getOrderDetailByOrderStatus?customerID=${userId}&orderStatus=delivering`
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

export default OrderToDeliver;
