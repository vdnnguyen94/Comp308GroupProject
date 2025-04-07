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
    <div className="container d-flex justify-content-center align-items-center min-vh-100 login-container">
      <div className="w-100">
        <div className="text-center">
          <div className="cute-bubble mb-3">
            <span className="bubble-emoji">🔐</span>
          </div>
          <h2 className="fw-bold mb-4">Welcome Back!</h2>
        </div>
        <div className="card p-4 shadow rounded-4">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
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
              <label htmlFor="password" className="form-label">Password</label>
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
              className="btn btn-primary w-100 rounded-pill"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-3">
            <p className="text-muted small">
              Don't have an account?{' '}
              <Link to="/register" className="text-decoration-none text-primary">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
