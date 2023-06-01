import axios from 'axios';
import React, { useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { FaClipboard } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { format, utcToZonedTime } from 'date-fns-tz';
import {
  RiTruckLine,
} from 'react-icons/ri';
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
    const updatedShowRatingForm = [...showRatingForm];
    updatedShowRatingForm[index] = !updatedShowRatingForm[index];
    setShowRatingForm(updatedShowRatingForm);
  };

  const handleRatingClick = (index, ratingValue) => {
    const updatedRating = [...rating];
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
      console.log("Intl API is not supported")
      return 'UTC';
    }
  };

  const userTimeZone = getUserTimeZone();
  const utcTime = '2023-06-01T05:50:42.000Z';

// Convert UTC time to Singapore time
const singaporeTime = utcToZonedTime(utcTime, userTimeZone);

// Format the Singapore time as per your requirement
const formattedTime = format(singaporeTime, 'yyyy-MM-dd HH:mm:ss');

console.log('Singapore Time:', formattedTime);
  console.log('userTimeZone', userTimeZone);
  if (items.length === 0) {
    return (
      <div className="flex item-center">
        <h2>No Items</h2>
      </div>
    );
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          <div className="mx-4 my-3 shadow-md shadow-gray-900 text-base p-6 rounded-lg">
            <div className='block md:flex flex-row justify-between'>
            <p className='flex flex-row items-center text-sm sm:text-base space-x-1'><FaClipboard className='text-green-700'/>Order ID :{item.order_id}</p>
          <p className='flex flex-row items-center text-sm sm:text-base space-x-1'><RiTruckLine className='text-green-700 text-xl'/>
              {renderRating? <span>shipping arrived at : {format(utcToZonedTime(item.completed_at, userTimeZone), "yyyy-MM-dd HH:mm:ss")}</span>
              : <span>shipping started at : {format(utcToZonedTime(item.shipping_start_at, userTimeZone), "yyyy-MM-dd HH:mm:ss")}</span>}
              </p>
            </div>
            <div className="block md:flex flex-row justify-between items-center lg:mx-12">
              <div className="block sm:flex items-center p-2">
              <AdvancedImage
                        cldImg={cld.image(item.image_url)}
                        className="w-48 h-48 rounded"
                      />
                <div className='px-4 flex flex-col'>
                  <p>{item.product_name}</p>
                  <p>price : ${item.price}</p>
                  <p>quantity : {item.quantity}</p>
                </div>
              </div>
              
              {renderRating && (
                <div className='flex flex-col space-y-4'>
                <Link to={`/product/${item.product_id}`}>
                <button className='bg-green-700 px-4 py-2 hover:bg-green-900 rounded text-white w-40'>Buy again</button>
                </Link>
                <button
                  onClick={() => {
                    handleRateItemClick(index);
                    setProductID(item.product_id);
                    setIndex(index)
                    ;
                  }}
                  className='py-2 px-4 rounded border-2 border-green-600 hover:border-green-800'
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
