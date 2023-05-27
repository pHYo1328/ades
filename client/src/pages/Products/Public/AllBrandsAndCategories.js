import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AllBrandsAndCategories() {
  const [brands, setBrands] = useState(null);
  const [categories, setCategories] = useState(null);
  const [bookmarkStatus, setBookmarkStatus] = useState({}); // Store bookmark status for each brand
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const customerId = localStorage.getItem('userid');

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/brands`)
      .then((response) => {
        console.log(response);
        setBrands(response.data.data);
        console.log(brands);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/category`)
      .then((response) => {
        console.log(response);
        setCategories(response.data.data);
        console.log(categories);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const bookmarkClickHandler = (brandId) => {
    setBookmarkStatus((prevStatus) => ({
      ...prevStatus,
      [brandId]: !prevStatus[brandId],
    }));
  };

  return (
    <div className="bg-white w-full text-dark text-left container-fluid align-items-center">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div class="col-10" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <div class="row">
            <div class="col-10">Brands</div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
            {brands ? (
              brands.map((brand) => (
                <div className="group relative border border-gray-300 rounded p-4" key={brand.brand_id}>
                  <div className="flex justify-between">
                    <div className="text-left">
                      <h3 className="text-sm text-gray-700">
                        <a href={`/brands/${brand.brand_id}`}>
                          {brand.brand_name}
                        </a>
                      </h3>
                    </div>
                    <div>
                      <button onClick={() => bookmarkClickHandler(brand.brand_id)}>
                        <i
                          className={`bi bi-bookmark${bookmarkStatus[brand.brand_id] ? '-fill' : ''}`}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>

          <div class="row mt-5">
            <div class="col-10">Categories</div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
            {categories ? (
              categories.map((category) => (
                <div
                  className="group relative border border-gray-300 rounded p-4"
                  key={category.category_id}
                >
                  <div className="flex justify-between">
                    <div className="text-left">
                      <h3 className="text-sm text-gray-700">
                        <a href={`/categories/${category.category_id}`}>
                          {category.category_name}
                        </a>
                      </h3>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
