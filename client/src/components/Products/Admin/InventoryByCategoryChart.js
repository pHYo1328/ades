import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarChart from './BarChart';

export default function InventoryByCategoryChart() {
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const [categories, setCategories] = useState(null);
  let labels = [];
  let counts = [];

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/admin/categories/count`)
      .then((response) => {
        console.log(response);
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  console.log('categories', categories);

  if (categories) {
    labels = categories.map((category) => category.category);
    counts = categories.map((category) => category.count);
  }

  return (
    <BarChart
      labels={labels}
      counts={counts}
      color={'bg-lime-200'}
      title={'Inventory (By Category)'}
      legend={'Inventory'}
    />
  );
}
