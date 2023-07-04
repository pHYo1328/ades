import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProductList from '../../../components/Products/Product/ProductList';
import Breadcrumb from '../../../components/Breadcrumb';

export default function ProductsByBrand() {
  const [products, setProducts] = useState(null);
  const [brand, setBrand] = useState(null);
  const [hasResults, setHasResults] = useState(false);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  const { brandID } = useParams();

  useEffect(() => {
    Promise.all([
      axios.get(`${baseUrl}/api/products/brand/${brandID}`),
      axios.get(`${baseUrl}/api/brand/${brandID}`)
    ])
      .then(([productsResponse, brandResponse]) => {
        console.log(productsResponse);
        setProducts(productsResponse.data.data);
        setHasResults(true);
        console.log(products);

        console.log(brandResponse);
        setBrand(brandResponse.data.data.brand_name);
        console.log(brand);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);


  return (
    <div className="bg-white w-full">
      <div className="bg-white w-11/12 mx-auto">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <Breadcrumb linkTo={`/products`} main={"Products"} value={brand} />
          <ProductList hasResults={hasResults} products={products} />
        </div>
      </div>
    </div>
  );
}
