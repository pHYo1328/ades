import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from 'react-loading-indicator';
import CartItem from './CartItem';

export const CartTable = ({
  isLoading,
  cartProductData,
  cartData,
  setCartData,
  setTotalAmount,
  productDetails,
  customerID,
}) => {
  const hasCartData =
    cartProductData && cartData.length > 0 && productDetails.length > 0;

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr className="flex justify-center items-center">
          <LoadingIndicator />
        </tr>
      );
    } else if (hasCartData) {
      return cartProductData.map((cartItem, index) => (
        <CartItem
          key={index}
          cartItem={cartItem}
          index={index}
          cartData={cartData}
          setCartData={setCartData}
          setTotalAmount={setTotalAmount}
          customerID={customerID}
        />
      ));
    } else {
      return (
        <tr>
          <td colSpan={5} className="flex justify-center item-center">
            There is nothing in your cart.
          </td>
        </tr>
      );
    }
  };

  return (
    <table className="table-auto border-collapse w-full text-base md:text-lg border-t-2  border-black font-breezeRegular">
      <thead className=" text-base border-b-2 md:text-xl">
        <tr>
          <th className="md:w-44 w-40">My Cart</th>
          <th className="md:w-44 w-24">Product</th>
          <th className="w-32 hidden lg:table-cell">Price</th>
          <th className="lg:w-32 text-center hidden md:table-cell">Quantity</th>
          <th className="lg:w-36 text-center hidden md:table-cell">Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{renderTableContent()}</tbody>
    </table>
  );
};

CartTable.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  cartProductData: PropTypes.array,
  cartData: PropTypes.array.isRequired,
  setCartData: PropTypes.func.isRequired,
  setTotalAmount: PropTypes.func.isRequired,
  productDetails: PropTypes.array,
  customerID: PropTypes.string.isRequired,
};

export default CartTable;
