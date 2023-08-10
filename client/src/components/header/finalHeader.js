import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiTruckLine,
  RiCheckboxCircleLine,
  RiNotification2Fill,
} from 'react-icons/ri';
import {
  FaBox,
  FaWallet,
  FaShoppingCart,
  FaUser,
  FaBars,
} from 'react-icons/fa';
import { MdComputer } from 'react-icons/md';
import api from '../../index';
import { AuthContext } from '../../AuthContext';
const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

const Header = ({ isUserSignedIn, isAdminSignedIn }) => {
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const userId = localStorage.getItem('userid');
  const userPanelRef = useRef(null);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)
  const sideNavRef = useRef(null);
  const handleUserPanelToggle = () => {
    setIsUserPanelOpen(!isUserPanelOpen);
  };
  console.log("ejlo" + isAdminSignedIn)
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const notificationPanelRef = useRef(null);
  const { userData, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleOutsideClick = (event) => {
    if (userPanelRef.current && !userPanelRef.current.contains(event.target)) {
      setIsUserPanelOpen(false);
    }

    if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
      setIsSideNavOpen(false);
    }

    if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target)) {
      setIsNotificationPanelOpen(false);
    }
  };

  const handleNotificationsPanelToggle = () => {
    setIsNotificationPanelOpen(!isNotificationPanelOpen);
  };

    const onHandleLogout = async () => {
    try {
      await fetch(`${baseUrl}/logout`, {
        method: 'PUT',
        credentials: 'include',
      });
    } catch (error) {
      console.error(error);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userid');
    // localStorage.removeItem('roles');
    localStorage.removeItem('isSignedIn');
    setUserData({
      ...userData,
      // accessToken: null,
      userid: null,
      roles: [],
      isSignedIn: false,
    });
    navigate('/');
  };

  const onHandleAdminLogout = async () => {
    try {
      await fetch(`${baseUrl}/logout`, {
        method: 'PUT',
        credentials: 'include',
      });
    } catch (error) {
      console.error(error);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('admin_id');
    localStorage.removeItem('isAdminSignedIn');
    setUserData({
      ...userData,
      accessToken: null,
      admin_id: null,
      roles: [],
      isAdminSignedIn: false,
    });
    navigate('/');
  };

  useEffect(() => {
    api.get(`/api/notifications/${userId}`).then((response) => {
      if (response.data.data[0][0].have_email === 1) {
        setNotificationStatus(true);
      }
    });
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleSideNavToggle = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  useEffect(() => {
    if (!isNotificationPanelOpen) {
      api.delete(`/api/notifications/${userId}`)
        .then((response) => {
        })
    }
  }, [isNotificationPanelOpen]);
  
  console.log("HEADER " + isAdminSignedIn);
  return (
    <header className="bg-tertiary shadow font-breezeRegular">
      <div className="container mx-auto px-4 py-6">
        {isUserSignedIn && (
          <>
                        <nav className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Link to="/" className="text-lg font-bold text-white">
                                TECHZERO
                                </Link>
                            </div>
                            <div className="flex items-center space-x-4">
                            {userId && <div className="relative" ref={notificationPanelRef}>
                                <button
                                    onClick={handleNotificationsPanelToggle}
                                    className="text-white hover:text-gray-600 flex flex-row space-x-1 py-2 border-b-2 border-transparent hover:border-fuchsia-600"
                                >
                                    <RiNotification2Fill />
                                    {notificationStatus && (
                                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                                    )}
                                </button>
                                {isNotificationPanelOpen && (
                                    <div className="z-10 absolute top-10 right-0 bg-white text-gray-800 border border-gray-300 rounded-md py-2 shadow-lg">
                                    {notificationStatus ? (
                                        <p className="w-max p-2">There are new emails for you</p>
                                    ) : (
                                        <p className="w-max p-2">There is no update for you</p>
                                    )}
                                    </div>
                                )}
                                </div>}
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

                                <button
                                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md text-lg"
                                onClick={onHandleLogout}
                                >
                                Log out
                                </button>

                                {/* <Link to="/login-admin">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md text-lg">
                                    Admin
                                </button>
                                </Link> */}

                                <Link to="/user-profile">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md text-lg">
                                    User Profile
                                </button>
                                </Link>
                            </div>
                        </nav>
          </>
        )}

        {isAdminSignedIn && (
          <>
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link to="/" className="text-lg font-bold text-white">
                            TECHZERO
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/admin" className="text-white hover:text-gray-600">
                            Dashboard
                            </Link>
                            <Link
                            to="/products/create"
                            className="text-white hover:text-gray-600"
                            >
                            Create
                            </Link>

                            <button
                            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md text-lg"
                            onClick={onHandleAdminLogout}
                            >
                            Log Out
                            </button>
                        </div>
                    </nav>
          </>
        )}

        {!isUserSignedIn && !isAdminSignedIn && (
          <>
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
            </>
        )}
      </div>
</header>
  );
};

export default Header;
