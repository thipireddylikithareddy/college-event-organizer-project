import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'participant'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailVerified) {
      alert('please verify your email before registering');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/user/register', formData);
      alert("Registration successful");
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  const handleSendCode = async () => {
    const email = formData.email.trim();

    if (!email) {
      alert('Please enter your email first');
      return;
    }
    await axios.post('http://localhost:5000/api/verify/send', { email: formData.email });
    alert('Verification code sent to your email');
  };

  const handleVerifyCode = async () => {
    const email = formData.email.trim();

    if (!email) {
      alert('Please enter your email before verifying the code');
      return;
    }

    const code = prompt('Enter the code sent to your email');
    const res = await axios.post('http://localhost:5000/api/verify/check', { email: formData.email, code });
    if (res.data.message === 'Email verified') {
      setEmailVerified(true);
    }
    else {
      alert('Verification failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={handleSubmit}
        className="p-4 rounded shadow bg-light"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <h2 className="mb-4 text-center text-success">Register</h2>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            placeholder="Enter your name"
            required
            onChange={handleChange}
            value={formData.name}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="Enter your email"
            required
            onChange={handleChange}
            value={formData.email}
          />
        </div>

        <div className="mb-3 d-flex">
          <button type="button" className="btn btn-primary me-2" onClick={handleSendCode}>
            Send Code
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleVerifyCode} disabled={emailVerified}>
            {emailVerified ? 'Verified' : 'Verify Code'}
          </button>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="Enter your password"
            required
            onChange={handleChange}
            value={formData.password}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            id="role"
            name="role"
            className="form-select"
            onChange={handleChange}
            value={formData.role}
          >
            <option value="participant">Participant</option>
            <option value="organizer">Organizer</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success w-100">Register</button>
      </form>
    </div>
  );
}

export default Register;

