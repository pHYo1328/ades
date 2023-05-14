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
    const baseUrl = 'http://localhost:8081';

    useEffect(() => {
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
    }, []);

            // delete product 
            // $(document).ready(function () {
            //     console.log("A");
            //     $("#editButton").click(function () {
            //         console.log("B");
    
            //         const productID = product.product_id;
    
            //         // delete actor with actorID
            //         axios.delete(`${baseUrl}/products/${productID}/`)
            //             .then((res) => {
            //                 alert('Product is successfully deleted!')
            //                 // actor will no longer exist in the system
            //                 window.location.assign('http://localhost:8082/products/');
            //             });
    
            //     });
            // });

    return (
        <div className="bg-white w-full text-dark text-left container-fluid align-items-center">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <ul role="list" class="divide-y divide-gray-100">
                    {products ? (
                        products.map((product) => (
                          

                            <div class="row col-10 mb-5">
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
  <div class="d-flex flex-row">
    <button type="button" class="btn btn-warning w-100 col-6 text-dark mr-2" id="editButton">Edit</button>
    <button type="button" class="btn btn-danger w-100 col-6 text-dark" id="deleteButton">Delete</button>
  </div>
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