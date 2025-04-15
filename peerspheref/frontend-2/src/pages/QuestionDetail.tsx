import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import answerService from '../services/answer';
import AnswerCard from '../components/AnswerCard';

// Define the interfaces to match the component usage
interface Author {
  _id: string;
  username: string;
}

interface Answer {
  _id: string;
  content: string;
  author: Author;
  createdAt: string;
  upvotes: string[];
  downvotes: string[];
  isAccepted: boolean;
}

interface Question {
  _id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  upvotes: string[];
  downvotes: string[];
  tags: string[];
  answers: Answer[];
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
    } catch (error: any) {
      console.error('Error upvoting question:', error);
      setError(error.response?.data?.message || 'Failed to upvote question. Please try again later.');
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
    } catch (error: any) {
      console.error('Error downvoting question:', error);
      setError(error.response?.data?.message || 'Failed to downvote question. Please try again later.');
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!token) {
      setError('Please log in to accept an answer');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/questions/${id}/accept-answer`,
        { answerId },
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
      console.error('Error accepting answer:', error);
      setError(error.response?.data?.message || 'Failed to accept answer. Please try again later.');
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
      {question && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex">
            <div className="flex flex-col items-center mr-4">
              <button
                onClick={handleUpvoteQuestion}
                className={`text-gray-500 hover:text-green-500 ${
                  user && Array.isArray(question.upvotes) && 
                  question.upvotes.includes(user._id) ? 'text-green-500' : ''
                }`}
                disabled={!user}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </button>
              <span className="text-sm font-bold my-1">
                {Array.isArray(question.upvotes) && Array.isArray(question.downvotes) 
                  ? question.upvotes.length - question.downvotes.length
                  : 0}
              </span>
              <button
                onClick={handleDownvoteQuestion}
                className={`text-gray-500 hover:text-red-500 ${
                  user && Array.isArray(question.downvotes) && 
                  question.downvotes.includes(user._id) ? 'text-red-500' : ''
                }`}
                disabled={!user}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
              <p className="text-gray-700 mb-4">{question.content}</p>
              <div className="flex items-center mb-4">
                <span className="text-blue-600">
                  {typeof question.author === 'object' ? question.author.username : ''}
                </span>
                <span className="text-gray-500 ml-2">
                  asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                </span>
              </div>
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
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Answers</h2>
        {question.answers.length === 0 ? (
          <p className="text-gray-600">No answers yet. Be the first to answer!</p>
        ) : (
          <div className="space-y-4">
            {question.answers.map((answer) => (
              <AnswerCard
                key={answer._id}
                answer={answer}
                onUpvote={() => handleUpvoteAnswer(answer._id)}
                onDownvote={() => handleDownvoteAnswer(answer._id)}
                onAccept={() => handleAcceptAnswer(answer._id)}
                isQuestionAuthor={
                  question && 
                  typeof question.author === 'object' && 
                  question.author._id === user?._id
                }
              />
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