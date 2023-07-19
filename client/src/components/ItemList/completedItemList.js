import axios from 'axios';
import React, { useState } from 'react';
import { FaClipboard, FaWallet } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { RiTruckLine, RiCheckboxCircleLine, RiTruckFill } from 'react-icons/ri';
import UserTimezoneDate from '../UserTimeZoneDate';
import ItemImage from '../ItemImage';
import Rating from '../Rating';
import OrderListHeader from './OrderListHeader';
const CompletedItemList = ({
  items,
  customerID,
  renderRating,
  orderStatus,
}) => {
  const combineOrders = (orders) => {
    // to organize the data from database, use reduce and find to bulid 2 dimensional array
    // first accumulator with [] and find the order id
    // if order id found make it push to existing order array or make a new array
    const combinedOrders = orders.reduce((acc, order) => {
      const existingOrder = acc.find((o) => o.order_id === order.order_id);
      if (existingOrder) {
        existingOrder.order_items.push({
          product_name: order.product_name,
          product_id: order.product_id,
          price: order.price,
          image_url: order.image_url || null,
          quantity: order.quantity,
        });
      } else {
        acc.push({
          order_id: order.order_id,
          shipping_id: order.shipping_id,
          shipping_method: order.shipping_method,
          shipping_address: order.shipping_address,
          order_date: order.order_date,
          payment_date: order.payment_date,
          shipping_start_at: order.shipping_start_at,
          completed_at: order.completed_at,
          order_items: [
            {
              product_name: order.product_name,
              product_id: order.product_id,
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
  const clearedItems = combineOrders(items);
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
    <ul className="p-8">
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
          <li key={index}>
            <div className="mx-4 my-3 shadow-md shadow-gray-900 text-lg p-6 rounded-lg">
              <OrderListHeader
                item={item}
                renderButton={false}
                items={items}
                clearedItems={clearedItems}
                customerID={customerID}
                index={index}
              />
              <div className="block md:flex flex-row items-center lg:mx-12 justify-between">
                <div className="block sm:flex flex-row items-center p-2">
                  <ItemImage imageUrl={item.image_url} width={48} height={48} />
                  <div className="px-4 flex flex-col">
                    <b>{item.product_name}</b>
                    <p>price : ${item.price}</p>
                    <p>quantity : {item.quantity}</p>
                  </div>
                </div>
                <div className="block md:flex flex-col">
                  <p className="flex flex-row items-center text-sm sm:text-lg space-x- pb-2">
                    <FaWallet className="text-green-700 text-xl" />
                    payment at : <UserTimezoneDate date={item.payment_date} />
                  </p>
                  <p className="flex flex-row items-center text-sm sm:text-lg space-x-1 pb-2">
                    <RiTruckLine className="text-green-700 text-xl" />

                    <p>
                      shipping started at :{' '}
                      <UserTimezoneDate date={item.shipping_start_at} />
                    </p>
                  </p>
                  {item.completed_at ? (
                    <p className="flex flex-row items-center text-sm sm:text-lg space-x-1 pb-2">
                      <RiTruckLine className="text-green-700 text-xl" />
                      shipping arrived at:{' '}
                      <UserTimezoneDate date={item.completed_at} />
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
                    <p>{item.product_id}</p>
                    <Rating
                      productID={item.product_id}
                      customerID={customerID}
                      index={index}
                    />
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default CompletedItemList;
