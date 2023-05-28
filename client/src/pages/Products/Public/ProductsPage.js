import { useState, useEffect } from 'react';
import axios from 'axios';
// import Pagination from '@mui/material/Pagination';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import Pagination from '../../../components/Products/Pagination';
import { Link } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

export default function ProductsPage() {
  const [products, setProducts] = useState(null);
  const [brands, setBrands] = useState(null);
  const [categories, setCategories] = useState(null);
  const [categoryID, setCategoryID] = useState(0);
  const [brandID, setBrandID] = useState(0);
  const [sort, setSort] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

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
      .get(
        `${baseUrl}/api/products/${categoryID}/${brandID}/${limit}/${offset}/${sort}`
      )
      .then((response) => {
        console.log(response);
        setProducts(response.data.data);
        console.log(products);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [categoryID, brandID, sort, limit, offset]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/products/total/${categoryID}/${brandID}`)
      .then((response) => {
        console.log('total number of products', response.data.data);
        console.log(response.data.data);
        setTotalProducts(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [categoryID, brandID]);
  
  useEffect(() => {
    setTotalProducts(totalProducts);
    console.log('total number of products', totalProducts);
  }, [totalProducts]);
  
  useEffect(() => {
    console.log('total number of products for pages', totalProducts);
    console.log('limit for pages', limit);
    console.log('pages', Math.ceil(totalProducts/limit))
    if (limit !== 0 && Math.ceil(totalProducts/limit)>1) {
      setTotalPages(Math.ceil(totalProducts / limit));
    } else {
      setTotalPages(1); 
    }
  }, [totalProducts, limit]);

  useEffect(() => {
    if(limit!=0){
      setTotalPages(totalPages);
    }
    console.log('total page: ', totalPages)
  }, [totalPages])
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log(page)
    const calculatedOffset = limit * (page - 1);
    console.log('calculated offset: ', calculatedOffset)
    setOffset(calculatedOffset);
  };

  useEffect(() => {
    setOffset(offset);
    console.log('offset: ', offset);
  }, [offset])

  useEffect(() => {
    setCurrentPage(currentPage)
    console.log('current page: ', currentPage)
  }, [brandID, categoryID, limit])
  
  return (
    <div className="bg-white w-full">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div class="row">
          <div class="col-4">
            <h2
              className="text-2xl font-bold tracking-tight text-gray-900 text-center"
              class="h2"
            >
              Products
            </h2>
          </div>
          <div class="col-2">
            <div class="input-group mb-3">
              <input
                min="1"
                type="number"
                class="form-control form-control-sm"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                placeholder="Limit"
                aria-describedby="basic-addon2"
              />
              <div class="input-group-append">
                <span class="input-group-text" id="basic-addon2">
                  Products/Page
                </span>
              </div>
            </div>
          </div>
          <div class="col-2">
            <select
              class="form-select form-select-sm"
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
          <div class="col-2">
            <select
              class="form-select form-select-sm"
              onChange={(e) => setCategoryID(e.target.value)}
            >
              <option disabled selected value="0">
                -- CATEGORY --
              </option>
              {categories ? (
                categories.map((category) => (
                  <option value={category.category_id}>
                    {category.category_name}
                  </option>
                ))
              ) : (
                <div className="flex items-center justify-center h-screen">
                <div className="mx-auto flex flex-col items-center">
                  <FadeLoader
                    color={'navy'}
                    loading={true}
                    size={100}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                  <p>Loading...</p>
                </div>
              </div>
              )}
              <option value={0}>All</option>
            </select>
          </div>
          <div class="col-2">
            <select
              class="form-select form-select-sm"
              onChange={(e) => setBrandID(e.target.value)}
            >
              <option disabled selected value>
                -- BRAND --
              </option>
              {brands ? (
                brands.map((brand) => (
                  <option value={brand.brand_id}>{brand.brand_name}</option>
                ))
              ) : (
                <div className="flex items-center justify-center h-screen">
              <div className="mx-auto flex flex-col items-center">
                <FadeLoader
                  color={'navy'}
                  loading={true}
                  size={100}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
                <p>Loading...</p>
              </div>
            </div>
              )}
              <option value={0}>All</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
          {products ? (
            products.map((product) => (
              <div
                key={product.product_id}
                className="group relative"
              >
                <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
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
          ) : (
            <div className="flex items-center justify-center h-screen">
              <div className="mx-auto flex flex-col items-center">
                <FadeLoader
                  color={'navy'}
                  loading={true}
                  size={100}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
                <p>Loading...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        class="pb-5 mb-5"
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
      >
        <Pagination
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        <p class="text-center h6 mt-4">
          {currentPage} / {totalPages}
        </p>
      </div>
      
    </div>
  );
}
