import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ThumbsUp, MessageCircle, Eye, Filter, TrendingUp, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import QuestionCard from '../components/QuestionCard';
import { useAuth } from '../context/AuthContext';

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
  answers: any[];
  tags: string[];
}

const HomePage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('latest');
  const [activeTab, setActiveTab] = useState('all');
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [showForm, setShowForm] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5000/api/questions', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setQuestions(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchQuestions();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Please log in to ask a question');
      return;
    }

    try {
      const questionData = {
        title: newQuestion.title.trim(),
        content: newQuestion.content.trim(),
        tags: newQuestion.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (questionData.title.length < 10) {
        setError('Title must be at least 10 characters long');
        return;
      }

      if (questionData.content.length < 20) {
        setError('Content must be at least 20 characters long');
        return;
      }

      console.log('Submitting question:', questionData);
      
      const response = await axios.post('http://localhost:5000/api/questions', questionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Question created successfully:', response.data);
      setQuestions(prevQuestions => [response.data, ...prevQuestions]);
      setNewQuestion({ title: '', content: '', tags: '' });
      setShowForm(false);
      setError(null);
    } catch (error: any) {
      console.error('Detailed error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError('Invalid question data. Please check your input and try again.');
      } else {
        setError('Failed to create question. Please try again later.');
      }
    }
  };

  const handleUpvote = async (questionId: string) => {
    if (!token) {
      setError('Please log in to vote');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/questions/${questionId}/upvote`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setQuestions(prevQuestions => 
        prevQuestions.map(question => 
          question._id === questionId ? response.data : question
        )
      );
      setError(null);
    } catch (error: any) {
      console.error('Error upvoting:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to upvote question. Please try again later.');
    }
  };

  const handleDownvote = async (questionId: string) => {
    if (!token) {
      setError('Please log in to vote');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/questions/${questionId}/downvote`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setQuestions(prevQuestions => 
        prevQuestions.map(question => 
          question._id === questionId ? response.data : question
        )
      );
      setError(null);
    } catch (error: any) {
      console.error('Error downvoting:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to downvote question. Please try again later.');
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Questions</h1>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Ask Question'}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              value={newQuestion.title}
              onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="What's your question?"
              required
              minLength={10}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Content
            </label>
            <textarea
              value={newQuestion.content}
              onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              rows={5}
              placeholder="Describe your question in detail..."
              required
              minLength={20}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={newQuestion.tags}
              onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="tag1, tag2, tag3"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Post Question
          </button>
        </form>
      )}

      {questions.length === 0 ? (
        <p className="text-gray-600">No questions yet. Be the first to ask!</p>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard
              key={question._id}
              question={question}
              onUpvote={() => handleUpvote(question._id)}
              onDownvote={() => handleDownvote(question._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;