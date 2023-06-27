import { useState, useEffect } from 'react';
import axios from 'axios';
import chalk from 'chalk';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../Loading/Loading';

export default function Brand({ fetchProducts }) {
    const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

    const [brands, setBrands] = useState(null);
    const [brandName, setBrandName] = useState('');
    const [brand, setBrand] = useState(null);

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

    useEffect(() => { fetchBrands() }, [])

    // add new brand
    const handleSubmitBrand = async (event) => {
        console.log(chalk.yellow('submit button is clicked!'));
        event.preventDefault();

        if (!brandName) {
            toast.error(`Please enter the name of the brand.`, {
                autoClose: 3000,
                pauseOnHover: true,
                style: { 'font-size': '16px' },
            });
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
                    toast.success(`Brand created.`, {
                        autoClose: 3000,
                        pauseOnHover: true,
                        style: { 'font-size': '16px' },
                    });
                    console.log(brand);
                    fetchBrands();
                    setBrandName('');

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
                });;
        }
    };

    return (
        <div className="col-span-12 mx-auto h-300 overflow-y-scroll bg-peach rounded-md mt-4">
            <div className="flex justify-center">
                <div className="text-center text-xl mt-3 mb-3 font-bold">Brands</div>
            </div>

            <div className="flex flex-row justify-center mt-2 mb-4 mx-auto space-x-4">
                <div className="w-3/5">
                    <input
                        type="text"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full"
                        placeholder="Brand Name"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                    />
                </div>
                {/* adds new brand when clicked on create button */}
                <div className="w-1/5">
                    <button
                        className="bg-dark-blue hover:bg-light-blue text-white font-bold py-2 px-4 rounded-sm w-full text-sm h-100"
                        onClick={handleSubmitBrand}
                    >
                        <i className="bi bi-plus-circle"></i>
                    </button>
                </div>
            </div>

            <div className="overflow-y-scroll max-h-80">
                <ul role="list" className="divide-y divide-gray-100 px-4 sm:px-4 md:px-3 lg:px-1">
                    {/* shows all brands */}
                    {brands ? (
                        brands.map((brand) => (
                            <li className="flex flex-row py-3 justify-between px-3">

                                <div className="col-span-10 flex items-center">
                                    <p className="text-sm font-semibold text-gray-900">{brand.brand_name}</p>
                                </div>

                                <div className="col-span-2 flex items-center">
                                    <button
                                        className="flex items-center"
                                        onClick={(e) => {
                                            // delete the brand when the admin clicks on the trash icon to delete
                                            e.preventDefault();
                                            const brandID = brand.brand_id;
                                            // confirm the deletion of brand, to prevent accidental deletions
                                            const confirmed = window.confirm('Are you sure you want to delete?');
                                            // if confirmed, proceed to delete
                                            if (confirmed) {
                                                axios
                                                    .delete(`${baseUrl}/api/brands/${brandID}`)
                                                    .then((res) => {
                                                        const updatedBrands = brands.filter((b) => b.brand_id !== brandID);
                                                        toast.success(`Brand deleted.`, {
                                                            autoClose: 3000,
                                                            pauseOnHover: true,
                                                            style: { 'font-size': '16px' },
                                                        });
                                                        setBrands(updatedBrands);
                                                        fetchBrands();
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