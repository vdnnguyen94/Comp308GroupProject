import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css';

const CREATE_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!, $fullName: String, $city: String!) {
    createUser(username: $username, email: $email, password: $password, fullName: $fullName, city: $city) {
      id
      username
      email
    }
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    city: 'Toronto'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [createUser, { loading }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      navigate('/login');
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const { confirmPassword, ...registrationData } = formData;
    createUser({ variables: registrationData });
  };

  const cities = ['Hamilton', 'Kitchener', 'London', 'Windsor', 'Toronto', 'Ottawa'];

  return (
    <div className="register-page-wrapper d-flex align-items-center justify-content-center min-vh-100">
      <div className="register-form-container position-relative">
        {/* Cute Header Section */}
        <section className="text-center mb-4">
          <div className="cute-bubble mb-3">
            <span className="bubble-emoji">👋</span>
          </div>
          <h1 className="display-6 fw-bold mb-2">Create Your Account</h1>
          <p className="subtitle mb-3">Join our community today</p>
        </section>
        {/* Register Form Card */}
        <div className="cute-banner rounded-4 shadow p-4 p-md-5 position-relative">
          {error && (
            <div className="alert alert-danger rounded-3" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="username" className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  name="username"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label fw-semibold">Email address</label>
                <input
                  type="email"
                  className="form-control rounded-pill"
                  id="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="fullName" className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  name="fullName"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="city" className="form-label fw-semibold">City</label>
                <select
                  className="form-select rounded-pill"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  name="city"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="password" className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control rounded-pill"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
                <input
                  type="password"
                  className="form-control rounded-pill"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  name="confirmPassword"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4 py-2 w-100 shadow-sm mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Registering...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus me-2"></i>Register
                </>
              )}
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="mb-0">
              Already have an account?{' '}
              <Link to="/login" className="text-decoration-none fw-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="decoration-dot dot1"></div>
        <div className="decoration-dot dot2"></div>
        <div className="decoration-dot dot3"></div>
        <div className="decoration-circle circle1"></div>
        <div className="decoration-circle circle2"></div>
      </div>
    </div>
  );
};

export default Register;