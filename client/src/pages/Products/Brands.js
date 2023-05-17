import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import axios from "axios";
import chalk from "chalk";

export default function Brands() {

    const [brands, setBrands] = useState(null)
    const [brand, setBrand] = useState(null)
    const baseUrl = 'http://localhost:8081';


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

      const handleSubmit = async (event) => {
        console.log(chalk.yellow('submit button is clicked!'))
        event.preventDefault();

        const name = document.getElementById("add").value;
        const type = "brand"

        if (!name){
            window.alert("Please fill in the name of the brand")
        } else{
            const requestBody = {
                name, type
            }
            console.log(requestBody)
            axios.post(`${baseUrl}/api/products/admin/type`, requestBody)
            .then((response) => {
                console.log(response)
                setBrand(response.data.data)
                console.log(brand)
                window.location.reload();
            })
        }
      }
      
    return(
        <div className="bg-white w-full text-dark text-left container-fluid align-items-center">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <h2 class="text-center font-weight-bold mb-5"><b>Admin Dashboard</b></h2>
            <div class="row">
                <div class="col-10">Brands</div>
               
            </div>
            <div class="row col-8" style={{marginLeft: 'auto', marginRight: 'auto'}}>
                <div class="col-10">
                <input type="text" class="form-control" id="add" placeholder="Brand Name"/>
                </div>
                <div class="col-2">
                <button class="btn btn-outline-success w-100" onClick={handleSubmit}>Add</button></div>
            </div>
            <ul role="list" class="divide-y divide-gray-100">
                {brands ? (
                    brands.map((brand) => (
                        <div class="d-flex flex-row row py-3 justify-content-around">
                            
                            <div class="col-6">
                                <p class="text-sm font-semibold leading-6 text-gray-900">{brand.brand_name}</p>
                            </div>
                            <div class="col-4 d-flex justify-content-end">

                            
                                <button onClick={() => {
                                    const brandID = brand.brand_id;
                                    axios.delete(`${baseUrl}/api/brands/${brandID}`)
                                        .then((res) => {
                                            // alert('Product is successfully deleted')
                                            // window.NavigationPreloadManager()
                                            const updatedBrands = brands.filter((b) => b.brand_id !== brandID);
                                            setBrands(updatedBrands);
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