import { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../../../components/Products/Pagination';
import Loading from '../../../components/Loading/Loading';
import Product from '../../../components/Products/Product/Product';
import Brands from '../../../components/Products/Product/Brands';
import Categories from '../../../components/Products/Product/Categories';

export default function ProductsPage() {
  const [resetPage, setResetPage] = useState(true);
  const [products, setProducts] = useState(null);
  const [categoryID, setCategoryID] = useState(0);
  const [brandID, setBrandID] = useState(0);
  const [sort, setSort] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  // changes the offset and current page as the user changes the page using pagination
  const handlePageChange = (page) => {
    setResetPage(false);
    setCurrentPage(page);
    console.log(page);
    const calculatedOffset = limit * (page - 1);
    console.log('calculated offset: ', calculatedOffset);
    setOffset(calculatedOffset);
  };

  // gets the products based on the filters input by user
  useEffect(() => {
    if (resetPage) {
      setCurrentPage(1);
    }
    setOffset(limit * (currentPage - 1));
    console.log(offset);
    console.log(limit);
    console.log(
      `${baseUrl}/api/products/${categoryID}/${brandID}/${limit}/${offset}/${sort}`
    );
    axios
      .get(
        `${baseUrl}/api/products/${categoryID}/${brandID}/${limit}/${offset}/${sort}`
      )
      .then((response) => {
        console.log(response);
        console.log(response.data.data);
        setProducts(response.data.data);
        console.log(products);
      })
      .catch((error) => {
        console.error(error);
      });
    setResetPage(true);
  }, [categoryID, brandID, sort, limit, offset]);

  // get the total number of products based on the filters input by user
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/products/total/${categoryID}/${brandID}`)
      .then((response) => {
        console.log('total number of products', response.data.data);
        console.log(response.data.data);
        setTotalProducts(response.data.data);
        setOffset(0);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [categoryID, brandID]);

  // change the total number of pages, based on limit and total number of products
  useEffect(() => {
    console.log('total number of products for pages', totalProducts);
    console.log('limit for pages', limit);
    console.log('pages', Math.ceil(totalProducts / limit));
    if (limit !== 0 && Math.ceil(totalProducts / limit) >= 1) {
      setTotalPages(Math.ceil(totalProducts / limit));
    } else {
      setTotalPages(1);
    }
  }, [totalProducts, limit]);

  // if limit is n ot 0, set the total number of pages
  useEffect(() => {
    if (limit != 0) {
      setTotalPages(totalPages);
    }
    console.log('total page: ', totalPages);
  }, [totalPages]);

  return (
    <div className="bg-white w-full">
      <div className="bg-white w-11/12 mx-auto">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex flex-wrap items-center mb-10">
            <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 p-2">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-left">
                Products
              </h2>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 p-2">
              <div className="flex items-center">
                <input
                  min="1"
                  type="number"
                  className="border border-gray-300 rounded-md py-2 px-3 w-full"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value))}
                  placeholder="Limit"
                  aria-describedby="basic-addon2"
                />
                <span className="ml-2 text-sm text-gray-600">Products/Page</span>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 p-2">
              <select
                className="form-select form-select-md w-full"
                aria-label=".form-select-sm example"
                onChange={(e) => setSort(e.target.value)}
              >
                <option disabled selected value={0}>
                  Sort
                </option>
                <option value={1}>Price (Ascending)</option>
                <option value={2}>Price (Descending)</option>
                <option value={3}>Name (A-Z)</option>
                <option value={4}>Name (Z-A)</option>
              </select>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 p-2">
              <Categories setCategoryID={setCategoryID} all={true} />
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 p-2">
              <Brands setBrandID={setBrandID} all={true} />
            </div>
          </div>

          {/* shows all the products, based on the filter input */}
          {products ? (
            products.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
                {products.map((product) => (
                  <Product product={product} />
                ))}
              </div>
            ) : (
              <p className="mt-40 text-center text-gray-500">No results found</p>
            )
          ) : (
            // Loading component (full screen)
            <div className="flex items-center justify-center h-screen">
              <Loading />
            </div>
          )}
        </div>

        <div className="pb-5 mb-5 mx-auto">
          {/* handles pagination */}
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
          {/* shows the current page that the user is at */}
          <p className="text-center text-sm mt-4">
            {currentPage} / {totalPages}
          </p>
        </div>
      </div>
    </div>

  );
}
