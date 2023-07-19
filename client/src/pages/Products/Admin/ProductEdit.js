import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import React from 'react';
import EditImage from '../../../components/Products/EditProduct/EditImage';
import ProductEditForm from '../../../components/Products/EditProduct/ProductEditForm';
import Button from '../../../components/Button';

export default function ProductEdit() {
  const [editImage, setEditImage] = useState(false);
  const navigate = useNavigate();
  // const location = useLocation();
  // const { fetchProducts } = location.state;

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem('roles'));
    console.log(roles);
    if (!roles) {
      // User does not have the required role(s), redirect them to the homepage or show an error message
      console.log('Redirecting to login');
      navigate('/login');
    } else {
      const isAdmin = roles.includes('admin');
      console.log(isAdmin);
      if (!isAdmin) {
        // User does not have the required role(s), redirect them to the homepage or show an error message
        // alert("you're not admin");
        console.log('Redirecting to homepage');
        navigate('/homepage');
      }
    }
  }, []);

  return (
    <div className="bg-white w-full h-auto">
      <div className="bg-white w-11/12 mx-auto">
        <div className="sm:w-11/12 md:w-8/12 lg:w-8/12 mt-5 mx-auto bg-peach p-5 rounded-md mb-5">
          <h3 className="text-center text-2xl font-bold mb-6">EDIT PRODUCT</h3>

          <div className="mx-auto lg:w-6/12 md:w-9/12 sm:w-11/12 mb-10">
            {/* toggle button to toggle between ProductEditForm and EditImage components */}
            <Button
              onClick={() => {
                setEditImage(!editImage);
              }}
              content={
                <>
                  <div className="flex items-center justify-center">
                    <div>Update&nbsp;</div>
                    <div>
                      {!editImage ? <p>Images</p> : <p>Product Details</p>}
                    </div>
                  </div>
                </>
              }
            />
          </div>

          {!editImage ? <ProductEditForm /> : <EditImage />}
        </div>
      </div>
    </div>
  );
}
