import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import chalk from 'chalk';

import Carousel from 'react-bootstrap/Carousel';

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

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const handleImageChange = (path) => {
    console.log('Selected image path:', path);
    setImagePath(path);
  };

  const handleSubmit = async (event) => {
    console.log(chalk.yellow('submit button is clicked!'));
    event.preventDefault();
    if (!imagePath || !productID) {
      window.alert('Please fill in all fields.');
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
          setImage(response.data.data);
          console.log(image);
          window.location.reload();
        });
    }
  };

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
  }, []);

  return (
    <div>
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        style={{ maxWidth: '500px', maxHeight: '200px', margin: '0 auto' }}
      >
        {images ? (
          images.map((image) => (
            <Carousel.Item>
              <div style={{ position: 'relative' }}>
                <Carousel.Caption style={{ top: 0, marginBottom: 0 }}>
                  <button
                    onClick={() => {
                      const imageID = image.image_id;
                      axios
                        .delete(`${baseUrl}/api/products/images/${imageID}`)
                        .then((res) => {
                          const updatedImages = images.filter(
                            (i) => i.image_id !== imageID
                          );
                          setImages(updatedImages);
                        });
                    }}
                  >
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </Carousel.Caption>
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
      <div
        style={{
          width: '200px',
          marginRight: 'auto',
          marginLeft: 'auto',
          marginTop: '100px',
        }}
      >
        <UploadWidget onImageChange={handleImageChange} />
      </div>
      <div class="col-3" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <button
          type="submit"
          id="submit"
          class="btn btn-outline-primary mb-3 mt-4 w-50"
          onClick={handleSubmit}
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        >
          Submit
        </button>
      </div>
      <div class="col-3" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <button
          class="btn btn-outline-primary mb-3 mt-4 w-50"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
          onClick={() => {
            console.log('delete all images for the product')
            console.log(productID)
            axios
              .delete(`${baseUrl}/api/products/${productID}/images`)
              .then((res) => {
                console.log('deleted')
                setImages();
              });
          }}
        >
          Delete All Images
        </button>
      </div>
    </div>
  );
}
