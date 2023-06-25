import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import React from 'react';
import axios from 'axios';
import chalk from 'chalk';
import { Link } from 'react-router-dom';
import Categories from '../Product/Categories';
import Brands from '../Product/Brands';
import Loading from '../../Loading/Loading';
export default function ProductEditForm() {
  const { productID } = useParams();
  const [productData, setProductData] = useState();
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  const [product, setProduct] = useState(null);

  const [productName, setProductName] = useState();
  const [productPrice, setProductPrice] = useState();
  const [productDescription, setProductDescription] = useState();
  const [productCategory, setProductCategory] = useState();
  const [productBrand, setProductBrand] = useState();
  const [productQuantity, setProductQuantity] = useState();

  // gets the details of the product by productID
  const getProducts = () => {
    console.log(productID);
    axios
      .get(`${baseUrl}/api/product/${productID}`)
      .then((response) => {
        console.log(response);
        setProductData(response.data.data);
        console.log(productData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  console.log(productData);

  // changes the details of the product as the user clicks on submit button
  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(chalk.yellow('submit button is clicked!'));

    const requestBody = {
      product_name: productName,
      description: productDescription,
      price: productPrice,
      category_id: productCategory,
      brand_id: productBrand,
      quantity: productQuantity,
    };

    console.log(requestBody);

    axios
      .put(`${baseUrl}/api/products/${productID}`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response);
        setProduct(response.data.data);
        console.log(product);
      });

    // alter the user about the changes saved
    window.alert('Changes saved!');
  };

  return (
    <div>
      <form
        id="create-product-form"
        class="w-50 mt-5"
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
        encType="multipart/form-data"
      >
        {/* shows the details of the product if the product exists */}
        {productData && (
          <div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label h6">
                Product Name
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                defaultValue={productData.product_name}
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label h6">
                Description
              </label>
              <textarea
                className="form-control form-control-sm"
                placeholder="Description"
                rows={3}
                defaultValue={productData.description}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>
            <div className="row">
              <div className="mb-3 col-6">
                <label htmlFor="exampleFormControlInput1" className="form-label h6">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-control form-control-sm"
                  defaultValue={productData.price}
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="Price"
                />
              </div>
              <div className="mb-3 col-6">
                <label htmlFor="exampleFormControlInput1" className="form-label h6">
                  Inventory (Quantity)
                </label>
                <input
                  min="0"
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Inventory (Quantity)"
                  defaultValue={productData.quantity}
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="mb-3 col-6">
                <label htmlFor="exampleFormControlInput1" className="form-label h6">
                  Category
                </label>
                <Categories
                  setCategoryID={setProductCategory}
                  all={false}
                  edit={true}
                  productData={productData}
                />
              </div>
              <div className="mb-3 col-6">
                <label htmlFor="exampleFormControlInput1" className="form-label h6">
                  Brand
                </label>
                <Brands
                  setBrandID={setProductBrand}
                  all={false}
                  edit={true}
                  productData={productData}
                />
              </div>
            </div>
          </div>
        )}

        <div class="d-flex justify-content-center gap-3">
          <div class="col-5 text-dark">
            <button
              type="submit"
              id="submit"
              class="btn btn-outline-success mb-3 w-100"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
          <div class="col-5 text-dark">
            <Link
              to="/products/admin"
              id="submit"
              class="btn btn-outline-danger mb-3 w-100"
            >
              Discard Changes
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
