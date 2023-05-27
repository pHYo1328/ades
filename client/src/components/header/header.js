import React, { useState, useEffect, useRef } from 'react';
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
  const userPanelRef = useRef(null);

  const handleUserPanelToggle = () => {
    setIsUserPanelOpen(!isUserPanelOpen);
  };

  const handleOutsideClick = (event) => {
    if (userPanelRef.current && !userPanelRef.current.contains(event.target)) {
      setIsUserPanelOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

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
            <Link to="/cart" className="text-gray-800 hover:text-gray-600">
              Cart
            </Link>
            <div className="relative" ref={userPanelRef}>
              <button
                onClick={handleUserPanelToggle}
                className="text-gray-800 hover:text-gray-600"
              >
                User
              </button>
              {isUserPanelOpen && (
                <div className="z-10 absolute top-10 right-0 bg-white text-gray-800 border border-gray-300 rounded-md py-2 shadow-lg">
                  <div className="flex flex-row">
                    <Link to="/orderToPay">
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        <FaWallet className="inline-block mr-2" />
                        to pay
                      </button>
                    </Link>
                    <Link to="/orderToShip">
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        <FaBox className="inline-block mr-2" />
                        to ship
                      </button>
                    </Link>
                  </div>
                  <div className="flex flex-row">
                    <Link to="/orderToDeliver">
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        <RiTruckLine className="inline-block mr-2" />
                        to receive
                      </button>
                    </Link>
                    <Link to="/orderDelivered">
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        <RiCheckboxCircleLine className="inline-block mr-2" />
                        completed
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link to="/login">
              <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md text-lg">
                Sign In
              </button>
            </Link>
            <Link to="/login-admin">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md text-lg">
                Admin
              </button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
