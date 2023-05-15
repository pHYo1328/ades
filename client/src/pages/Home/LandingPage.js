import { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function ProductsPage() {
  // const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [brands, setBrands] = useState(null);
  const [categories, setCategories] = useState(null);
  const baseUrl = 'http://localhost:8081';
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/products/new`)
      .then((response) => {
        console.log(response);
        setProducts(response.data.data);
        console.log(products);
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

  return (
    <div className="bg-white w-full">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h3 class="text-center text-black font-weight-bold mb-3">
          WELCOME TO TECHZERO
        </h3>

        <div class="row col-10">
          <div class="input-wrap first col-lg-10 col-md-8 col-sm-12">
            <div class="mb-3 text-dark">
              <input
                type="text"
                class="form-control"
                placeholder="Enter search..."
              />
            </div>
          </div>
        </div>
        <div class="row col-10">
          <div class="input-wrap first col-lg-4 col-md-8 col-sm-12 row">
            <div class="mb-3 text-dark col-lg-6">
              <input
                type="number"
                class="form-control"
                placeholder="Min price"
              />
            </div>
            <div class="mb-3 text-dark col-lg-6">
              <input
                type="number"
                class="form-control"
                placeholder="Max price"
              />
            </div>
          </div>
          <div class="input-wrap first col-lg-3 col-md-8 col-sm-12">
            <div class="input-field first w-100">
              {/* <label>CATEGORY</label> */}
              <select class="form-select" id="categoryOptions">
                <option disabled selected value>
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
          </div>
          <div class="input-wrap first col-lg-3 col-md-8 col-sm-12">
            <div class="input-field first w-100">
              {/* <label>BRAND</label> */}
              <select class="form-select" id="brandOptions">
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
        </div>

        <div class="row col-3 text-black">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-50 h-50">
            Search
          </button>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          New Arrivals
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
          {products ? (
            products.map((product) => (
              <div key={product.product_id} className="group relative">
                <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src="https://images.samsung.com/ca/smartphones/galaxy-s22/buy/S22_S22plus_ProductKV_White_MO.jpg"
                    alt=""
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
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
