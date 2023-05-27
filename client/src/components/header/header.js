import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RiTruckLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
} from 'react-icons/ri';
import { FaBox, FaWallet } from 'react-icons/fa';

const Header = () => {
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const userId = localStorage.getItem('userid');
  const handleUserPanelToggle = () => {
    setIsUserPanelOpen(!isUserPanelOpen);
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-lg font-bold text-gray-800">
              TECHZERO
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/products" className="text-gray-800 hover:text-gray-600">
              Products
            </Link>
            <Link to="/brands" className="text-gray-800 hover:text-gray-600">
              Brands
            </Link>
            <Link to="/cart" className="text-gray-800 hover:text-gray-600">
              Cart
            </Link>
            <Link to="/category" className="text-gray-800 hover:text-gray-600">
              Category
            </Link>
            <div className="relative">
              <button
                onClick={handleUserPanelToggle}
                className="text-gray-800 hover:text-gray-600"
              >
                User
              </button>
              {isUserPanelOpen && (
                <div className="absolute top-10 right-0 bg-white text-gray-800 border border-gray-300 rounded-md py-2 shadow-lg">
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    <FaWallet className="inline-block mr-2" />
                    to pay
                  </button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    <FaBox className="inline-block mr-2" />
                    to ship
                  </button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    <RiTruckLine className="inline-block mr-2" />
                    to receive
                  </button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    <RiCheckboxCircleLine className="inline-block mr-2" />
                    completed
                  </button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    <RiCloseCircleLine className="inline-block mr-2" />
                    cancelled
                  </button>
                </div>
              )}
            </div>
            <Link to="/login">
              <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md text-lg">
                Sign In
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-pink-600 hover:bg-pink-800 text-white font-bold py-2 px-4 rounded-md text-lg">
                Sign Up
              </button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
