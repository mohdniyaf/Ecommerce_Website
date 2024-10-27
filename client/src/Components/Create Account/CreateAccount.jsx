import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateAccount() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/signup`, formData);
      console.log('Account created successfully:', response.data);
      navigate('/login'); // Redirect to login page on success
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  return (
    <div>
      <div className="row d-flex justify-content-center">
        <div className="col-xl-5 col-lg-6 col-md-7 col-sm-9 col-11">
          <div className="d-flex justify-content-center">
            <h2 className="login-font">Create Account!</h2>
          </div>
          <div className="d-flex justify-content-center">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">First name</label>
                <input
                  type="text"
                  name="firstname"
                  placeholder="Enter First Name"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Last name</label>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Enter Last Name"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter Phone Number"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email Address"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn form-submit">Submit</button>
            </form>
          </div>
          <div>
            <h6 className="login-font mt-2">
              Already have an account?{' '}
              <a href="#" onClick={() => navigate('/login')} className="register-here">
                Login here
              </a>
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
