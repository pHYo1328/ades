import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../AuthContext';
import OrderList from '../../../components/OrderItemList';
import api from '../../../index';
import { FadeLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
const OrderToShip = () => {
  const { userData } = useContext(AuthContext);
  const [orderItems, setOrderItems] = useState(null);
  const [shippingMethods, setShippingMethods] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userData.isSignedIn) {
      console.log('Redirecting to homepage');
      navigate('/login');
    } else {
      // add whatever else validation
    }
  }, []);
  const userId = localStorage.getItem('userid');
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const response = await api.get(
        `/api/order/getOrderDetailByOrderStatus?customerID=${userId}&orderStatus=paid`
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
      orderStatus={'paid'}
    ></OrderList>
  );
};

export default OrderToShip;
