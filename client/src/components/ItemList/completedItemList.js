import axios from 'axios';
import React, { useState } from 'react';

const CompletedItemList = ({ items, customerID }) => {
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

  if (items.length === 0) {
    return (
      <div>
        <h2>No Items</h2>
      </div>
    );
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          <div className="py-3 mx-6 my-3 shadow-md">
            <div className="flex flex-row justify-between items-center">
              <div className="flex items-center">
                <p>{item.product_name}</p>
              </div>
              <button
                onClick={() => {
                  handleRateItemClick(index);
                  console.log('console.log item.product_id', item.product_id);
                  setProductID(item.product_id);
                  setIndex(index);
                }}
              >
                Rate this item
              </button>
            </div>
            {showRatingForm[index] && (
              <div className="flex flex-col items-end mt-2">
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
                    type="text"
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
