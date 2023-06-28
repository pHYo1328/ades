import React, { useRef } from 'react';
import { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import chalk from 'chalk';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Brand from '../../../components/Products/Admin/Brand';
import Category from '../../../components/Products/Admin/Category';

import ProductList from '../../../components/Products/Admin/ProductList';
import Statistics from '../../../components/Products/Admin/Statistics';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const searchOrderButtonRef = useRef(null);

  const [open, setOpen] = useState(true);

  const cancelButtonRef = useRef(null);

  const [products, setProducts] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [statisticsKey, setStatisticsKey] = useState(0);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  const [orderID, setOrderID] = useState(null);
  const [refunds, setRefunds] = useState(null);

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem('roles'));
    console.log(roles);
    if (!roles) {
      // User does not have the required role(s), redirect them to the homepage or show an error message
      console.log('Redirecting to login');
      navigate('/login');
    } else {
      const isAdmin = roles.includes('admin');
      console.log(isAdmin);
      if (!isAdmin) {
        // User does not have the required role(s), redirect them to the homepage or show an error message
        // alert("you're not admin");
        console.log('Redirecting to homepage');
        navigate('/homepage');
      }
    }
  });

  // get all products
  const fetchProducts = () => {
    axios
      .get(`${baseUrl}/api/allProducts`)
      .then((response) => {
        console.log(response);
        setProducts(response.data.data);
        console.log(products);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => { fetchProducts() }, [])

  // get the statistics
  const fetchStatistics = () => {
    axios
      .get(`${baseUrl}/api/admin/statistics`)
      .then((response) => {
        setStatistics(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // refresh the statistics every 1 minute
  useEffect(() => {
    fetchStatistics();
    setStatisticsKey((prevKey) => prevKey + 1);
    const intervalId = setInterval(fetchStatistics, 60 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [products]);

  // search the order by id
  const handleSearchOrder = async (event) => {
    console.log(chalk.yellow('Search button is clicked!'));
    event.preventDefault();

    if (!orderID) {
      toast.error(`Please fill in the order_id to process refund.`, {
        autoClose: 3000,
        pauseOnHover: true,
        style: { 'font-size': '16px' },
      });
    } else {
      try {
        const response = await axios.get(
          `${baseUrl}/api/paymentByStatus/${orderID}`
        );
        console.log(response);

        // Check if order exists
        if (response.data && response.data.data.length > 0) {
          window.location.href = `/payment-refund/${orderID}`;
        }
      } catch (error) {
        console.error(error);
        toast.error(`Order does not exist for fully refunding.`, {
          autoClose: 3000,
          pauseOnHover: true,
          style: { 'font-size': '16px' },
        });
      }
    }
  };

  return (
    <div className="bg-white w-full">
      <div className="bg-white w-11/12 mx-auto">

        <ToastContainer
          limit={2}
          newestOnTop={true}
          position="top-center"
        />

        <div className="flex justify-center mx-auto">
          <h3 className="text-center text-black font-bold mb-4 mt-3 text-xxl">Admin Dashboard</h3>
        </div>

        <Statistics statistics={statistics} key={statisticsKey} />

        <ProductList products={products} refunds={refunds} fetchProducts={() => fetchProducts()} fetchStatistics={() => fetchStatistics()} setRefunds={() => setRefunds()} setProducts={() => setProducts()} />

        <div className="col-span-12 mx-auto flex flex-wrap justify-center text-center mb-4">
          <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 px-2">
            <Brand fetchProducts={() => fetchProducts()} />
          </div>
          <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 px-2">
            <Category fetchProducts={() => fetchProducts()} />
          </div>
        </div>


        <div className="col-span-12 mx-auto h-300 overflow-y-scroll bg-peach rounded-md mt-4 mb-4">

          <div className="flex items-center justify-between mb-3 mt-3 ">
            <div className="w-9/12 text-left ml-10 text-xl font-bold">Fully Refund</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-3 py-2">
            <div className="flex items-center w-full sm:w-full md:w-3/4 lg:w-3/4 text-left text-xl px-3 pb-3 pb:mb-3 pb:mb-0 pb:mb-0">
              <input
                type="text"
                className="border border-gray-300 rounded-md w-full"
                placeholder="Enter Order ID"
                value={orderID}
                onChange={(e) => setOrderID(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    event.stopPropagation();
                    searchOrderButtonRef.current.click();
                  }
                }}
              />
            </div>

            <div className="flex items-center w-full sm:w-full md:w-1/4 lg:w-1/4 px-3 pb-3 pb:mb-3 pb:mb-0 pb:mb-0">
              <button
                ref={searchOrderButtonRef}
                className="bg-dark-blue hover:bg-light-blue text-white font-bold py-2 px-4 rounded-sm w-full text-sm"
                onClick={handleSearchOrder}
              >
                Search <i className="bi bi-search"></i>
              </button>
            </div>
          </div>

        </div>


        <div className="col-span-12">

          <div className="flex justify-center mb-12">
            {/* link to go to orderStatus to manage the status of orders */}
            <Link to={'/admin/orderStatus'}>
              <button className="bg-dark-blue hover:bg-light-blue text-white font-bold py-2 px-4 rounded-md w-full text-md">
                Go to Order Status Management
              </button>
            </Link>
          </div>
        </div>


      </div>
    </div >
  );
}