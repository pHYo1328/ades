import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import chalk from 'chalk';

import Carousel from 'react-bootstrap/Carousel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';

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
          window.location.reload();
        });
    }
  };

  // gets all the images of the product
  useEffect(() => {
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
  }, [images]);

  return (
    <div>
      <div
        class="row"
        style={{ width: '400px', margin: 'auto', marginTop: '50px' }}
      >
        <div class="col-6">
          <div style={{ width: '200px', margin: 'auto' }}>
            <UploadWidget onImageChange={handleImageChange} />
          </div>
        </div>
        <div class="col-6 d-flex align-items-center">
          <div style={{ margin: 'auto', width: '200px' }}>
            <button
              type="submit"
              id="submit"
              class="btn btn-outline-primary ml-4 h-100 w-100"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <div
        style={{ marginLeft: 'auto', marginRight: 'auto', width: '500px' }}
        className="text-center"
      >
        <button
          class="btn btn-outline-primary mb-3 mt-4 w-50"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
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
                  style: { 'font-size': '16px' },
                });
                setImages();
              });
          }}
        >
          Delete All Images
        </button>
      </div>

      <ToastContainer
        limit={2}
        newestOnTop={true}
        position="top-center"
      />

      <div
        style={{
          width: '400px',
          height: '400px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        class="mt-3"
      >
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          style={{ maxWidth: '100%', maxHeight: '200px', margin: '0 auto' }}
        >
          {/* shows all the images if exists */}
          {images ? (
            images.map((image) => (
              <Carousel.Item>
                <div style={{ position: 'relative' }}>
                  <Carousel.Caption style={{ top: 0, marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                                  style: { 'font-size': '16px' },
                                });
                                setImages(updatedImages);
                              });
                          } else {
                            // Show an alert when trying to delete the only image
                            toast.error(`Each product should have at least one image.`, {
                              autoClose: 3000,
                              pauseOnHover: true,
                              style: { 'font-size': '16px' },
                            });
                          }
                        }}
                        style={{
                          borderRadius: '50%',
                          backgroundColor: 'black',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <i
                          class="bi bi-trash-fill"
                          style={{ color: 'white' }}
                        ></i>
                      </button>
                    </div>
                  </Carousel.Caption>
                  {/* shows the image from Cloudinary */}
                  <AdvancedImage cldImg={cld.image(image.image_url)} />
                </div>
              </Carousel.Item>
            ))
          ) : (
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
          )}
        </Carousel>
      </div>
    </div>
  );
}
