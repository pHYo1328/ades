import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import chalk from 'chalk';
import UploadWidget from '../../../components/cloudinary/UploadWidget';
import Categories from '../../../components/Products/Product/Categories';
import Brands from '../../../components/Products/Product/Brands';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function ProductCreate() {

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const [product, setProduct] = useState(null);

  const [productName, setProductName] = useState(null);
  const [productPrice, setProductPrice] = useState(null);
  const [productDescription, setProductDescription] = useState(null);
  const [productCategory, setProductCategory] = useState(null);
  const [productBrand, setProductBrand] = useState(null);
  const [productQuantity, setProductQuantity] = useState(null);
  const [imagePath, setImagePath] = useState('');

  const [categoryKey, setCategoryKey] = useState(0);
  const [brandKey, setBrandKey] = useState(0);

  const handleImageChange = (path) => {
    console.log('Selected image path:', path);
    setImagePath(path);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem('roles'));
    console.log(roles);
    if (!roles) {
      // User does not have the required role(s), redirect them to the homepage or show an error message
      console.log('Redirecting to login');
      navigate('/login');
    } else {
      const isAdmin = roles.includes('admin');
      console.log(isAdmin);
      if (!isAdmin) {
        // User does not have the required role(s), redirect them to the homepage or show an error message
        // alert("you're not admin");
        console.log('Redirecting to homepage');
        navigate('/homepage');
      }
    }
  }, []);

  // creates a new product when the admin clicks on submit
  const handleSubmit = async (event) => {
    console.log(chalk.yellow('submit button is clicked!'));
    event.preventDefault();

    // validate data
    if (
      !productName ||
      !productDescription ||
      !productBrand ||
      !productCategory ||
      !productPrice ||
      !productQuantity
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
      const requestBody = {
        name: productName,
        description: productDescription,
        price: productPrice,
        category_id: productCategory,
        brand_id: productBrand,
        quantity: productQuantity,
        image: imagePath,
      };
      console.log(requestBody);
      axios
        .post(`${baseUrl}/api/products`, requestBody, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          toast.success(`Product created.`, {
            autoClose: 3000,
            pauseOnHover: true,
            style: { 'font-size': '16px' },
          });
          console.log(response);
          setProduct(response.data.data);
          console.log(product);
          // window.location.reload();
          setProductName('');
          setProductDescription('');
          setProductPrice('');
          setProductQuantity('');
          setProductCategory(null);
          setProductBrand(null);
          setCategoryKey((prevKey) => prevKey + 1);
          setBrandKey((prevKey) => prevKey + 1);
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
          <Categories setCategoryID={setProductCategory} all={false} key={categoryKey} />
        </div>
        <div class="mb-3 col-6">
          <label for="exampleFormControlInput1" class="form-label h6">
            Brand
          </label>
          <Brands setBrandID={setProductBrand} all={false} key={brandKey} />
        </div>
      </div>
      <div class="mb-3">
        <UploadWidget onImageChange={handleImageChange} />
      </div>
      <div class="col-3" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        {/* creates new product when the submit button is clicked */}
        <button
          type="submit"
          id="submit"
          class="btn btn-outline-primary mb-3 w-100"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <ToastContainer
          limit={2}
          newestOnTop={true}
          position="top-center"
        />
      </div>
    </form>
  );
}
