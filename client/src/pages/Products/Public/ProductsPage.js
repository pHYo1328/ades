import { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Category from '../../../components/Products/Dropdown/Category';

import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

export default function ProductsPage() {
  // const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [brands, setBrands] = useState(null)
  const [categories, setCategories] = useState(null)
  const [categoryID, setCategoryID] = useState(0)
  const [brandID, setBrandID] = useState(0)
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/products/${categoryID}/${brandID}`)
      .then((response) => {
        console.log(response);
        setProducts(response.data.data);
        console.log(products);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [categoryID, brandID]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/category`)
      .then((response) => {
        console.log(response);
        setCategories(response.data.data);
        console.log(categories);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
    <div className="bg-white w-full">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">

        <div class="row">
          <div class="col-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-center" class="h2">
              Products
            </h2>
          </div>
          <div class="col-2">
            <select class="form-select form-select-sm" onChange={(e) => setCategoryID(e.target.value)}>
              <option disabled selected value="0">
                -- CATEGORY --
              </option>
              {categories ? (
                categories.map((category) => (
                  <option value={category.category_id}>
                    {category.category_name}
                  </option>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </select>
          </div>
          <div class="col-2">
            <select class="form-select form-select-sm" onChange={(e) => setBrandID(e.target.value)}>
              <option disabled selected value>
                -- BRAND --
              </option>
              {brands ? (
                brands.map((brand) => (
                  <option value={brand.brand_id}>{brand.brand_name}</option>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
          {products ? (
            products.map((product) => (
              <div key={product.product_id} className="group relative"  onClick={() => {
                const productID = product.product_id
                window.location.href=`http://localhost:3000/products/${productID}`
              }}>
                <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  {/* <img
                    src={cld.image(product.image_url)}
                    alt={product.image_url}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  /> */}
                  {/* <p>{product.image_url}</p> */}
                  <AdvancedImage
                    cldImg={cld.image(product.image_url)}
                  />
                  {/* {product.image_url} */}
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="text-left">
                    <h3 className="text-sm text-gray-700">
                      <a href={`/product/${product.product_id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.product_name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.brand_name}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 justify-start">
                    {product.price}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}