import React, { useRef } from 'react';
import { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import chalk from 'chalk';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Button from '../../../components/Button';
import Toggle from '../../../components/Products/Admin/Toggle'
import TextInput from '../../../components/TextInput';
import SideBar from '../../../components/Products/Admin/SideBar';

import LinkButton from '../../../components/LinkButton';
import Category from '../../../components/Products/Admin/Category';

import ProductList from '../../../components/Products/Admin/ProductList';
import Statistics from '../../../components/Products/Admin/Statistics';

import OrderAdmin from '../../Order/Admin/OrderAdmin';
import UserInfo from '../../Login/UserInfo';

import Brand from '../../../components/Products/Admin/Brand';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const brandCreateButtonRef = useRef(null);
    const categoryCreateButtonRef = useRef(null);
    const searchOrderButtonRef = useRef(null);
    const searchProductButtonRef = useRef(null);

    const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

    const [search, setSearch] = useState(null);
    // const [searchKey, setSearchKey] = useState(0);

    const [products, setProducts] = useState(null);
    const [hasProducts, setHasProducts] = useState(false);
    const [statistics, setStatistics] = useState(null);
    const [hasStatistics, setHasStatistics] = useState(false)

    const [orderID, setOrderID] = useState(null);
    const [refunds, setRefunds] = useState(null);

    const [brands, setBrands] = useState(null);
    const [brandName, setBrandName] = useState('');
    const [brand, setBrand] = useState(null);
    const [hasBrand, setHasBrand] = useState(false)

    const [categories, setCategories] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [category, setCategory] = useState(null);
    const [hasCategory, setHasCategory] = useState(false)

    const [activeTab, setActiveTab] = useState('home');

    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const handleWindowResize = () => {
            console.log(window.innerWidth);
            if (window.innerWidth > 768) {
                setShowMenu(false);
            }
        };

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);


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
    });

    const fetchData = (endpoint, setData, setHasData) => {
        axios
            .get(endpoint)
            .then((response) => {
                setData(response.data.data);
                setHasData(true);
            })
            .catch((error) => {
                console.error(error);
            });
    };


    const fetchCategories = () => fetchData(`${baseUrl}/api/category`, setCategories, setHasCategory);
    useEffect(() => { fetchCategories() }, [])

    const fetchBrands = () => fetchData(`${baseUrl}/api/brands`, setBrands, setHasBrand);
    useEffect(() => { fetchBrands() }, [])

    const fetchProducts = () => {
        setHasProducts(true);
        fetchData(`${baseUrl}/api/allProducts`, setProducts, setHasProducts);
    }

    const fetchSearchResults = () => {
        setHasProducts(true);
        fetchData(`${baseUrl}/api/search?product_name=${search}`, setProducts, setHasProducts);

    }

    useEffect(() => {
        if (search && search.trim() !== "") {
            fetchSearchResults();
        } else {
            fetchProducts();
        }
    }, [search]);

    const fetchStatistics = () => fetchData(`${baseUrl}/api/admin/statistics`, setStatistics, setHasStatistics);

    // refresh the statistics every 1 minute
    useEffect(() => {
        fetchStatistics();
        const intervalId = setInterval(fetchStatistics, 60 * 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, [products]);



    const handleSubmit = async (event, name, type, setData, fetchData, setDataName) => {
        event.preventDefault();

        if (!name) {
            toast.error(`Please enter the name of the ${type}.`, {
                autoClose: 3000,
                pauseOnHover: true,
                style: { fontSize: '16px' },
            });
        } else {
            const requestBody = {
                name: name,
                type: type,
            };

            axios
                .post(`${baseUrl}/api/products/admin/type`, requestBody)
                .then((response) => {
                    setData(response.data.data);
                    toast.success(`${type} created.`, {
                        autoClose: 3000,
                        pauseOnHover: true,
                        style: { fontSize: '16px' },
                    });
                    fetchData();
                    setDataName('');
                })
                .catch((error) => {
                    if (error.response.status === 409) {
                        console.log("duplicate");
                        toast.error(`Category or brand already exists.`, {
                            autoClose: 3000,
                            pauseOnHover: true,
                            style: { fontSize: '16px' },
                        });
                    }
                });
        }
    };

    // add new brand
    const handleSubmitBrand = (event) => {
        console.log(chalk.yellow('submit button is clicked!'));
        handleSubmit(event, brandName, 'brand', setBrand, fetchBrands, setBrandName);
    };

    // add new category
    const handleSubmitCategory = (event) => {
        console.log(chalk.yellow('submit button is clicked!'));
        handleSubmit(event, categoryName, 'category', setCategory, fetchCategories, setCategoryName);
    };

    // search the order by id
    const handleSearchOrder = async (event) => {
        console.log(chalk.yellow('Search button is clicked!'));
        event.preventDefault();

        if (!orderID) {
            toast.error(`Please fill in the order_id to process refund.`, {
                autoClose: 3000,
                pauseOnHover: true,
                style: { 'font-size': '16px' },
            });
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
                toast.error(`Order does not exist for fully refunding.`, {
                    autoClose: 3000,
                    pauseOnHover: true,
                    style: { 'font-size': '16px' },
                });
            }
        }
    };

    return (
        <div className="bg-white z-1 top-25">
            <div className="bg-white w-full mx-auto">
                <ToastContainer
                    limit={2}
                    newestOnTop={true}
                    position="top-center"
                />

                {/* <Toggle showMenu={showMenu} setShowMenu={() => setShowMenu()} /> */}

                <button
                    data-drawer-target="sidebar-multi-level-sidebar"
                    data-drawer-toggle="sidebar-multi-level-sidebar"
                    aria-controls="sidebar-multi-level-sidebar"
                    type="button"
                    className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    onClick={() => {
                        setShowMenu(!showMenu);
                        console.log("showMenu", showMenu)
                    }}
                >
                    <span className="sr-only">Open sidebar</span>
                    <i class="bi bi-list"></i>
                </button>

                <aside id="default-sidebar" class="fixed top-25 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 md:translate-x-0" aria-label="Sidebar">
                    <SideBar activeTab={activeTab} setActiveTab={(value) => setActiveTab(value)} />
                </aside>

                {/* {showSmallMenu && (
                    <SideBar className="md:hidden lg:hidden" activeTab={activeTab} setActiveTab={(value) => setActiveTab(value)} />
                )} */}

                {window.innerWidth < 768 && showMenu && (
                    <SideBar activeTab={activeTab} setActiveTab={(value) => setActiveTab(value)} />
                )}

                <div className="p-4 sm:ml-64 top-25 overflow-hidden">
                    <div className="rounded-lg dark:border-gray-700 overflow-hidden flex justify-center items-center w-full">
                        {activeTab === 'home' && (
                            <Statistics statistics={statistics} />
                        )}
                        {activeTab === 'products' && (
                            <div className="w-full">
                                <div className="w-full flex flex-row items-center justify-between mb-3 mt-3">
                                    <div className="w-12/12 sm:w-12/12 md:w-9/12 lg:w-9/12 text-sm pr-4">
                                        <TextInput placeholder={"Enter search..."} value={search}
                                            func={(e) => setSearch(e.target.value)} />
                                    </div>

                                    <div className="w-12/12 sm:w-12/12 md:w-3/12 lg:w-3/12">
                                        <LinkButton linkTo={"/products/create"} content={<>
                                            Create <i className="bi bi-plus-circle ml-1"></i>
                                        </>} />
                                    </div>
                                </div>

                                <ProductList products={products} hasProducts={hasProducts} refunds={refunds} fetchProducts={() => fetchProducts()} fetchStatistics={() => fetchStatistics()} setRefunds={() => setRefunds()} setProducts={() => setProducts()} />
                            </div>
                        )}
                        {activeTab === 'brands' && (
                            <div className="w-full">
                                <div className="w-full flex flex-row items-center justify-between mb-3 mt-3">
                                    <div className="w-12/12 sm:w-12/12 md:w-9/12 lg:w-9/12 text-sm pr-4">
                                        <TextInput placeholder={"Brand Name"} value={brandName} func={(e) => setBrandName(e.target.value)} buttonRef={brandCreateButtonRef} />
                                    </div>

                                    <div className="w-12/12 sm:w-12/12 md:w-3/12 lg:w-3/12">
                                        <Button buttonRef={brandCreateButtonRef} onClick={handleSubmitBrand} content={<i className="bi bi-plus-circle"></i>} />
                                    </div>
                                </div>
                                <Brand brands={brands} fetchProducts={() => fetchProducts()} fetchBrands={() => fetchBrands()} setBrands={setBrands} products={products} hasProducts={hasProducts} refunds={refunds} fetchStatistics={() => fetchStatistics()} setRefunds={() => setRefunds()} setProducts={() => setProducts()} />
                            </div>
                        )}
                        {activeTab === 'categories' && (
                            <div className="w-full">
                                <div className="w-full flex flex-row items-center justify-between mb-3 mt-3">
                                    <div className="w-12/12 sm:w-12/12 md:w-9/12 lg:w-9/12 text-sm pr-4">
                                        <TextInput placeholder={"Category Name"} value={categoryName} func={(e) => setCategoryName(e.target.value)} buttonRef={categoryCreateButtonRef} />
                                    </div>

                                    <div className="w-12/12 sm:w-12/12 md:w-3/12 lg:w-3/12">
                                        <Button buttonRef={categoryCreateButtonRef} onClick={handleSubmitCategory} content={<i className="bi bi-plus-circle"></i>} />
                                    </div>
                                </div>
                                <Category categories={categories} fetchProducts={() => fetchProducts()} fetchCategories={() => fetchCategories()} />
                            </div>
                        )}
                        {activeTab === 'users' && (
                            <UserInfo />
                        )}
                        {activeTab === 'orders' && (
                            <OrderAdmin />
                        )}
                        {activeTab === 'refunds' && (
                            <div className="col-span-12 mx-auto h-300 overflow-y-scroll bg-peach rounded-md mt-4 mb-4">

                                <div className="flex items-center justify-between mb-3 mt-3 ">
                                    <div className="w-9/12 text-left ml-10 text-xl font-bold">Fully Refund</div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between mt-3 py-2">
                                    <div className="flex items-center w-full sm:w-full md:w-3/4 lg:w-3/4 text-left text-xl px-3 pb-3 pb:mb-3 pb:mb-0 pb:mb-0">
                                        <TextInput placeholder={"Enter Order ID"} value={orderID} func={(e) => setOrderID(e.target.value)} buttonRef={searchOrderButtonRef} />
                                    </div>

                                    <div className="flex items-center w-full sm:w-full md:w-1/4 lg:w-1/4 px-3 pb-3 pb:mb-3 pb:mb-0 pb:mb-0">
                                        <Button buttonRef={searchOrderButtonRef} onClick={handleSearchOrder} content={<i className="bi bi-search"></i>} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div >
            </div>
        </div >
    )
}