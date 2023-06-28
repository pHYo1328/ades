import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import React from 'react';
import axios from 'axios';
import chalk from 'chalk';
import { Link } from 'react-router-dom';
import Categories from '../Product/Categories';
import Brands from '../Product/Brands';
import Loading from '../../Loading/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        setProductName(response.data.data.product_name);
        setProductDescription(response.data.data.description);
        setProductBrand(response.data.data.category_id);
        setProductCategory(response.data.data.brand_id);
        setProductPrice(response.data.data.price);
        setProductQuantity(response.data.data.quantity);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  // console.log("product data:", productData);

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
    if (
      productName == "" || productDescription == ""
    ) {
      toast.error(`Please fill in all the fields.`, {
        autoClose: 3000,
        pauseOnHover: true,
        style: { 'font-size': '16px' },
      });
    } else if (isNaN(productQuantity) || productQuantity < 0) {
      toast.error(`Inventory must be a value not less than 0.`, {
        autoClose: 3000,
        pauseOnHover: true,
        style: { 'font-size': '16px' },
      });
    } else if (isNaN(productPrice) || productPrice <= 0) {
      toast.error(`Price must be a value not less than or equal to 0.`, {
        autoClose: 3000,
        pauseOnHover: true,
        style: { 'font-size': '16px' },
      });
    } else {
      axios
        .put(`${baseUrl}/api/products/${productID}`, requestBody, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          toast.success(`Changes saved.`, {
            autoClose: 3000,
            pauseOnHover: true,
            style: { 'font-size': '16px' },
          });
          console.log(response);
          setProduct(response.data.data);
          console.log(product);
        });
    }
  };

  return (
    <form
      id="create-product-form"
      style={{ marginLeft: 'auto', marginRight: 'auto' }}
      encType="multipart/form-data"
    >
      {/* shows the details of the product if the product exists */}
      {productData ? (
        <div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="block text-base font-semibold mb-1">
              Product Name
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-md py-2 px-3 w-full text-sm"
              defaultValue={productData.product_name}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="block text-base font-semibold mb-1">
              Description
            </label>
            <textarea
              className="border border-gray-300 rounded-md py-2 px-3 w-full text-sm"
              placeholder="Description"
              rows={3}
              defaultValue={productData.description}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="block text-base font-semibold mb-1">
                Price
              </label>
              <input
                type="number"
                min="0"
                className="border border-gray-300 rounded-md py-2 px-3 w-full text-sm"
                defaultValue={productData.price}
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="Price"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="block text-base font-semibold mb-1">
                Inventory
              </label>
              <input
                min="0"
                type="number"
                className="border border-gray-300 rounded-md py-2 px-3 w-full text-sm"
                placeholder="Inventory (Quantity)"
                defaultValue={productData.quantity}
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="block text-base font-semibold mb-1">
                Category
              </label>
              <Categories
                setCategoryID={setProductCategory}
                all={false}
                edit={true}
                productData={productData}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="block text-base font-semibold mb-1">
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
      ) : (
        // Loading component (full screen)
        <div className="flex items-center justify-center h-screen">
          <Loading />
        </div>
      )}


      <div className="flex justify-between mt-4 space-x-4">
        <div className="mb-3 w-6/12">
          <button
            type="submit"
            id="submit"
            className="bg-dark-blue hover:bg-light-blue text-white font-bold py-2 px-4 rounded-md w-full text-sm h-100 flex items-center justify-center text-center"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        <div className="mb-3 w-6/12">
          <Link
            to="/products/admin"
            id="submit"
            className="bg-light-blue  text-white font-bold py-2 px-4 rounded-md w-full text-sm h-full flex items-center justify-center text-center hover:shadow-lg"  >
            Discard Changes
          </Link>
        </div>
      </div>

      <ToastContainer
        limit={2}
        newestOnTop={true}
        position="top-center"
      />
    </form>
  );
}
