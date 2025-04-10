import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';

const CREATE_ALERT = gql`
  mutation CreateAlert($title: String!, $description: String!, $city: String!) {
    createAlert(title: $title, description: $description, city: $city) {
      id
    }
  }
`;

function CreateAlertPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('Toronto');

  const [createAlert, { loading }] = useMutation(CREATE_ALERT, {
    onCompleted: () => {
      window.location.href = '/alerts';
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createAlert({ 
        variables: { title, description, city } 
      });
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  return (
    <div>
      <h1>Create Alert</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label>City:</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="Toronto">Toronto</option>
            <option value="Vancouver">Vancouver</option>
            <option value="Montreal">Montreal</option>
          </select>
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Alert'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAlertPage;