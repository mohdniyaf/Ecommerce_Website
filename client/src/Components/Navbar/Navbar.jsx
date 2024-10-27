import React, { useState } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // Import your Auth Context

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, LogoutUser } = useAuth();  // Destructure values from useAuth
  const [search, setSearch] = useState(false);

  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#"><h4>Ryme.</h4></a>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav m-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="" onClick={() => navigate('/')}>Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="">Shop</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="">Favourite</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="">Contact</a>
              </li>
            </ul>
          </div>

          <div className="d-flex align-items-center nav-right">
            <p className="mb-0 navbar-hide"><i className="fa-solid fa-heart nav-icon"></i></p>
            <p className="mb-0" onClick={() => setSearch(!search)}><i className="fa-solid fa-magnifying-glass nav-icon"></i></p>
            <p className="mb-0" onClick={() => navigate('/cart')}><i className="fa-solid fa-cart-shopping nav-icon"></i></p>

            {/* Conditionally render Login button or User dropdown based on isLoggedIn */}
            {!isLoggedIn ? (
              <p className="mb-0 navbar-hide" onClick={() => navigate('/login')}>
                <button type="button" className="btn nav-login-btn bg-primary text-light">Login</button>
              </p>
            ) : (
              <p className="mb-0">
                <ul className="navbar-nav ms-auto navbar-hide">
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle d-flex align-items-center"
                      href="#"
                      id="navbarDropdownMenuLink"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="loged-initial"><p>MA</p></div>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-loged" aria-labelledby="navbarDropdownMenuLink">
                      <li><a className="dropdown-item" href="#"><i className="fa-solid fa-user"></i> My profile</a></li>
                      <li><a className="dropdown-item" href="#" onClick={() => navigate('/orders')}><i className="fa-solid fa-bag-shopping"></i> Orders</a></li>
                      <li><a className="dropdown-item" href="#" onClick={LogoutUser}><i className="fa-solid fa-right-from-bracket"></i> Logout</a></li>
                    </ul>
                  </li>
                </ul>
              </p>
            )}
          </div>
        </div>
      </nav>

      {/* Search bar */}
      {search && (
        <div className="search-form-container">
          <div className="search-form-box">
            <div className="input-container">
              <input type="search" className="head-search-form" placeholder="Search" />
            </div>
            <div className="icon-container d-flex align-items-center">
              <i className="fa-solid fa-xmark" onClick={() => setSearch(false)}></i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
