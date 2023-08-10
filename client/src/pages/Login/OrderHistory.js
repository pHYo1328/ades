import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { BsCaretUpFill } from "react-icons/bs";
import { BsCaretDownFill} from "react-icons/bs";
import CompletedItemList from '../../components/CompletedOrderList';
import api from '../../index';
import { FadeLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;






//TO BE DELETED







const OrderHistory = () => {
    const [orderItems, setOrderItems] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedSection, setExpandedSection] = useState(null);
    const navigate = useNavigate();


    const toggleSection = (section) => {
        if (expandedSection === section) {
          setExpandedSection(null);
        } else {
          setExpandedSection(section);
        }
      };

    const userId = localStorage.getItem('userid');
    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
        const response = await api.get(
            `/api/order/getOrderDetailByOrderStatus?customerID=${userId}&orderStatus=delivered`
        );
        setOrderItems(response.data.data);
        setIsLoading(false);
        };
        fetchData();
    }, []);

  return (
    <div className="h-xl w-xl bg-gray-100 flex items-center justify-center">
      <div className="flex w-screen m-3">
        <div className="bg-gray-800 text-white ml-10 w-64 flex-none rounded-tl-lg rounded-bl-lg">
          <nav className="p-4">
            <ul className="space-y-2">
              <li className="py-2">
                <a
                  href="/user-profile"
                  className="block px-4 py-2 text-lg rounded-md hover:bg-gray-700 font-bold"
                >
                  Profile Page
                </a>
              </li>
              <li className="py-2">
                    <button
                    onClick={() => toggleSection('orders')}
                    className="flex items-center justify-between px-4 py-2 text-lg rounded-md hover:bg-gray-700 cursor-pointer"
                    >
                    <span className="mr-20 font-bold">Orders</span>
                    {expandedSection === 'orders' ? <BsCaretUpFill /> : <BsCaretDownFill />}
                    </button>
                    {expandedSection === 'orders' && (
                    <ul className="pl-4 text-lg space-y-1">
                        <li className="hover:bg-gray-700 rounded-md">
                        <a href="/to-pay" className="block px-2 py-1">To Pay</a>
                        </li>
                        <li className="hover:bg-gray-700 rounded-md">
                        <a href="/to-ship" className="block px-2 py-1">To Ship</a>
                        </li>
                        <li className="hover:bg-gray-700 rounded-md">
                        <a href="/to-receive" className="block px-2 py-1">To Receive</a>
                        </li>
                        <li className="hover:bg-gray-700 rounded-md">
                        <a href="/OrderDelivered" className="block px-2 py-1">Completed</a>
                        </li>
                    </ul>
                    )}
                </li>
            </ul>
          </nav>
        </div>
  
        <div className="flex-grow">
          <div className="max-w-6xl">
            <div className="bg-gray-100 shadow-lg rounded-tr-lg rounded-br-lg">
  
              {isLoading ? (
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
                  orderStatus={'delivered'}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
              }  


export default OrderHistory;