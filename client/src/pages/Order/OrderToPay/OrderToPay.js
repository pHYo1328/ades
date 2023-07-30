import React, { useEffect, useState } from 'react';
import OrderList from '../../../components/OrderList';
import api from '../../../index';
import { FadeLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
const OrderToPay = () => {
  const [orderItems, setOrderItems] = useState(null);
  const [shippingMethods, setShippingMethods] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem('roles'));
    if (!roles) {
      // User does not have the required role(s), redirect them to the homepage or show an error message
      // alert("you're not admin");
      navigate('/login');
    } else {
      const isCustomer = roles.includes('customer');
      if (!isCustomer) {
        // User does not have the required role(s), redirect them to the homepage or show an error message
        // alert("you're not admin");
        navigate('/login');
      }
    }
  }, []);
  const userId = localStorage.getItem('userid');
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const response = await api.get(
        `/api/order/getOrderDetailByOrderStatus?customerID=${userId}&orderStatus=order_received`
      );
      setOrderItems(response.data.data);
      const shippingMethods = await api.get(`/api/shipping`);
      setShippingMethods(shippingMethods.data.data);
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
    <OrderList
      items={orderItems}
      setItems={setOrderItems}
      shippingMethods={shippingMethods}
      customerID={userId}
      orderStatus={'order_received'}
      renderButton={true}
    ></OrderList>
  );
};
export default OrderToPay;
