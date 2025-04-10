import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const CREATE_HELP_REQUEST = gql`
  mutation CreateHelpRequest($city: String!, $category: String, $description: String) {
    createHelpRequest(city: $city, category: $category, description: $description) {
      id
      city
      category
      description
      status
    }
  }
`;

const categories = [
  'Eldercare',
  'Childcare',
  'Groceries',
  'Transportation',
  'Home Repair',
  'Pet Sitting',
  'Tutoring',
  'Technology Help',
  'Other'
];

const NewHelpRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    city: '',
    category: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [createHelpRequest, { loading }] = useMutation(CREATE_HELP_REQUEST, {
    onCompleted: (data) => {
      setSuccess(true);
      setTimeout(() => {
        navigate(`/help/request/${data.createHelpRequest.id}`);
      }, 2000);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.city.trim()) {
      setError('City is required');
      return;
    }
    
    createHelpRequest({ variables: formData });
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Request Community Help</h1>
        <Button variant="outline-primary" onClick={() => navigate('/help')}>
          Back to Listings
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Help request created successfully! Redirecting...</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>City *</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter your city"
            required
          />
          <Form.Text className="text-muted">
            We'll match you with volunteers in your area.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what kind of help you need..."
            rows={5}
          />
          <Form.Text className="text-muted">
            Please provide details about your request to help us find the best volunteer match.
          </Form.Text>
        </Form.Group>

        <div className="d-grid gap-2">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Help Request'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default NewHelpRequest;