import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import api from '../../../index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FadeLoader } from 'react-spinners';
const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [ratings, setRatings] = useState(null);
  let [cartQuantity, setCartQuantity] = useState(0);
  const { productID } = useParams();
  const customerId = localStorage.getItem('userid');
  const addToCartHandler = async (userid, productId, productName, quantity) => {
    // first i want to use useContext hook but i dont know why everytime context got re rendered. If i can find the problem i will change it back
    if (quantity === 0) {
      toast.error('Please select quantity', {
        autoClose: 3000,
        pauseOnHover: true,
        style: { 'font-size': '16px' },
      });
    } else {
      const cartData = await api.get(`/api/cart/${userid}`);

      console.log(cartData.data.data);
      let updatedCartData = [...cartData.data.data];

      const productIndex = updatedCartData.findIndex(
        (item) => item.productId == productId
      );

      if (productIndex !== -1) {
        updatedCartData[productIndex].quantity += quantity;
      } else {
        updatedCartData.push({ productId: productId, quantity: quantity });
      }

      // Update the cartData for the given userId
      const updatedResponse = await api.post(`/api/cart/${userid}`, {
        cartData: updatedCartData,
      });
      console.log(updatedResponse);
      toast.success(`${productName} added to cart`, {
        autoClose: 3000,
        pauseOnHover: true,
        style: { 'font-size': '16px' },
      });
    }
  };

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/product/${productID}`)
      .then((response) => {
        console.log(response);
        setProduct(response.data.data);
        console.log(product);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/products/rating/${productID}`)
      .then((response) => {
        console.log(response);
        setRatings(response.data.data);
        console.log(ratings);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div
      className="bg-white h-screen w-screen"
      style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}
    >
      <div className="pt-6">
        {product ? (
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
            {product.image_url.map((url, index) => (
              <AdvancedImage key={index} cldImg={cld.image(url)} />
            ))}

            <div className="text-left lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8 pt-5">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mr-4">
                  {product.product_name}
                </h1>
                <p className="text-3xl tracking-tight text-gray-900">
                  <i className="bi bi-tags-fill"></i> ${product.price}
                </p>
              </div>

              <div>
                <div class="flex items-center mt-4">
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <title>Rating star</title>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <p class="ml-2 text-sm font-bold text-gray-900 dark:text-black">
                    {product.average_rating}
                  </p>
                  <span class="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                  <p class="text-sm font-medium text-gray-900 dark:text-black">
                    {product.rating_count} reviews
                  </p>
                </div>
              </div>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              <div>
                <h4 class="h4 font-weight-bold">Description</h4>
                <div className="space-y-6 ml-5">
                  <ul className="list-disc list-inside ml-3">
                    {product.description.split('\n').map((line, index) => (
                      <li
                        key={index}
                        className="text-base text-gray-900"
                        style={{ textAlign: 'justify' }}
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-2 lg:row-span-3 lg:mt-0">
              <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <div
                  class="row col-4"
                  style={{ marginLeft: 'auto', marginRight: 'auto' }}
                >
                  <button
                    class="col-4"
                    id="minusButton"
                    style={{ marginLeft: 'auto', marginRight: 'auto' }}
                    onClick={() => {
                      if (product.quantity >= 1 && cartQuantity >= 1) {
                        setCartQuantity((cartQuantity -= 1));
                      }
                    }}
                  >
                    <i class="bi bi-dash-circle"></i>
                  </button>
                  <p class="col-4 text-center">{cartQuantity}</p>
                  <button
                    class="col-4"
                    style={{ marginLeft: 'auto', marginRight: 'auto' }}
                    id="plusButton"
                    onClick={() => {
                      if (product.quantity > cartQuantity) {
                        setCartQuantity((cartQuantity += 1));
                      }
                    }}
                  >
                    <i class="bi bi-plus-circle"></i>
                  </button>
                </div>
              </div>
              {product.quantity <= 0 ? (
                <p className="text-red-800 text-base text-center">
                  No stock available
                </p>
              ) : (
                <p className="text-emerald-800 text-base text-center">
                  Stock in
                </p>
              )}
              <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <button
                  disabled={product.quantity <= 0}
                  onClick={() => {
                    addToCartHandler(
                      customerId,
                      productID,
                      product.product_name,
                      cartQuantity
                    );
                  }}
                  className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add to cart
                </button>
                <ToastContainer
                  limit={2}
                  newestOnTop={true}
                  position="top-center"
                />
              </div>

              <div class="row mt-4">
                <div
                  class="col-12"
                  style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    height: '300px',
                    overflowY: 'scroll',
                    background: '#c2d9ff',
                  }}
                >
                  <div class="row">
                    <div class="col-12 text-center h6 mt-3 mb-3">Reviews</div>
                  </div>

                  <ul role="list" class="divide-y divide-gray-100">
                    {ratings ? (
                      ratings.map((rating) => (
                        <div class="d-flex flex-row row py-3 justify-content-around">
                          <div class="col-2">
                            <i class="bi bi-person-circle"></i>
                          </div>
                          <div class="col-10">
                            <p class="text-sm font-semibold text-gray-900">
                              {rating.comment}
                            </p>
                          </div>
                        </div>
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
                  </ul>
                </div>
              </div>
            </div>
          </div>
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
      </div>
    </div>
  );
}
