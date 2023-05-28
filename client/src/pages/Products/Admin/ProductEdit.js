import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import React from 'react';
import EditImage from '../../../components/Products/EditProduct/EditImage';
import ProductEditForm from '../../../components/Products/EditProduct/ProductEditForm';
export default function ProductEdit() {
  const [editImage, setEditImage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem('roles'));
    console.log(roles);
    const isAdmin = roles.includes('admin');
    console.log(isAdmin);
    if (!isAdmin) {
      // User does not have the required role(s), redirect them to the homepage or show an error message
      alert("you're not admin");
      console.log('Redirecting to homepage-admin');
      navigate('/homepage');
    }
  }, []);

  return (
    <div class="pb-3">
      <h3 class="h3 text-center mt-5 mb-5">EDIT PRODUCT</h3>

      <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '400px' }}>
        <button
          className="btn btn-outline-success w-100"
          onClick={() => {
            setEditImage(!editImage);
          }}
        >
          <div className="flex items-center justify-center">
            <div>Update&nbsp;</div>
            <div>{!editImage ? <p>Images</p> : <p>Product Details</p>}</div>
          </div>
        </button>
      </div>

      {!editImage ? <ProductEditForm /> : <EditImage />}
    </div>
  );
}
