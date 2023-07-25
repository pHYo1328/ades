import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

export default function RevenueChart() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const [revenues, setRevenues] = useState(null);
  let labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let amounts = [];

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/admin/revenue`)
      .then((response) => {
        console.log(response);
        setRevenues(response.data.revenues);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  console.log('revenues', revenues);

  if (revenues) {
    const revenueByMonth = {};

    labels.forEach((month) => {
      revenueByMonth[month] = 0;
    });

    revenues.forEach((revenue) => {
      const monthName = new Date(revenue.month + '-01').toLocaleString('en-US', { month: 'long' });
      revenueByMonth[monthName] = revenue.total;
    });

    amounts = labels.map((month) => revenueByMonth[month]);
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
        label: 'Revenue',
        data: amounts,
        // fill: false,
        // backgroundColor: 'rgba(75, 192, 192, 0.2)',
        // borderColor: '#213555',
        backgroundColor: "rgba(0,0,255,1.0)",
        borderColor: "rgba(0,0,255)",
        // borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-orange-100 rounded-lg p-5 w-50 lg:w-50 md:w-100 sm:w-100">
      <h4 className="text-2xl font-bold mb-6 text-center">Revenue (By Month)</h4>
      <Line options={options} data={data} />
    </div>
  );
}
