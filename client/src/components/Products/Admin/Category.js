import { useState, useEffect } from 'react';
import axios from 'axios';
import chalk from 'chalk';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../Loading/Loading';

export default function Category({ fetchProducts }) {
    const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

    const [categories, setCategories] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [category, setCategory] = useState(null);

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

    useEffect(() => { fetchCategories() }, []);

    // add new category
    const handleSubmitCategory = async (event) => {
        console.log(chalk.yellow('submit button is clicked!'));
        event.preventDefault();

        if (!categoryName) {
            toast.error(`Please enter the name of the category.`, {
                autoClose: 3000,
                pauseOnHover: true,
                style: { 'font-size': '16px' },
            });
        } else {
            const requestBody = {
                name: categoryName,
                type: 'category',
            };
            console.log(requestBody);
            axios
                .post(`${baseUrl}/api/products/admin/type`, requestBody)
                .then((response) => {
                    console.log("RESPONSE", response);
                    console.log("RESPONSE STATUS CODE: ", response.status);
                    if (response.status == 409) {
                        console.log("duplicate");
                        toast.error(`Category or brand already exists.`, {
                            autoClose: 3000,
                            pauseOnHover: true,
                            style: { 'font-size': '16px' },
                        });
                    } else {
                        setCategory(response.data.data);
                        toast.success(`Category created.`, {
                            autoClose: 3000,
                            pauseOnHover: true,
                            style: { 'font-size': '16px' },
                        });
                        console.log(category);
                        fetchCategories();
                        setCategoryName('');
                    }
                });
        }
    };

    return (
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
                                                    toast.success(`Category deleted.`, {
                                                        autoClose: 3000,
                                                        pauseOnHover: true,
                                                        style: { 'font-size': '16px' },
                                                    });
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
                    // Loading component (full screen)
                    <div className="flex items-center justify-center h-screen">
                        <Loading />
                    </div>
                )}
            </ul>
        </div>
    );
}