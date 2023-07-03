import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  RiTruckLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
} from 'react-icons/ri';
import {
  FaBox,
  FaWallet,
  FaShoppingCart,
  FaUser,
  FaBars,
} from 'react-icons/fa';
import { MdComputer } from 'react-icons/md';

const Header = () => {
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const userId = localStorage.getItem('userid');
  const userPanelRef = useRef(null);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const sideNavRef = useRef(null);

  const handleUserPanelToggle = () => {
    setIsUserPanelOpen(!isUserPanelOpen);
  };

  const handleOutsideClick = (event) => {
    if (userPanelRef.current && !userPanelRef.current.contains(event.target)) {
      setIsUserPanelOpen(false);
    }

    if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
      setIsSideNavOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleSideNavToggle = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  return (
    <header className="bg-tertiary shadow">
      <div className="container mx-auto px-4 py-6">
        <nav className="hidden md:flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-lg font-bold text-white">
              TECHZERO
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link
              to="/products"
              className="text-white hover:text-gray-600 flex flex-row space-x-1 items-center py-2 border-b-2 border-transparent hover:border-fuchsia-600"
            >
              <MdComputer />
              <p className="text-2xl">Products</p>
            </Link>
            <Link
              to="/cart"
              className="text-white hover:text-gray-600 py-2 border-b-2 border-transparent hover:border-fuchsia-600 flex flex-row space-x-1"
            >
              <FaShoppingCart />
              <p className="text-2xl">Cart</p>
            </Link>
            <div className="relative" ref={userPanelRef}>
              <button
                onClick={handleUserPanelToggle}
                className="text-white  hover:text-gray-600 flex flex-row space-x-1 py-2 border-b-2 border-transparent hover:border-fuchsia-600"
              >
                <FaUser />
                <p className="text-2xl">User</p>
              </button>
              {isUserPanelOpen && (
                <div className="z-10 absolute top-10 right-0 bg-white text-gray-800 border border-gray-300 rounded-md py-2 shadow-lg">
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
        <nav className="flex md:hidden items-center justify-between ">
          <Link to="/" className="text-lg font-bold text-gray-800">
            TECHZERO
          </Link>
          <div ref={sideNavRef}>
            <div>
              <FaBars className="text-2xl" onClick={handleSideNavToggle} />
            </div>
            {isSideNavOpen && (
              <div className="absolute top-16 right-0 bg-white text-gray-800 border border-gray-300 rounded-md py-2 shadow-lg z-10">
                <Link
                  to="/products"
                  className="block text-left px-4 py-2 hover:bg-gray-100"
                >
                  <MdComputer className="inline-block mr-2" />
                  Products
                </Link>
                <Link
                  to="/cart"
                  className="block text-left px-4 py-2 hover:bg-gray-100"
                >
                  <FaShoppingCart className="inline-block mr-2" />
                  Cart
                </Link>
                <div className="relative" ref={userPanelRef}>
                  <button
                    onClick={handleUserPanelToggle}
                    className="block text-left px-4 py-2 hover:bg-gray-100"
                  >
                    <FaUser className="inline-block mr-2" />
                    User
                  </button>
                  {isUserPanelOpen && (
                    <div className="absolute top-10 right-0 bg-white text-gray-800 border border-gray-300 rounded-md py-2 shadow-lg ">
                      <Link
                        to="/orderToPay"
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        <FaWallet className="inline-block mr-2" />
                        To Pay
                      </Link>
                      <Link
                        to="/orderToShip"
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        <FaBox className="inline-block mr-2" />
                        To Ship
                      </Link>
                      <Link
                        to="/orderToDeliver"
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        <RiTruckLine className="inline-block mr-2" />
                        To Receive
                      </Link>
                      <Link
                        to="/orderDelivered"
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        <RiCheckboxCircleLine className="inline-block mr-2" />
                        Completed
                      </Link>
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2 px-2">
                  <Link to="/login">
                    <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md text-base">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/login-admin">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md text-base">
                      Admin
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
