import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Category() {
  const [categories, setCategories] = useState(null);
  const [categoryID, setCategoryID] = useState(0);
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

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
      {categories ? (
        categories.map((category) => (
          <option value={category.category_id}>{category.category_name}</option>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </select>
  );
}
