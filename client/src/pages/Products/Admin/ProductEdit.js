import { useState, useEffect } from 'react';

import React from 'react';
import EditImage from '../../../components/Products/EditProduct/EditImage';
import ProductEditForm from '../../../components/Products/EditProduct/ProductEditForm';
export default function ProductEdit() {

  const [editImage, setEditImage] = useState(false)

  return (

    <div>

      <button onClick={() => {
        setEditImage(!editImage)
      }
      }>Toggle</button>

      {!editImage ? (
        <ProductEditForm />
      ) :
        <EditImage />
      }

    </div>
  );
}
