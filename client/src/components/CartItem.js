import React, { useCallback, useEffect, useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { FiPlus, FiMinus } from 'react-icons/fi';
import ItemImage from './ItemImage';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Link } from 'react-router-dom';

const CartItem = ({
  cartItem,
  index,
  cartData,
  setCartData,
  setTotalAmount,
  customerID,
}) => {
  const plusButtonHandler = useCallback(
    (productId) => {
      const updatedCart = cartData.map((item) =>
        item.productId == productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartData([...updatedCart]);
    },
    [cartData, setCartData, customerID]
  );

  const minusButtonHandler = useCallback(
    (productId) => {
      const updatedCart = cartData.map((item) =>
        item.productId == productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      setCartData([...updatedCart]);
    },
    [cartData, setCartData, customerID]
  );

  const deleteButtonHandler = useCallback(
    (productId) => {
      confirmAlert({
        title: 'Confirm to delete',
        message: 'Are you sure you want to delete this item?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              const filteredProducts = cartData.filter(
                (item) => item.productId != productId
              );
              setCartData(filteredProducts);
              const overallTotalAmount = filteredProducts
                .reduce(
                  (total, item) => total + parseFloat(item.totalAmount),
                  0
                )
                .toFixed(2);
              setTotalAmount(overallTotalAmount);
            },
          },
          {
            label: 'No',
            onClick: () => {},
          },
        ],
      });
    },
    [cartData, setCartData, setTotalAmount]
  );

  return (
    <tr
      key={`${cartItem.product_ID}-${index}`}
      className="border-b-2 border-grey"
    >
      <td className="flex flew-row py-6 px-2 w-48 h-56 md:w-64 md:h-64 ">
        <ItemImage imageUrl={cartItem.image_url} />
      </td>
      <td>
        <Link
          to={`/product/${cartItem.product_id}`}
          onClick={() => window.scrollTo(0, 0)}
        >
          <b>{cartItem.product_name}</b>
        </Link>
        <p className="block md:hidden">{cartItem.product_name}</p>
        <p className="hidden md:flex flex-row">
          <b className="hidden lg:block">category:</b> {cartItem.category}
        </p>
        <p className="hidden md:flex flex-row">
          <b className="hidden lg:block">brand :</b>
          {cartItem.brand}
        </p>
        <div className="block lg:hidden">{cartItem.price}</div>
        <div className="justify-evenly border-2 border-gray-400 rounded flex flex-row md:hidden my-2">
          <button
            className="flex items-center justify-center "
            onClick={() => minusButtonHandler(cartItem.product_id)}
            aria-label="Decrease quantity"
          >
            <FiMinus size={16} />
          </button>
          <p className="border-l-2 border-r-2 w-8 text-center border-gray-400">
            {cartItem.quantity}
          </p>
          <button
            className="flex items-center justify-center"
            onClick={() => plusButtonHandler(cartItem.product_id)}
            aria-label="Increase quantity"
          >
            <span className="sr-only">Increase quantity</span>
            <FiPlus size={16} />
          </button>
        </div>
        <div className="w-20 text-center block md:hidden">
          <b>${cartItem.totalAmount}</b>
        </div>
      </td>
      <td className="hidden lg:table-cell">${cartItem.price}</td>
      <td>
        <div className="justify-evenly hidden md:flex flex-row">
          <button
            className="flex items-center justify-center w-8 border-2 rounded-tl-md rounded-bl-md border-gray-500"
            onClick={() => minusButtonHandler(cartItem.product_id)}
            aria-label="Decrease quantity"
          >
            <FiMinus size={16} />
          </button>
          <p className="text-center px-1 w-10 border-t-2 border-b-2 border-gray-500">
            {cartItem.quantity}
          </p>
          <button
            className="flex items-center justify-center w-8 border-2 border-gray-500 rounded-tr-md rounded-br-md"
            onClick={() => plusButtonHandler(cartItem.product_id)}
            aria-label="Increase quantity"
          >
            <FiPlus size={16} />
          </button>
        </div>
      </td>
      <td className="text-center hidden md:table-cell ">
        <b>${cartItem.totalAmount}</b>
      </td>
      <td className="pl-4">
        <button
          className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded-full"
          onClick={() => deleteButtonHandler(cartItem.product_id)}
          aria-label="Delete item"
        >
          <AiFillDelete size={20} color="white" className="hidden md:block" />
          <AiFillDelete size={16} color="white" className="block md:hidden" />
        </button>
      </td>
    </tr>
  );
};
export default CartItem;
