import { useState, useEffect } from 'react';
import axios from 'axios';
import chalk from 'chalk';
import { Link } from 'react-router-dom';

import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

export default function AdminDashboard() {
  const [products, setProducts] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  const [brands, setBrands] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [brand, setBrand] = useState(null);

  const [categories, setCategories] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [category, setCategory] = useState(null);
  const [orderID, setOrderID] = useState(null);

  const fetchCategories = () => {
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
  };

  const fetchBrands = () => {
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
  };

  const fetchProducts = () => {
    axios
      .get(`${baseUrl}/api/products`)
      .then((response) => {
        console.log(response);
        setProducts(response.data.data);
        console.log(products);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchProductsPromise = fetchProducts();
      const fetchBrandsPromise = fetchBrands();
      const fetchCategoriesPromise = fetchCategories();

      await Promise.all([
        fetchProductsPromise,
        fetchBrandsPromise,
        fetchCategoriesPromise,
      ]);
    };
    fetchData();
  }, []);

  const fetchStatistics = () => {
    axios
      .get(`${baseUrl}/api/admin/statistics`)
      .then((response) => {
        setStatistics(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchStatistics();
    const intervalId = setInterval(fetchStatistics, 60 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [products]);

  const handleSubmitBrand = async (event) => {
    console.log(chalk.yellow('submit button is clicked!'));
    event.preventDefault();

    if (!brandName) {
      window.alert('Please fill in the name of the brand');
    } else {
      const requestBody = {
        name: brandName,
        type: 'brand',
      };
      console.log(requestBody);
      axios
        .post(`${baseUrl}/api/products/admin/type`, requestBody)
        .then((response) => {
          console.log(response);
          setBrand(response.data.data);
          console.log(brand);
          fetchBrands();
          setBrandName('');
        });
    }
  };

  const handleSubmitCategory = async (event) => {
    console.log(chalk.yellow('submit button is clicked!'));
    event.preventDefault();

    if (!categoryName) {
      window.alert('Please fill in the name of the category');
    } else {
      const requestBody = {
        name: categoryName,
        type: 'category',
      };
      console.log(requestBody);
      axios
        .post(`${baseUrl}/api/products/admin/type`, requestBody)
        .then((response) => {
          console.log(response);
          setCategory(response.data.data);
          console.log(category);
          fetchCategories();
          setCategoryName('');
        });
    }
  };

  const handleSearchOrder = async (event) => {
    console.log(chalk.yellow('Search button is clicked!'));
    event.preventDefault();

    if (!orderID) {
      window.alert('Please fill in the order_id to process refund');
    } else {
      console.log(orderID);
      window.location.href = `/payment-refund/${orderID}`;
    }
  };

  return (
    <div class="row col-10" style={{ marginRight: 'auto', marginLeft: 'auto' }}>
      <div class="row">
        <h4 class="h4 font-weight-bold text-center mt-4">Admin Dashboard</h4>
      </div>

      {statistics ? (
        <div class="row my-2">
          <div class="col-3 text-center">
            <div
              class="d-flex align-items-center justify-content-center"
              style={{ height: '100%' }}
            >
              <div class="w-100 p-3 rounded" style={{ background: '#dff7ec' }}>
                <h4 class="h4">Total Sold</h4>
                <p>{statistics.total_sold}</p>
              </div>
            </div>
          </div>

          <div class="col-3 text-center">
            <div
              class="d-flex align-items-center justify-content-center"
              style={{ height: '100%' }}
            >
              <div class="w-100 p-3 rounded" style={{ background: '#dfeaf7' }}>
                <h4 class="h4">Total Inventory</h4>
                <p>{statistics.total_inventory}</p>
              </div>
            </div>
          </div>

          <div class="col-3 text-center">
            <div
              class="d-flex align-items-center justify-content-center"
              style={{ height: '100%' }}
            >
              <div class="w-100 p-3 rounded" style={{ background: '#f0f7df' }}>
                <h4 class="h4">Total Revenue</h4>
                <p>{statistics.total_payment}</p>
              </div>
            </div>
          </div>

          <div class="col-3 text-center">
            <div
              class="d-flex align-items-center justify-content-center"
              style={{ height: '100%' }}
            >
              <div class="w-100 p-3 rounded" style={{ background: '#f3dff5' }}>
                <h4 class="h4">Total Order</h4>
                <p>{statistics.total_order}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <div
        class="row my-2"
        style={{
          height: '300px',
          overflowY: 'scroll',
          background: '#c2d9ff',
        }}
      >
        <div
          class="py-2 w-100 col-12"
          style={{
            position: 'sticky',
            top: '0',
            background: '#dff7ec',
            width: '100%',
          }}
        >
          <div className="row">
            <div className="col-10">Products</div>
            <div className="col-2">
              <Link
                to="/products/create"
                className="btn btn-success w-100 col-6 text-dark mr-2"
                id="createButton"
              >
                Create
              </Link>
            </div>
          </div>
        </div>
        <ul role="list" class="divide-y divide-gray-100">
          {products ? (
            products.map((product) => (
              <div class="d-flex flex-row row py-3 justify-content-around">
                <div class="col-2">
                  <AdvancedImage
                    class="h-12 w-12 flex-none bg-gray-50"
                    cldImg={cld.image(product.image_url)}
                  />
                </div>
                <div class="col-6">
                  <p class="text-sm font-semibold leading-6 text-gray-900">
                    {product.product_name}
                  </p>
                  <p class="mt-1 truncate text-xs leading-5 text-gray-500">
                    {product.category_name} - {product.brand_name}
                  </p>
                </div>
                <div class="col-4 d-flex justify-content-end">
                  <div class="col-6">
                    <button
                      id="plusButton"
                      onClick={() => {
                        const productID = product.product_id;
                        axios
                          .put(
                            `${baseUrl}/api/products/inventory/plus/${productID}`
                          )
                          .then((response) => {
                            console.log('Increase button is clicked');
                            fetchProducts();
                            fetchStatistics();
                          })
                          .catch((error) => {
                            console.error(error);
                          });
                      }}
                    >
                      <i class="bi bi-plus-circle"></i>
                    </button>
                    <p>{product.quantity}</p>
                    <button
                      id="minusButton"
                      onClick={() => {
                        if (product.quantity >= 1) {
                          const productID = product.product_id;
                          axios
                            .put(
                              `${baseUrl}/api/products/inventory/minus/${productID}`
                            )
                            .then((response) => {
                              console.log('Decrease button is clicked');
                              fetchProducts();
                              fetchStatistics();
                            })
                            .catch((error) => {
                              console.error(error);
                            });
                        }
                      }}
                    >
                      <i class="bi bi-dash-circle"></i>
                    </button>
                  </div>

                  <Link to={`/products/edit/${product.product_id}`}>
                    <i className="bi bi-pencil-square"></i>
                  </Link>

                  <button
                    onClick={() => {
                      const productID = product.product_id;
                      axios
                        .delete(`${baseUrl}/api/products/${productID}`)
                        .then((res) => {
                          const updatedProducts = products.filter(
                            (p) => p.product_id !== productID
                          );
                          setProducts(updatedProducts);
                        });
                    }}
                  >
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </ul>
      </div>

      <div class="row">
        <div
          class="col-5"
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            height: '300px',
            overflowY: 'scroll',
            background: '#c2d9ff',
          }}
        >
          <div class="row">
            <div class="col-10">Brands</div>
          </div>
          <div
            class="row col-12"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          >
            <div class="col-8">
              <input
                type="text"
                className="form-control"
                placeholder="Brand Name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>
            <div class="col-4">
              <button
                class="btn btn-outline-success w-100"
                onClick={handleSubmitBrand}
              >
                Add
              </button>
            </div>
          </div>
          <ul role="list" class="divide-y divide-gray-100">
            {brands ? (
              brands.map((brand) => (
                <div class="d-flex flex-row row py-3 justify-content-around">
                  <div class="col-6">
                    <p class="text-sm font-semibold leading-6 text-gray-900">
                      {brand.brand_name}
                    </p>
                  </div>
                  <div class="col-4 d-flex justify-content-end">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const brandID = brand.brand_id;
                        axios
                          .delete(`${baseUrl}/api/brands/${brandID}`)
                          .then((res) => {
                            const updatedBrands = brands.filter(
                              (b) => b.brand_id !== brandID
                            );
                            setBrands(updatedBrands);
                            fetchBrands();
                            fetchProducts();
                          });
                      }}
                    >
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </ul>
        </div>
        <div
          class="col-5"
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            height: '300px',
            overflowY: 'scroll',
            background: '#c2d9ff',
          }}
        >
          <div class="row">
            <div class="col-10">Categories</div>
          </div>

          <div
            class="row col-12"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          >
            <div class="col-8">
              <input
                type="text"
                className="form-control"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            <div class="col-4">
              <button
                class="btn btn-outline-success w-100"
                onClick={handleSubmitCategory}
              >
                Add
              </button>
            </div>
          </div>
          <ul role="list" class="divide-y divide-gray-100">
            {categories ? (
              categories.map((category) => (
                <div class="d-flex flex-row row py-3 justify-content-around">
                  <div class="col-6">
                    <p class="text-sm font-semibold leading-6 text-gray-900">
                      {category.category_name}
                    </p>
                  </div>
                  <div class="col-4 d-flex justify-content-end">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const categoryID = category.category_id;
                        axios
                          .delete(`${baseUrl}/api/categories/${categoryID}`)
                          .then((res) => {
                            const updatedCategories = categories.filter(
                              (c) => c.category_id !== categoryID
                            );
                            setCategories(updatedCategories);
                            fetchCategories();
                            fetchProducts();
                          });
                      }}
                    >
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </ul>
        </div>
      </div>

      <div class="row">
        <div
          class="col-5"
          style={{
            marginTop: '10px',
            background: '#c2d9ff',
          }}
        >
          <div class="row">
            <div class="col-10">Refund</div>
          </div>
          <div
            class="row col-12"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          >
            <div class="col-8">
              <input
                type="text"
                class="form-control"
                placeholder="Enter order_id..."
                value={orderID}
                onChange={(e) => setOrderID(e.target.value)}
              />
            </div>
            <div class="col-4">
              <button
                class="btn btn-outline-success w-100"
                onClick={handleSearchOrder}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
