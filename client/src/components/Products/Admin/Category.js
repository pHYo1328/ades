import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../Loading/Loading';
import DeleteModal from '../../modal/DeleteModal';
import ProductListModal from '../../modal/ProductListModal';


export default function Category({ categories, fetchProducts, fetchCategories, refunds, setRefunds, fetchStatistics }) {
    const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryID, setCategoryID] = useState(null);
    const [showProducts, setShowProducts] = useState(false);
    const [products, setProducts] = useState(null)
    const [hasProducts, setHasProducts] = useState(false)

    const getProductsByCategory = (categoryID) => {
        axios
            .get(`${baseUrl}/api/products/category/${categoryID}`)
            .then((response) => {
                console.log(response);
                setProducts(response.data.data);
                setHasProducts(true)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const deleteCategory = (categoryID) => {
        axios
            .delete(`${baseUrl}/api/categories/${categoryID}`)
            .then((res) => {
                toast.success(`Category deleted.`, {
                    autoClose: 3000,
                    pauseOnHover: true,
                    style: { 'font-size': '16px' },
                });

                fetchCategories();
                fetchProducts();
            });
    }


    return (
        <div className="relative  overflow-x-auto overflow-y-auto max-h-[60vh] sm:max-h-[60vh] md:max-h-[70vh] lg:max-h-[70vh] shadow-md sm:rounded-lg">

            {categories ? (
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center">
                        <tr>

                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-gray-400 h-98 overflow-y-auto">
                        {categories.map((category) => (
                            <tr className="bg-white border-b hover:bg-gray-50 text-dark text-center">
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    <button onClick={() => {
                                        console.log(category.category_id);
                                        console.log('category is clicked')
                                        setShowProducts(true);
                                        getProductsByCategory(category.category_id);
                                    }}>{category.category_name}</button>
                                </td>
                                {showProducts && (
                                    <ProductListModal
                                        // key={products}
                                        onCancel={() => { setShowProducts(false); console.log("cancel button is clicked") }}
                                        products={products} hasProducts={hasProducts} refunds={refunds} fetchProducts={() => fetchProducts()} fetchStatistics={() => fetchStatistics()} setRefunds={() => setRefunds()} setProducts={() => setProducts()}
                                    />
                                )}
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    <button
                                        className=" text-center"
                                        onClick={() => { setShowDeleteModal(true); console.log(showDeleteModal); setCategoryID(category.category_id) }}
                                    >
                                        <i className="bi bi-trash-fill"></i>
                                    </button>
                                    {/* Render the delete modal */}
                                    {showDeleteModal && (
                                        <DeleteModal
                                            onCancel={() => { setShowDeleteModal(false); console.log("cancel button is clicked"); }}
                                            onDelete={() => {

                                                setShowDeleteModal(false); // Close the modal

                                                // let categoryID = category.category_id;
                                                console.log("categoryID: ", categoryID)
                                                deleteCategory(categoryID);

                                            }}
                                        />
                                    )}
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            ) : (
                // Loading component (full screen)
                <div className="flex items-center justify-center h-screen">
                    <Loading />
                </div>
            )}
        </div>
    );
}