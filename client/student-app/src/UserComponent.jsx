import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import './UserComponent.css'; // Import the CSS file


// Login mutation to handle login
const LOGIN_MUTATION = gql`
  mutation Login($studentNumber: String!, $password: String!) {
    login(studentNumber: $studentNumber, password: $password) {
      message
    }
  }
`;
const IS_LOGGED_IN = gql`
  query {
    isLoggedIn {
      isLoggedIn
      studentNumber
    }
  }
`;

const UserComponent = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);
  const { refetch } = useQuery(IS_LOGGED_IN, {
    skip: true, // Skip query execution initially
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    login({ variables: { studentNumber, password } })
      .then(() => {
        if (data && !error) {
          console.log('Login successful');
          // Redirect using window.location.href after successful login
          refetch().then(() => {
            // Navigate to the student page after login is successful
            navigate(`/students/${studentNumber}`);
          });
        }
      })
      .catch((err) => {
        console.error('Login error:', err);
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group mb-3">
          <label>Student Number:</label>
          <input
            type="text"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group mb-3">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-100">
          Login
        </button>
      </form>
      {error && <p className="text-danger text-center mt-3">Error: {error.message}</p>}
      {data && <p className="text-success text-center mt-3">{data.login.message}</p>}
    </div>
  );
};

export default UserComponent;
