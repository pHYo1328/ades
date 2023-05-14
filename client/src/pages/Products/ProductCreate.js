import { useState, useEffect } from "react";
import axios from "axios";
import chalk from "chalk";
import UploadWidget from "../../components/cloudinary/UploadWidget";

export default function ProductCreate() {
  const [brands, setBrands] = useState(null);
  const [categories, setCategories] = useState(null);

  const baseUrl = "http://localhost:8081";
  const [product, setProduct] = useState(null);

  const [imagePath, setImagePath] = useState("");

  const handleImageChange = (path) => {
    console.log("Selected image path:", path);
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
    console.log(chalk.yellow("submit button is clicked!"));
    event.preventDefault();

    const requestBody = {
      name: document.getElementById("create-product-name").value,
      description: document.getElementById("create-product-description").value,
      price: document.getElementById("create-product-price").value,
      category_id: document.getElementById("create-product-category").value,
      brand_id: document.getElementById("create-product-brand").value,
      quantity: document.getElementById("create-product-quantity").value,
      image: imagePath,
    };

    console.log("path test");
    console.log(imagePath);

    console.log(requestBody);
    axios
      .post(`${baseUrl}/api/products`, requestBody, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        setProduct(response.data.data);
        console.log(product);
        window.location.reload();
      });
  };
  return (
    // <>
    //   <Helmet>
    //     <script
    //       src="https://widget.cloudinary.com/v2.0/global/all.js"
    //       type="text/javascript"
    //     />
    //   </Helmet>
    <form id="create-product-form" enctype="multipart/form-data">
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">
          Product Name
        </label>
        <input
          type="text"
          class="form-control"
          id="create-product-name"
          placeholder="Product Name"
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
        />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">
          Inventory (Quantity)
        </label>
        <input
          type="number"
          class="form-control"
          id="create-product-quantity"
          placeholder="Inventory (Quantity)"
        />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">
          Category
        </label>
        <select class="form-select" id="create-product-category">
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
        <select class="form-select" id="create-product-brand">
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

        {/* <UploadWidget onImageChange={handleImageChange} /> */}
        <UploadWidget onImageChange={handleImageChange} />
      </div>
      <div class="col-auto">
        <button
          type="submit"
          id="submit"
          class="btn btn-primary mb-3"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </form>
    // </>
  );
}
