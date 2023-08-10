import React, { useState } from 'react';
import Product from './Product';
import Loading from '../../Loading/Loading';

export default function ProductList({
  products,
  hasProducts,
  refunds,
  setProducts,
  setRefunds,
  fetchProducts,
  fetchStatistics,
}) {
  const headers = [
    { key: 'product_name', label: 'Name' },
    { key: 'category_name', label: 'Category' },
    { key: 'brand_name', label: 'Brand' },
    { key: 'price', label: 'Price' },
    { key: 'quantity', label: 'Inventory' },
    { key: 'action', label: 'Action' },
  ];

  const [sortedProducts, setSortedProducts] = useState(products);
  const [sortStatus, setSortStatus] = useState({
    price: 0,
    inventory: 0,
    name: 0,
    category: 0,
    brand: 0,
  });

  const sortProducts = (property) => {
    setSortStatus((prevStatus) => {
      const newStatus = { ...prevStatus };
      newStatus[property] = newStatus[property] === 1 ? 2 : 1;
      return newStatus;
    });

    setSortedProducts((prevProducts) => {
      const sorted = [...prevProducts].sort((a, b) => {
        if (property === 'price' || property === 'inventory') {
          return sortStatus[property] === 1 ? b[property] - a[property] : a[property] - b[property];
        } else {
          return sortStatus[property] === 1 ? a[property].localeCompare(b[property]) : b[property].localeCompare(a[property]);
        }
      });
      return sorted;
    });
  };

  return (
    <div className="relative  overflow-x-auto overflow-y-auto max-h-[60vh] sm:max-h-[60vh] md:max-h-[70vh] lg:max-h-[70vh] shadow-md sm:rounded-lg">
      {hasProducts ? (
        products ? (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center">
              <tr>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Image</span>
                  {/* Image */}
                </th>
                {headers.map((header) => (
                  <th
                    scope="col"
                    className="px-6 py-3 text-center"
                    key={header.key}
                  >
                    <div class="flex items-center text-center">
                      {header.label}
                      {header.label !== 'Action' && (
                        <button className={header.label === 'Action' ? 'hidden' : ''} onClick={() => sortProducts(header.key)}><svg class="w-3 h-3 ml-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg></button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-400 h-98 overflow-y-auto">
              {sortedProducts.map((product) => (
                <Product
                  product={product}
                  products={products}
                  refunds={refunds}
                  fetchProducts={() => fetchProducts()}
                  fetchStatistics={() => fetchStatistics()}
                  setRefunds={setRefunds}
                  setProducts={setProducts}
                />
              ))}
            </tbody>
          </table >
        ) : (
          // If no results match the search
          <p className="my-40 text-center text-gray-500">No results found</p>
        )
      ) : (
        // Loading component (full screen)
        <div className="flex items-center justify-center h-screen">
          <Loading />
        </div>
      )
      }
    </div >
  );
}
