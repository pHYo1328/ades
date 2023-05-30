import { useState, useEffect } from 'react';
import axios from 'axios';
import chalk from 'chalk';
import { Link, useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

export default function AdminDashboard() {
  const navigate = useNavigate();

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
  const [refunds, setRefunds] = useState(null);

  // useEffect(() => {
  //   const roles = JSON.parse(localStorage.getItem('roles'));
  //   console.log(roles);
  //   const isAdmin = roles.includes('admin');
  //   console.log(isAdmin);
  //   if (!isAdmin) {
  //     // User does not have the required role(s), redirect them to the homepage or show an error message
  //     // alert("you're not admin");
  //     console.log('Redirecting to homepage-admin');
  //     navigate('/homepage');
  //   }
  // }, []);

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem('roles'));
    console.log(roles);
    if (!roles) {
      // User does not have the required role(s), redirect them to the homepage or show an error message
      console.log('Redirecting to login');
      navigate('/login');
    } else {
      const isAdmin = roles.includes('admin');
      console.log(isAdmin);
      if (!isAdmin) {
        // User does not have the required role(s), redirect them to the homepage or show an error message
        // alert("you're not admin");
        console.log('Redirecting to homepage');
        navigate('/homepage');
      }
    }
  }, []);

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
      .get(`${baseUrl}/api/allProducts`)
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

  // const handlePartialRefund = async (event) => {
  //   console.log(chalk.yellow('Partial refund is processing!'));
  //   event.preventDefault();
  //   axios
  //     .post(`${baseUrl}/processPartialRefund/${productID}`)
  //     .then((response) => {
  //       console.log(response);
  //       setRefunds(response.data.data);
  //       console.log(refunds);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });

  //   window.alert('Giving partial refund now...');
  // };

  return (
    <div class="row col-11" style={{ marginRight: 'auto', marginLeft: 'auto' }}>
      <div class="row" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <h4 class="h4 font-weight-bold text-center mt-4">Admin Dashboard</h4>
      </div>

      {statistics ? (
        <div
          className="row col-11 my-2 justify-content-center"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        >
          <div className="col-3 text-center">
            <div className="d-flex align-items-center justify-content-center h-100">
              <div
                className="w-100 p-3 rounded"
                style={{ background: '#dff7ec' }}
              >
                <h4 className="h4">Total Sold</h4>
                <p>{statistics.total_sold}</p>
              </div>
            </div>
          </div>

          <div className="col-3 text-center">
            <div className="d-flex align-items-center justify-content-center h-100">
              <div
                className="w-100 p-3 rounded"
                style={{ background: '#dfeaf7' }}
              >
                <h4 className="h4">Total Inventory</h4>
                <p>{statistics.total_inventory}</p>
              </div>
            </div>
          </div>

          <div className="col-3 text-center">
            <div className="d-flex align-items-center justify-content-center h-100">
              <div
                className="w-100 p-3 rounded"
                style={{ background: '#f0f7df' }}
              >
                <h4 className="h4">Total Revenue</h4>
                <p>{statistics.total_payment}</p>
              </div>
            </div>
          </div>

          <div className="col-3 text-center">
            <div className="d-flex align-items-center justify-content-center h-100">
              <div
                className="w-100 p-3 rounded"
                style={{ background: '#f3dff5' }}
              >
                <h4 className="h4">Total Order</h4>
                <p>{statistics.total_order}</p>
              </div>
            </div>
          </div>
        </div>
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

      <div
        class="row my-2 mx-auto p-0"
        style={{
          height: '300px',
          overflowY: 'scroll',
          background: '#c2d9ff',
          width: '90%',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          class="py-2"
          style={{
            position: 'sticky',
            top: '0',
            background: '#dff7ec',
            width: '100%',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            className="row align-items-center col-11"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          >
            <div className="col-10 h5 font-weight-bold">Products</div>
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
              <div className="d-flex flex-row py-3 justify-content-around">
                <div className="col-2">
                  <AdvancedImage
                    className="h-20 w-20 flex-none bg-gray-50"
                    cldImg={cld.image(product.image_url)}
                  />
                </div>
                <div className="col-6 d-flex flex-column justify-content-center">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {product.product_name}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {product.category_name} - {product.brand_name}
                  </p>
                </div>

                <div className="col-4 d-flex justify-content-end align-items-center">
                  <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <div
                      class="row col-12"
                      style={{ marginLeft: 'auto', marginRight: 'auto' }}
                    >
                      <button
                        class="col-4"
                        style={{ marginLeft: 'auto', marginRight: 'auto' }}
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
                      <p class="col-4 text-center">{product.quantity}</p>
                      <button
                        class="col-4"
                        id="minusButton"
                        style={{ marginLeft: 'auto', marginRight: 'auto' }}
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
                  </div>

                  <div className="d-flex align-items-center">
                    <Link
                      to={`/products/edit/${product.product_id}`}
                      className="mr-2"
                    >
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

                        axios
                        .post(`${baseUrl}/processPartialRefund/${productID}`)
                        .then((response) => {
                          console.log(response);
                          setRefunds(response.data.data);
                          console.log(refunds);
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                  
                      window.alert('Giving partial refund now...');
                      }}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
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
        </ul>
      </div>

      <div
        className="row col-12 justify-content-center my-2 mx-0"
        style={{ marginRight: 'auto', marginLeft: 'auto' }}
      >
        <div
          class="col-5 p-0 mx-4"
          style={{
            height: '300px',
            overflowY: 'scroll',
            background: '#c2d9ff',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            class="py-2"
            style={{
              position: 'sticky',
              top: '0',
              background: '#dff7ec',
              width: '100%',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              className="row align-items-center col-11"
              style={{ marginLeft: 'auto', marginRight: 'auto' }}
            >
              <div className="col-10 h5 font-weight-bold">Brands</div>
            </div>
            <div
              class="row col-12 mt-3"
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
          </ul>
        </div>

        <div
          class="col-5 p-0 mx-4"
          style={{
            height: '300px',
            overflowY: 'scroll',
            background: '#c2d9ff',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            class="py-2"
            style={{
              position: 'sticky',
              top: '0',
              background: '#dff7ec',
              width: '100%',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              className="row align-items-center col-11"
              style={{ marginLeft: 'auto', marginRight: 'auto' }}
            >
              <div className="col-10 h5 font-weight-bold">Categories</div>
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
          </ul>
        </div>
      </div>

      <div
        className="row col-12 justify-content-center my-2 mx-0"
        style={{ marginRight: 'auto', marginLeft: 'auto' }}
      >
        <div
          class="col-5 p-0 mx-4"
          style={{
            background: '#c2d9ff',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            class="py-2"
            style={{
              position: 'sticky',
              top: '0',
              background: '#dff7ec',
              width: '100%',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              className="row align-items-center col-11"
              style={{ marginLeft: 'auto', marginRight: 'auto' }}
            >
              <div className="col-10 h5 font-weight-bold">Refund</div>
            </div>
          </div>
          <div
            class="row col-12 mt-4 mb-4"
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
        <div class="col-5">
          <div className="flex justify-end mb-12">
            <Link to={'/admin/orderStatus'}>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Go to Order Status Management
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
