import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import { FaUserEdit, FaSave } from 'react-icons/fa';

const UPDATE_USER = gql`
  mutation UpdateUser($fullName: String, $city: String!) {
    updateUser(fullName: $fullName, city: $city) {
      id
      username
      email
      fullName
      city
    }
  }
`;

const Profile = () => {
  const { currentUser, refetch } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    city: currentUser?.city || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      refetch();
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.city) {
      setError('City is required');
      return;
    }
    
    updateUser({
      variables: {
        fullName: formData.fullName,
        city: formData.city
      }
    });
  };

  const cities = ['Hamilton', 'Kitchener', 'London', 'Windsor', 'Toronto', 'Ottawa'];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <FaUserEdit className="mr-2" /> Edit Profile
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Username</h2>
                <p className="mt-1 text-lg text-gray-900">{currentUser?.username}</p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-500">Email</h2>
                <p className="mt-1 text-lg text-gray-900">{currentUser?.email}</p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-500">Full Name</h2>
                <p className="mt-1 text-lg text-gray-900">{currentUser?.fullName || 'Not provided'}</p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-500">City</h2>
                <p className="mt-1 text-lg text-gray-900">{currentUser?.city || 'Not provided'}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={currentUser?.username}
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    disabled
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={currentUser?.email}
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    disabled
                  />
                </div>
                
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select your city</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                  <FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;