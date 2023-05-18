import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import chalk from 'chalk';
import UploadWidget from '../../../components/cloudinary/UploadWidget';

export default function ProductCreate() {
  const { productID } = useParams();
  const [brands, setBrands] = useState(null);
  const [categories, setCategories] = useState(null);

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const [product, setProduct] = useState(null);

  const [productName, setProductName] = useState(null);
  const [productPrice, setProductPrice] = useState(null);
  const [productDescription, setProductDescription] = useState(null);
  const [productCategory, setProductCategory] = useState(null);
  const [productBrand, setProductBrand] = useState(null)
  const [productQuantity, setProductQuantity] = useState(null);
  const [imagePath, setImagePath] = useState('');

  // const [imagePath, setImagePath] = useState('');

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/product/${productID}`)
      .then((response) => {
        console.log(response);
        setProduct(response.data.data);
        console.log(product);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);


  const handleImageChange = (path) => {
    console.log('Selected image path:', path);
    setImagePath(path);
  };
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

  const handleSubmit = async (event) => {
    console.log(chalk.yellow('submit button is clicked!'));
    event.preventDefault();

    // const name = document.getElementById('edit-product-name').value;
    // const description = document.getElementById(
    //   'edit-product-description'
    // ).value;
    // const price = document.getElementById('edit-product-price').value;
    // const category_id = document.getElementById('edit-product-category').value;
    // const brand_id = document.getElementById('edit-product-brand').value;
    // const quantity = document.getElementById('edit-product-quantity').value;
    // const image = imagePath;
    if (isNaN(productQuantity) || productQuantity < 0) {
      window.alert('Inventory must be a value not less than 0.');
    } else if (isNaN(productPrice) || productPrice <= 0) {
      window.alert('Price must be a value not less than or equal to 0.');
    } else {
      const requestBody = {
        name: productName, 
        description: productDescription, 
        price: productPrice, 
        category_id: productCategory,
        brand_id: productBrand, 
        quantity: productQuantity,
        image: imagePath
      };

      console.log('path test');
      console.log(imagePath);

      console.log(requestBody);
      axios
        .put(`${baseUrl}/api/products/${productID}`, requestBody, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log(response);
          setProduct(response.data.data);
          console.log(product);
          // window.location.reload();
          // window.location.href = `http://localhost:3000/products/admin`;
        });
    }
  };

  return (
    // <>
    //   <Helmet>
    //     <script
    //       src="https://widget.cloudinary.com/v2.0/global/all.js"
    //       type="text/javascript"
    //     />
    //   </Helmet>
    <div>
      <form
        id="create-product-form"
        class="w-50 mt-5"
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
        encType="multipart/form-data"
      >
        <h3 class="h3 text-center">EDIT PRODUCT</h3>
        {product && (
          <div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label h6">
                Product Name
              </label>
              <input
                type="text"
                class="form-control form-control-sm"
                // placeholder={product.product_name}
                // value={product.product_name}
                defaultValue={product.product_name}
                value= {productName}
          onChange = {(e) => setProductName(e.target.value)}
              />
            </div>

            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label h6">
                Description
              </label>
              <textarea
                class="form-control form-control-sm"
                placeholder="Description"
                rows={3}
                defaultValue={product.description}
                value= {productDescription}
                onChange = {(e) => setProductDescription(e.target.value)}
              />
            </div>
            <div class="row">
              <div class="mb-3 col-6">
                <label for="exampleFormControlInput1" class="form-label  h6">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  class="form-control form-control-sm"
                  value= {productPrice}
          onChange = {(e) => setProductPrice(e.target.value)}
                  placeholder="Price"
                  defaultValue={product.price}
                />
              </div>
              <div class="mb-3 col-6">
                <label for="exampleFormControlInput1" class="form-label h6">
                  Inventory (Quantity)
                </label>
                <input
                  min="0"
                  type="number"
                  class="form-control form-control-sm"
                  placeholder="Inventory (Quantity)"
                  defaultValue={product.quantity}
                  value= {productQuantity}
                  onChange = {(e) => setProductQuantity(e.target.value)}
                   
                />
              </div>
            </div>
            <div class="row">
              <div class="mb-3 col-6">
                <label for="exampleFormControlInput1" class="form-label h6">
                  Category
                </label>
                <select
                  class="form-select form-select-sm"
                  onChange={(e) => setProductCategory(e.target.value)}
                >
                  {categories ? (
                    categories.map((category) => (
                      // <option value={category.category_id}>
                      //   {category.category_name}
                      // </option>

                      <option
                        value={category.category_id}
                        selected={
                          category.category_name === product.category_name
                        }
                      >
                        {category.category_name}
                      </option>
                    ))
                  ) : (
                    <p>Loading...</p>
                  )}
                </select>
              </div>
              <div class="mb-3 col-6">
                <label for="exampleFormControlInput1" class="form-label h6">
                  Brand
                </label>
                <select
                  class="form-select form-select-sm"
                  onChange={(e) => setProductBrand(e.target.value)}
                >
                  {brands ? (
                    brands.map((brand) => (
                      <option
                        value={brand.brand_id}
                        selected={brand.brand_name === product.brand_name}
                      >
                        {brand.brand_name}
                      </option>
                    ))
                  ) : (
                    <p>Loading...</p>
                  )}
                </select>
              </div>
            </div>
            <div class="mb-3 row">
              <div class="col-6">
                <button
                  class="btn btn-outline-danger w-100"
                  onClick={(e) => {
                    e.preventDefault();
                    // const productID = {productID};
                    axios
                      .put(`${baseUrl}/api/products/${productID}/images`)
                      .then((response) => {
                        console.log('Delete images button is clicked');
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  }}
                >
                  Remove existing images
                </button>
              </div>
              <div class="col-6">
                <UploadWidget onImageChange={handleImageChange} />
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
            <button
              type="button"
              id="submit"
              class="btn btn-outline-danger mb-3 w-100"
              onClick={() => {
                window.location.href = `http://localhost:3000/products/admin`;
              }}
            >
              Discard Changes
            </button>
          </div>
        </div>
      </form>
    </div>
    // </>
  );
}
