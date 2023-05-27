import React, { useState } from 'react';
import api from '../../index';
import { useNavigate } from 'react-router-dom';
const OrderList = ({ items, shippingMethods, customerID, renderButton }) => {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [itemList, setItemList] = useState(items);
  const [editedShippingAddress, setEditedShippingAddress] = useState('');
  const [editedShippingMethod, setEditedShippingMethod] = useState('');
  const navigate = useNavigate();
  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedShippingAddress(items[index].shipping_address);
    setEditedShippingMethod(items[index].shipping_method);
  };

  // Create a lookup for shipping methodsx
  const shippingMethodLookup = shippingMethods.reduce((lookup, method) => {
    lookup[method.shipping_id] = method.shipping_method;
    return lookup;
  }, {});

  const handleSaveClick = async (orderId) => {
    console.log('Edited Shipping Address:', editedShippingAddress);
    console.log('Edited Shipping Method:', editedShippingMethod);
    const result = await api.put(
      `/api/order/updateShippingDetails/${customerID}`,
      {
        orderId: orderId,
        shippingAddr: editedShippingAddress,
        shippingMethod: editedShippingMethod,
      }
    );
    console.log(result);

    setEditingIndex(-1);
    const updatedItemList = itemList.map((item) =>
    item.order_id === result.data.order_id ? result.data : item
  );
  setItemList(updatedItemList);
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
            },
          ],
        });
      }

      return acc;
    }, []);

    return combinedOrders;
  };

  const clearedItems = combineOrders(items);

  const handleDeleteItem = async (orderId, productId) => {
    console.log(orderId, productId);
    try {
      const result = await api.delete(
        `/api/order?orderId=${orderId}&productID=${productId}`
      );
      console.log('Deleted Item:', orderId, productId);
      console.log(result);
      // Remove the deleted item from state
      const updatedItemList = itemList.filter(
        (item) => item.order_id !== orderId || item.product_id !== productId
      );
      setItemList(updatedItemList);    
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
          <div className="py-3 mx-6 my-6 shadow-md">
            <div className="flex flex-row justify-around text-xl">
              <p>{item.order_id}</p>
              {editingIndex === index ? (
                <div className="flex flex-row space-x-12 w-1/2">
                  <input
                    type="text"
                    value={editedShippingAddress}
                    onChange={(event) =>
                      setEditedShippingAddress(event.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 mt-2 flex-grow"
                  />
                   <select
        value={editedShippingMethod}
        onChange={(event) =>
          setEditedShippingMethod(event.target.value)
        }
        className="border border-gray-300 rounded px-2 py-1 mt-2 flex-grow text-base"
      >
        <option disabled selected value="">
          Select a method
        </option>
        {shippingMethods.map((method) => (
          <option
            key={method.shipping_id}
            value={method.shipping_id}
          >
            {method.shipping_method}
          </option>
        ))}
      </select>
                  <button onClick={() => handleSaveClick(item.order_id)}>
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex flex-row space-x-12">
                  
                    <>
                      <p>{item.shipping_address}</p>
                      <p>{item.shipping_method}</p>
                    </>
                  <button onClick={() => handleEditClick(index)}>Edit</button>
                  {renderButton && (
                    <button
                      onClick={() => {
                        navigate(`/payment/${item.order_id}`);
                      }}
                      className="bg-green-600 p-3"
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
                  <div
                    key={orderIndex}
                    className="flex items-center mt-2 justify-around"
                  >
                    <p>{orderItem.product_name}</p>
                    <p>{orderItem.product_id}</p>
                    <p>{orderItem.price}</p>
                    {renderButton && (
                      <button
                        onClick={() =>
                          handleDeleteItem(item.order_id, orderItem.product_id)
                        }
                        className="ml-4 text-red-500"
                      >
                        Delete
                      </button>
                    )}
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
