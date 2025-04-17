import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ThumbsUp, MessageCircle, Eye, Filter, TrendingUp, Clock, Search } from 'lucide-react';
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
  upvotes: string[];
  downvotes: string[];
  answers: any[];
  tags: string[];
}

const HomePage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('latest');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      const response = await axios.get(`http://localhost:5000/api/questions/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setQuestions(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error searching questions:', err);
      setError('Failed to search questions. Please try again later.');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = async () => {
    setSearchQuery('');
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
    } finally {
      setLoading(false);
    }
  };

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
      
      // Clear any search query after posting a new question
      setSearchQuery('');
      
      // Fetch all questions again to show the updated list including the new question
      const questionsResponse = await axios.get('http://localhost:5000/api/questions', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setQuestions(Array.isArray(questionsResponse.data) ? questionsResponse.data : []);
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Questions</h1>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200 relative group"
          >
            {showForm ? 'Cancel' : 'Ask Question'}
            <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {showForm ? 'Close question form' : 'Create a new question'}
            </span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex items-center border dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by title, content, or tags..."
            className="flex-grow px-4 py-2 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <button 
            type="submit" 
            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 flex items-center hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200 relative group"
            disabled={isSearching}
          >
            {isSearching ? (
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
            ) : (
              <Search size={20} />
            )}
            <span className="absolute -bottom-9 right-0 bg-gray-800 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Search
            </span>
          </button>
          {searchQuery && (
            <button 
              type="button" 
              onClick={clearSearch}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 relative group"
            >
              Clear
              <span className="absolute -bottom-9 right-0 bg-gray-800 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Clear search
              </span>
            </button>
          )}
        </form>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center mb-6 gap-2">
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-200">
          <button
            onClick={() => handleFilterChange('latest')}
            className={`px-3 py-2 flex items-center transition-colors duration-200 relative group ${
              filter === 'latest' 
                ? 'bg-blue-500 dark:bg-blue-600 text-white' 
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Clock size={16} className="mr-1" />
            Latest
            <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Sort by newest first
            </span>
          </button>
          <button
            onClick={() => handleFilterChange('trending')}
            className={`px-3 py-2 flex items-center transition-colors duration-200 relative group ${
              filter === 'trending' 
                ? 'bg-blue-500 dark:bg-blue-600 text-white' 
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <TrendingUp size={16} className="mr-1" />
            Trending
            <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Sort by most answered
            </span>
          </button>
          <button
            onClick={() => handleFilterChange('votes')}
            className={`px-3 py-2 flex items-center transition-colors duration-200 relative group ${
              filter === 'votes' 
                ? 'bg-blue-500 dark:bg-blue-600 text-white' 
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ThumbsUp size={16} className="mr-1" />
            Most Votes
            <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Sort by highest votes
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 dark:bg-opacity-20 text-red-700 dark:text-red-300 rounded-md transition-colors duration-200">
          {error}
        </div>
      )}

      {/* Display search results info */}
      {searchQuery.trim() && !isSearching && (
        <div className="mb-4 text-gray-600 dark:text-gray-300">
          {questions.length === 0
            ? `No results found for "${searchQuery}"`
            : `Found ${questions.length} result${questions.length === 1 ? '' : 's'} for "${searchQuery}"`}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-blue-50 dark:bg-opacity-10 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              value={newQuestion.title}
              onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="What's your question?"
              required
              minLength={10}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
              Content
            </label>
            <textarea
              value={newQuestion.content}
              onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              rows={5}
              placeholder="Describe your question in detail..."
              required
              minLength={20}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={newQuestion.tags}
              onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="tag1, tag2, tag3"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200 relative group"
          >
            Post Question
            <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Submit your question
            </span>
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white dark:bg-blue-50 dark:bg-opacity-10 rounded-lg shadow-md p-8 text-center transition-colors duration-200">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">No questions found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {searchQuery 
              ? "Try a different search term or browse all questions." 
              : "Be the first to ask a question!"}
          </p>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 relative group"
            >
              View all questions
              <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Clear search and show all
              </span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {questions
            .sort((a, b) => {
              if (filter === 'latest') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              } else if (filter === 'trending') {
                return b.answers.length - a.answers.length;
              } else if (filter === 'votes') {
                const aVotes = a.upvotes.length - a.downvotes.length;
                const bVotes = b.upvotes.length - b.downvotes.length;
                return bVotes - aVotes;
              }
              return 0;
            })
            .map(question => (
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