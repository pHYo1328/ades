import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import chalk from 'chalk';

import Carousel from 'react-bootstrap/Carousel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import Loading from '../../Loading/Loading';

import { FadeLoader } from 'react-spinners';

import UploadWidget from '../../../components/cloudinary/UploadWidget';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

export default function EditImage() {
  const [index, setIndex] = useState(0);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const { productID } = useParams();
  const [images, setImages] = useState();
  const [imagePath, setImagePath] = useState('');
  const [image, setImage] = useState('');

  // changes the index of carousel
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  // sets the image path when the user uploads an image
  const handleImageChange = (path) => {
    console.log('Selected image path:', path);
    setImagePath(path);
  };

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

  // updates the images when the user clicks on submit
  const handleSubmit = async (event) => {
    console.log(chalk.yellow('submit button is clicked!'));
    event.preventDefault();
    if (!imagePath || !productID) {
      toast.error(`Please fill in all the fields.`, {
        autoClose: 3000,
        pauseOnHover: true,
        style: { 'font-size': '16px' },
      });
    } else {
      const requestBody = {
        product_id: productID,
        image_url: imagePath,
      };

      console.log('path test');
      console.log(imagePath);

      console.log(requestBody);
      axios
        .post(`${baseUrl}/api/products/images`, requestBody, {
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
          // window.location.reload();
        });
    }
  };



  return (
    <div>
      <div className="flex justify-between mt-4 space-x-4">
        <div className="mb-3 w-6/12">
          <UploadWidget onImageChange={handleImageChange} />
        </div>
        <div className="mb-3 w-6/12">
          <button
            type="submit"
            id="submit"
            className="bg-dark-blue hover:bg-light-blue text-white font-bold py-2 px-4 rounded-md w-full text-sm h-full"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>

      <div className="mt-3 w-200 h-300 mx-auto">
        <div className="mx-auto lg:w-6/12 md:w-9/12 sm:w-11/12 mb-4">
          <button
            className="bg-dark-blue hover:bg-light-blue text-white font-bold py-2 px-4 rounded-md w-full text-sm mt-4"
            onClick={() => {
              // delete all images of the product
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
            }}
          >
            Delete All Images
          </button>
        </div>

        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          className="max-w-full max-h-64 mx-auto"
        >
          {/* shows all the images if exists */}
          {images ? (
            images.map((image) => (
              <Carousel.Item>
                <Carousel.Caption style={{ top: 0, marginBottom: 0 }}>
                  <div className="flex justify-center">
                    <button
                      // disabled={images.length <= 1} 
                      onClick={() => {
                        if (images.length > 1) {
                          // Delete the image at the index by using imageID
                          const imageID = image.image_id;
                          axios
                            .delete(`${baseUrl}/api/products/images/${imageID}`)
                            .then((res) => {
                              const updatedImages = images.filter(
                                (i) => i.image_id !== imageID
                              );
                              toast.success(`Image deleted.`, {
                                autoClose: 3000,
                                pauseOnHover: true,
                                style: { fontSize: '16px' },
                              });
                              setImages(updatedImages);
                              setIndex(0);
                            });
                        } else {
                          // Show an alert when trying to delete the only image
                          toast.error(`Each product should have at least one image.`, {
                            autoClose: 3000,
                            pauseOnHover: true,
                            style: { fontSize: '16px' },
                          });
                        }
                      }}
                      className="rounded-full bg-black w-8 h-8 flex items-center justify-center border-none cursor-pointer"
                    >
                      <i className="bi bi-trash-fill text-white"></i>
                    </button>
                  </div>
                </Carousel.Caption>
                {/* shows the image from Cloudinary */}
                <AdvancedImage
                  cldImg={cld.image(image.image_url)}
                  className="w-64 h-64 mx-auto"
                />
              </Carousel.Item>
            ))
          ) : (
            // Loading component (full screen)
            <div className="flex items-center justify-center h-screen">
              <Loading />
            </div>
          )}
        </Carousel>
      </div>

      <ToastContainer limit={2} newestOnTop={true} position="top-center" />
    </div>

  );
}
