import React, { createContext, useState, useEffect, useContext } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const AuthContext = createContext();

const IS_LOGGED_IN = gql`
  query IsLoggedIn {
    isLoggedIn {
      isLoggedIn
      username
    }
  }
`;

const GET_USER = gql`
  query GetUserByToken {
    getUserByToken {
      id
      username
      email
      fullName
      city
    }
  }
`;

const LOGOUT = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: authData } = useQuery(IS_LOGGED_IN);
  const { data: userData, loading: userLoading, refetch } = useQuery(GET_USER, {
    fetchPolicy: 'no-cache',
    skip: !authData?.isLoggedIn?.isLoggedIn,
    onCompleted: (data) => {
      if (data?.getUserByToken) {
        setCurrentUser(data.getUserByToken);
      }
      setLoading(false);
    },
    onError: () => {
      setCurrentUser(null);
      setLoading(false);
    }
  });
  
  const [logoutMutation] = useMutation(LOGOUT);
  const handleLogout = async () => {
    try {
      const res = await logoutMutation();
      if (res?.data?.logout?.success) {
        setCurrentUser(null);
        navigate('/login');
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  

  useEffect(() => {
    if (authData?.isLoggedIn?.isLoggedIn) {
      refetch(); // try to fetch user if logged in
    } else if (authData) {
      setCurrentUser(null);
      setLoading(false); // no user found
    }
  }, [authData, refetch]);
  

  return (
    <AuthContext.Provider value={{ currentUser, loading, handleLogout, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);