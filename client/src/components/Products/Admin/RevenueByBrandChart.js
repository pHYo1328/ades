import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoughnutChart from './DoughnutChart';

export default function RevenueByBrandChart() {
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const [brands, setBrands] = useState(null);
  let labels = [];
  let counts = [];

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/admin/revenue/brand/count`)
      .then((response) => {
        console.log(response);
        setBrands(response.data.orders);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  console.log('brands', brands);

  if (brands) {
    labels = brands.map((brand) => brand.brand);
    counts = brands.map((brand) => brand.count);
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
    <DoughnutChart
      labels={labels}
      counts={counts}
      backgroundColor={backgroundColor}
      color={'bg-fuchsia-200'}
      title={'Revenue By Brand'}
      legend={'Revenue By Brand'}
    />
  );
}
