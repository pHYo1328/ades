import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { ToastContainer, toast } from 'react-toastify';
import DeleteModal from '../../modal/DeleteModal';
import 'react-toastify/dist/ReactToastify.css';

const cld = new Cloudinary({
    cloud: {
        cloudName: 'ddoajstil',
    },
});

export default function Product({ product, refunds, setRefunds, fetchProducts, fetchStatistics }) {

    // const { product, products, refunds, setProducts, setRefunds } = props;

    const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

    const [showDeleteModal, setShowDeleteModal] = useState(false);


    return (
        <div className="d-flex flex-row py-3 justify-content-around h-30 w-30">
            <div className="w-2/6 sm:w-2/6 md:w-2/6 lg:w-1/6 aspect-square border-r-2 border-white pl-2 pr-3 mr-3 h-30 ">
                <AdvancedImage
                    className="h-full w-full bg-gray-50 rounded-lg object-cover"
                    cldImg={cld.image(product.image_url)}
                />
            </div>
            <div className="w-3/6 flex flex-col justify-center">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                    {product.product_name}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {product.category_name} - {product.brand_name}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    <i className="bi bi-tags-fill"></i> ${product.price}
                </p>
            </div>


            {/* <div className="col-4 d-flex justify-between justify-content-end align-items-center"> */}
            <div className="w-3/6 flex flex-wrap justify-center items-center text-center space-x-3">

                <div className="mx-auto w-full sm:w-full md:w-1/2 lg:w-1/2 mb-4 lg:px-3 md:px-3 items-center lg:mt-5 md:mt-5">
                    <div className="flex flex-row justify-between items-center">
                        <div className="w-2/5">
                            <button
                                className="w-full"
                                id="minusButton"
                                onClick={() => {
                                    if (product.quantity >= 1) {
                                        // minus the inventory by 1 when the admin clicks on the minus icon
                                        const productID = product.product_id;
                                        axios
                                            .put(`${baseUrl}/api/products/inventory/minus/${productID}`)
                                            .then((response) => {
                                                console.log('Decrease button is clicked');
                                                toast.success(`Inventory level updated.`, {
                                                    autoClose: 3000,
                                                    pauseOnHover: true,
                                                    style: { fontSize: '16px' },
                                                });
                                                fetchProducts();
                                                fetchStatistics();
                                            })
                                            .catch((error) => {
                                                console.error(error);
                                            });
                                    }
                                }}
                            >
                                <i className="bi bi-dash-circle"></i>
                            </button>
                        </div>
                        {/* the quantity will change as the admin makes changes to the inventory */}
                        <p className="w-1/5 mx-3 text-center">{product.quantity}</p>
                        <div className="w-2/5">
                            <button
                                className="w-full"
                                id="plusButton"
                                onClick={() => {
                                    // plus the inventory by 1 when the admin clicks on the plus button
                                    const productID = product.product_id;
                                    axios
                                        .put(`${baseUrl}/api/products/inventory/plus/${productID}`)
                                        .then((response) => {
                                            console.log('Increase button is clicked');
                                            toast.success(`Inventory level updated.`, {
                                                autoClose: 3000,
                                                pauseOnHover: true,
                                                style: { fontSize: '16px' },
                                            });
                                            fetchProducts();
                                            fetchStatistics();
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                        });
                                }}
                            >
                                <i className="bi bi-plus-circle"></i>
                            </button>
                        </div>
                    </div>
                </div>



                <div className="mx-auto w-full sm:w-full md:w-1/2 lg:w-1/2 lg:px-3 md:px-3  items-center ">
                    {/* link to ProductEdit page as the admin clicks on the pencil icon to edit */}
                    <Link
                        to={`/products/edit/${product.product_id}`}
                        className="mr-2"
                    >
                        <i className="bi bi-pencil-square"></i>
                    </Link>

                    <div>
                        <button
                            onClick={() => { setShowDeleteModal(true); console.log(showDeleteModal); }}
                        >
                            <i className="bi bi-trash-fill"></i>
                        </button>
                        {/* Render the delete modal */}
                        {showDeleteModal && (
                            <DeleteModal
                                // id={product.product_id}
                                onCancel={() => { setShowDeleteModal(false); console.log("cancel button is clicked") }}
                                onDelete={() => {
                                    console.log("delete button is clicked")
                                    setShowDeleteModal(false); // Close the modal

                                    axios
                                        .delete(`${baseUrl}/api/products/${product.product_id}`)
                                        .then((res) => {
                                            // const updatedProducts = products.filter(
                                            //     (p) => p.product_id !== productID
                                            // );
                                            toast.success(`Product deleted.`, {
                                                autoClose: 3000,
                                                pauseOnHover: true,
                                                style: { 'font-size': '16px' },
                                            });
                                            // setProducts(updatedProducts);
                                            fetchProducts();
                                            fetchStatistics();
                                        });

                                    // give partial refund to customers who ordered the deleted products
                                    axios
                                        .post(
                                            `${baseUrl}/processPartialRefund/${product.product_id}`
                                        )
                                        .then((response) => {
                                            console.log(response);
                                            setRefunds(response.data.data);
                                            console.log(refunds);
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                        });

                                    toast.success(`Giving partial refund now.`, {
                                        autoClose: 3000,
                                        pauseOnHover: true,
                                        style: { 'font-size': '16px' },
                                    });

                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}