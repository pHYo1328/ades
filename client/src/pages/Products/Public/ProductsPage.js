import { useState, useEffect } from 'react';
import axios from 'axios';
// import Pagination from '@mui/material/Pagination';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import Pagination from '../../../components/Products/Pagination'

const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

export default function ProductsPage() {
  const [statistics, setStatistics] = useState(null);
  const [products, setProducts] = useState(null);
  const [brands, setBrands] = useState(null);
  const [categories, setCategories] = useState(null);
  const [categoryID, setCategoryID] = useState(0);
  const [brandID, setBrandID] = useState(0);
  const [limit, setLimit] = useState(0);
  const [total, setTotal] = useState(0);
  // const [pages, setPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // const offset = limit - 1 * currentPage;
  const [totalPages, setTotalPages] = useState(1);
  const [offset, setOffset] = useState(1);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/products/${categoryID}/${brandID}/${limit}/${offset}`)
      .then((response) => {
        console.log(response);
        setProducts(response.data.data);
        console.log(products);

        if(limit == 0){
          setTotalPages(1);
        }else{
          setTotalPages(Math.ceil(total / limit)); 
        }
        setCurrentPage(1)
        console.log("products.length: ", total)
        console.log("totalPages: ", totalPages)
        console.log("limit", limit)
      })
      .catch((error) => {
        console.error(error);
      });
  }, [categoryID, brandID, limit, currentPage]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/products/total/${categoryID}/${brandID}`)
      .then((response) => {
        console.log(response);
        setTotal(response.data.data);
        console.log(total);
      
      })
      .catch((error) => {
        console.error(error);
      });
  }, [categoryID, brandID])

  // useEffect(() => {
  //   if(limit == 0){
  //     setTotalPages(1);
  //   }else{
  //     setTotalPages(Math.ceil(products.length / limit)); 
  //   }
  //   setCurrentPage(1)
  //   console.log("products.length: ", products.length)
  //   console.log("totalPages: ", totalPages)
  //   console.log("limit", limit)
  // }, [limit])

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const calculatedOffset = limit * (page - 1) + 1;
    setOffset(calculatedOffset);
  };

  // useEffect(() => {
  //   const calculatedOffset = limit * (currentPage - 1) + 1;
  //   setOffset(calculatedOffset);
  // }, [currentPage, limit]);


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
      .get(`${baseUrl}/api/admin/statistics`)
      .then((response) => {
        console.log(response);
        setStatistics(response.data.data);
        console.log(statistics);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="bg-white w-full">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div class="row">
          <div class="col-6">
            <h2
              className="text-2xl font-bold tracking-tight text-gray-900 text-center"
              class="h2"
            >
              Products
            </h2>
          </div>
          <div class="col-2">
            <input
              min="0"
              type="number"
              class="form-control form-control-sm"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value, 10))}
              placeholder="Limit"
            />

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
                <p>Loading...</p>
              )}
              <option value={0}>
                All
              </option>
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
                <p>Loading...</p>
              )}
              <option value={0}>
                All
              </option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
          {products ? (
            products.map((product) => (
              <div
                key={product.product_id}
                className="group relative"
                onClick={() => {
                  const productID = product.product_id;
                  window.location.href = `/products/${productID}`;
                }}
              >
                <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <AdvancedImage cldImg={cld.image(product.image_url)} />
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="text-left">
                    <h3 className="text-sm text-gray-700">
                      <a href={`/product/${product.product_id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.product_name}
                      </a>
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
            <p>Loading...</p>
          )}
        </div>
      </div>

      <div class="pb-5 mb-5">
        <Pagination
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
          // totalPages={limit == 0 ? 0 : Math.ceil(products.length / limit)}
          totalPages = {totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        <p>{currentPage} / {totalPages}</p>
      </div>


    </div>
  );
}
