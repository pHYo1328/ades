import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductsByCategory() {
  // const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const baseUrl = "http://localhost:8081";
  const categoryID = 3;
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/products/category/${categoryID}`)
      .then((response) => {
        console.log(response);
        setProducts(response.data.data);
        console.log(products);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <a href="/products">
        <h1 class="text-3xl font-bold underline">Products</h1>
      </a>
      <div id="products">
        {products ? (
          products.map((product) => (
            <div key={product.id}>
              <h1>{product.product_name}</h1>
              <p>{product.description}</p>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
