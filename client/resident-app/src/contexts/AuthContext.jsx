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
  const { data: userData, refetch } = useQuery(GET_USER, {
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

  const [logout] = useMutation(LOGOUT, {
    onCompleted: () => {
      setCurrentUser(null);
    }
  });

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (authData?.isLoggedIn?.isLoggedIn) {
      refetch();
    } else {
      setLoading(false);
    }
  }, [authData, refetch]);

  return (
    <AuthContext.Provider value={{ currentUser, loading, handleLogout, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);