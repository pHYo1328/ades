import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarChart from './BarChart';

export default function OrdersByBrandsChart() {

    const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
    const [brands, setBrands] = useState(null);
    let labels = [];
    let counts = [];

    useEffect(() => {
        axios
            .get(`${baseUrl}/api/admin/orders/count`)
            .then((response) => {
                console.log(response);
                setBrands(response.data.brands);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    console.log('brands', brands);

    if (brands) {
        labels = brands.map((brand) => brand.brand);
        counts = brands.map((brand) => brand.count);
    }

    return (
        <BarChart labels={labels} counts={counts} color={'bg-emerald-200'} title={'Orders (By Brand)'} legend={'Orders'} />
    );
}
