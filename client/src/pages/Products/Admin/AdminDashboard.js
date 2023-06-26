import { useState, useEffect } from 'react';
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

  useEffect(() => { fetchProducts() })

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
    <div class="row col-11" style={{ marginRight: 'auto', marginLeft: 'auto' }}>

      <ToastContainer
        limit={2}
        newestOnTop={true}
        position="top-center"
      />

      <div class="row" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <h4 class="h4 font-weight-bold text-center mt-4">Admin Dashboard</h4>
      </div>

      <Statistics statistics={statistics} key={statisticsKey} />

      <ProductList products={products} refunds={refunds} statistics={statistics} fetchProducts={fetchProducts} fetchStatistics={fetchStatistics} setRefunds={setRefunds} />

      <div
        class="row my-2 mx-auto p-0"
        style={{ marginRight: 'auto', marginLeft: 'auto' }}
      >
        <div
          class="col-12 justify-content-between d-flex"
          style={{ marginRight: 'auto', marginLeft: 'auto', width: '100%' }}
        >
          <Brand fetchProducts={fetchProducts()} />

          <Category fetchProducts={fetchProducts()} />
        </div>
      </div>

      <div
        className="row col-12 justify-content-center my-2 mx-0"
        style={{ marginRight: 'auto', marginLeft: 'auto' }}
      >
        <div
          class="col-11 p-0 mx-4"
          style={{
            background: '#c2d9ff',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            class="py-2"
            style={{
              position: 'sticky',
              top: '0',
              background: '#dff7ec',
              width: '100%',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              className="row align-items-center col-11"
              style={{ marginLeft: 'auto', marginRight: 'auto' }}
            >
              <div className="col-10 h5 font-weight-bold">Fully Refund</div>
            </div>
          </div>
          <div
            class="row col-12 mt-4 mb-4"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          >
            <div class="col-8">
              <input
                type="text"
                class="form-control"
                placeholder="Enter order_id..."
                value={orderID}
                onChange={(e) => setOrderID(e.target.value)}
              />
            </div>
            {/* give full refund to the customer based on the order ID */}
            <div class="col-4">
              <button
                class="btn btn-info w-100 col-6 text-dark mr-2"
                onClick={handleSearchOrder}
              >
                Search <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div className="flex justify-center mb-12">
          {/* link to go to orderStatus to manage the status of orders */}
          <Link to={'/admin/orderStatus'}>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Go to Order Status Management
            </button>
          </Link>
        </div>
      </div>


    </div>
  );
}
