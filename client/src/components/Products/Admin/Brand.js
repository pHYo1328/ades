import { useState, useEffect } from 'react';
import axios from 'axios';
import chalk from 'chalk';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../Loading/Loading';
// import { cloudinary_cloud_name } from '../../../../../server/src/config/config';

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
                    // console.log("no rizz")
                    // console.log(response.response.status)
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