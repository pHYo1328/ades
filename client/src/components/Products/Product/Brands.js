import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../../Loading/Loading';

export default function Brands({ setBrandID, all, edit = false, productData = null }) {
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const [brands, setBrands] = useState(null);

  // get all brands for drop down selection
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/brands`)
      .then((response) => {
        console.log(response);
        setBrands(response.data.data);
        console.log(brands);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <select
      class="form-select form-select-sm"
      onChange={(e) => setBrandID(e.target.value)}
    >
      <option disabled selected value>
        -- BRAND --
      </option>
      {/* shows all the brands for drop down select */}
      {brands ? (
        brands.map((brand) => (
          <option value={brand.brand_id} selected={
            edit && brand.brand_name === productData?.brand_name
          }>{brand.brand_name}</option>
        ))
      ) : (
        // Loading component (full screen)
        <div className="flex items-center justify-center h-screen">
          <Loading />
        </div>
      )}
      {all && <option value={0}>All</option>}
    </select>
  )
}