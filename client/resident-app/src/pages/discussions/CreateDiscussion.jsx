import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext';

const CREATE_DISCUSSION = gql`
  mutation CreateDiscussion($title: String!, $content: String!, $summary: String, $city: String!) {
    createDiscussion(title: $title, content: $content, summary: $summary, city: $city) {
      id
      title
    }
  }
`;

const CreateDiscussion = () => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    city: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [createDiscussion, { loading }] = useMutation(CREATE_DISCUSSION, {
    onCompleted: (data) => {
      navigate(`/discussions/${data.createDiscussion.id}`);
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
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    createDiscussion({
      variables: {
        ...formData,
        city: formData.city || currentUser?.city || 'Toronto'
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Start a New Discussion</h1>
        <p className="text-gray-600">Share your thoughts, ask questions, or start a conversation with your community.</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Discussion Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="What's your discussion about?"
            required
          />
        </div>
        
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            Short Summary (Optional)
          </label>
          <input
            type="text"
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="A brief summary of your discussion"
          />
          <p className="mt-1 text-sm text-gray-500">This will appear at the top of your discussion.</p>
        </div>
        
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City (Optional)
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city || currentUser?.city || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Which city is this discussion relevant to?"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Discussion Content *
          </label>
          <textarea
            id="content"
            name="content"
            rows="10"
            value={formData.content}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Share the details of your discussion here..."
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/discussions')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {loading ? 'Creating...' : 'Create Discussion'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDiscussion;