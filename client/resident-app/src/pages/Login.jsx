import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { refetch } = useAuth();

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: async (data) => {
      if (data.login.success) {
        await refetch();
        navigate('/');
      } else {
        setError(data.login.message || 'Login failed');
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    login({ variables: { email, password } });
  };

  return (
<div className="login-page-wrapper d-flex align-items-center justify-content-center min-vh-100">
      <div className="login-form-container position-relative">
        {/* Cute Header Section */}
        <section className="text-center mb-4">
          <div className="cute-bubble mb-3">
            <span className="bubble-emoji">🔐</span>
          </div>
          <h1 className="display-6 fw-bold mb-2">Welcome Back!</h1>
          <p className="subtitle mb-3">Sign in to connect with your community</p>
        </section>

        {/* Login Form Card */}
        <div className="cute-banner rounded-4 shadow p-4 p-md-5 position-relative">
          {error && (
            <div className="alert alert-danger rounded-3" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email address</label>
              <input
                type="email"
                className="form-control rounded-pill"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control rounded-pill"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4 py-2 w-100 shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="mb-0">
              Don't have an account?{' '}
              <Link to="/register" className="text-decoration-none fw-semibold">
                Register here
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

export default Login;