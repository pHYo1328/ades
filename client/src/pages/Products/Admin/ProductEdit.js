import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../AuthContext';
import ProductEditForm from '../../../components/Products/EditProduct/ProductEditForm';

export default function ProductEdit() {
  const { userData, userDataLoaded} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userDataLoaded) {
      // User data is not yet loaded, you might want to show a loading indicator
      console.log("user data not loaded yet");
      return;
    }
  
    if (!userData.roles || userData.roles === '') {
      console.log('Redirecting to login page');
      navigate('/login');
    } else if (userData.roles.includes('customer')) {
      console.log('Redirecting to customer');
      navigate('/');
    }
  }, [userData, userDataLoaded]);


  return (
    <div className="bg-white w-full h-auto">
      <div className="bg-white w-11/12 mx-auto">
        <div className="sm:w-11/12 md:w-8/12 lg:w-8/12 mt-5 mx-auto bg-peach p-5 rounded-md mb-5">
          <h3 className="text-center text-2xl font-bold mb-6">EDIT PRODUCT</h3>
          <ProductEditForm />
        </div>
      </div>
    </div>
  );
}
