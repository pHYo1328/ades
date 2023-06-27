import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../../../components/Loading/Loading';
import Product from '../../../components/Products/Product/Product';

export default function SearchResults() {
  const [hasResults, setHasResults] = useState(false);
  const [products, setProducts] = useState(null);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const clientUrl = process.env.REACT_APP_DOMAIN_BASE_URL;

  // gets the products based on the search results
  useEffect(() => {
    const query = window.location.href.split(`${clientUrl}/`)[1];
    axios
      .get(`${baseUrl}/api/${query}`)
      .then((response) => {
        console.log('response: ', response);
        setProducts(response.data.data);
        setHasResults(true);
        console.log(response.data);
        console.log(products);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="bg-white w-full">
      <div className="w-11/12 mx-auto">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Search Results</h2>

          {/* If the product has results, show the products */}
          {hasResults ? (
            products ? (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {products.map((product) => (
                  <Product key={product.id} product={product} />
                ))}
              </div>
            ) : (
              // If no results match the search
              <p className="mt-40 text-center text-gray-500">No results found</p>
            )
          ) : (
            // Loading component (full screen)
            <div className="flex items-center justify-center h-screen">
              <Loading />
            </div>
          )}

        </div>
      </div>
    </div>

  );
}
