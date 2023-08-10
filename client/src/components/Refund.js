import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const Rating = ({
  productID,
  customerID,
  showRatingForm,
  setShowRatingForm,
}) => {
  const [refundComment, setRefundComment] = useState('');
  const [rating, setRating] = useState(0);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
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
          console.log(response);
        });

      // Reset the form
      setRatingComment('');
      setShowRatingForm(false);
    }
  };

  return (
    <>
      {showRatingForm && (
        <div className="flex flex-col mt-2 items-center ">
          <div className="flex ml-2">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`${
                  i < rating ? 'text-yellow-500' : 'text-gray-400'
                } text-2xl mr-1`}
                onClick={() => handleRatingClick(i + 1)}
              >
                &#9733;
              </span>
            ))}
          </div>
          <form
            onSubmit={handleRatingSubmit}
            className="flex flex-col sm:w-[500px] "
          >
            <textarea
              value={ratingComment}
              onChange={handleRatingCommentChange}
              placeholder="please provide feedback comment here"
              className="border border-gray-300 rounded px-2 py-1 mt-2 w-full h-32 sm:h-56"
            />
            <div className="space-x-4 flex justify-center items-center">
              <button
                type="submit"
                className="bg-blue-500 text-white rounded px-3 py-1 mt-2"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setRatingComment('');
                  setShowRatingForm(false);
                }}
                className="bg-red-500 text-white rounded px-3 py-1 mt-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

Rating.propTypes = {
  productID: PropTypes.number.isRequired,
  customerID: PropTypes.string.isRequired,
  showRatingForm: PropTypes.bool.isRequired,
  setShowRatingForm: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default Rating;
