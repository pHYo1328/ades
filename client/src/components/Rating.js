import React, { useState } from 'react';
import axios from 'axios';

const Rating = ({ productID, customerID, index }) => {
  console.log(productID);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingComment, setRatingComment] = useState('');
  const [rating, setRating] = useState(0);
  const [ratingData, setRatingData] = useState(null);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  const handleRateItemClick = () => {
    setShowRatingForm(!showRatingForm);
  };

  const handleRatingClick = (ratingValue) => {
    setRating(ratingValue);
  };

  const handleRatingCommentChange = (event) => {
    setRatingComment(event.target.value);
  };

  const handleRatingSubmit = (event) => {
    event.preventDefault();
    console.log(rating, ratingComment, productID, customerID);
    if (!rating || !ratingComment || !productID || !customerID) {
      window.alert('Please fill in all the fields');
    } else {
      const requestBody = {
        comment: ratingComment,
        rating_score: rating,
        product_id: productID,
        customer_id: customerID,
      };
      axios
        .post(`${baseUrl}/api/products/ratings`, requestBody)
        .then((response) => {
          setRatingData(response.data.data);
        });

      // Reset the form
      setRatingComment('');
      setShowRatingForm(false);
    }
  };

  return (
    <>
      <button
        onClick={handleRateItemClick}
        className="py-2 px-4 rounded border-2 border-green-600 hover:border-green-800"
      >
        Rate this item
      </button>
      {showRatingForm && (
        <div className="flex flex-col mt-2 items-center">
          <div className="flex ml-2">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`${
                  i < rating ? 'text-yellow-500' : 'text-gray-400'
                } mr-1`}
                onClick={() => handleRatingClick(i + 1)}
              >
                &#9733;
              </span>
            ))}
          </div>
          <form onSubmit={handleRatingSubmit} className="flex flex-col">
            <input
              type="textarea"
              value={ratingComment}
              onChange={handleRatingCommentChange}
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
    </>
  );
};

export default Rating;
