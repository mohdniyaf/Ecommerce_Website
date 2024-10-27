import React, { useState, useEffect } from 'react';
import './ProductCard.css';
import './Responsive.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/store'; // Import auth context for token

function ProductCard() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [products, setProducts] = useState([]);

  // Fetch product data from your API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/allProduct`); // Adjust the endpoint to match your backend
        setProducts(response.data); // Assuming the response contains the array of products
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProducts();
  }, []);

  // Function to handle adding product to cart
  const addToCart = async (id,quantity) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/addCart`, 
        { productId: id, quantity }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <div className='productCard-border'>
      <div className='productCard-headin d-flex justify-content-center'>
        <h4 className='san-font'>Products</h4>
      </div>
      <div className='productCard-container d-flex justify-content-center'>
        <div className='productCard-container'>
          {products.map((product) => (
            <div className="productCard-box bg-light" key={product._id} onClick={() => navigate(`/category/${product._id}`)}>
              <div className='productCard-image-container'>
                {/* Access the first image's URL from the array */}
                <img 
                  src={product.images[0]?.url} 
                  className='productCard-image' 
                  alt={product.images[0]?.altText || product.name} 
                />
              </div>
              <div className='productCard-details'>
                <p><strong>{product.name}</strong></p>
                <p className="productCard-category">{product.subCategory}</p>
                <div className='d-flex justify-content-between'>
                  <p className='productCard-price'><strong>₹ {product.price}</strong></p>
                  <i 
                    className="fa-solid fa-cart-plus productCard-cart"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      const quantity=1;// Prevent navigation on cart icon click
                      addToCart(product._id,quantity);
                    }}
                  ></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
