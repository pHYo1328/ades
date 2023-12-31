import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PieChart from './PieChart';

export default function ShippingMethodChart() {
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const [methods, setMethods] = useState(null);
  let labels = [];
  let counts = [];

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/admin/shipping/count`)
      .then((response) => {
        console.log(response);
        setMethods(response.data.methods);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  console.log('methods', methods);

  if (methods) {
    labels = methods.map((method) => method.shipping);
    counts = methods.map((method) => method.count);
  }

  const backgroundColor = [
    'rgba(225, 170, 198, 0.8)',
    'rgba(170, 225, 199, 0.8)',
    'rgba(225, 199, 170, 0.8)',
    // Add more colors if you have more data points
  ];

  return (
    <PieChart
      labels={labels}
      counts={counts}
      backgroundColor={backgroundColor}
      color={'bg-indigo-200'}
      title={'Shipping Methods'}
      legend={'Shipping Methods'}
    />
  );
}
