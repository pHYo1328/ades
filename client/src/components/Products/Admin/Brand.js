import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import chalk from 'chalk';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../Loading/Loading';
import DeleteModal from '../../modal/DeleteModal';
import ProductListModal from '../../modal/ProductListModal';

export default function Brand({ brands, fetchProducts, fetchBrands, refunds, setRefunds, fetchStatistics }) {
    const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [brandID, setBrandID] = useState(null);
    const [showProducts, setShowProducts] = useState(false);
    const [products, setProducts] = useState(null)
    const [hasProducts, setHasProducts] = useState(false)

    const getProductsByBrand = (brandID) => {
        axios
            .get(`${baseUrl}/api/products/brand/${brandID}`)
            .then((response) => {
                console.log(response);
                setProducts(response.data.data);
                setHasProducts(true)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => { console.log("products", products) }, [products])

    const deleteBrand = (brandID) => {

        axios
            .delete(`${baseUrl}/api/brands/${brandID}`)
            .then((res) => {
                console.log("brandid ", brandID)
                // const updatedBrands = brands.filter((b) => b.brand_id !== brand.brand_id);
                toast.success(`Brand deleted.`, {
                    autoClose: 3000,
                    pauseOnHover: true,
                    style: { 'font-size': '16px' },
                });
                // setBrands(updatedBrands);
                fetchBrands();
                fetchProducts();
            });

    }

    return (
        <div className="relative  overflow-x-auto overflow-y-auto max-h-[60vh] sm:max-h-[60vh] md:max-h-[70vh] lg:max-h-[70vh] shadow-md sm:rounded-lg">

            {brands ? (
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
                        {brands.map((brand) => (
                            <tr className="bg-white border-b hover:bg-gray-50 text-dark text-center">
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    <button onClick={() => {
                                        console.log(brand.brand_id);
                                        console.log('brand is clicked')
                                        setShowProducts(true);
                                        getProductsByBrand(brand.brand_id);
                                    }}>{brand.brand_name}</button>
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
                                        onClick={() => { setShowDeleteModal(true); console.log(showDeleteModal); setBrandID(brand.brand_id) }}
                                    >
                                        <i className="bi bi-trash-fill"></i>
                                    </button>
                                    {/* Render the delete modal */}
                                    {showDeleteModal && (
                                        <DeleteModal
                                            onCancel={() => { setShowDeleteModal(false); console.log("cancel button is clicked") }}
                                            onDelete={() => {
                                                console.log("delete button is clicked")
                                                setShowDeleteModal(false); // Close the modal
                                                console.log("brandid ", brandID)
                                                deleteBrand(brandID)
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