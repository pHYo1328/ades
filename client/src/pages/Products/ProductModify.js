import { useState, useEffect } from "react";
import axios from "axios";
import chalk from "chalk";

import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";

const cld = new Cloudinary({
    cloud: {
        cloudName: "ddoajstil",
    },
});


export default function ProductModify() {
    const [products, setProducts] = useState(null);
    const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

    // useEffect(() => {
    //     axios
    //         .get(`${baseUrl}/api/products`)
    //         .then((response) => {
    //             console.log(response);
    //             setProducts(response.data.data);
    //             console.log(products);
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // }, []);

    const fetchProducts = () => {
        axios
          .get(`${baseUrl}/api/products`)
          .then((response) => {
            console.log(response);
            setProducts(response.data.data);
            console.log(products);
          })
          .catch((error) => {
            console.error(error);
          });
      };

      useEffect(() => {
        fetchProducts();
      }, [])

    return (
        <div className="bg-white w-full text-dark text-left container-fluid align-items-center">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <h2 class="text-center font-weight-bold mb-5"><b>Admin Dashboard</b></h2>
                <div class="row">
                    <div class="col-10">Products</div>
                    <div class="col-2">
                        <button type="button" class="btn btn-success w-100 col-6 text-dark mr-2" id="createButton" onClick={() => {
                            window.location.href = `http://localhost:3000/products/create`;
                        }}>Create</button>
                    </div>
                </div>
                <ul role="list" class="divide-y divide-gray-100">
                    {products ? (
                        products.map((product) => (
                            <div class="d-flex flex-row row py-3 justify-content-around">
                                <div class="col-2">
                                    <AdvancedImage class="h-12 w-12 flex-none bg-gray-50"
                                        cldImg={cld.image(product.image_url.split(",")[0])}
                                    />
                                </div>
                                <div class="col-6">
                                    <p class="text-sm font-semibold leading-6 text-gray-900">{product.product_name}</p>
                                    <p class="mt-1 truncate text-xs leading-5 text-gray-500">{product.category_name} - {product.brand_name}</p>
                                </div>
                                <div class="col-4 d-flex justify-content-end">

                                    <div class="col-6">
                                        <button id="plusButton" onClick={() => {
                                            // console.log(product.product_id)
                                            const productID = product.product_id
                                            axios
                                                .put(`${baseUrl}/api/products/inventory/plus/${productID}`)
                                                .then((response) => {
                                                    //  console.log(response);
                                                    //  setProducts(response.data.data);
                                                    //  console.log(products);
                                                    console.log("Increase button is clicked")
                                                    fetchProducts();
                                                })
                                                .catch((error) => {
                                                    console.error(error);
                                                });
                                            
                                                product.quantity ++;
                                        }}>
                                            <i class="bi bi-plus-circle"></i>
                                        </button>
                                        <p>{product.quantity}</p>
                                        <button id="minusButton" onClick={() => {
                                            if(product.quantity >= 1){

                                           
                                            // console.log(product.product_id)
                                            const productID = product.product_id
                                             axios
                                             .put(`${baseUrl}/api/products/inventory/minus/${productID}`)
                                             .then((response) => {    
                                                console.log("Decrease button is clicked")
                                                fetchProducts();
                                             })
                                             .catch((error) => {
                                                 console.error(error);
                                             });
                                            } 

                                         }}>
                                        <i class="bi bi-dash-circle"></i>
                                            
                                        </button>
                                    </div>

                                    <button onClick={() => {
                                        const productID = product.product_id;
                                        window.location.href = `http://localhost:3000/products/edit/${productID}`;
                                    }}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>


                                    <button onClick={() => {
                                        const productID = product.product_id;
                                        axios.delete(`${baseUrl}/api/products/${productID}`)
                                            .then((res) => {
                                                // alert('Product is successfully deleted')
                                                // window.NavigationPreloadManager()
                                                const updatedProducts = products.filter((p) => p.product_id !== productID);
                                                setProducts(updatedProducts);
                                            })
                                    }}>
                                        <i class="bi bi-trash-fill"></i>
                                    </button>

                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Loading...</p>
                    )}
                </ul>
            </div>
        </div>
    )
}