import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout & pages
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import DiscussionList from './pages/discussions/DiscussionList';
import DiscussionDetail from './pages/discussions/DiscussionDetail';
import CreateDiscussion from './pages/discussions/CreateDiscussion';
import Profile from './pages/Profile';

// ProtectedRoute component to guard routes
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth(); 
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!currentUser) return <Navigate to="/login" />;
  
  return children;
};

const AppContent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="discussions" element={<DiscussionList />} />
          <Route path="discussions/:id" element={<DiscussionDetail />} />
          <Route path="discussions/create" element={<CreateDiscussion />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
    // <Router>
    //   <Routes>
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/register" element={<Register />} />
        
    //     <Route path="/" element={<MainLayout />}>
    //       <Route index element={<Home />} />
    //       <Route path="discussions" element={<DiscussionList />} />
    //       <Route path="discussions/:id" element={<DiscussionDetail />} />
    //       <Route path="discussions/create" element={<CreateDiscussion />} />
    //       <Route path="profile" element={<Profile />} />
    //     </Route>
    //   </Routes>
    // </Router>
  );
};

const App = () => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;