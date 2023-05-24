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
    <header className="flex items-center justify-end bg-black text-white py-4 px-8">
      <nav>
        <ul className="flex justify-end space-x-12">
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/brands">Brands</Link>
          </li>
          <li>
            <Link to="/category">Category</Link>
          </li>
          <li>
            <Link to="#" onClick={handleUserPanelToggle}>
              User
            </Link>
          </li>
          <li>
            <Link to="/cart">Cart</Link>
          </li>
        </ul>
      </nav>
      {/* User Panel */}
      {isUserPanelOpen && (
        <div className="bg-black text-white absolute top-16 right-8 rounded p-2 text-base">
          <div className="flex flex-row justify-between">
            <button className="p-2 ">
              <FaWallet />
              to pay
            </button>
            <button className="p-2">
              <FaBox />
              to ship
            </button>
          </div>
          <div className="flex flex-row justify-between">
            <button className="p-2">
              <RiTruckLine />
              to receive
            </button>
            <button className="p-2">
              <RiCheckboxCircleLine />
              completed
            </button>
          </div>
          <div>
            <button className="p-2">
              <RiCloseCircleLine />
              cancelled
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
