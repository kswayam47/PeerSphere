import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface Answer {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  createdAt: string;
  upvotes: number;
  downvotes: number;
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
  upvotes: number;
  downvotes: number;
  answers: Answer[];
  tags: string[];
}

const QuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setError(null);
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
    if (!token) {
      setError('Please log in to post an answer');
      return;
    }

    if (!newAnswer.trim()) {
      setError('Answer cannot be empty');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/questions/${id}/answers`,
        { 
          content: newAnswer.trim(),
          author: user?._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (question) {
        setQuestion({
          ...question,
          answers: [...question.answers, response.data]
        });
      }
      setNewAnswer('');
      setError(null);
    } catch (error: any) {
      console.error('Error posting answer:', error);
      setError(error.response?.data?.message || 'Failed to post answer. Please try again later.');
    }
  };

  const handleUpvoteAnswer = async (answerId: string) => {
    if (!token) {
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

      if (question) {
        setQuestion({
          ...question,
          answers: question.answers.map(answer =>
            answer._id === answerId ? response.data : answer
          )
        });
      }
    } catch (error: any) {
      console.error('Error upvoting answer:', error);
      setError(error.response?.data?.message || 'Failed to upvote answer. Please try again later.');
    }
  };

  const handleDownvoteAnswer = async (answerId: string) => {
    if (!token) {
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

      if (question) {
        setQuestion({
          ...question,
          answers: question.answers.map(answer =>
            answer._id === answerId ? response.data : answer
          )
        });
      }
    } catch (error: any) {
      console.error('Error downvoting answer:', error);
      setError(error.response?.data?.message || 'Failed to downvote answer. Please try again later.');
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
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
        <div className="flex items-center mb-4">
          <span className="text-blue-600">
            {question.author.username}
          </span>
          <span className="text-gray-500 ml-2">
            asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-gray-700 mb-4">{question.content}</p>
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Answers</h2>
        {question.answers.length === 0 ? (
          <p className="text-gray-600">No answers yet. Be the first to answer!</p>
        ) : (
          <div className="space-y-4">
            {question.answers.map((answer) => (
              <div key={answer._id} className="border-b border-gray-200 pb-4">
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleUpvoteAnswer(answer._id)}
                      className="text-gray-500 hover:text-green-500"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <span className="text-sm font-semibold">{answer.upvotes - answer.downvotes}</span>
                    <button
                      onClick={() => handleDownvoteAnswer(answer._id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">{answer.content}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span className="text-blue-600">
                        {answer.author.username}
                      </span>
                      <span className="ml-2">
                        answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {user && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Answer</h2>
          <form onSubmit={handleSubmitAnswer}>
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4"
              rows={5}
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

export default QuestionDetail; 