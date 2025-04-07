import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { FaPlus } from 'react-icons/fa';

const GET_DISCUSSIONS = gql`
  query GetDiscussions($city: String) {
    getDiscussions(city: $city) {
      id
      title
      content
      createdAt
      city
      author {
        username
      }
    }
  }
`;

const DiscussionList = () => {
  const { currentUser } = useAuth();
  const [filterByCity, setFilterByCity] = useState(false);
  
  const { loading, error, data, refetch } = useQuery(GET_DISCUSSIONS, {
    variables: { city: filterByCity ? currentUser?.city : null },
    fetchPolicy: 'network-only'
  });

  const handleFilterToggle = () => {
    setFilterByCity(!filterByCity);
    refetch({ city: !filterByCity ? currentUser?.city : null });
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading discussions...</div>;
  if (error) return <div className="bg-red-100 text-red-700 p-4 rounded">Error loading discussions: {error.message}</div>;

  const discussions = data?.getDiscussions || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Community Discussions</h1>
        <Link 
          to="/discussions/create" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> New Discussion
        </Link>
      </div>
      
      <div className="flex items-center mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filterByCity}
            onChange={handleFilterToggle}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
          <span className="ml-2 text-gray-700">Show only discussions in {currentUser?.city}</span>
        </label>
      </div>
      
      {discussions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No discussions found. Be the first to start a conversation!</p>
          <Link 
            to="/discussions/create" 
            className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Start a Discussion
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <Link 
              key={discussion.id} 
              to={`/discussions/${discussion.id}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{discussion.title}</h2>
                {discussion.city && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                    {discussion.city}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {discussion.content || "No content provided"}
              </p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Posted by {discussion.author?.username}</span>
                <span>{formatDistanceToNow(new Date(parseInt(discussion.createdAt)), { addSuffix: true })}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionList;