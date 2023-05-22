import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="flex items-center justify-end bg-black text-white py-4 px-8">
      <nav>
        <ul className="flex justify-end space-x-12">
          <li>
            <Link to="/products">Home</Link>
          </li>
          <li>
            <Link to="/brands">Brands</Link>
          </li>
          <li>
            <Link to="/category">Category</Link>
          </li>
          <li>
            <Link to="/user">User</Link>
          </li>
          <li>
            <Link to="/cart">Cart</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;