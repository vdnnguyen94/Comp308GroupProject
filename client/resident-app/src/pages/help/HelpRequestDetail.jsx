import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Alert } from 'react-bootstrap';

// GraphQL Queries and Mutations
const GET_HELP_REQUEST = gql`
  query GetHelpRequest($id: ID!) {
    getHelpRequest(id: $id) {
      id
      user {
        id
        fullName
      }
      city
      category
      description
      analysis
      status
      createdAt
      bestMatches {
        id
        fullName
      }
    }
  }
`;

const UPDATE_HELP_REQUEST_ANALYSIS = gql`
  mutation UpdateHelpRequestAnalysis($id: ID!) {
    updateHelpRequestAnalysis(id: $id) {
      id
      analysis
      bestMatches {
        id
        fullName
      }
      status
    }
  }
`;

const CLOSE_HELP_REQUEST = gql`
  mutation CloseHelpRequest($id: ID!) {
    closeHelpRequest(id: $id) {
      id
      status
    }
  }
`;

const formatDate = (dateString) => {
  const date = new Date(parseInt(dateString));
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
};

const HelpRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { loading, error, data, refetch } = useQuery(GET_HELP_REQUEST, {
    variables: { id },
    fetchPolicy: "network-only"
  });

  const [updateAnalysis, { loading: analyzeLoading }] = useMutation(UPDATE_HELP_REQUEST_ANALYSIS, {
    onCompleted: () => {
      refetch();
    }
  });

  const [closeRequest, { loading: closeLoading }] = useMutation(CLOSE_HELP_REQUEST, {
    onCompleted: () => {
      refetch();
    }
  });

  if (loading) return <div className="text-center p-5">Loading details...</div>;
  if (error) return <div className="alert alert-danger m-5">Error: {error.message}</div>;

  const request = data.getHelpRequest;
  const isOwner = true; // In a real app, check if current user is the request creator
  const isOpen = request.status === 'open';
  const isMatched = request.status === 'matched';
  const isClosed = request.status === 'closed';

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Help Request Details</h1>
        <Button variant="outline-primary" onClick={() => navigate('/help')}>
          Back to Listings
        </Button>
      </div>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="mb-0">{request.category || 'General Help'}</h3>
                <Badge bg={isClosed ? 'dark' : isMatched ? 'success' : 'primary'}>
                  {request.status}
                </Badge>
              </div>
              {isOwner && !isClosed && (
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  disabled={closeLoading}
                  onClick={() => closeRequest({ variables: { id }})}
                >
                  {closeLoading ? 'Closing...' : 'Close Request'}
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              <Card.Subtitle className="mb-3 text-muted">
                {request.city} • Posted by {request.user.fullName} • {formatDate(request.createdAt)}
              </Card.Subtitle>
              
              <Card.Text>
                {request.description}
              </Card.Text>

              {isOpen && isOwner && (
                <div className="d-grid mt-4">
                  <Button 
                    variant="primary" 
                    disabled={analyzeLoading}
                    onClick={() => updateAnalysis({ variables: { id }})}
                  >
                    {analyzeLoading ? 'Finding Matches...' : 'Find Volunteer Matches'}
                  </Button>
                  <div className="text-muted text-center mt-2">
                    <small>We'll analyze your request and find the best volunteers in your area.</small>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          {request.analysis && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Request Analysis</h5>
              </Card.Header>
              <Card.Body>
                <Card.Text style={{ whiteSpace: 'pre-line' }}>
                  {request.analysis}
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Best Volunteer Matches</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {request.bestMatches && request.bestMatches.length > 0 ? (
                request.bestMatches.map(volunteer => (
                  <ListGroup.Item key={volunteer.id} className="d-flex justify-content-between align-items-center">
                    {volunteer.fullName}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>
                  {isOpen ? (
                    "Click 'Find Volunteer Matches' to get matched with volunteers."
                  ) : isClosed ? (
                    "This request has been closed."
                  ) : (
                    "No matches found for this request."
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
            
            {request.bestMatches && request.bestMatches.length > 0 && (
              <Card.Footer>
                <div className="text-muted">
                  <small>These volunteers match your request based on interests, location, and availability.</small>
                </div>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HelpRequestDetail;