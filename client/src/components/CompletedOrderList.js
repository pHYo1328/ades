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

const OrderListItem = React.memo(
  ({
    item,
    customerID,
    renderRating,
    showRatingForm,
    setShowRatingForm,
    index,
  }) => (
    <li className='p-2 font-breezeRegular sm:mx-4 my-4 shadow-lg text-lg sm:p-6 sm:rounded-lg'>
      <div className=" ml-1 mr-1 sm:ml-12 sm:mr-12 border-b-2 border-gray-300 my-2">
        <OrderListHeader
          item={item}
          renderButton={false}
          renderOrderDate={false}
        />
        {item.order_items.length > 0 &&
          item.order_items.map((orderItem, orderIndex) => (
            <div
              key={orderIndex}
              className=" border-t-2 border-gray-300 py-2"
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
                {item.shipping_start_at && (
                  <div className="flex flex-row items-center py-2 space-x-4">
                    <RiTruckFill className="sm:ml-3 animate-car-move text-cyan-500" />
                    <div className='flex flex-row space-x-2'>
                    <p>Shipped On</p>
                    <UserTimezoneDate date={item.shipping_start_at} />
                    </div>
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
      </div>
    </li>
  )
);
OrderListItem.displayName = 'OrderListItem';
OrderListItem.propTypes = {
  item: PropTypes.object.isRequired,
  customerID: PropTypes.string.isRequired,
  renderRating: PropTypes.bool,
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
        href="mailto:235756ksp@gmail.com?subject=Hello&body=I%20wanted%20to%20say%20this%20item%20is"
        className="text-lg bg-red-600 hover:bg-red-800 text-white w-40 rounded text-center py-2 px-4 items-end mt-2"
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
  renderRating: PropTypes.bool,
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
          />
        ))}
    </ul>
  );
};

export default CompletedOrderList;
