//user-app/src/UserComponent.jsx
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the login mutation
    login({ variables: { username, password } });
  };

  return (
    <div>
      <h2>Hello from User Component!</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          Login
        </button>
      </form>
      {error && <p>Error: {error.message}</p>}
      {data && <p>{data.login}</p>}
    </div>
  );
};

export default UserComponent;
