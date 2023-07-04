import { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../../../components/Products/Pagination';
import Brands from '../../../components/Products/Product/Brands';
import Categories from '../../../components/Products/Product/Categories';
import ProductList from '../../../components/Products/Product/ProductList';
import NumberInput from '../../../components/NumberInput';

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
  const [hasResults, setHasResults] = useState(false)
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  const sortOptions = [
    { value: 1, label: "Price (Ascending)" },
    { value: 2, label: "Price (Descending)" },
    { value: 3, label: "Name (A-Z)" },
    { value: 4, label: "Name (Z-A)" }
  ];

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
    axios
      .get(
        `${baseUrl}/api/products/${categoryID}/${brandID}/${limit}/${offset}/${sort}`
      )
      .then((response) => {
        console.log(response);
        console.log(response.data.data);
        setProducts(response.data.data);
        setHasResults(true);
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
                <NumberInput min={1} value={limit} func={(e) => setLimit(parseInt(e.target.value))} placeholder={"Limit"} />
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
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 p-2">
              <Categories setCategoryID={setCategoryID} all={true} />
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 p-2">
              <Brands setBrandID={setBrandID} all={true} />
            </div>
          </div>

          <ProductList hasResults={hasResults} products={products} />

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
