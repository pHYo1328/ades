import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from '../../../components/Products/Product/ProductList';

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
          <ProductList hasResults={hasResults} products={products} />
        </div>
      </div>
    </div>
  );
}
