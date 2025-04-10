import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col, Badge } from 'react-bootstrap';

const GET_VOLUNTEER_BY_TOKEN = gql`
  query GetVolunteerByToken {
    getVolunteerByToken {
      id
      city
      interests
      availability {
        day
        from
        to
      }
      user {
        id
        fullName
      }
    }
  }
`;

const CREATE_VOLUNTEER = gql`
  mutation CreateVolunteer($city: String!, $interests: [String], $availability: [AvailabilityInput]) {
    createVolunteer(city: $city, interests: $interests, availability: $availability) {
      id
      city
      interests
      availability {
        day
        from
        to
      }
    }
  }
`;

const DELETE_VOLUNTEER = gql`
  mutation DeleteVolunteer($id: ID!) {
    deleteVolunteer(id: $id)
  }
`;

const interestOptions = [
  'Eldercare',
  'Childcare',
  'Groceries',
  'Transportation',
  'Home Repair',
  'Pet Sitting',
  'Tutoring',
  'Technology Help',
  'Languages',
  'Cooking',
  'Gardening',
  'Arts & Crafts'
];

const daysOfWeek = [
  'Monday', 
  'Tuesday', 
  'Wednesday', 
  'Thursday', 
  'Friday', 
  'Saturday', 
  'Sunday'
];

const VolunteerForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    city: '',
    interests: [],
    availability: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get existing volunteer profile if any
  const { loading: profileLoading, error: profileError, data: profileData, refetch } = useQuery(GET_VOLUNTEER_BY_TOKEN, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data.getVolunteerByToken && data.getVolunteerByToken.length > 0) {
        const volunteer = data.getVolunteerByToken[0];
        setFormData({
          city: volunteer.city,
          interests: volunteer.interests || [],
          availability: volunteer.availability || []
        });
      }
    }
  });

  const [createVolunteer, { loading: createLoading }] = useMutation(CREATE_VOLUNTEER, {
    onCompleted: () => {
      refetch();
      setSuccess('Volunteer profile created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const [deleteVolunteer, { loading: deleteLoading }] = useMutation(DELETE_VOLUNTEER, {
    onCompleted: () => {
      setSuccess('Volunteer profile deleted successfully!');
      setTimeout(() => {
        setSuccess('');
        navigate('/help');
      }, 2000);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const hasProfile = profileData?.getVolunteerByToken?.length > 0;
  const volunteerId = hasProfile ? profileData.getVolunteerByToken[0].id : null;

  const handleInterestChange = (e) => {
    const { checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, value]
        : prev.interests.filter(interest => interest !== value)
    }));
  };

  const handleAddAvailability = () => {
    setFormData(prev => ({
      ...prev,
      availability: [...prev.availability, { day: 'Monday', from: '09:00', to: '17:00' }]
    }));
  };

  const handleRemoveAvailability = (index) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...formData.availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setFormData(prev => ({ ...prev, availability: newAvailability }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.city.trim()) {
      setError('City is required');
      return;
    }
    
    createVolunteer({ variables: formData });
  };

  const handleDeleteProfile = () => {
    if (window.confirm('Are you sure you want to delete your volunteer profile?')) {
      deleteVolunteer({ variables: { id: volunteerId } });
    }
  };

  if (profileLoading) return <div className="text-center p-5">Loading profile...</div>;
  if (profileError) return <div className="alert alert-danger m-5">Error: {profileError.message}</div>;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{hasProfile ? 'Your Volunteer Profile' : 'Become a Volunteer'}</h1>
        <Button variant="outline-primary" onClick={() => navigate('/help')}>
          Back to Help Requests
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>City *</Form.Label>
              <Form.Control
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Enter your city"
                required
              />
              <Form.Text className="text-muted">
                We'll match you with help requests in your area.
              </Form.Text>
            </Form.Group>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Areas of Interest</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              {interestOptions.map(interest => (
                <Col md={4} key={interest}>
                  <Form.Check
                    type="checkbox"
                    id={`interest-${interest}`}
                    label={interest}
                    value={interest}
                    checked={formData.interests.includes(interest)}
                    onChange={handleInterestChange}
                    className="mb-2"
                  />
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Availability</h5>
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={handleAddAvailability}
            >
              Add Time Slot
            </Button>
          </Card.Header>
          <Card.Body>
            {formData.availability.length === 0 ? (
              <div className="text-center py-3">
                <p className="text-muted">No availability added yet. Click "Add Time Slot" to add your availability.</p>
              </div>
            ) : (
              formData.availability.map((slot, index) => (
                <Row key={index} className="align-items-center mb-3 pb-3 border-bottom">
                  <Col md={3}>
                    <Form.Select
                      value={slot.day}
                      onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                    >
                      {daysOfWeek.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      type="time"
                      value={slot.from}
                      onChange={(e) => handleAvailabilityChange(index, 'from', e.target.value)}
                    />
                  </Col>
                  <Col md={1} className="text-center">to</Col>
                  <Col md={3}>
                    <Form.Control
                      type="time"
                      value={slot.to}
                      onChange={(e) => handleAvailabilityChange(index, 'to', e.target.value)}
                    />
                  </Col>
                  <Col md={2} className="text-end">
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleRemoveAvailability(index)}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))
            )}
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-between">
          {hasProfile && (
            <Button 
              variant="outline-danger" 
              onClick={handleDeleteProfile}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Profile'}
            </Button>
          )}
          <Button 
            variant="primary" 
            type="submit" 
            className="ms-auto"
            disabled={createLoading}
          >
            {createLoading ? 'Saving...' : (hasProfile ? 'Update Profile' : 'Create Profile')}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default VolunteerForm;