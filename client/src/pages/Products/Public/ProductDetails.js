import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CartContext from '../../../context/CartContext';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import api from '../../../index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [ratings, setRatings] = useState(null);
  const { cartData, setCartData, addToCart } = useContext(CartContext);
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
    <div className="bg-white h-screen w-screen">
      <div className="pt-6">
        {product ? (
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
            {product.image_url.map((url, index) => (
              <AdvancedImage key={index} cldImg={cld.image(url)} />
            ))}

            <div className="text-left lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {product.product_name}
              </h1>
            </div>

            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                ${product.price}
              </p>

              <button
                data-modal-target="staticModal"
                data-modal-toggle="staticModal"
                class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
              >
                <div class="flex items-center">
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
              </button>

              <div
                id="staticModal"
                data-modal-backdrop="static"
                tabindex="-1"
                aria-hidden="true"
                class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
              >
                <div class="relative w-full max-w-2xl max-h-full">
                  <div class="relative bg-white rounded-lg shadow">
                    <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        Reviews
                      </h3>
                      <button
                        type="button"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-hide="staticModal"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                    <div class="p-6 space-y-6">
                      {ratings ? (
                        ratings.map((rating) => (
                          <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            {rating.comment}
                          </p>
                        ))
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                    <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                      <button
                        data-modal-hide="staticModal"
                        type="button"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p>Inventory: {product.quantity}</p>
              <div class="col-6">
                <button
                  id="plusButton"
                  onClick={() => {
                    if (product.quantity > cartQuantity) {
                      setCartQuantity((cartQuantity += 1));
                    }
                  }}
                >
                  <i class="bi bi-plus-circle"></i>
                </button>
                <p>{cartQuantity}</p>
                <button
                  id="minusButton"
                  onClick={() => {
                    if (product.quantity >= 1) {
                      setCartQuantity((cartQuantity -= 1));
                    }
                  }}
                >
                  <i class="bi bi-dash-circle"></i>
                </button>
              </div>
              {product.quantity <= 0 ? (
                <p className="text-red-800 text-base">No stock available</p>
              ) : (
                <p className="text-emerald-800 text-base">Stock in</p>
              )}
              <div>
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
                <ToastContainer limit={2} newestOnTop={true} position='top-center' />
              </div>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              <div>
                <h3 className="sr-only">Description</h3>
                <div className="space-y-6 text-left">
                  <p className="text-base text-gray-900">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
