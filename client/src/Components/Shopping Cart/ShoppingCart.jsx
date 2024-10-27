import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShoppingCart.css';
import { useAuth } from '../../context/store'; // Import auth context for token

function ShoppingCart() {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]); // Initialize as empty array
  const [quantity, setQuantity] = useState(1);

  // Fetch cart items function
  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.items || []); // Fallback to empty array if undefined
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchCartItems();
  }, [token]);

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/user/deleteCart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCartItems(); // Refetch cart items after deletion
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  return (
    <div>
      <div className="cart-border">
        <h3 className='cart-heading'>Shopping Cart</h3>
        <hr className='cart-border-hr'/>
        <div className='cart-cate-name'>
          <p className='cart-product-head-prod ps-3'>Product</p>
          <p className='cart-product-head-quan'>Quantity</p>
          <p className='cart-product-head-tot'>Subtotal</p>
        </div>
        <hr className='cart-border-hr' />
        <div className="cart-product-container">
          {cartItems.length > 0 ? cartItems.map((item) => (
            <div key={item._id}>
              <div className='cart-product'>
                <div className="cart-product-details ">
                  <div className="cart-product-image">
                    {item.product?.images?.[0] ? (
                      <img 
                        src={item.product.images[0].url} 
                        alt={item.product.images[0].altText || item.product.name} 
                      />
                    ) : (
                      <p>No Image Available</p>
                    )}
                  </div>
                  <div className="cart-product-content ">
                    <p className='cart-content-name'>{item.product?.name || "Product name unavailable"}</p>
                    <p className='cart-content-font'>₹{item.product?.price || "Price unavailable"}</p>
                    <select value={item.size || "sm"} aria-placeholder="Select size">
                      <option value="sm">sm</option>
                      <option value="lg">lg</option>
                      <option value="xl">xl</option>
                      <option value="xxl">xxl</option>
                    </select>
                    <p className='cart-content-font text-danger' onClick={() => removeFromCart(item.product._id)}>
                      Remove
                    </p>
                  </div>
                </div>
                <div className="cart-product-quantity">
                  <div className='m-1'>
                    <i className="fa-solid fa-minus" onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}></i>
                    <input type="number" disabled value={quantity} className='ms-2 quantity-desc' />
                    <i className="fa-solid fa-plus" onClick={() => setQuantity(quantity + 1)}></i>
                  </div>
                </div>
                <div className="cart-product-subtotal">
                  <p>₹{(item.product?.price || 0) * item.quantity}</p>
                </div>
                <div className='cart-product-break'>
                  <hr className='cart-product-hr'/>
                </div>
              </div>
            </div>
          )) : <p className="text-center">Your cart is empty.</p>}
        </div>
        <div className='d-flex justify-content-end me-3'>
          <h5 className='san-font'>Total Price: ₹{cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0)}</h5>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;
