import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { Link } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
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
              <div key={product.product_id} className="group relative">
                <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-50">
                  <AdvancedImage cldImg={cld.image(product.image_url)} />
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="text-left">
                    <h3 className="text-sm text-gray-700">
                      <Link to={`/product/${product.product_id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.product_name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.brand_name}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 justify-start">
                    {product.price}
                  </p>
                </div>
              </div>
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
