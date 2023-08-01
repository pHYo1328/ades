import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import chalk from 'chalk';
import UploadWidget from '../../../components/cloudinary/UploadWidget';
// import UploadMultiple from '../../cloudinary/UploadMultiple';
// import ImageCarousel from '../../ImageCarousel';
import Categories from '../../../components/Products/Product/Categories';
import Brands from '../../../components/Products/Product/Brands';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';
import NumberInput from '../../../components/NumberInput';
import InputLabel from '../../../components/InputLabel';
import TextArea from '../../../components/TextArea';
import CloudinaryUpload from '../../../components/cloudinary/CloudinaryUpload';
import UploadMultiple from '../../../components/cloudinary/UploadMultiple';
import ImageCarousel from '../../../components/ImageCarousel';

export default function ProductCreate() {
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const [product, setProduct] = useState(null);

  const [productName, setProductName] = useState(null);
  const [productPrice, setProductPrice] = useState(null);
  const [productDescription, setProductDescription] = useState(null);
  const [productCategory, setProductCategory] = useState(null);
  const [productBrand, setProductBrand] = useState(null);
  const [productQuantity, setProductQuantity] = useState(null);

  const [categoryKey, setCategoryKey] = useState(0);
  const [brandKey, setBrandKey] = useState(0);

  const [index, setIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [imagePath, setImagePath] = useState('');
  const [image, setImage] = useState('');
  const [success, setSuccess] = useState(false)

  // const handleImageChange = (path) => {
  //   console.log('Selected image path:', path);
  //   setImagePath(path);
  //   console.log('Selected image path after setting:', path);
  // };

  const handleImageChange = (path) => {
    console.log('Selected image path:', path);
    setImagePath(path);
    console.log('path[0]: ', path[0]);
    for (let i = 0; i < path.length; i++) {
      setImages((prevImages) => [...prevImages, { image_id: i, image_url: path[i] }]);
    }
    // console.log('images: ', images);
    console.log('Selected image path after setting:', path);
  };


  // const handleImageChange = async (resultInfo) => {
  //   setUpdateImage(resultInfo.public_id);
  //   try {
  //     const response = await axiosPrivateCustomer.put(
  //       `/customer/profile/edit/photo/${customer_id}`,
  //       {
  //         image_url: resultInfo.public_id,
  //       }
  //     );
  //     if (response.status === 200) {
  //       console.log(response);
  //       // getAll();
  //     }
  //   } catch (error) {
  //     console.error(error);

  //   }
  // };

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
          setSuccess(true);
          setProductName('');
          setProductDescription('');
          setProductPrice('');
          setProductQuantity('');
          setProductCategory(null);
          setProductBrand(null);
          setImagePath(null);
          setCategoryKey((prevKey) => prevKey + 1);
          setBrandKey((prevKey) => prevKey + 1);
          setImages([]);
          setImagePath(null);
        });
    }
  };

  const deleteImage = (imageID) => {
    if (images.length > 1) {
      // Delete the image at the index by using imageID
      // const imageID = image.image_id;
      console.log("imageID", imageID);
      if (imageID !== 0) {
        console.log("imageID", imageID);
        if (!deletedImages.includes(imageID)) {
          setDeletedImages([...deletedImages, imageID]);
        }
        // setIndex(0);
      } else {
        console.log("imageID", imageID);
        images.splice(imageID, 1);
        console.log("splice", images.splice(imageID, 1));
        // setIndex(0);
      }


      console.log("deletedImage", deletedImages);

      for (let image = 0; image < images.length; image++) {
        for (let i = 0; i < deletedImages.length; i++) {
          if (images[image].image_id === deletedImages[i]) {
            images.splice(image, 1);
          }
        }
      }

      console.log("index", index);
      setIndex(0);
      setImages([...images]);
      console.log("images", images);
    } else {
      // Show an alert when trying to delete the only image
      toast.error(`Each product should have at least one image.`, {
        autoClose: 3000,
        pauseOnHover: true,
        style: { fontSize: '16px' },
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
          <div className="mt-3 w-200 h-300 mx-auto">
            <ImageCarousel images={images} deleteImage={deleteImage} setIndex={setIndex} index={index} />
          </div>
          <div className="mb-3">
            <InputLabel content="Product Name" />
            <TextInput
              placeholder={'Product Name'}
              value={productName}
              func={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <InputLabel content="Description" />
            <TextArea
              rows={3}
              placeholder={'Description'}
              value={productDescription}
              func={(e) => setProductDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-3">
              <InputLabel content="Price" />
              <NumberInput
                min={0}
                placeholder={'Price'}
                value={productPrice}
                func={(e) => setProductPrice(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <InputLabel content="Inventory" />
              <NumberInput
                min={0}
                placeholder={'Inventory (Quantity)'}
                value={productQuantity}
                func={(e) => setProductQuantity(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-3">
              <InputLabel content="Category" />
              <Categories
                setCategoryID={setProductCategory}
                all={false}
                key={categoryKey}
              />
            </div>
            <div className="mb-3">
              <InputLabel content="Brand" />
              <Brands setBrandID={setProductBrand} all={false} key={brandKey} />
            </div>
          </div>

          {/* <div className="flex justify-between mt-4 space-x-4">
            <div className="mb-3 w-6/12"> */}
          <UploadMultiple length={images.length} onImageChange={handleImageChange} success={success} />
          {/* </div> */}

          {/* </div> */}

          <div className="w-12/12 flex justify-center">

            <div className="mb-3 w-6/12">
              <Button onClick={handleSubmit} content={"Submit"} />
            </div>
          </div>

          <ToastContainer limit={2} newestOnTop={true} position="top-center" />
        </form>
      </div >
    </div >

  );
}
