import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import api from '../../../index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Carousel from 'react-bootstrap/Carousel';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading/Loading';
import Rating from '../../../components/Products/Product/Rating';
import ProductDescription from '../../../components/Products/Product/ProductDescription';
import AverageRating from '../../../components/Products/Product/AverageRating';
import Product from '../../../components/Products/Product/Product';

const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [hasRelatedProducts, setHasRelatedProducts] = useState(false);
  const [categoryID, setCategoryID] = useState(null);
  const [brandID, setBrandID] = useState(null);
  let [cartQuantity, setCartQuantity] = useState(0);
  const { productID } = useParams();
  const navigate = useNavigate();
  const customerId = localStorage.getItem('userid');

  const [index, setIndex] = useState(0);
  const [images, setImages] = useState();
  const [image, setImage] = useState('');

  // changes the index of carousel
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };


  const addToCartHandler = async (userid, productId, productName, quantity) => {
    // first i want to use useContext hook but i dont know why everytime context got re rendered. If i can find the problem i will change it back
    if (!customerId) {
      navigate('/login');
    } else if (quantity === 0) {
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

  // get the details + images of the product by product ID
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/product/${productID}`)
      .then((response) => {
        console.log(response);
        setProduct(response.data.data);
        setBrandID(response.data.data.brand_id);
        setCategoryID(response.data.data.category_id);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // get related products
  useEffect(() => {
    if (categoryID && brandID) {
      axios
        .get(`${baseUrl}/api/products/related/${categoryID}/${brandID}`)
        .then((response) => {
          console.log(response);
          setHasRelatedProducts(true);
          setRelatedProducts(response.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [categoryID, brandID]);

  return (
    <div className="bg-white w-full">
      <div className="bg-white w-11/12 mx-auto">
        <div className="pt-6">
          {/* shows the details of the product, if the product exists */}
          {product ? (
            <div>
              <div className="mx-auto px-4 pb-16 pt-10 sm:px-6 md:px-8 md:pb-24 md:pt-16 lg:px-8 lg:pb-24 lg:pt-16">

                <div className="w-full flex justify-center items-center">
                  <Carousel
                    activeIndex={index}
                    onSelect={handleSelect}
                    className="max-w-full max-h-96"
                  >
                    {/* shows all the images if exists */}
                    {product.image_url ? (
                      product.image_url.map((url) => (
                        <Carousel.Item>
                          {/* shows the image from Cloudinary */}
                          <AdvancedImage
                            cldImg={cld.image(url)}
                            className="w-96 h-96 mx-auto"
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
              </div>

              <div className="mx-auto text-center w-full">
                <div className="flex items-center justify-center">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mr-4">
                    {product.product_name}
                  </h1>
                  <p className="text-3xl tracking-tight text-gray-900">
                    <i className="bi bi-tags-fill"></i> ${product.price}
                  </p>
                </div>

                <AverageRating averageRating={product.average_rating} ratingCount={product.rating_count} />
              </div>

              <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 md:grid md:grid-cols-2 md:grid-rows-[auto,auto,1fr] md:gap-x-8 md:px-8 md:pb-24 md:pt-16 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">

                <ProductDescription description={product.description} />

                <div className="mt-2 lg:row-span-3 lg:mt-0">
                  <div className="mx-auto">
                    <div className="flex flex-row col-span-4 mx-auto">
                      <button
                        className="col-span-4 mx-auto"
                        id="minusButton"
                        onClick={() => {
                          // minus the quantity by 1 when the user clicks on the minus icon
                          if (product.quantity >= 1 && cartQuantity >= 1) {
                            setCartQuantity((cartQuantity -= 1));
                          }
                        }}
                      >
                        <i className="bi bi-dash-circle"></i>
                      </button>

                      {/* shows the quantity of products that the user has in the cart, will change as the user makes changes by using the icons */}
                      <p className="col-span-4 text-center">{cartQuantity}</p>
                      <button
                        className="col-span-4 mx-auto"
                        id="plusButton"
                        onClick={() => {
                          // plus the quantity by 1 when the user clicks on the button
                          // disable the button and show alert when the quantity in the cart exceeds the inventory
                          if (product.quantity > cartQuantity) {
                            setCartQuantity((cartQuantity += 1));
                          } else {
                            toast.error(`No more inventory!`, {
                              autoClose: 3000,
                              pauseOnHover: true,
                              style: { fontSize: '16px' },
                            });
                          }
                        }}
                      >
                        <i className="bi bi-plus-circle"></i>
                      </button>
                      <ToastContainer limit={2} newestOnTop={true} position="top-center" />
                    </div>
                  </div>

                  {product.quantity <= 0 ? (
                    <p className="text-red-800 text-base text-center">
                      No stock available
                    </p>
                  ) : (
                    <p className="text-emerald-800 text-base text-center">Stock in</p>
                  )}

                  <div className="mx-auto">
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
                    <ToastContainer limit={2} newestOnTop={true} position="top-center" />
                  </div>

                  <Rating productID={productID} />
                </div>

              </div>
            </div>
          ) : (
            // Loading component (full screen)
            <div className="flex items-center justify-center h-screen">
              <Loading />
            </div>
          )}
        </div>
        <div className="mx-auto px-4 pb-16 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-row items-center justify-between">
            <div className="w-10/12">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Related Products
              </h2>
            </div>
          </div>

          {hasRelatedProducts ? (
            relatedProducts ? (
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
                {relatedProducts.map((product) => (
                  <Product key={product.id} product={product} />
                ))}
              </div>
            ) : (
              // If no results match the search
              <p className="mt-40 text-center text-gray-500">No results found</p>
            )
          ) : (
            <div className="flex items-center justify-center h-screen">
              <Loading />
            </div>
          )}
        </div>
      </div>
    </div >
  );
}