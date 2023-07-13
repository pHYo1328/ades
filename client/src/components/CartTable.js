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
    <table className="border-collapse w-full text-base md:text-lg border-t-2  border-black font-breezeRegular">
      <thead className=" text-base border-b-2 md:text-xl">
        <tr>
          <th className="w-1/8">My Cart</th>
          <th className="w-1/4">Product</th>
          <th className="hidden lg:table-cell w-1/6">Price</th>
          <th className="lg:w-1/12 text-center hidden sm:table-cell">
            Quantity
          </th>
          <th className="lg:w-1/5 text-center hidden sm:table-cell">Total</th>
        </tr>
      </thead>
      <tbody>{renderTableContent()}</tbody>
    </table>
  );
};
