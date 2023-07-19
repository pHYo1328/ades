import React from 'react';
import { FaWallet, FaEdit } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import api from '../index';
import { validateAddress } from '../utils/addressUtils';
export const SaveButton = ({
  item,
  editedShippingAddress,
  setIsInvalidAddress,
  items,
  setItems,
  setEditingIndex,
  customerID,
}) => {
  const handleSaveClick = async (orderId) => {
    const result = await validateAddress(editedShippingAddress);
    setIsInvalidAddress(result);
    console.log(result);
    if (!result) {
      const response = await api.put(
        `/api/order/updateShippingDetails/${customerID}`,
        {
          orderId,
          shippingAddr: editedShippingAddress,
        }
      );

      if (response.status === 200) {
        const updatedItemList = items.map((item) =>
          item.order_id === orderId
            ? { ...item, shipping_address: editedShippingAddress }
            : item
        );

        setItems(updatedItemList);
        setEditingIndex(-1);
      }
    } else {
      return;
    }
  };

  return (
    <button
      onClick={() => handleSaveClick(item.order_id)}
      className="bg-green-700 px-3 py-2 rounded text-white w-full text-sm"
    >
      Save
    </button>
  );
};

export const EditAddressButton = ({
  index,
  setEditingIndex,
  clearedItems,
  setEditedShippingAddress,
}) => {
  const handleEditClick = (index) => {
    console.log(clearedItems);
    setEditingIndex(index);
    setEditedShippingAddress(clearedItems[index].shipping_address);
  };

  return (
    <button
      onClick={() => handleEditClick(index)}
      className="bg-gray-600 mr-2 over:bg-gray-800 h-10 px-3 rounded text-white flex flex-row items-center text-sm w-full whitespace-nowrap"
    >
      <FaEdit></FaEdit>Edit Address
    </button>
  );
};

export const PayButton = ({ items, item, navigate }) => {
  const payButtonHandler = async (orderId) => {
    let isStockAvailable = true;
    const products = items.filter((item) => item.order_id === orderId);
    const productIds = products.map((item) => item.product_id);
    console.log(productIds);
    const productIdsWithQuantity = products.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));
    api
      .get(`/api/inventory/checkQuantity?productIDs=${productIds.join(',')}`)
      .then((response) => {
        response.data.data.forEach((inventory) => {
          const quantityIndex = productIdsWithQuantity.findIndex(
            (item) => item.productId == inventory.product_id
          );
          if (
            quantityIndex !== -1 &&
            inventory.quantity < productIdsWithQuantity[quantityIndex].quantity
          ) {
            isStockAvailable = false;
          }

          if (!isStockAvailable) {
            toast.warn(
              'Sorry,items in your orders are no more stock. Please cancel',
              {
                autoClose: 3000,
                pauseOnHover: true,
                style: { fontSize: '16px' },
              }
            );
          } else {
            navigate(`/payment/${orderId}`);
          }
        });
      });
  };

  return (
    <button
      onClick={() => payButtonHandler(item.order_id)}
      className="bg-green-600 h-10 px-4 hover:bg-green-800 text-white rounded flex flex-row items-center text-sm w-full"
    >
      <FaWallet className="mr-3" />
      Pay
    </button>
  );
};
