import React, { useEffect, useState } from 'react';
import ItemList from "../../../components/ItemList/itemList";
import api from '../../../index';
import LoadingIndicator from 'react-loading-indicator';
const OrderToShip = () => {
  const userId = localStorage.getItem('userid');
  const [orderItems,setOrderItems] = useState(null);
  const [isLoading,setIsLoading]= useState(true);
  useEffect(() => { 
    setIsLoading(true);
    const fetchData = async () => {
      const response = await api.get(
        `/api/order/getOrderDetailBeforePickUp/${userId}`
      );
      setOrderItems(response.data.data)
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return (
    isLoading ? (
        <LoadingIndicator/>
    ):(
        <ItemList items={orderItems}></ItemList>
    )
    
  )
};

export default OrderToShip;
