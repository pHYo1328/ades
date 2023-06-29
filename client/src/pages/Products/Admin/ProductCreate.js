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
    <div className="bg-white w-full">
      <div className="bg-white w-11/12 mx-auto">
        <form
          id="create-product-form"
          className="sm:w-11/12 md:w-10/12 lg:w-8/12 mt-5 mx-auto bg-peach p-5 rounded-md mb-5"
          encType="multipart/form-data"
        >
          <h3 className="text-center text-2xl font-bold mb-6">CREATE PRODUCT</h3>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="block text-base font-semibold mb-1">
              Product Name
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-md py-2 px-3 w-full text-sm"
              placeholder="Product Name"
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
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="block text-base font-semibold mb-1 text-sm">
                Price
              </label>
              <input
                type="number"
                min="0"
                className="border border-gray-300 rounded-md py-2 px-3 w-full text-sm"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="Price"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="block text-base font-semibold mb-1 ">
                Inventory
              </label>
              <input
                min="0"
                type="number"
                className="border border-gray-300 rounded-md py-2 px-3 w-full text-sm"
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
                placeholder="Inventory (Quantity)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="block text-base font-semibold mb-1">
                Category
              </label>
              <Categories setCategoryID={setProductCategory} all={false} key={categoryKey} />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="block text-base font-semibold mb-1">
                Brand
              </label>
              <Brands setBrandID={setProductBrand} all={false} key={brandKey} />
            </div>
          </div>

          <div className="flex justify-between mt-4 space-x-4">
            <div className="mb-3 w-6/12">
              <UploadWidget onImageChange={handleImageChange} />
            </div>
            <div className="mb-3 w-6/12">
              <button
                type="submit"
                id="submit"
                className="bg-dark-blue hover:bg-light-blue text-white font-bold py-2 px-4 rounded-md w-full text-sm h-100"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>

          <ToastContainer
            limit={2}
            newestOnTop={true}
            position="top-center"
          />
        </form>
      </div>
    </div>

  );
}
