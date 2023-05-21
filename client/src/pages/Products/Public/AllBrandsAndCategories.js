import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import chalk from 'chalk';

export default function AllBrandsAndCategories() {

    const [brands, setBrands] = useState(null)
    const [brandName, setBrandName] = useState("");
    const [brand, setBrand] = useState(null)
    const [categories, setCategories] = useState(null)
    const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

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
    return (
        <div className="bg-white w-full text-dark text-left container-fluid align-items-center">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">

                <div class="col-10" style={{ marginLeft: "auto", marginRight: "auto" }}>
                    <div class="row">
                        <div class="col-10">Brands</div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
                        {brands ? (
                            brands.map((brand) => (
                                <div key={brand.brand_id}   className="group relative border border-gray-300 rounded p-4" onClick={() => {
                                    const brandID = brand.brand_id
                                    window.location.href = `http://localhost:3000/brands/${brandID}`
                                }}>

                                    <div className="flex justify-between">
                                        <div className="text-left">
                                            <h3 className="text-sm text-gray-700">
                                                <a href={`/brands/${brand.brand_id}`}>
                                                    <span aria-hidden="true" className="absolute inset-0" />
                                                    {brand.brand_name}
                                                </a>
                                            </h3>

                                        </div>

                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>

                    <div class="row mt-5">
                        <div class="col-10">Categories</div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
                        {categories ? (
                            categories.map((category) => (
                                <div key={category.category_id}   className="group relative border border-gray-300 rounded p-4" onClick={() => {
                                    const categoryID = category.category_id
                                    window.location.href = `http://localhost:3000/products/${categoryID}`
                                }}>

                                    <div className="flex justify-between">
                                        <div className="text-left">
                                            <h3 className="text-sm text-gray-700">
                                                <a href={`/categories/${category.category_id}`}>
                                                    <span aria-hidden="true" className="absolute inset-0" />
                                                    {category.category_name}
                                                </a>
                                            </h3>

                                        </div>

                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
