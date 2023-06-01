import React, { useState, useEffect } from 'react';
import api from '../../index';
import { useNavigate } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { FaEdit,FaClipboard,FaWalking, FaWallet,FaMapMarkedAlt } from 'react-icons/fa';
import { RiTruckLine } from 'react-icons/ri';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});
const OrderList = ({
  items,
  setItems,
  customerID,
  renderButton,
  orderStatus,
}) => {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedShippingAddress, setEditedShippingAddress] = useState('');
  const navigate = useNavigate();
  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedShippingAddress(items[index].shipping_address);
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
    confirmAlert({
      title: 'Confirm to cancel the order',
      message: 'Are you sure you want to cancel this item?',
      buttons: [
        {
          label: 'Yes',
          onClick: async() => {
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
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };
  const payButtonHandler = async (orderId) => {
    console.log(orderId);
    let isStockAvailable =true;
    const products= items
    .filter((item) => item.order_id === orderId)
    const productIds= products.map((item) => item.product_id);
    console.log(productIds);
    const productIdsWithQuantity = products.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));
    console.log(productIdsWithQuantity);
    api
      .get(`/api/inventory/checkQuantity?productIDs=${productIds.join(',')}`)
      .then((response) => {
        console.log(response.data.data);
        response.data.data.forEach((inventory) => {
          const quantityIndex = productIdsWithQuantity.findIndex(
            (item) => item.productId == inventory.product_id
          ); if (
            quantityIndex !== -1 &&
            inventory.quantity < productIdsWithQuantity[quantityIndex].quantity
          ) {
            isStockAvailable = false;
          }

          if(!isStockAvailable){
            toast.warn("Sorry,items in your orders are no more stock. Please cancel", {
              autoClose: 3000,
              pauseOnHover: true,
              style: { 'font-size': '16px' },
            });
          }
          else{
            navigate(`/payment/${orderId}`)
          }

        })})
  }

  if (items.length === 0) {
    return (
      <div className='flex items-center justify-center align-middle py-5'>
        <h2>No Items to {orderStatus == "paid" ? (`deliver to you`):(`pay for order`)}</h2>
      </div>
    );
  }

  return (
    <ul>
      {clearedItems.map((item, index) => (
        <li key={index}>
          <div className="mx-4 my-3 shadow-md shadow-gray-900  p-6 rounded-lg">
            <div className="block sm:flex flex-row justify-around text-base">
              <p className='flex flex-row items-center'><FaClipboard className='text-green-700'/>order ID : {item.order_id}</p>
              {editingIndex === index ? (
                <div className="block w-full sm:flex flex-row sm:space-x-12 py-2 sm:w-1/2">
                  <input
                    type="text"
                    value={editedShippingAddress}
                    onChange={(event) =>
                      setEditedShippingAddress(event.target.value)
                    }
                    className="border border-gray-300 rounded px-2 flex-grow"
                  />
                  <p>Shipping Method : {item.shipping_method}</p>
                  <button
                    onClick={() => handleSaveClick(item.order_id)}
                    className="bg-green-700 px-4 py-2 rounded text-white"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="block sm:flex flex-row space-x-12 items-center">
                  <div className='block sm:flex flex-row space-x-6'>
                    <p className='flex flex-row items-center space-x-1'><FaMapMarkedAlt className='text-green-700'/>Address : {item.shipping_address}</p>
                    <p className='flex flex-row items-center space-x-2'><RiTruckLine className='text-green-700'/>Shipping Method : {item.shipping_method}</p>
                  </div>
                  <div className='flex flex-row space-x-5 py-2'>
                  <button
                    onClick={() => handleEditClick(index)}
                    className="bg-gray-600 hover:bg-gray-800 h-10 px-4 rounded text-white flex flex-row items-center"
                  >
                    <FaEdit className="mr-3"></FaEdit>Edit
                  </button>
                  {renderButton && (
                    <button
                      onClick={() => {
                        payButtonHandler(item.order_id);
                      }}
                      className="bg-green-600 h-10 px-4 hover:bg-green-800 text-white rounded flex flex-row items-center"
                    >
                      <FaWallet/>
                      Pay
                    </button>
                  )}
                  </div>
                </div>
              )}
            </div>
            {item.order_items.length > 0 && (
              <div className="text-xl">
                {item.order_items.map((orderItem, orderIndex) => (
                  <div key={orderIndex}>
                    <div className="my-5 text-black rounded-lg shadow-md shadow-violet-800 border-violet-800 border-2">
                      <div className="block sm:flex items-center justify-between px-5">
                        <div className="py-4">
                          <AdvancedImage
                            cldImg={cld.image(orderItem.image_url)}
                            className="w-48 h-48 rounded"
                          />
                        </div>
                        <div>
                          <b>{orderItem.product_name}</b>
                          <p>${orderItem.price}</p>
                          <p>quantity : {orderItem.quantity}</p>
                        </div>
                        <p>
                          item total: $
                          {(orderItem.price * orderItem.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end px-4">
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
