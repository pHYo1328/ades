import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PieChart from './PieChart';

export default function OrderStatusChart() {
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const [statuses, setStatuses] = useState(null);
  let labels = [];
  let counts = [];

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/admin/orders/status/count`)
      .then((response) => {
        console.log(response);
        setStatuses(response.data.orders);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  console.log('statuses', statuses);

  if (statuses) {
    labels = statuses.map((status) => status.status);
    counts = statuses.map((status) => status.count);
  }

  const backgroundColor = [
    'rgba(225, 170, 198, 0.8)',
    'rgba(170, 225, 199, 0.8)',
    'rgba(225, 199, 170, 0.8)',
    'rgba(170, 194, 225, 0.8)',
    'rgba(129, 143, 250, 0.8)',
    'rgba(225,170, 211, 0.8)',
    // Add more colors if you have more data points
  ];

  return (
    <PieChart
      labels={labels}
      counts={counts}
      backgroundColor={backgroundColor}
      color={'bg-fuchsia-200'}
      title={'Order Status'}
      legend={'Order Status'}
    />
  );
}
