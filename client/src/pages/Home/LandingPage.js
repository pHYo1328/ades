import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import Product from '../../components/Products/Product/Product';
import Brands from '../../components/Products/Product/Brands';
import Categories from '../../components/Products/Product/Categories';

export default function LandingPage() {
  const [products, setProducts] = useState(null);
  const searchButtonRef = useRef(null);

  const [productName, setProductName] = useState();
  const [productMinPrice, setProductMinPrice] = useState();
  const [productMaxPrice, setProductMaxPrice] = useState();
  const [productCategory, setProductCategory] = useState();
  const [productBrand, setProductBrand] = useState();

  const [categoryKey, setCategoryKey] = useState(0);
  const [brandKey, setBrandKey] = useState(0);

  useEffect(() => {
    setCategoryKey((prevKey) => prevKey + 1);
    setBrandKey((prevKey) => prevKey + 1);
  }, [])

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  // get 5 latest arrivals
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

  return (
    <div className="bg-white w-full">
      <div className="bg-white w-11/12 mx-auto" >
        <div className="mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h3 className="text-center text-black font-bold mb-3">WELCOME TO TECHZERO</h3>

          <div className="flex justify-center">
            <div className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12">
              <div className="mb-4 text-dark">
                <input
                  type="text"
                  className="border border-gray-300 rounded-md py-2 px-3 w-full"
                  placeholder="Enter search..."
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      event.stopPropagation();
                      searchButtonRef.current.click();
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="mb-3 w-full sm:w-11/12 md:w-10/12 lg:w-1/4">
              <input
                type="number"
                className="border border-gray-500 border-opacity-75 rounded-md py-2 px-3 w-full"
                placeholder="Min price"
                value={productMinPrice}
                onChange={(e) => setProductMinPrice(e.target.value)}
              />
            </div>

            <div className="mb-3 w-full sm:w-11/12 md:w-10/12 lg:w-1/4">
              <input
                type="number"
                className="border border-gray-500 border-opacity-75 rounded-md py-2 px-3 w-full"
                placeholder="Max price"
                value={productMaxPrice}
                onChange={(e) => setProductMaxPrice(e.target.value)}
              />
            </div>

            <div className="mb-3 w-full sm:w-11/12 md:w-10/12 lg:w-1/4">
              <Categories setCategoryID={setProductCategory} all={true} key={categoryKey} />
            </div>

            <div className="mb-3 w-full sm:w-11/12 md:w-10/12 lg:w-1/4">
              <Brands setBrandID={setProductBrand} all={true} key={brandKey} />
            </div>

            <div className="mb-3 w-full sm:w-11/12 md:w-10/12 lg:w-1/4">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-sm w-full text-sm"
                ref={searchButtonRef}
                onClick={() => {
                  let url = '/search';
                  const queryParams = [];

                  if (productName) queryParams.push(`product_name=${productName}`);
                  if (productCategory) queryParams.push(`category_id=${productCategory}`);
                  if (productBrand) queryParams.push(`brand_id=${productBrand}`);
                  if (productMaxPrice) queryParams.push(`max_price=${productMaxPrice}`);
                  if (productMinPrice) queryParams.push(`min_price=${productMinPrice}`);

                  if (queryParams.length > 0) {
                    url += `?${queryParams.join('&')}`;
                    window.location.href = url;
                  }
                }}
              >
                Search
              </button>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between mt-5">
            <div className="w-10/12">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                New Arrivals
              </h2>
            </div>
            <div className="w-2/12 ml-3">
              <Dropdown>
                <Dropdown.Toggle className="bg-white text-black hover:bg-blue-600 hover:text-white border-gray-300 px-2 py-2 rounded-md text-gray-700 font-semibold w-full text-sm">
                  All
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/products">
                    Products
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/brands/categories">
                    Brands & Categories
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {products ? (
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
              {products.map((product) => (
                <Product key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-screen">
              <Loading />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
