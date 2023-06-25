import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { Link } from 'react-router-dom';
import Product from '../../../components/Products/Product/Product';
import Loading from '../../../components/Loading/Loading';
const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

export default function ProductsByBrand() {
  const [products, setProducts] = useState(null);
  const [brand, setBrand] = useState(null);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  const { brandID } = useParams();

  // get all products by brand ID
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/products/brand/${brandID}`)
      .then((response) => {
        console.log(response);
        setProducts(response.data.data);
        console.log(products);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // get the brand name
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/brand/${brandID}`)
      .then((response) => {
        console.log(response);
        setBrand(response.data.data.brand_name);
        console.log(brand);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="bg-white w-full">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <Link to="/products">Products</Link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {brand}
            </li>
          </ol>
        </nav>


        {/* get the products by brand, if exists */}
        {products ? (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
            {products.map((product) => (
              <Product product={product} />
            ))
            }
          </div>
        ) : (
          // Loading component (full screen)
          <div className="flex items-center justify-center h-screen">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
}
