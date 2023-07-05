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

export default function Product({
  product,
  refunds,
  setRefunds,
  fetchProducts,
  fetchStatistics,
}) {
  // const { product, products, refunds, setProducts, setRefunds } = props;

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const increaseInventory = (productID) => {
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
  };

  const decreaseInventory = (productID) => {
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
  };

  const deleteProduct = (productID) => {
    axios
      .delete(`${baseUrl}/api/products/${product.product_id}`)
      .then((res) => {
        console.log('productID: ', product.product_id);
        toast.success(`Product deleted.`, {
          autoClose: 3000,
          pauseOnHover: true,
          style: { 'font-size': '16px' },
        });
        fetchProducts();
        fetchStatistics();
      });

    // give partial refund to customers who ordered the deleted products
    axios
      .post(`${baseUrl}/processPartialRefund/${product.product_id}`)
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
  };

    return (
        <tr className="bg-white border-b hover:bg-gray-50 text-dark text-center">
            <td className="aspect-square" style={{ width: "250px" }}>
                <AdvancedImage
                    className="h-full w-full bg-gray-50 rounded-lg object-cover"
                    cldImg={cld.image(product.image_url)}
                />
            </td>
            <td className="px-6 py-4 font-semibold text-gray-900">
                {product.product_name}
            </td>
            <td className="px-6 py-4 font-semibold text-gray-900">
                {product.category_name}
            </td>
            <td className="px-6 py-4 font-semibold text-gray-900">
                {product.brand_name}
            </td>
            <td className="px-6 py-4 font-semibold text-gray-900">
                ${product.price}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                    <button className="inline-flex items-center p-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button" onClick={() => {
                        if (product.quantity >= 1) {
                            // minus the inventory by 1 when the admin clicks on the minus icon
                            const productID = product.product_id;
                            decreaseInventory(productID);
                        }
                    }}>
                        <span className="sr-only">Quantity button</span>
                        <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                    </button>
                    <div className="flex justify-center items-center">
                        <input
                            type="number"
                            id="first_product"
                            className="text-center bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder={product.quantity}
                            disabled
                        />
                    </div>

                    <button className="inline-flex items-center p-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button" onClick={() => {
                        // plus the inventory by 1 when the admin clicks on the plus button
                        const productID = product.product_id;
                        increaseInventory(productID);
                    }}>
                        <span className="sr-only">Quantity button</span>
                        <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>
            </td>
            <td className="px-6 py-4 items-center justify-center">
                <Link to={`/products/edit/${product.product_id}`}>
                    <i className="text-lg bi bi-pencil-square"></i>
                </Link>

                <div className='h-100'>
                    <button onClick={() => { setShowDeleteModal(true); console.log(showDeleteModal); }}>
                        <i className="text-lg bi bi-trash-fill"></i>
                    </button>
                    {/* Render the delete modal */}
                    {showDeleteModal && (
                        <DeleteModal
                            onCancel={() => { setShowDeleteModal(false); console.log("cancel button is clicked") }}
                            onDelete={() => {
                                console.log("delete button is clicked")
                                setShowDeleteModal(false); // Close the modal
                                const productID = product.product_id;
                                deleteProduct(productID);
                            }}
                        />
                    )}
                </div>
            </td>

        </tr>
    )
}
