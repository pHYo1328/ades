import React, { useEffect } from 'react';
//import ItemList from "../../../components/ItemList/itemList";
import api from '../../../index';
const OrderToShip = () => {
  const userId = localStorage.getItem('userid');
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(
        `/api/order/getOrderDetailBeforePickUp/${userId}`
      );
      console.log(response);
    };
    fetchData();
  }, []);
  return <div></div>;
};

export default OrderToShip;
