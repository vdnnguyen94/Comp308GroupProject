import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container, Card, Row, Col, Badge } from 'react-bootstrap';

// GraphQL Queries and Mutations
const GET_HELP_REQUESTS = gql`
  query GetHelpRequests($city: String) {
    getHelpRequests(city: $city) {
      id
      user {
        id
        fullName
      }
      city
      category
      description
      status
      createdAt
      bestMatches {
        id
        fullName
      }
    }
  }
`;

const HelpIndex = () => {
  const navigate = useNavigate();
  const [activeCity, setActiveCity] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const { loading, error, data, refetch } = useQuery(GET_HELP_REQUESTS, {
    variables: { city: cityFilter },
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    // Could load user's city from profile or localStorage
    const userCity = localStorage.getItem('userCity');
    setActiveCity(userCity || '');
  }, []);

  const handleCityFilter = () => {
    setCityFilter(activeCity);
  };

  const handleClearFilter = () => {
    setActiveCity('');
    setCityFilter('');
  };

  if (loading) return <div className="text-center p-5">Loading help requests...</div>;
  if (error) return <div className="alert alert-danger m-5">Error loading requests: {error.message}</div>;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Community Help Requests</h1>
        <div>
          <Button variant="primary" onClick={() => navigate('/help/new')}>
            Request Help
          </Button>
          <Button variant="outline-secondary" className="ms-2" onClick={() => navigate('/help/volunteer')}>
            Volunteer
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by city..."
            value={activeCity}
            onChange={(e) => setActiveCity(e.target.value)}
          />
          <Button variant="outline-primary" onClick={handleCityFilter}>Filter</Button>
          <Button variant="outline-secondary" onClick={handleClearFilter}>Clear</Button>
        </div>
      </div>

      {data?.getHelpRequests?.length === 0 ? (
        <div className="text-center p-5">
          <p>No help requests found.</p>
          <Button variant="primary" onClick={() => navigate('/help/new')}>
            Create a New Request
          </Button>
        </div>
      ) : (
        <Row>
          {data?.getHelpRequests?.map(request => (
            <Col md={6} lg={4} className="mb-4" key={request.id}>
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <Card.Title>{request.category || 'General Help'}</Card.Title>
                    <StatusBadge status={request.status} />
                  </div>
                  <Card.Subtitle className="mb-2 text-muted">{request.city}</Card.Subtitle>
                  <Card.Text className="text-truncate">
                    {request.description}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Posted by: {request.user.fullName}
                    </small>
                    <Link to={`/help/${request.id}`} className="btn btn-sm btn-outline-primary">
                      View Details
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

// Helper component for status badge
const StatusBadge = ({ status }) => {
  let variant = 'secondary';
  
  switch (status) {
    case 'open':
      variant = 'primary';
      break;
    case 'matched':
      variant = 'success';
      break;
    case 'closed':
      variant = 'dark';
      break;
  }
  
  return <Badge bg={variant}>{status}</Badge>;
};

export default HelpIndex;