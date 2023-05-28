import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import chalk from 'chalk';
import UploadWidget from '../../../components/cloudinary/UploadWidget';
import { FadeLoader } from 'react-spinners';

export default function ProductCreate() {
  const [brands, setBrands] = useState(null);
  const [categories, setCategories] = useState(null);

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const [product, setProduct] = useState(null);

  const [productName, setProductName] = useState(null);
  const [productPrice, setProductPrice] = useState(null);
  const [productDescription, setProductDescription] = useState(null);
  const [productCategory, setProductCategory] = useState(null);
  const [productBrand, setProductBrand] = useState(null);
  const [productQuantity, setProductQuantity] = useState(null);
  const [imagePath, setImagePath] = useState('');

  const handleImageChange = (path) => {
    console.log('Selected image path:', path);
    setImagePath(path);
  };
  
  const navigate = useNavigate();

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
      const roles = JSON.parse(localStorage.getItem('roles'));
      console.log(roles);
      const isAdmin = roles.includes('admin');
      console.log(isAdmin);
      if (!isAdmin) {
        // User does not have the required role(s), redirect them to the homepage or show an error message
        alert("you're not admin");
        console.log('Redirecting to homepage-admin');
        navigate('/homepage-admin');
      }
    }, []);
  
  

  const handleSubmit = async (event) => {
    console.log(chalk.yellow('submit button is clicked!'));
    event.preventDefault();

    if (
      !productName ||
      !productDescription ||
      !productBrand ||
      !productCategory ||
      !productPrice ||
      !productQuantity
    ) {
      window.alert('Please fill in all fields.');
    } else if (isNaN(productQuantity) || productQuantity < 0) {
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
        image: imagePath,
      };

      console.log('path test');
      console.log(imagePath);

      console.log(requestBody);
      axios
        .post(`${baseUrl}/api/products`, requestBody, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response);
          setProduct(response.data.data);
          console.log(product);
          window.location.reload();
        });
    }
  };

  return (
    <form
      id="create-product-form"
      class="w-50 mt-5"
      style={{ marginLeft: 'auto', marginRight: 'auto' }}
      enctype="multipart/form-data"
    >
      <h3 class="h3 text-center">CREATE PRODUCT</h3>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label h6">
          Product Name
        </label>
        <input
          type="text"
          class="form-control form-control-sm"
          placeholder="Product Name"
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
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
      </div>
      <div class="row">
        <div class="mb-3 col-6">
          <label for="exampleFormControlInput1" class="form-label h6">
            Price
          </label>
          <input
            type="number"
            min="0"
            class="form-control form-control-sm"
            value={productPrice}
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
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            placeholder="Inventory (Quantity)"
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
        <div class="mb-3 col-6">
          <label for="exampleFormControlInput1" class="form-label h6">
            Brand
          </label>
          <select
            class="form-select form-select-sm"
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
      <div class="mb-3">
        <UploadWidget onImageChange={handleImageChange} />
      </div>
      <div class="col-3" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <button
          type="submit"
          id="submit"
          class="btn btn-outline-primary mb-3 w-100"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </form>
    // </>
  );
}
