import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  createdAt: string;
}

interface Answer {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  createdAt: string;
  upvotes: string[];
  downvotes: string[];
  isAccepted: boolean;
  comments: Comment[];
}

interface Question {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  createdAt: string;
  upvotes: string[];
  downvotes: string[];
  answers: Answer[];
}

const QuestionPage = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [newComments, setNewComments] = useState<{[key: string]: string}>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCommentsFor, setShowCommentsFor] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/questions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setQuestion(response.data);
      } catch (err) {
        console.error('Error fetching question:', err);
        setError('Failed to load question. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id, token]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) {
      setError('Answer cannot be empty');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: newAnswer,
          questionId: id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setError(data.errors.join(', '));
        } else {
          setError(data.message || 'Failed to post answer');
        }
        return;
      }

      // Update the answers state with the new answer
      setQuestion(prev => {
        if (!prev) return null;
        return {
          ...prev,
          answers: [data, ...prev.answers]
        };
      });

      // Clear the form
      setNewAnswer('');
      setError('');
    } catch (err) {
      setError('Failed to post answer. Please try again.');
    }
  };

  const handleUpvoteAnswer = async (answerId: string) => {
    if (!token || !user) {
      setError('Please log in to vote');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/answers/${answerId}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the question state with the updated answer
      setQuestion(prev => {
        if (!prev) return null;
        return {
          ...prev,
          answers: prev.answers.map(answer => 
            answer._id === answerId ? response.data : answer
          )
        };
      });
    } catch (err: any) {
      console.error('Error upvoting answer:', err);
      setError(err.response?.data?.message || 'Failed to upvote. Please try again.');
    }
  };

  const handleDownvoteAnswer = async (answerId: string) => {
    if (!token || !user) {
      setError('Please log in to vote');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/answers/${answerId}/downvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the question state with the updated answer
      setQuestion(prev => {
        if (!prev) return null;
        return {
          ...prev,
          answers: prev.answers.map(answer => 
            answer._id === answerId ? response.data : answer
          )
        };
      });
    } catch (err: any) {
      console.error('Error downvoting answer:', err);
      setError(err.response?.data?.message || 'Failed to downvote. Please try again.');
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!token || !user || !question || question.author._id !== user._id) {
      setError('Only the question author can accept answers');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/answers/${answerId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the question state with the updated answer
      setQuestion(prev => {
        if (!prev) return null;
        return {
          ...prev,
          answers: prev.answers.map(answer => 
            answer._id === answerId ? response.data : answer
          )
        };
      });
    } catch (err: any) {
      console.error('Error accepting answer:', err);
      setError(err.response?.data?.message || 'Failed to accept answer. Please try again.');
    }
  };

  const toggleComments = (answerId: string) => {
    setShowCommentsFor(prev => prev === answerId ? null : answerId);
  };

  const handleSubmitComment = async (answerId: string) => {
    const commentContent = newComments[answerId];
    if (!commentContent || !commentContent.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (!token || !user) {
      setError('Please log in to comment');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/answers/${answerId}/comments`,
        { content: commentContent.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the question state with the updated answer
      setQuestion(prev => {
        if (!prev) return null;
        return {
          ...prev,
          answers: prev.answers.map(answer => 
            answer._id === answerId ? response.data : answer
          )
        };
      });

      // Clear the comment form
      setNewComments(prev => ({
        ...prev,
        [answerId]: ''
      }));
    } catch (err: any) {
      console.error('Error adding comment:', err);
      setError(err.response?.data?.message || 'Failed to add comment. Please try again.');
    }
  };

  const handleUpvoteQuestion = async () => {
    if (!token || !user) {
      setError('Please log in to vote');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/questions/${id}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setQuestion(response.data);
    } catch (err: any) {
      console.error('Error upvoting question:', err);
      setError(err.response?.data?.message || 'Failed to upvote question. Please try again.');
    }
  };

  const handleDownvoteQuestion = async () => {
    if (!token || !user) {
      setError('Please log in to vote');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/questions/${id}/downvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setQuestion(response.data);
    } catch (err: any) {
      console.error('Error downvoting question:', err);
      setError(err.response?.data?.message || 'Failed to downvote question. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          Question not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex">
          <div className="flex flex-col items-center mr-4">
            <button 
              onClick={handleUpvoteQuestion}
              className={`text-gray-500 hover:text-green-500 ${
                user && question?.upvotes.includes(user._id) ? 'text-green-500' : ''
              }`}
              disabled={!user}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </button>
            <span className="text-sm font-bold my-1">
              {question?.upvotes.length - question?.downvotes.length}
            </span>
            <button 
              onClick={handleDownvoteQuestion}
              className={`text-gray-500 hover:text-red-500 ${
                user && question?.downvotes.includes(user._id) ? 'text-red-500' : ''
              }`}
              disabled={!user}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-4">{question?.title}</h1>
            <p className="text-gray-700 mb-4">{question?.content}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span>Asked by {question?.author.username}</span>
              <span className="mx-2">•</span>
              <span>{new Date(question?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">{question.answers.length} Answers</h2>
        {question.answers.length === 0 ? (
          <p className="text-gray-600">No answers yet. Be the first to answer!</p>
        ) : (
          question.answers.map((answer) => (
            <div key={answer._id} className="bg-white rounded-lg shadow-md p-6 mb-4">
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <button 
                    onClick={() => handleUpvoteAnswer(answer._id)}
                    className={`text-gray-500 hover:text-green-500 ${
                      user && answer.upvotes.includes(user._id) ? 'text-green-500' : ''
                    }`}
                    disabled={!user}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </button>
                  <span className="text-sm font-bold my-1">
                    {answer.upvotes.length - answer.downvotes.length}
                  </span>
                  <button 
                    onClick={() => handleDownvoteAnswer(answer._id)}
                    className={`text-gray-500 hover:text-red-500 ${
                      user && answer.downvotes.includes(user._id) ? 'text-red-500' : ''
                    }`}
                    disabled={!user}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 mb-4">{answer.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Answered by {answer.author.username}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                    </div>
                    {user && question.author._id === user._id && !answer.isAccepted && (
                      <button 
                        onClick={() => handleAcceptAnswer(answer._id)}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs"
                      >
                        Accept Answer
                      </button>
                    )}
                    {answer.isAccepted && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Accepted
                      </span>
                    )}
                  </div>
                  
                  {/* Comments section */}
                  <div className="mt-4 border-t pt-3">
                    <button 
                      onClick={() => toggleComments(answer._id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {answer.comments && answer.comments.length > 0 
                        ? `Show ${answer.comments.length} comment${answer.comments.length > 1 ? 's' : ''}` 
                        : 'Add a comment'}
                    </button>
                    
                    {showCommentsFor === answer._id && (
                      <div className="mt-3">
                        {answer.comments && answer.comments.length > 0 && (
                          <div className="mb-3">
                            {answer.comments.map(comment => (
                              <div key={comment._id} className="mb-2 text-sm">
                                <div className="flex items-start">
                                  <span className="font-semibold mr-2">{comment.author.username}:</span>
                                  <span className="text-gray-700">{comment.content}</span>
                                </div>
                                <div className="text-xs text-gray-500 ml-0">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {user && (
                          <div className="flex">
                            <input
                              type="text"
                              value={newComments[answer._id] || ''}
                              onChange={(e) => setNewComments(prev => ({
                                ...prev,
                                [answer._id]: e.target.value
                              }))}
                              placeholder="Add a comment..."
                              className="flex-1 border rounded-l-md px-3 py-1 text-sm"
                            />
                            <button
                              onClick={() => handleSubmitComment(answer._id)}
                              className="bg-blue-500 text-white px-3 py-1 rounded-r-md text-sm"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {user && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Your Answer</h2>
          <form onSubmit={handleSubmitAnswer}>
            <textarea
              className="w-full p-3 border rounded-md mb-4"
              rows={6}
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer here..."
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Post Answer
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
