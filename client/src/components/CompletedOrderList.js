import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  RiCheckboxCircleLine,
  RiTruckFill,
  RiCheckboxCircleFill,
} from 'react-icons/ri';
import UserTimezoneDate from './UserTimeZoneDate';
import ItemImage from './ItemImage';
import Rating from './Rating';
import OrderListHeader from './OrderListHeader';
import axios from 'axios';


const handleRefund = async (order_id, total, customerID) => {
  
  try {
    // Create an object with the data to send

    const refundData = {
      order_id,
      customer_id: customerID,
      total,
    };
   
    console.log(refundData);
    // Send the refund request to the backend
    await axios.post('http://localhost:8081/addRefund', refundData);
    window.alert('Refund request has been sent.');
   
  } catch (error) {
    // Handle errors here
    console.error('Error sending refund request:', error);
    window.alert('Error occurred while processing refund.');
  }
};

const OrderListItem = React.memo(
  ({
    item,
    customerID,
    renderRating,
    showRatingForm,
    setShowRatingForm,
    index,
  }) => {
    const [refundClicked, setRefundClicked] = useState(false);
    const [refundStatus, setRefundStatus] = useState('pending'); // Default status

    useEffect(() => {
      // Fetch refund status here
      fetchRefundStatus(item.order_id);
    }, [item.order_id]);

    const fetchRefundStatus = async (order_id) => {
      try {
        const response = await axios.get(`http://localhost:8081/api/refundStatusByID/${order_id}`);
        const data = response.data.data;
        if (data.length > 0) {
          const refunded_status = data[0].refunded_status;
          setRefundStatus(refunded_status);
        }else {
          setRefundStatus(''); // No data, set to empty status
        }
      } catch (error) {
        console.error('Error fetching refund status:', error);
      }
    }


    return (

    <li>
      <div className="p-2 font-breezeRegular sm:mx-4 my-3 shadow-lg text-lg sm:p-6 sm:rounded-lg">
        <OrderListHeader
          item={item}
          renderButton={false}
          renderOrderDate={false}
        />
        {item.order_items.length > 0 &&
          item.order_items.map((orderItem, orderIndex) => (
            <div
              key={orderIndex}
              className="ml-1 mr-1 sm:ml-12 sm:mr-12 my-3 border-t-2 border-b-2 border-gray-300 py-2"
            >
              <div className="flex mx-2 p-2">
                <ItemImage
                  imageUrl={orderItem.image_url}
                  width={28}
                  height={28}
                />
                <OrderItemDetails item={orderItem} />
              </div>
              <div className="md:flex flex-row justify-between items-center">
                {!item.completed_at && item.shipping_at && (
                  <div className="flex flex-row items-center py-2 space-x-2">
                    <RiTruckFill className="sm:ml-3 animate-car-move text-cyan-500 " />
                    <p>Shipped On</p>
                    <UserTimezoneDate date={item.shipping_at} />
                  </div>
                )}
                {item.completed_at && (
                  <div className="flex flex-row items-center py-2 space-x-2">
                    <RiCheckboxCircleFill className="text-green-600" />
                    <p>Delivered On</p>
                    <UserTimezoneDate date={item.completed_at} />
                  </div>
                )}
                <OrderActions
                  item={orderItem}
                  customerID={customerID}
                  renderRating={renderRating}
                  showRatingForm={showRatingForm}
                  setShowRatingForm={setShowRatingForm}
                />
              </div>
              <Rating
                productID={orderItem.product_id}
                customerID={customerID}
                showRatingForm={showRatingForm}
                setShowRatingForm={setShowRatingForm}
                index={index}
              />
            </div>
          ))}
          
        {/* { renderRating && ( <div className="flex flex-row space-x-2 mb-2 md:item-center md:justify-center">
          <button
    className={`bg-red-700 hover:bg-green-900 rounded text-white w-40 h-10 ${refundClicked ? 'opacity-50 cursor-not-allowed' : ''}`}
    onClick={() => {
      handleRefund(item.order_id, item.totalAmount, customerID);
      setRefundClicked(true);
    }}
    disabled={refundClicked}
  >
    {refundClicked ? 'Refund Pending' : 'Refund'}
  </button>

          </div>)} */}

{/* {renderRating && (
        <div className="flex flex-row space-x-2 mb-2 md:item-center md:justify-center">
          <button
            className={`bg-red-700 hover:bg-green-900 rounded text-white w-40 h-10 ${refundClicked ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => {
              if (!refundClicked) {
                handleRefund(item.order_id, item.totalAmount, customerID);
                setRefundClicked(true);

                window.location.reload();
              }
            }}
            disabled={refundClicked || refundStatus === 'pending' || refundStatus === 'refunded'}
          >
             {refundStatus === 'pending' ? 'Refund Pending' : refundStatus === 'refunded' ? 'Refunded' : refundStatus ? refundStatus : 'Refund'}
          </button>
        </div>
      )} */}

{/* {renderRating && (
  <div className="flex flex-row space-x-2 mb-2 md:item-center md:justify-center">
    <button
      className={`bg-red-700 hover:bg-green-900 rounded text-white w-40 h-10 ${refundClicked ? 'opacity-50 cursor-not-allowed' : ''} ${refundStatus === 'pending' || refundStatus === 'refunded' ? 'pointer-events-none' : ''}`}
      onClick={() => {
        if (!refundClicked) {
          handleRefund(item.order_id, item.totalAmount, customerID);
          setRefundClicked(true);
          window.location.reload();
        }
      }}
      disabled={refundClicked || refundStatus === 'pending' || refundStatus === 'refunded'}
    >
      {refundStatus === 'pending' ? 'Refund Pending' : refundStatus === 'refunded' ? 'Refunded' : refundStatus ? refundStatus : 'Refund'}
    </button>
  </div>
)} */}

{/* {renderRating && (
  <div className="flex flex-row space-x-2 mb-2 md:item-center md:justify-center">
    <button
      className={`bg-red-700 hover:bg-green-900 rounded text-white w-40 h-10 ${refundClicked ? 'opacity-50 cursor-not-allowed' : ''} ${refundStatus === 'pending' || refundStatus === 'refunded' ? 'pointer-events-none bg-gray-400' : ''}`}
      onClick={() => {
        if (!refundClicked) {
          handleRefund(item.order_id, item.totalAmount, customerID);
          setRefundClicked(true);
          window.location.reload();
        }
      }}
      disabled={refundClicked || refundStatus === 'pending' || refundStatus === 'refunded'}
    >
      {refundStatus === 'pending' ? 'Refund Pending' : refundStatus === 'refunded' ? 'Refunded' : refundStatus ? refundStatus : 'Refund'}
    </button>
  </div>
)} */}

{renderRating && (
  <div className="flex flex-row space-x-2 mb-2 md:item-center md:justify-center">
    <button
      className={`bg-red-700 hover:bg-green-900 rounded text-white w-40 h-10 ${
        refundClicked ? 'opacity-50 cursor-not-allowed' : ''
      } ${
        refundStatus === 'pending' || refundStatus === 'refunded'
          ? 'pointer-events-none bg-gray-400'
          : ''
      }`}
      onClick={() => {
        if (!refundClicked && refundStatus !== 'pending' && refundStatus !== 'refunded') {
          handleRefund(item.order_id, item.totalAmount, customerID);
          setRefundClicked(true);
          // You might not need to reload the page here
          // window.location.reload();
        }
      }}
      disabled={refundClicked || refundStatus === 'pending' || refundStatus === 'refunded'}
    >
      {refundStatus === 'pending' ? 'Refund Pending' : refundStatus === 'refunded' ? 'Refunded' : 'Refund'}
    </button>
  </div>
)}



      </div>
    </li>
    );
  }
);
OrderListItem.displayName = 'OrderListItem';
OrderListItem.propTypes = {
  item: PropTypes.object.isRequired,
  customerID: PropTypes.string.isRequired,
  renderRating: PropTypes.bool.isRequired,
  showRatingForm: PropTypes.bool.isRequired,
  setShowRatingForm: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

const OrderItemDetails = ({ item }) => (
  <div className="px-4 flex flex-col w-full py-2 h-full overflow-hidden">
    <div className="sm:flex sm:flex-row justify-between items-center">
      <b>{item.product_name}</b>
      <p>
        <b>${item.price}</b>
      </p>
    </div>
    <p className="hidden sm:block overflow-ellipsis overflow-hidden">
      {item.product_description}
    </p>
  </div>
);

OrderItemDetails.propTypes = {
  item: PropTypes.object.isRequired,
};

const OrderActions = ({
  item,

  renderRating,
  showRatingForm,
  setShowRatingForm,
}) => {
  if (!renderRating) {
    return (
      <a
        href="mailto:235756ksp@gmail.com?subject=Hello&body=I%20wanted%20to%20say%20hi!"
        className="text-xl bg-red-600 hover:bg-red-800 text-white w-40 rounded text-center py-2 px-4 items-end"
      >
        Contact us
      </a>
    );
  } else {
    return (
      <div className="flex flex-row space-x-2 mb-2 md:item-center md:justify-center">
        <Link to={`/product/${item.product_id}`}>
          <button className="bg-green-700 hover:bg-green-900 rounded text-white w-40 h-10">
            Buy again
          </button>
        </Link>
        <button
          onClick={() => {
            setShowRatingForm(!showRatingForm);
          }}
          className="rounded border-2 border-green-600 hover:border-green-800 w-40 h-10"
        >
          Rate Product
        </button>
      </div>
    );
  }
};
OrderActions.propTypes = {
  item: PropTypes.object.isRequired,
  customerID: PropTypes.string.isRequired,
  renderRating: PropTypes.bool.isRequired,
  showRatingForm: PropTypes.bool.isRequired,
  setShowRatingForm: PropTypes.func.isRequired,
};

const CompletedOrderList = ({
  items,
  customerID,
  renderRating,
  orderStatus,
}) => {
  const [clearedItems, setClearedItems] = useState([]);

  const [showRatingForm, setShowRatingForm] = useState(false);
  useEffect(() => {
    const combineOrders = (orders) => { 
      const combinedOrders = orders.reduce((acc, order) => {
        const existingOrder = acc.find((o) => o.order_id === order.order_id);
        if (existingOrder) {
          existingOrder.order_items.push({
            product_name: order.product_name,
            product_id: order.product_id,
            product_description: order.description || null,
            price: order.price,
            image_url: order.image_url || null,
            quantity: order.quantity,
          });
        } else {
          acc.push({
            order_id: order.order_id,
            shipping_method: order.shipping_method,
            shipping_address: order.shipping_address,
            order_date: order.order_date,
            payment_date: order.payment_date || null,
            shipping_start_at: order.shipping_start_at || null,
            completed_at: order.completed_at || null,
            totalAmount: (0 + order.price * order.quantity).toFixed(2),
            order_items: [
              {
                product_name: order.product_name,
                product_id: order.product_id,
                product_description: order.description || null,
                price: order.price,
                image_url: order.image_url || null,
                quantity: order.quantity,
              },
            ],
          });
        }
        return acc;
      }, []);

      return combinedOrders;
    };

    const sortedAndCombinedItems = combineOrders(items).sort(
      (a, b) => new Date(b.order_date) - new Date(a.order_date)
    );

    setClearedItems(sortedAndCombinedItems);
  }, [items]);
  CompletedOrderList.propTypes = {
    items: PropTypes.array.isRequired,
    customerID: PropTypes.string.isRequired,
    renderRating: PropTypes.bool,
    orderStatus: PropTypes.string,
  };
  if (clearedItems.length === 0) {
    return (
      <div className="p-8">
        <h2 className="mx-4 my-6 font-breezeBold font-bold text-3xl md:text-4xl flex flex-row">
          {orderStatus === 'delivered' ? (
            <>
              Orders History
              <RiCheckboxCircleLine className="sm:ml-3 animate-bounce text-green-600" />
            </>
          ) : (
            <>
              Orders delivering
              <RiTruckFill className="sm:ml-3 animate-car-move text-cyan-500 " />
            </>
          )}
        </h2>
        <div className="flex items-center justify-center align-middle py-5">
          <h2>
            No Items{' '}
            {renderRating ? `delivered to you` : `is delivering to you`}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <ul className="sm:p-8">
      <h2 className="mx-4 my-6 font-breezeBold font-bold text-3xl md:text-4xl flex flex-row">
        {orderStatus === 'delivered' ? (
          <>
            Orders History
            <RiCheckboxCircleLine className="sm:ml-3 animate-bounce text-green-600" />
          </>
        ) : (
          <>
            Orders delivering
            <RiTruckFill className="sm:ml-3 animate-car-move text-cyan-500 " />
          </>
        )}
      </h2>
      {clearedItems
        .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
        .map((item, index) => (
          <OrderListItem
            key={index}
            item={item}
            customerID={customerID}
            renderRating={renderRating}
            showRatingForm={showRatingForm}
            setShowRatingForm={setShowRatingForm}
            index={index}
            handleRefund={handleRefund} 
          />
        ))}
    </ul>
  );
};

export default CompletedOrderList;
