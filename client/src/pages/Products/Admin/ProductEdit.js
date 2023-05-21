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
  const [product, setProduct] = useState();

  const [productName, setProductName] = useState();
  const [productPrice, setProductPrice] = useState();
  const [productDescription, setProductDescription] = useState();
  const [productCategory, setProductCategory] = useState();
  const [productBrand, setProductBrand] = useState()
  const [productQuantity, setProductQuantity] = useState();
  const [imagePath, setImagePath] = useState('');

  const fetchProducts = () => {
    axios
      .get(`${baseUrl}/api/product/${productID}`)
      .then((response) => {
        console.log(response);
        setProduct(response.data.data);
        console.log(product);
        setProductName(product.name);
        setProductPrice(product.price);
        setProductDescription(product.description);
        setProductCategory(product.category);
        setProductBrand(product.brand);
        setProductQuantity(product.quantity);
        setImagePath(product.imagePath);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchProducts();
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
    if (isNaN((productQuantity)) || productQuantity < 0) {
      window.alert('Inventory must be a value not less than 0.');
    } else if (isNaN(parseFloat(productPrice)) || parseFloat(productPrice) <= 0) {
      window.alert('Price must be a value not less than or equal to 0.');
    }
    else {
      const requestBody = {
        product_name: productName,
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
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response);
          setProduct(response.data.data);
          console.log(product);
          fetchProducts();
        });
    }
  };

  const handleDeleteImage = async (event) => {
    event.preventDefault();
    axios
      .put(`${baseUrl}/api/products/${productID}/images`)
      .then((response) => {
        console.log('Delete images button is clicked');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (

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
                defaultValue={product.product_name}
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
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
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
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
                  defaultValue={productPrice}
                  value={product.price}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="Price"
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
                  defaultValue={productQuantity}
                  value={product.quantity}
                  onChange={(e) => setProductQuantity(e.target.value)}

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
                  onClick={handleDeleteImage}
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
  );
}
