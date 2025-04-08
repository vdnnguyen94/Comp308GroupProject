import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { FaTrash, FaPen, FaArrowLeft, FaSyncAlt } from 'react-icons/fa';

const GET_DISCUSSION = gql`
  query GetDiscussion($id: ID!) {
    getDiscussion(id: $id) {
      id
      title
      content
      summary
      createdAt
      city
      author {
        id
        username
      }
      comments {
        id
        content
        createdAt
        author {
          id
          username
        }
      }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($discussionId: ID!, $content: String!) {
    addComment(discussionId: $discussionId, content: $content) {
      id
      content
      createdAt
      author {
        id
        username
      }
    }
  }
`;

const DELETE_DISCUSSION = gql`
  mutation DeleteDiscussion($id: ID!) {
    deleteDiscussion(id: $id) {
      id
    }
  }
`;

const DiscussionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [commentContent, setCommentContent] = useState('');
  const [error, setError] = useState('');

  const { loading, data, refetch } = useQuery(GET_DISCUSSION, {
    variables: { id },
    fetchPolicy: 'network-only',
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    onCompleted: () => {
      setCommentContent('');
      refetch();
    },
    onError: (error) => setError(error.message),
  });

  const [deleteDiscussion] = useMutation(DELETE_DISCUSSION, {
    onCompleted: () => navigate('/discussions'),
    onError: (error) => setError(error.message),
  });

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    setError('');
    addComment({ variables: { discussionId: id, content: commentContent } });
  };

  const handleDeleteDiscussion = () => {
    if (window.confirm('Are you sure you want to delete this discussion?')) {
      deleteDiscussion({ variables: { id } });
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading discussion...</div>;
  if (!data?.getDiscussion) return <div className="text-center py-12">Discussion not found.</div>;

  const discussion = data.getDiscussion;
  const isAuthor = currentUser?.id === discussion.author?.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/discussions" className="flex items-center text-indigo-600 hover:text-indigo-800">
          <FaArrowLeft className="mr-2" /> Back to Discussions
        </Link>

        <div className="flex items-center space-x-2">
          <button onClick={() => refetch()} className="p-2 text-gray-500 hover:text-indigo-600">
            <FaSyncAlt />
          </button>

          {isAuthor && (
            <div className="flex space-x-2">
              <Link
                to={`/discussions/${id}/edit`}
                className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
              >
                <FaPen className="mr-1" /> Edit
              </Link>
              <button
                onClick={handleDeleteDiscussion}
                className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <article className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold text-gray-800">{discussion.title}</h1>
          {discussion.city && (
            <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
              {discussion.city}
            </span>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>Posted by {discussion.author?.username}</span>
          <span className="mx-2">•</span>
          <span>{formatDistanceToNow(new Date(parseInt(discussion.createdAt)), { addSuffix: true })}</span>
        </div>

        {discussion.summary && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-700">{discussion.summary}</p>
          </div>
        )}

        <div className="prose max-w-none text-gray-700 mb-8">
          {discussion.content}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold mb-4">
            Comments ({discussion.comments.length})
          </h2>

          {discussion.comments.length === 0 ? (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          ) : (
            <div className="space-y-4">
              {discussion.comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">{comment.author?.username}</span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(parseInt(comment.createdAt)), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Add a Comment</h3>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmitComment}>
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows="4"
            placeholder="Share your thoughts..."
          />
          <div className="mt-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
            >
              Post Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscussionDetail;
