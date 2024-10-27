import React, { useState } from 'react';
import './SignIn.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/store';

function SignIn() {
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth(); // Move useAuth to the component's top level
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, { email, password });
      if (response.data) {
        const data = response.data;
        console.log("data from server", data);
        storeTokenInLS(data.token);
        setEmail('');
        setPassword('');
        navigate('/');
      }
    } catch (err) {
      setError('Login failed. Please check your email and password.');
      console.error(err);
    }
  };

  return (
    <div className="row d-flex justify-content-center">
      <div className="col-xl-5 col-lg-6 col-md-7 col-sm-9 col-11">
        <div className="d-flex justify-content-center">
          <h2 className="login-font">Login</h2>
        </div>
        <div className="d-flex justify-content-center">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                id="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button type="submit" className="btn form-submit">Submit</button>
          </form>
        </div>
        <div>
          <h6 className="login-font mt-2">
            Don't have an account? 
          </h6>
          <a href="" onClick={() => navigate('/signup')} className="register-here">Register here</a>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
