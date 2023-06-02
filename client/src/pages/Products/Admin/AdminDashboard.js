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

  // get all categories
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

  // get all brands
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

  // get all products
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

  // get all brands, categories, and products concurrently
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

  // get the statistics
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

  // refresh the statistics every 1 minute
  useEffect(() => {
    fetchStatistics();
    const intervalId = setInterval(fetchStatistics, 60 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [products]);

  // add new brand
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

  // add new category
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

  // search the order by id
  const handleSearchOrder = async (event) => {
    console.log(chalk.yellow('Search button is clicked!'));
    event.preventDefault();

    if (!orderID) {
      window.alert('Please fill in the order_id to process refund');
    } else {
      try {
        const response = await axios.get(
          `${baseUrl}/api/paymentByStatus/${orderID}`
        );
        console.log(response);

        // Check if order exists
        if (response.data && response.data.data.length > 0) {
          window.location.href = `/payment-refund/${orderID}`;
        }
      } catch (error) {
        console.error(error);
        window.alert('Order does not exist for fully refunding');
      }
    }
  };

  return (
    <div class="row col-11" style={{ marginRight: 'auto', marginLeft: 'auto' }}>
      <div class="row" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <h4 class="h4 font-weight-bold text-center mt-4">Admin Dashboard</h4>
      </div>

      {/* shows the statistics */}
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
                <p>${statistics.total_payment}</p>
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
          height: '400px',
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
            <div className="col-9 h5 font-weight-bold">Products</div>
            {/* link to ProductCreate page when admin clicks on create button */}
            <div className="col-3">
              <Link
                to="/products/create"
                className="btn btn-info w-100 col-12 text-dark mr-2"
                id="createButton"
              >
                Create <i class="bi bi-plus-circle"></i>
              </Link>
            </div>
          </div>
        </div>
        <ul role="list" class="divide-y divide-gray-100">
          {/* shows all products */}
          {products ? (
            products.map((product) => (
              <div className="d-flex flex-row py-3 justify-content-around">
                <div className="col-2 border-r-2 border-white pl-2 pr-3 mr-3">
                  <AdvancedImage
                    className="h-30 w-30 flex-none bg-gray-50 rounded-lg"
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
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    <i class="bi bi-tags-fill"></i> ${product.price}
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
                        id="minusButton"
                        style={{ marginLeft: 'auto', marginRight: 'auto' }}
                        onClick={() => {
                          if (product.quantity >= 1) {
                            // minus the inventory by 1 when the admin clicks on the minus icon
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
                      {/* the quantity will change as the admin makes changes to the inventory */}
                      <p class="col-4 text-center">{product.quantity}</p>
                      <button
                        class="col-4"
                        style={{ marginLeft: 'auto', marginRight: 'auto' }}
                        id="plusButton"
                        onClick={() => {
                          // plus the inventory by 1 when the admin clicks on the plus button
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
                    </div>
                  </div>

                  <div className="d-flex align-items-center pr-4">
                    {/* link to ProductEdit page as the admin clicks on the pencil icon to edit */}
                    <Link
                      to={`/products/edit/${product.product_id}`}
                      className="mr-2"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Link>
                    <button
                      onClick={() => {
                        // deletes the product when the admin clicks on the trash icon to delete
                        const productID = product.product_id;
                        // confirm whether the admin wants to delete or not, to prevent accidental deletions
                        const confirmed = window.confirm(
                          'Are you sure you want to delete?'
                        );
                        // if deletion is confirmed by admin, delete the product by using productID
                        if (confirmed) {
                          axios
                            .delete(`${baseUrl}/api/products/${productID}`)
                            .then((res) => {
                              const updatedProducts = products.filter(
                                (p) => p.product_id !== productID
                              );
                              setProducts(updatedProducts);
                            });

                          // give partial refund to customers who ordered the deleted products
                          axios
                            .post(
                              `${baseUrl}/processPartialRefund/${productID}`
                            )
                            .then((response) => {
                              console.log(response);
                              setRefunds(response.data.data);
                              console.log(refunds);
                            })
                            .catch((error) => {
                              console.error(error);
                            });

                          window.alert('Giving partial refund now...');
                        }
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
        class="row my-2 mx-auto p-0"
        style={{ marginRight: 'auto', marginLeft: 'auto' }}
      >
        <div
          class="col-12 justify-content-between d-flex"
          style={{ marginRight: 'auto', marginLeft: 'auto', width: '100%' }}
        >
          <div
            class="col-5 p-0"
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
                {/* adds new brand when clicked on create button */}
                <div class="col-4">
                  <button
                    class="btn btn-info w-100 col-6 text-dark mr-2"
                    onClick={handleSubmitBrand}
                  >
                    Create <i class="bi bi-plus-circle"></i>
                  </button>
                </div>
              </div>
            </div>
            <ul
              role="list"
              class="divide-y divide-gray-100"
              style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}
            >
              {/* shows all brands */}
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
                          // delete the brand when the admin clicks on the trash icon to delete
                          e.preventDefault();
                          const brandID = brand.brand_id;
                          // confirm the deletion of brand, to prevent accidental deletions
                          const confirmed = window.confirm(
                            'Are you sure you want to delete?'
                          );
                          // if confirmed, proceed to delete
                          if (confirmed) {
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
                          }
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
            class="col-5 p-0"
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
                  {/* adds new category when clicked on create button */}
                  <button
                    class="btn btn-info w-100 col-6 text-dark mr-2"
                    onClick={handleSubmitCategory}
                  >
                    Create <i class="bi bi-plus-circle"></i>
                  </button>
                </div>
              </div>
            </div>
            <ul
              role="list"
              class="divide-y divide-gray-100"
              style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}
            >
              {/* shows all categories */}
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
                          // delete the category when clicked on trash icon to delete
                          e.preventDefault();
                          const categoryID = category.category_id;
                          // confirm deletion to prevent accidental deletions
                          const confirmed = window.confirm(
                            'Are you sure you want to delete?'
                          );
                          // if confirmed, proceed to delete
                          if (confirmed) {
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
                          }
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
      </div>

      <div
        className="row col-12 justify-content-center my-2 mx-0"
        style={{ marginRight: 'auto', marginLeft: 'auto' }}
      >
        <div
          class="col-11 p-0 mx-4"
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
              <div className="col-10 h5 font-weight-bold">Fully Refund</div>
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
            {/* give full refund to the customer based on the order ID */}
            <div class="col-4">
              <button
                class="btn btn-info w-100 col-6 text-dark mr-2"
                onClick={handleSearchOrder}
              >
                Search <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div className="flex justify-center mb-12">
          {/* link to go to orderStatus to manage the status of orders */}
          <Link to={'/admin/orderStatus'}>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Go to Order Status Management
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
