import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import React from 'react';

import axios from 'axios';
import chalk from 'chalk';
import UploadWidget from '../../../components/cloudinary/UploadWidget';
import EditImage from '../../../components/Products/EditProduct/EditImage';
import ProductEditForm from '../../../components/Products/EditProduct/ProductEditForm';
import { edit } from '@cloudinary/url-gen/actions/animated';
export default function ProductEdit() {
    const { productID } = useParams();
    const [brands, setBrands] = useState(null);
    const [categories, setCategories] = useState(null);

    const [submitClicked, setSubmitClicked] = useState(false);
    const [deleteImageClicked, setDeleteImageClicked] = useState(false);
    const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
    const [product, setProduct] = useState(null);

    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productBrand, setProductBrand] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [imagePath, setImagePath] = useState('');


    const [editImage, setEditImage] = useState(false)


    const handleImageChange = (path) => {
        console.log('Selected image path:', path);
        setImagePath(path);
    };


    const fetchProducts = () => {
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
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (product && !submitClicked) {
            setProductName(product.product_name);
            setProductPrice(product.price);
            setProductDescription(product.description);
            setProductCategory(product.category_id);
            setProductBrand(product.brand_id);
            setProductQuantity(product.quantity);
        }
    }, [product]);

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
        setSubmitClicked(true);
        event.preventDefault();

        console.log(chalk.yellow('submit button is clicked!'));
        // submitClicked=true;

        console.log("image path before requestBody", imagePath)

        console.log("product.image_url: ", product.image_url);
        console.log("product.image_url length: ", product.image_url.length);

        if (product.image_url.length > 0) {
            setImagePath(`, ${imagePath}`);
            console.log("image path after comma", imagePath);
        }

        const requestBody = {
            product_name: productName,
            description: productDescription,
            price: productPrice,
            category_id: productCategory,
            brand_id: productBrand,
            quantity: productQuantity,
            image_url: imagePath,
        };

        console.log(requestBody)

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
                setSubmitClicked(false);
                fetchProducts();
            });
    };


    const handleDeleteImage = async (event) => {
        event.preventDefault();

        axios
            .put(`${baseUrl}/api/products/${productID}/images`)
            .then((response) => {
                console.log('Delete images button is clicked');
                fetchProducts();
            })
            .catch((error) => {
                console.error(error);
            });

        setDeleteImageClicked(true);
    };

    useEffect(() => {
        if (deleteImageClicked) {
            const deleteImageBtn = document.getElementById('delete-image-btn');
            if (deleteImageBtn) {
                deleteImageBtn.removeEventListener('click', handleDeleteImage);
            }
        }
    }, [deleteImageClicked]);


    return (

        <div>
            {/* <form
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
            id="delete-image-btn"
            class="btn btn-outline-danger w-100"
            onClick={handleDeleteImage}
            disabled={deleteImageClicked}
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
      </form> */}

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
