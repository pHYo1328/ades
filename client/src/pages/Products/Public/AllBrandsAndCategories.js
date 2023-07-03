import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import api from '../../../index';
import Loading from '../../../components/Loading/Loading';
export default function AllBrandsAndCategories() {
  const [brands, setBrands] = useState(null);
  const [categories, setCategories] = useState(null);
  const [bookmarkStatus, setBookmarkStatus] = useState({}); // Store bookmark status for each brand
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const bookmarkedBrandsRef = useRef([]);
  const customerId = localStorage.getItem('userid');

  // get all brands
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

  // get all categories
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

  // add to customer's bookmarked brands when the customer clicks on the bookmark button
  useEffect(() => {
    api
      .get(`/api/bookmark/${customerId}`)
      .then((response) => {
        console.log(response);
        const bookmarkData = response.data.data;
        const bookmarkStatusData = {};
        bookmarkData.forEach((bookmark) => {
          bookmarkStatusData[bookmark.brand_id] = true;
        });
        setBookmarkStatus(bookmarkStatusData);
        bookmarkedBrandsRef.current = bookmarkData.map(
          (bookmark) => bookmark.brand_id
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, [customerId]);

  const bookmarkClickHandler = (brandId) => {
    setBookmarkStatus((prevStatus) => {
      // Toggle bookmark status
      const newStatus = { ...prevStatus, [brandId]: !prevStatus[brandId] };
      if (newStatus[brandId]) {
        // If brand is bookmarked, send a POST request to add the brand to the bookmarks
        api
          .post('/api/bookmark/add', {
            customerId,
            brandId,
          })
          .then((response) => {
            console.log('Brand bookmarked successfully');
            console.log(response);
          })
          .catch((error) => {
            console.error('Error bookmarking brand:', error);
          });
      } else {
        // If brand is un-bookmarked, send a POST request to remove the brand from the bookmarks
        api
          .delete(`/api/bookmark/remove/${customerId}/${brandId}`)
          .then((response) => {
            console.log('Brand un-bookmarked successfully');
            console.log(response);
          })
          .catch((error) => {
            console.error('Error un-bookmarking brand:', error);
          });
      }
      return newStatus;
    });
  };

  return (
    <div className="bg-white w-full">
      <div className="bg-white w-11/12 mx-auto text-dark text-left">
        <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          {/* Brands */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Brands</h2>
            {brands ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {brands.map((brand) => (
                  <div
                    className="group relative border border-gray-300 rounded p-4"
                    key={brand.brand_id}
                  >
                    <div className="flex justify-between">
                      <div className="text-left">
                        <h3 className="text-sm text-gray-700">
                          {/* link to ProductsByBrand to show all the products related to the brand */}
                          <Link to={`/brands/${brand.brand_id}`}>
                            {brand.brand_name}
                          </Link>
                        </h3>
                      </div>
                      <div>
                        {/* bookmark button */}
                        <button
                          onClick={() => bookmarkClickHandler(brand.brand_id)}
                        >
                          <i
                            className={`bi bi-bookmark${
                              bookmarkStatus[brand.brand_id] ? '-fill' : ''
                            }`}
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Loading component (full screen)
              <div className="flex items-center justify-center">
                <Loading />
              </div>
            )}
          </div>

          <hr className="my-10" />

          {/* Categories */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Categories</h2>
            {categories ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {categories.map((category) => (
                  <div
                    className="group relative border border-gray-300 rounded p-4"
                    key={category.category_id}
                  >
                    <div className="flex justify-between">
                      <div className="text-left">
                        <h3 className="text-sm text-gray-700">
                          {/* goes to ProductsByCategory to show all the products related to the category */}
                          <Link to={`/categories/${category.category_id}`}>
                            {category.category_name}
                          </Link>
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Loading component (full screen)
              <div className="flex items-center justify-center">
                <Loading />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
