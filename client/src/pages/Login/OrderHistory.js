import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { BiEdit } from 'react-icons/bi';

const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
const OrderHistory = () => {
  return (
    <div className="h-xl w-xl bg-gray-100 flex items-center justify-center">
      <div className="flex h-screen w-screen m-3">
        <div className="bg-gray-800 text-white ml-10 w-64 flex-none rounded-tl-lg rounded-bl-lg">
          <nav className="p-4">
            <ul className="space-y-2">
              <li className="py-2">
                <a
                  href="/user-profile"
                  className="block px-4 py-2 text-lg rounded-md hover:bg-gray-700"
                >
                  Profile Page
                </a>
              </li>
              <li className="py-2">
                <a
                  href="/order-history"
                  className="block px-4 py-2 text-lg rounded-md hover:bg-gray-700"
                >
                  Order History
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-grow">
          <div className="max-w-6xl h-full">
            <div className="bg-white shadow-lg h-full p-8 rounded-tr-lg rounded-br-lg">
              <h2 className="text-4xl text-center font-bold mb-4">
                Order History
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
