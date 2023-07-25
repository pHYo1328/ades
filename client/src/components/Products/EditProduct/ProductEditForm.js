import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import React from 'react';
import axios from 'axios';
import chalk from 'chalk';
import Categories from '../Product/Categories';
import Brands from '../Product/Brands';
import Loading from '../../Loading/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';
import NumberInput from '../../../components/NumberInput';
import InputLabel from '../../../components/InputLabel';
import TextArea from '../../../components/TextArea';
import UploadMultiple from '../../cloudinary/UploadMultiple';
import ImageCarousel from '../../ImageCarousel';
import DeleteModal from '../../modal/DeleteModal';

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

  const [index, setIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [imagePath, setImagePath] = useState('');
  const [image, setImage] = useState('');
  const [success, setSuccess] = useState(false)

  const [imageID, setImageID] = useState(0);
  const [deletedImages, setDeletedImages] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        setProductBrand(response.data.data.brand_id);
        setProductCategory(response.data.data.category_id);
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


  // sets the image path when the user uploads an image
  const handleImageChange = (path) => {
    console.log('Selected image path:', path);
    setImagePath(path);
    console.log('path[0]: ', path[0]);
    for (let i = 0; i < path.length; i++) {
      setImages((prevImages) => [...prevImages, { product_id: parseInt(productID), image_id: i, image_url: path[i] }]);
    }
    // console.log('images: ', images);
    console.log('Selected image path after setting:', path);
  };

  useEffect(() => {
    console.log('images: ', images);
  }, [images]);

  // gets all the images of the product
  const getImages = () => {
    axios
      .get(`${baseUrl}/api/products/${productID}/images`)
      .then((response) => {
        console.log(response);
        setImages(response.data.data);
        console.log(images);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getImages();
  }, []);

  const deleteAllImages = () => {
    console.log('delete all images for the product');
    console.log(productID);
    axios
      .delete(`${baseUrl}/api/products/${productID}/images`)
      .then((res) => {
        console.log('deleted');
        toast.success(`Images deleted.`, {
          autoClose: 3000,
          pauseOnHover: true,
          style: { fontSize: '16px' },
        });
        getImages();
        setIndex(0);
      });
  }

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


  const handleSubmit = (event) => {
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

    const imageRequestBody = {
      product_id: productID,
      image_url: imagePath,
    };

    console.log(requestBody);
    console.log(imageRequestBody);

    if (
      !productName ||
      !productDescription ||
      isNaN(productQuantity) ||
      isNaN(productPrice) ||
      productQuantity < 0 ||
      productPrice <= 0
    ) {
      toast.error(`Please fill in all the fields with valid values.`, {
        autoClose: 3000,
        pauseOnHover: true,
        style: { 'font-size': '16px' },
      });
    } else if (!images || !productID) {
      toast.error(`Please fill in all the fields.`, {
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
        })
        .catch((error) => {
          console.error(error);
        });

      axios
        .post(`${baseUrl}/api/products/images`, imageRequestBody, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response);
          toast.success(`Image updated.`, {
            autoClose: 3000,
            pauseOnHover: true,
            style: { 'font-size': '16px' },
          });
          setImage(response.data.data);
          console.log(image);
          getImages();
        })
        .catch((error) => {
          console.error(error);
        });

      for (let image = 0; image < deletedImages.length; image++) {
        // let imageID = image.image_id;
        console.log("imageID", deletedImages[image])
        axios
          .delete(`${baseUrl}/api/products/images/${deletedImages[image]}`)
          .then((res) => {
            // const updatedImages = images.filter(
            //   (i) => i.image_id !== image.image_id
            // );
            toast.success(`Image deleted.`, {
              autoClose: 3000,
              pauseOnHover: true,
              style: { fontSize: '16px' },
            });
            setImages(images);
            setIndex(0);
          });
      }

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
          <div className="mt-3 w-200 h-300 mx-auto">
            <ImageCarousel images={images} deleteImage={deleteImage} setIndex={setIndex} index={index} />
          </div>

          <div className="flex justify-between mt-4 space-x-4">
            <div className="mb-3 w-6/12">
              {/* <UploadWidget onImageChange={handleImageChange} /> */}
              <UploadMultiple length={images.length} onImageChange={handleImageChange} success={success} />

            </div>
            <div className="mb-3 w-6/12">
              {/* <Button onClick={deleteAllImages} content={"Delete All Images"} /> */}
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  setShowDeleteModal(true);
                  console.log(showDeleteModal); // Note: This log will not show the updated state value immediately due to the asynchronous nature of state updates
                }}
                content={"Delete All Images"}
              />
              {showDeleteModal && (
                <DeleteModal
                  onCancel={() => {
                    setShowDeleteModal(false);
                    console.log("cancel button is clicked");
                  }}
                  onDelete={() => {
                    console.log("delete button is clicked");
                    setShowDeleteModal(false); // Close the modal
                    deleteAllImages();
                  }}
                />
              )}
            </div>
          </div>

          <div className="mb-3">
            <InputLabel content="Product Name" />
            <TextInput
              placeholder={'Product Name'}
              value={productName}
              func={(e) => setProductName(e.target.value)}
              defaultValue={productData.product_name}
            />
          </div>

          <div className="mb-3">
            <InputLabel content="Description" />
            <TextArea
              rows={3}
              placeholder={'Description'}
              value={productDescription}
              func={(e) => setProductDescription(e.target.value)}
              defaultValue={productData.description}
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
                defaultValue={productData.price}
              />
            </div>
            <div className="mb-3">
              <InputLabel content="Inventory" />
              <NumberInput
                min={0}
                placeholder={'Inventory (Quantity)'}
                value={productQuantity}
                func={(e) => setProductQuantity(e.target.value)}
                defaultValue={productData.quantity}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-3">
              <InputLabel content="Category" />
              <Categories
                setCategoryID={setProductCategory}
                all={false}
                edit={true}
                productData={productData}
              />
            </div>
            <div className="mb-3">
              <InputLabel content="Brand" />
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
          <Button onClick={handleSubmit} content={'Submit'} />
        </div>
        <div className="mb-3 w-6/12">
          <Button onClick={(event) => {
            event.preventDefault();
            getProducts();
            getImages();
          }} content={"Discard Changes"} />
        </div>
      </div>

      <ToastContainer limit={2} newestOnTop={true} position="top-center" />
    </form>
  );
}
