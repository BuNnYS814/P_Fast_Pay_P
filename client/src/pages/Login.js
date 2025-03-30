import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { email, password };

    axios.post('http://localhost:5000/api/login', user)
      .then(res => {
        const { upi_id, balance, email, name } = res.data;
        
        // Store complete user data
        const userData = {
          name,
          email,
          upi_id,
          balance: Number(balance)
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Stored user data:', userData);

        navigate('/transaction');
      })
      .catch(err => alert('Error logging in'));
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row">
        <div className="">
          <div className="card p-4 shadow-sm">
            <h2 className="card-title mb-4 text-center">LOGIN</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">E-Mail</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            </form>
            <p className="mt-3 text-center">
              Don't have an account? <Link to="/signup" className="link-primary">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
