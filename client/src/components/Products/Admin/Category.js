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

                    setCategory(response.data.data);
                    toast.success(`Category created.`, {
                        autoClose: 3000,
                        pauseOnHover: true,
                        style: { 'font-size': '16px' },
                    });
                    console.log(category);
                    fetchCategories();
                    setCategoryName('');
                })
                .catch((response) => {
                    if (response.response.status == 409) {
                        console.log("duplicate");
                        toast.error(`Category or brand already exists.`, {
                            autoClose: 3000,
                            pauseOnHover: true,
                            style: { 'font-size': '16px' },
                        });
                    }
                });
        }
    };

    return (
        <div className="col-span-12 mx-auto h-300 overflow-y-scroll bg-peach rounded-md mt-4">
            <div className="flex justify-center">
                <div className="text-center text-xl mt-3 mb-3 font-bold">Categories</div>
            </div>

            <div className="flex flex-row justify-center mt-2 mb-4 mx-auto space-x-4">
                <div className="w-3/5">
                    <input
                        type="text"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full"
                        placeholder="Category Name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </div>
                <div className="w-1/5">
                    {/* adds new category when clicked on create button */}
                    <button
                        className="bg-dark-blue hover:bg-light-blue text-white font-bold py-2 px-4 rounded-sm w-full text-sm h-100"
                        onClick={handleSubmitCategory}
                    >
                        <i className="bi bi-plus-circle"></i>
                    </button>
                </div>
            </div>
            <div className="overflow-y-scroll max-h-80">
                <ul role="list" className="divide-y divide-gray-100 px-4 sm:px-4 md:px-3 lg:px-1">
                    {/* shows all categories */}
                    {categories ? (
                        categories.map((category) => (
                            <li className="flex flex-row py-3 justify-between px-3">
                                <div className="col-span-10 flex items-center">
                                    <p className="text-sm font-semibold text-gray-900">{category.category_name}</p>
                                </div>
                                <div className="col-span-2 flex items-center">
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
                                        <i className="bi bi-trash-fill"></i>
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        // Loading component (full screen)
                        <div className="flex items-center justify-center h-screen">
                            <Loading />
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}