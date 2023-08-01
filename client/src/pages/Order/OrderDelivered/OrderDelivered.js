import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../AuthContext';
import CompletedItemList from '../../../components/ItemList/completedItemList';
import api from '../../../index';
import { FadeLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
const OrderDelivered = () => {
  const { userData } = useContext(AuthContext);
  const [orderItems, setOrderItems] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    // const roles = JSON.parse(localStorage.getItem('roles'));
    // console.log(userData.isSignedIn);
    if (!userData.isSignedIn) {
      // User does not have the required role(s), redirect them to the homepage or show an error message
      console.log('Redirecting to homepage');
      navigate('/login');
    } else {
      // const isCustomer = roles.includes('customer');
      // console.log(isCustomer);
      // if (!isCustomer) {
      //   // User does not have the required role(s), redirect them to the homepage or show an error message
      //   // alert("you're not admin");
      //   console.log('Redirecting to homepage-admin');
      //   navigate('/login');
      // }
    }
  }, []);
  const userId = localStorage.getItem('userid');
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const response = await api.get(
        `/api/order/getOrderDetailByOrderStatus?customerID=${userId}&orderStatus=delivered`
      );
      console.log(response);
      setOrderItems(response.data.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return isLoading ? (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-row">
        <FadeLoader
          color={'navy'}
          loading={isLoading}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <p>Loading...</p>
      </div>
    </div>
  ) : (
    <CompletedItemList
      items={orderItems}
      customerID={userId}
      renderRating={true}
    ></CompletedItemList>
  );
};

export default OrderDelivered;

{
  /* <div className="h-xl w-xl bg-gray-100 flex items-center justify-center">
      <div className="flex h-screen w-screen m-3">
        <div className="bg-gray-800 text-white ml-10 w-64 flex-none rounded-tl-lg rounded-bl-lg">
          <nav className="p-4">
            <ul className="space-y-2">
              <li className="py-2">
                <a href="/user-profile" className="block px-4 py-2 text-lg rounded-md hover:bg-gray-700">Profile Page</a>
              </li>
              <li className="py-2">
                <a href="#" className="block px-4 py-2 text-lg rounded-md hover:bg-gray-700">Order History</a>
              </li>
            </ul>
          </nav>
        </div>

        

      </div>
</div> */
}
