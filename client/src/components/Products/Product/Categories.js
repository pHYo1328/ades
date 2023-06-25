import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../../Loading/Loading';

export default function Categories({ setCategoryID, all, edit = false, productData = null }) {
    const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
    const [categories, setCategories] = useState(null);

    // get all category for drop down selection
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
        <select
            class="form-select form-select-sm"
            onChange={(e) => setCategoryID(e.target.value)}
        >
            <option disabled selected value="0">
                -- CATEGORY --
            </option>
            {/* shows all the categories for drop down select */}
            {categories ? (
                categories.map((category) => (
                    <option value={category.category_id} selected={
                        edit && category.category_name === productData?.category_name
                    }>
                        {category.category_name}
                    </option>
                ))
            ) : (
                // Loading component (full screen)
                <div className="flex items-center justify-center h-screen">
                    <Loading />
                </div>
            )}

            {all && <option value={0}>All</option>}
        </select>
    )
}