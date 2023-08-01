import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement, // Import BarElement
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2'; // Import Bar instead of Line

export default function OrdersByBrandMonthChart() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement, // Register BarElement
    Title,
    Tooltip,
    Legend
  );

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const [brands, setBrands] = useState(null);
  let labels = [];
  let counts = [];

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/admin/orders/count`)
      .then((response) => {
        console.log(response);
        setBrands(response.data.brands);
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

  const options = {
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
        },
      },
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Orders',
        data: counts,
        backgroundColor: 'rgba(0,0,255,1.0)',
        borderColor: 'rgba(0,0,255)',
      },
    ],
  };

  return (
    <div className="bg-emerald-200 rounded-lg p-5 w-50 lg:w-50 md:w-100 sm:w-100">
      <h4 className="text-2xl font-bold mb-6 text-center">Orders (By Brand)</h4>
      <Bar options={options} data={data} /> {/* Use Bar instead of Line */}
    </div>
  );
}
