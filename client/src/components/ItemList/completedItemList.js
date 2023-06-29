import axios from 'axios';
import React, { useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { FaClipboard, FaWallet } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { format, utcToZonedTime } from 'date-fns-tz';
import { RiTruckLine } from 'react-icons/ri';
const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

const CompletedItemList = ({ items, customerID, renderRating }) => {
  const [showRatingForm, setShowRatingForm] = useState([]);
  const [ratingComment, setRatingComment] = useState([]);
  const [rating, setRating] = useState([]);
  const [productID, setProductID] = useState(null);
  const [ratingData, setRatingData] = useState(null);
  const [index, setIndex] = useState(null);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  const handleRateItemClick = (index) => {
    // make array to handle all items for the state with index
    const updatedShowRatingForm = [...showRatingForm];
    // change opposite state of previous value to make sure to close or open
    updatedShowRatingForm[index] = !updatedShowRatingForm[index];
    setShowRatingForm(updatedShowRatingForm);
  };

  const handleRatingClick = (index, ratingValue) => {
    // same concept with above function
    const updatedRating = [...rating];
    // add the rating value
    updatedRating[index] = ratingValue;
    setRating(updatedRating);
  };

  const handleRatingCommentChange = (index, event) => {
    const updatedRatingComment = [...ratingComment];
    updatedRatingComment[index] = event.target.value;
    setRatingComment(updatedRatingComment);
  };

  const handleRatingSubmit = (index, event) => {
    event.preventDefault();
    // Perform rating submission API call or other actions here
    console.log('Rating comment:', ratingComment[index]);
    // Reset the form
    const updatedShowRatingForm = [...showRatingForm];
    updatedShowRatingForm[index] = false;
    setShowRatingForm(updatedShowRatingForm);

    const updatedRatingComment = [...ratingComment];
    updatedRatingComment[index] = '';
    setRatingComment(updatedRatingComment);

    console.log('rating', rating[index]);
    console.log('comment', ratingComment[index]);
    console.log('productID', productID);
    console.log('customerID', customerID);

    if (!rating || !ratingComment || !productID || !customerID) {
      window.alert('Please fill in all the fields');
    } else {
      const requestBody = {
        comment: ratingComment,
        rating_score: rating,
        product_id: productID,
        customer_id: customerID,
      };
      console.log(requestBody);
      axios
        .post(`${baseUrl}/api/products/ratings`, requestBody)
        .then((response) => {
          console.log(response);
          setRatingData(response.data.data);
          console.log(ratingData);
          // window.location.reload();
        });
    }
  };
  const getUserTimeZone = () => {
    if (typeof Intl === 'object' && typeof Intl.DateTimeFormat === 'function') {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } else {
      // Fallback to a default time zone if Intl API is not supported
      console.log('Intl API is not supported');
      return 'UTC';
    }
  };
  const userTimeZone = getUserTimeZone();
  if (items.length === 0) {
    return (
      <div className='flex items-center justify-center align-middle py-5'>
        <h2>No Items {renderRating ? (`delivered to you`):(`is delivering to you`)}</h2>
      </div>
    );
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          <div className="mx-4 my-3 shadow-md shadow-gray-900 text-lg p-6 rounded-lg">
            <p className="flex flex-row items-center text-sm sm:text-lg space-x-1">
              <FaClipboard className="text-green-700" />
              Order ID :{item.order_id}
            </p>
            <div className="block md:flex flex-row items-center lg:mx-12 justify-between">
              <div className="block sm:flex flex-row items-center p-2">
                <AdvancedImage
                  cldImg={cld.image(item.image_url)}
                  className="w-48 h-48 rounded"
                />
                <div className="px-4 flex flex-col">
                  <b>{item.product_name}</b>
                  <p>price : ${item.price}</p>
                  <p>quantity : {item.quantity}</p>
                </div>
              </div>
              <div className="block md:flex flex-col">
                <p className="flex flex-row items-center text-sm sm:text-lg space-x- pb-2">
                  <FaWallet className="text-green-700 text-xl" />
                  payment at :{' '}
                  {format(
                    utcToZonedTime(item.payment_date, userTimeZone),
                    'yyyy-MM-dd HH:mm:ss'
                  )}
                </p>
                <p className="flex flex-row items-center text-sm sm:text-lg space-x-1 pb-2">
                  <RiTruckLine className="text-green-700 text-xl" />

                  <p>
                    shipping started at :{' '}
                    {format(
                      utcToZonedTime(item.shipping_start_at, userTimeZone),
                      'yyyy-MM-dd HH:mm:ss'
                    )}
                  </p>
                </p>
                {item.completed_at ? (
                  <p className="flex flex-row items-center text-sm sm:text-lg space-x-1 pb-2">
                    <RiTruckLine className="text-green-700 text-xl" />
                    shipping arrived at:{' '}
                    {format(
                      utcToZonedTime(item.completed_at, userTimeZone),
                      'yyyy-MM-dd HH:mm:ss'
                    )}
                  </p>
                ) : (
                  <span></span>
                )}
              </div>
              {!renderRating && (
                <a
                  href="mailto:235756ksp@gmail.com?subject=Hello&body=I%20wanted%20to%20say%20hi!"
                  className="text-xl bg-red-600 hover:bg-red-800 text-white w-40 rounded text-center py-2 px-4 items-end"
                >
                  Contact us{' '}
                </a>
              )}
              {renderRating && (
                <div className="flex flex-col space-y-4">
                  <Link to={`/product/${item.product_id}`}>
                    <button className="bg-green-700 px-4 py-2 hover:bg-green-900 rounded text-white w-40">
                      Buy again
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      handleRateItemClick(index);
                      setProductID(item.product_id);
                      setIndex(index);
                    }}
                    className="py-2 px-4 rounded border-2 border-green-600 hover:border-green-800"
                  >
                    Rate this item
                  </button>
                </div>
              )}
            </div>
            {showRatingForm[index] && (
              <div className="flex flex-col mt-2 items-center">
                <div className="flex ml-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`${
                        i < (rating[index] || 0)
                          ? 'text-yellow-500'
                          : 'text-gray-400'
                      } mr-1`}
                      onClick={() => handleRatingClick(index, i + 1)}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
                <form
                  onSubmit={(event) => handleRatingSubmit(index, event)}
                  className="flex flex-col"
                >
                  <input
                    type="textarea"
                    value={ratingComment[index] || ''}
                    onChange={(event) =>
                      handleRatingCommentChange(index, event)
                    }
                    placeholder="Enter rating comment"
                    className="border border-gray-300 rounded px-2 py-1 mt-2"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded px-3 py-1 mt-2"
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CompletedItemList;
