import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import Dropdown from 'react-bootstrap/Dropdown';
import { FadeLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import UserSignedInHeader from '../../components/header/userSignedInHeader';
const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

export default function LandingPage() {
  const [products, setProducts] = useState(null);
  const [brands, setBrands] = useState(null);
  const [categories, setCategories] = useState(null);

  const [productName, setProductName] = useState();
  const [productMinPrice, setProductMinPrice] = useState();
  const [productMaxPrice, setProductMaxPrice] = useState();
  const [productCategory, setProductCategory] = useState();
  const [productBrand, setProductBrand] = useState();

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
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
    <div>
      <UserSignedInHeader />
      <div
        className="bg-white w-full"
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h3 className="text-center text-black font-weight-bold mb-3">
            WELCOME TO TECHZERO
          </h3>

          <div className="row">
            <div
              className="input-wrap first col-lg-10 col-md-8 col-sm-12"
              style={{ marginLeft: 'auto', marginRight: 'auto' }}
            >
              <div className="mb-3 text-dark">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter search..."
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div
            className="row col-10"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          >
            <div
              className="input-wrap first col-lg-4 col-md-8 col-sm-12 row"
              style={{ marginLeft: 'auto', marginRight: 'auto' }}
            >
              <div className="mb-3 text-dark col-lg-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min price"
                  value={productMinPrice}
                  onChange={(e) => setProductMinPrice(e.target.value)}
                />
              </div>
              <div className="mb-3 text-dark col-lg-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max price"
                  value={productMaxPrice}
                  onChange={(e) => setProductMaxPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="input-wrap first col-lg-3 col-md-8 col-sm-12">
              <div className="input-field first w-100">
                <select
                  className="form-select"
                  id="categoryOptions"
                  onChange={(e) => setProductCategory(e.target.value)}
                >
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
                    <div className="flex items-center justify-center h-screen">
                      <div className="mx-auto flex flex-col items-center">
                        <FadeLoader
                          color={'navy'}
                          loading={true}
                          size={100}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <p>Loading...</p>
                      </div>
                    </div>
                  )}
                </select>
              </div>
            </div>
            <div className="input-wrap first col-lg-3 col-md-8 col-sm-12">
              <div className="input-field first w-100">
                <select
                  className="form-select"
                  id="brandOptions"
                  onChange={(e) => setProductBrand(e.target.value)}
                >
                  <option disabled selected value>
                    -- BRAND --
                  </option>
                  {brands ? (
                    brands.map((brand) => (
                      <option value={brand.brand_id}>{brand.brand_name}</option>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-screen">
                      <div className="mx-auto flex flex-col items-center">
                        <FadeLoader
                          color={'navy'}
                          loading={true}
                          size={100}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <p>Loading...</p>
                      </div>
                    </div>
                  )}
                </select>
              </div>
            </div>
            <div className=" col-2 text-black">
              <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={() => {
                  let url = '/search';
                  const queryParams = [];

                  if (productName)
                    queryParams.push(`product_name=${productName}`);
                  if (productCategory)
                    queryParams.push(`category_id=${productCategory}`);
                  if (productBrand)
                    queryParams.push(`brand_id=${productBrand}`);
                  if (productMaxPrice)
                    queryParams.push(`max_price=${productMaxPrice}`);
                  if (productMinPrice)
                    queryParams.push(`min_price=${productMinPrice}`);

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

          <div className="row mt-5">
            <div className="col-10">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                New Arrivals
              </h2>
            </div>
            <div className="col-2">
              <Dropdown style={{ width: '100%' }}>
                <Dropdown.Toggle
                  variant="outline-primary"
                  id="dropdownMenuButton"
                  className="w-100"
                >
                  See All
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
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
            {products ? (
              products.map((product) => (
                <div key={product.product_id} className="group relative">
                  <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-50">
                    <AdvancedImage cldImg={cld.image(product.image_url)} />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="text-left">
                      <h3 className="text-sm text-gray-700">
                        <Link to={`/product/${product.product_id}`}>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {product.product_name}
                        </Link>
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
              <div className="flex items-center justify-center h-screen">
                <div className="mx-auto flex flex-col items-center">
                  <FadeLoader
                    color={'navy'}
                    loading={true}
                    size={100}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                  <p>Loading...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
