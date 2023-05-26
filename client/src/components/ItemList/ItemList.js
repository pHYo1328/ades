import React from 'react';

const ItemList = ({ items }) => {
  console.log(items);
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.product_name}</li>
      ))}
    </ul>
  );
};

export default ItemList;
