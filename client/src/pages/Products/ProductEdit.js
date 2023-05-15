import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { useNavigate } from "react-router-dom";
import axios from 'axios';
import chalk from 'chalk';

export default function ProductEdit() {
  const [brands, setBrands] = useState(null);
  const [categories, setCategories] = useState(null);
  const [oldProduct, setOldProduct] = useState(null);

  const baseUrl = 'http://localhost:8081';
  const { productID } = useParams();
  const [product, setProduct] = useState(null);

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

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/product/${productID}`)
      .then((response) => {
        console.log(productID);
        console.log(response);
        setOldProduct(response.data.data);
        console.log(oldProduct);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSubmit = async (event) => {
    console.log(chalk.yellow('submit button is clicked!'));
    event.preventDefault();

    const requestBody = {
      name: document.getElementById('create-product-name').value,
      description: document.getElementById('create-product-description').value,
      price: document.getElementById('create-product-price').value,
      category_id: document.getElementById('create-product-category').value,
      brand_id: document.getElementById('create-product-brand').value,
      image: document.getElementById('create-product-image').files[0],
    };

    // console.log(requestBody.image);
    // console.log(URL.createObjectURL(requestBody.image));

    // const imageFile = document.getElementById("create-product-image").files[0];

    axios.post(`${baseUrl}/api/products`, requestBody).then((response) => {
      console.log(response);
      setProduct(response.data.data);
      console.log(product);
    });
  };
  return (
    <form id="create-product-form" onSubmit={handleSubmit}>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">
          Product Name
        </label>
        <input
          type="text"
          class="form-control"
          id="create-product-name"
          placeholder="Product Name"
          value={oldProduct.product_name}
        />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">
          Price
        </label>
        <input
          type="number"
          class="form-control"
          id="create-product-price"
          placeholder="Price"
          value={oldProduct.price}
        />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">
          Description
        </label>
        <input
          type="text"
          class="form-control"
          id="create-product-description"
          placeholder="Description"
          value={oldProduct.description}
        />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">
          Category
        </label>
        <select
          class="form-select"
          id="create-product-category"
          value={oldProduct.category_id}
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
            <p>Loading...</p>
          )}
        </select>
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">
          Brand
        </label>
        <select
          class="form-select"
          id="create-product-brand"
          value={oldProduct.brand_id}
        >
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
      <div class="mb-3">
        <label for="formFile" class="form-label">
          Image
        </label>
        <input class="form-control" type="file" id="create-product-image" />
      </div>
      <div class="col-auto">
        <button type="submit" id="submit" class="btn btn-primary mb-3">
          Submit
        </button>
      </div>
    </form>
  );
}
