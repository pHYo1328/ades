import React, { useState } from 'react';
import {
  FaClipboard,
  FaMapMarkedAlt,
  FaRegCalendarAlt,
  FaDollarSign,
} from 'react-icons/fa';
import { RiTruckLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import UserTimezoneDate from './UserTimeZoneDate';
import 'react-toastify/dist/ReactToastify.css';
import { SaveButton, EditAddressButton, PayButton } from './ButtonsComponents';
const OrderListHeader = ({
  item,
  renderButton,
  clearedItems,
  items,
  setItems,
  customerID,
  index,
  renderOrderDate = true,
}) => {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedShippingAddress, setEditedShippingAddress] = useState('');
  const [isInvalidAddress, setIsInvalidAddress] = useState(false);
  const navigate = useNavigate();
  // same concept with inventory checking in cart
  // fetch all items according to order list and check quantity
  // if one item cannot make it, must cancel that order item
  return (
    <div className="ml-1 mr-1 md:ml-6 md:mr-6 md:mt-6 md:mb-6 pl-2 pr-2 md:pl-6 md:pr-6 py-2 bg-gray-100 rounded-md">
      <div className="flex flex-row items-center">
        <table className="table-auto text-base flex-grow hidden lg:block">
          <thead>
            <tr>
              <th className="w-1/6 p-2">
                <p className="flex flex-row items-center">
                  <FaClipboard className="text-green-700 mr-2" />
                  Order ID
                </p>
              </th>
              {renderOrderDate && (
                <th className="w-1/6 p-2">
                  <p className="flex flex-row items-center space-x-1">
                    <FaRegCalendarAlt className="text-green-700 mr-2" />
                    Order Date
                  </p>
                </th>
              )}
              {item.payment_date && (
                <th className="w-1/6 p-2">
                  <p className="flex flex-row items-center space-x-1">
                    <FaRegCalendarAlt className="text-green-700 mr-2" />
                    Payment Date
                  </p>
                </th>
              )}
              {item.totalAmount && (
                <th className="w-1/6 p-2">
                  <p className="flex flex-row items-center space-x-2">
                    <FaDollarSign className="text-green-700 mr-2" />
                    Total Amount
                  </p>
                </th>
              )}
              <th className="w-1/6 p-2">
                <p className="flex flex-row items-center space-x-2">
                  <RiTruckLine className="text-green-700 mr-2" />
                  Shipping Method
                </p>
              </th>
              <th className="w-1/3 p-2">
                <p className="flex flex-row items-center space-x-1">
                  <FaMapMarkedAlt className="text-green-700 mr-2" />
                  Shipping Address
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 align-top">{item.order_id}</td>
              {renderOrderDate && (
                <td className="p-2 align-top">
                  <UserTimezoneDate date={item.order_date} />
                </td>
              )}
              {item.payment_date && (
                <td className="p-2 align-top">
                  <UserTimezoneDate date={item.payment_date} />
                </td>
              )}
              {item.totalAmount && (
                <td className="p-2 align-top">${item.totalAmount}</td>
              )}
              <td className="p-2 align-top">{item.shipping_method}</td>
              <td className="p-2 align-top">
                {editingIndex === index ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={editedShippingAddress}
                      onChange={(event) =>
                        setEditedShippingAddress(event.target.value)
                      }
                      className="border border-gray-300 rounded flex-grow"
                    />
                    {isInvalidAddress && (
                      <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-3/4 p-2 mt-1 rounded-md bg-red-500 text-white text-sm">
                        Invalid Address
                        <div className="tooltip-arrow" data-popper-arrow></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>{item.shipping_address}</p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div className=" hidden lg:flex">
          {editingIndex === index ? (
            <SaveButton
              item={item}
              editedShippingAddress={editedShippingAddress}
              setIsInvalidAddress={setIsInvalidAddress}
              items={items}
              setItems={setItems}
              setEditingIndex={setEditingIndex}
              customerID={customerID}
            />
          ) : (
            item.shipping_start_at == null && (
              <>
                <EditAddressButton
                  index={index}
                  setEditingIndex={setEditingIndex}
                  clearedItems={clearedItems}
                  setEditedShippingAddress={setEditedShippingAddress}
                />
                {renderButton && (
                  <PayButton items={items} item={item} navigate={navigate} />
                )}
              </>
            )
          )}
        </div>
      </div>
      <div className="text-base p-1 lg:hidden">
        <div className="flex flex-row py-4 justify-between border-b-2 border-gray-300">
          <p className="flex flex-row items-center mr-6 whitespace-nowrap">
            <FaClipboard className="text-green-700 mr-2" />
            Order ID
            <span className="md:hidden">:</span>
          </p>
          <p>{item.order_id}</p>
        </div>
        {renderOrderDate && (
          <div className="flex flex-row py-4 justify-between border-b-2 border-gray-300">
            <p className="flex flex-row items-center space-x-1">
              <FaRegCalendarAlt className="text-green-700 mr-2" />
              Order Date
              <span className="md:hidden">:</span>
            </p>
            <UserTimezoneDate date={item.order_date} />
          </div>
        )}
        {item.payment_date && (
          <div className="flex flex-row py-4 justify-between border-b-2 border-gray-300">
            <p className="flex flex-row items-center space-x-1">
              <FaRegCalendarAlt className="text-green-700 mr-2" />
              Payment Date
              <span className="md:hidden">:</span>
            </p>
            <UserTimezoneDate date={item.payment_date} />
          </div>
        )}
        {item.totalAmount && (
          <div className="flex flex-row py-4 justify-between border-b-2 border-gray-300">
            <p className="flex flex-row items-center space-x-1">
              <FaDollarSign className="text-green-700 mr-2" />
              Total Amount
              <span className="md:hidden">:</span>
            </p>
            <p>${item.totalAmount}</p>
          </div>
        )}
        <div className="flex flex-row py-4 justify-between border-b-2 border-gray-300">
          <p className="flex flex-row items-center space-x-1">
            <RiTruckLine className="text-green-700 mr-2" />
            Shipping Method
            <span className="md:hidden">:</span>
          </p>
          <p>{item.shipping_method}</p>
        </div>
        <div className="sm:flex flex-row py-4 justify-between border-b-2 border-gray-300">
          <p className="flex flex-row items-center space-x-1">
            <FaMapMarkedAlt className="text-green-700 mr-2" />
            Shipping Address
          </p>
          {editingIndex === index ? (
            <div className="relative">
              <input
                type="text"
                value={editedShippingAddress}
                onChange={(event) =>
                  setEditedShippingAddress(event.target.value)
                }
                className="border border-gray-300 rounded w-full"
              />
              {isInvalidAddress && (
                <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-3/4 p-2 mt-1 rounded-md bg-red-500 text-white text-sm">
                  Invalid Address
                  <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
              )}
            </div>
          ) : (
            <p>{item.shipping_address}</p>
          )}
        </div>
        <div className="flex flex-row py-2 sm:py-4">
          {editingIndex === index ? (
            <SaveButton
              item={item}
              editedShippingAddress={editedShippingAddress}
              setIsInvalidAddress={setIsInvalidAddress}
              items={items}
              setItems={setItems}
              setEditingIndex={setEditingIndex}
            />
          ) : (
            item.shipping_start_at == null && (
              <>
                <EditAddressButton
                  index={index}
                  setEditingIndex={setEditingIndex}
                  clearedItems={clearedItems}
                  setEditedShippingAddress={setEditedShippingAddress}
                />
                {renderButton && (
                  <PayButton items={items} item={item} navigate={navigate} />
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderListHeader;
