import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_ALERT, GET_ACTIVE_ALERTS } from '../graphql/queries';
import CitySelector from './CitySelector';

const CreateAlert = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('Toronto');
  const [message, setMessage] = useState('');

  const [createAlert, { loading }] = useMutation(CREATE_ALERT, {
    refetchQueries: [
      { 
        query: GET_ACTIVE_ALERTS,
        variables: { city }
      }
    ],
    onCompleted: () => {
      setTitle('');
      setDescription('');
      setMessage('Alert created successfully!');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage(`Error: ${error.message}`);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) {
      setMessage('Please fill in all fields');
      return;
    }
    
    createAlert({
      variables: { title, description, city }
    });
  };

  return (
    <div className="create-alert-container">
      <h2>Create Community Alert</h2>
      {message && <div className="alert-message">{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Alert Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label>City:</label>
          <CitySelector selectedCity={city} onChange={setCity} />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Alert'}
        </button>
      </form>
    </div>
  );
};

export default CreateAlert;