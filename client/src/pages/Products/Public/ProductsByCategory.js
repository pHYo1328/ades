import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProductList from '../../../components/Products/Product/ProductList';
import Breadcrumb from '../../../components/Breadcrumb';

export default function ProductsByCategory() {
  const [products, setProducts] = useState(null);
  const [category, setCategory] = useState(null);
  const [hasResults, setHasResults] = useState(false);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  const { categoryID } = useParams();

  useEffect(() => {
    Promise.all([
      axios.get(`${baseUrl}/api/products/category/${categoryID}`),
      axios.get(`${baseUrl}/api/category/${categoryID}`)
    ])
      .then(([productsResponse, categoryResponse]) => {
        console.log(productsResponse);
        setProducts(productsResponse.data.data);
        setHasResults(true);
        console.log(products);

        console.log(categoryResponse);
        setCategory(categoryResponse.data.data.category_name);
        console.log(category);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="bg-white w-full">
      <div className="bg-white w-11/12 mx-auto">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <Breadcrumb linkTo={`/products`} main={"Products"} value={category} />
          <ProductList hasResults={hasResults} products={products} />
        </div>
      </div>
    </div>
  );
}
