import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductDetails() {
  // const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const baseUrl = "http://localhost:8081";
  const productID = 8;
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/product/${productID}`)
      .then((response) => {
        console.log(response);
        setProduct(response.data.data);
        console.log(product);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <div>
        {product ? (
          <div>
            <h1>{product.product_name}</h1>
            <p>{product.description}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
