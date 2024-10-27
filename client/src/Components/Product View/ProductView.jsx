import React, { useState, useEffect } from 'react';
import './ProductView.css';
import './Responsive.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Navigation, FreeMode, Thumbs } from 'swiper/modules';
import { useAuth } from '../../context/store'; // Adjust the path as needed

function ProductView() {
  const { id } = useParams(); // Get product ID from URL
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { token } = useAuth(); // Get token from AuthContext

  // Fetch product details based on the product ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/productSinglePage/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Add to Cart function
  const addToCart = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/addCart`,
        { productId: id, quantity }, // Adjust the payload if needed
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="category-container row">
        <div className="col-xl-5 col-lg-4 col-md-4 col-sm-5 col-12-img ">
          <div className="cate-image-cont d-flex justify-content-center">
            <div className='img-cont'>
              <div className='cate-image-box'>
                <Swiper
                  style={{
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                    '--swiper-navigation-size': '15px'
                  }}
                  slidesPerView={1}
                  spaceBetween={10}
                  grabCursor
                  loop
                  navigation={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                  className="mySwiper2"
                >
                  {product.images.map((img) => (
                    <SwiperSlide key={img._id} className='d-flex justify-content-center'>
                      <img src={img.url} className="cate-image" alt={img.altText} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="img-selec-cont">
                <Swiper
                  style={{
                    '--swiper-navigation-size': '15px'
                  }}
                  watchSlidesProgress={true}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={3}
                  freeMode={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper"
                >
                  {product.images.map((img) => (
                    <SwiperSlide key={img._id} className='swiper-slide-1 d-flex justify-content-center'>
                      <img src={img.url} className="cate-image" alt={img.altText} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-7 col-lg-8 col-md-8 col-sm-7 col-12-desc column-desc">
          <h6 className='name-desc'>{product.name}</h6>
          <h6 className="category-card">{product.category}</h6>
          <p className='name-desc '>₹ {product.price}</p>

          <select id="size" aria-placeholder='select'>
            <option value="">Select size</option>
            {product.size.map((size, index) => (
              <option key={index} value={size}>{size}</option>
            ))}
          </select>

          <div className="d-flex">
            <div className='m-1'>
              <i className="fa-solid fa-minus" onClick={() => {
                if (quantity > 1) setQuantity(quantity - 1);
              }}></i>
              <input type="number" disabled className='ms-2 quantity-desc' value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <i className="fa-solid fa-plus" onClick={() => setQuantity(quantity + 1)}></i>
            </div>
            <button type="button" className="button-desc ms-3 m-1" onClick={addToCart}>ADD TO CART</button>
          </div>

          <h6 className='san-font'>Product Details:</h6>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductView;
