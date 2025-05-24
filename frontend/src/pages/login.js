import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/user/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      const role = res.data.role;
      if(role === 'organizer')
        navigate('/organizer-dashboard');
      else if(role === 'participant')
        navigate('/participant-dashboard');
      else
        alert('Unknow user');
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleSubmit} className="p-4 rounded shadow bg-light" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="mb-4 text-center text-primary">Login</h2>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input 
            type="email" 
            className="form-control" 
            id="email" 
            name="email" 
            onChange={handleChange} 
            placeholder="Enter email" 
            required 
            value={formData.email}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            id="password" 
            name="password" 
            onChange={handleChange} 
            placeholder="Enter password" 
            required 
            value={formData.password}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Login</button>

        <div className="text-center">
          <span>New user? </span>
          <Link to="/register" className="btn btn-link p-0 align-baseline">Register here</Link>
        </div>

      </form>
    </div>
  );
}

export default Login;
