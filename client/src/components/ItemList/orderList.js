import React, { useState, useEffect } from 'react';
import api from '../../index';
import { useNavigate } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { FaEdit } from 'react-icons/fa';
const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});
const OrderList = ({
  items,
  setItems,
  shippingMethods,
  customerID,
  renderButton,
  orderStatus,
}) => {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedShippingAddress, setEditedShippingAddress] = useState('');
  const [editedShippingMethod, setEditedShippingMethod] = useState('');
  const navigate = useNavigate();
  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedShippingAddress(items[index].shipping_address);
    setEditedShippingMethod(items[index].shipping_id);
  };
  const handleSaveClick = async (orderId) => {
    console.log('Edited Shipping Address:', editedShippingAddress);
    const result = await api.put(
      `/api/order/updateShippingDetails/${customerID}`,
      {
        orderId: orderId,
        shippingAddr: editedShippingAddress,
      }
    );
    console.log(result);

    setEditingIndex(-1);
    const updatedItemList = items.map((item) =>
      item.order_id === orderId
        ? {
            ...item,
            shipping_address: editedShippingAddress,
          }
        : item
    );
    setItems(updatedItemList);
  };

  const combineOrders = (orders) => {
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
  const handleDeleteItem = async (orderId, productId, quantity) => {
    console.log(orderId, productId);
    try {
      const result = await api.delete(
        `/api/order?orderId=${orderId}&productID=${productId}&quantity=${quantity}&orderStatus=${orderStatus}`
      );
      console.log('Deleted Item:', orderId, productId);
      console.log(result);
      // Remove the deleted item from state
      const updatedItemList = items.filter(
        (item) => item.order_id !== orderId || item.product_id !== productId
      );
      setItems(updatedItemList);
    } catch (error) {
      console.error('Error deleting item:', error);
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
      {clearedItems.map((item, index) => (
        <li key={index}>
          <div className="mx-4 my-3 shadow-md shadow-gray-900  p-6 rounded-lg">
            <div className="flex flex-row justify-around text-base">
              <p>order ID : {item.order_id}</p>
              {editingIndex === index ? (
                <div className="flex flex-row space-x-12 w-1/2">
                  <input
                    type="text"
                    value={editedShippingAddress}
                    onChange={(event) =>
                      setEditedShippingAddress(event.target.value)
                    }
                    className="border border-gray-300 rounded px-2 flex-grow"
                  />
                  <p>Shipping Method : {item.shipping_method}</p>
                  <button onClick={() => handleSaveClick(item.order_id)} className='bg-green-700 px-4 py-2 rounded text-white'>
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex flex-row space-x-12">
                  <>
                    <p>Address : {item.shipping_address}</p>
                    <p>Shipping Method : {item.shipping_method}</p>
                  </>
                  <button
                    onClick={() => handleEditClick(index)}
                    className="bg-gray-600 hover:bg-gray-800 h-10 px-4 rounded text-white flex flex-row items-center"
                  >
                    <FaEdit className="mr-3"></FaEdit>Edit
                  </button>
                  {renderButton && (
                    <button
                      onClick={() => {
                        navigate(`/payment/${item.order_id}`);
                      }}
                      className="bg-green-600 h-10 px-4 hover:bg-green-800 text-white rounded"
                    >
                      Pay
                    </button>
                  )}
                </div>
              )}
            </div>
            {item.order_items.length > 0 && (
              <div className="mt-4 text-xl">
                {item.order_items.map((orderItem, orderIndex) => (
                  <div key={orderIndex}>
                    <div className="flex items-center mt-2 justify-between px-5">
                      <AdvancedImage
                        cldImg={cld.image(orderItem.image_url)}
                        className="w-48 h-48 rounded"
                      />
                      <div>
                        <p>{orderItem.product_name}</p>
                        <p>quantity : {orderItem.quantity}</p>
                        <p>${orderItem.price}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end px-4">
                      <p>
                        item total: $
                        {(orderItem.price * orderItem.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() =>
                          handleDeleteItem(
                            item.order_id,
                            orderItem.product_id,
                            orderItem.quantity
                          )
                        }
                        className="my-3 text-white bg-red-600 px-4 py-2 rounded text-base hover:bg-red-800"
                      >
                        cancel order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OrderList;
