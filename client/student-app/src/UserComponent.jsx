import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import './UserComponent.css'; // Import the CSS file

// Define the login mutation
const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

const UserComponent = () => {
  // State for the username and password inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // useMutation hook for the login mutation
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  // useNavigate hook for navigation
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the login mutation
    login({ variables: { username, password } }).finally(() => {
      // Navigate to the student list page regardless of the login result
      navigate('/students');
    });
  };

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group mb-3">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
      {data && <p className="text-success text-center mt-3">{data.login}</p>}
    </div>
  );
};

export default UserComponent;