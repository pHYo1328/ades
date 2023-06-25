import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import Loading from '../../../components/Loading/Loading';
import Product from '../../../components/Products/Product/Product';
import { Link } from 'react-router-dom';
const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});
export default function ProductsByCategory() {
  const [products, setProducts] = useState(null);
  const [category, setCategory] = useState(null);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  const { categoryID } = useParams();

  // get all products by category ID
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/products/category/${categoryID}`)
      .then((response) => {
        console.log(response);
        setProducts(response.data.data);
        console.log(products);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // get the category name
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/category/${categoryID}`)
      .then((response) => {
        console.log(response);
        setCategory(response.data.data.category_name);
        console.log(category);
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
              {category}
            </li>
          </ol>
        </nav>

        {/* shows all the products by Category ID, if exists */}
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
