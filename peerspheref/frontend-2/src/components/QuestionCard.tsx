import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface QuestionCardProps {
  question: {
    _id: string;
    title: string;
    content: string;
    author: {
      _id: string;
      username: string;
    };
    createdAt: string;
    upvotes: string[] | number;
    downvotes: string[] | number;
    answers: any[];
    tags?: string[];
  };
  onUpvote: () => void;
  onDownvote: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onUpvote, onDownvote }) => {
  const { user } = useAuth();
  
  // Calculate vote count based on whether upvotes/downvotes are arrays or numbers
  const getVoteCount = () => {
    if (Array.isArray(question.upvotes) && Array.isArray(question.downvotes)) {
      return question.upvotes.length - question.downvotes.length;
    } else if (typeof question.upvotes === 'number' && typeof question.downvotes === 'number') {
      return question.upvotes - question.downvotes;
    }
    return 0;
  };

  // Check if user has upvoted
  const hasUpvoted = () => {
    if (user && Array.isArray(question.upvotes)) {
      return question.upvotes.includes(user._id);
    }
    return false;
  };

  // Check if user has downvoted
  const hasDownvoted = () => {
    if (user && Array.isArray(question.downvotes)) {
      return question.downvotes.includes(user._id);
    }
    return false;
  };

  return (
    <div className="bg-white dark:bg-blue-50 dark:bg-opacity-10 rounded-lg shadow-md p-6 mb-4 transition-all duration-200 hover:shadow-lg hover:transform hover:scale-[1.01] hover:border-blue-200 dark:hover:border-blue-700 border border-transparent cursor-pointer">
      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-center">
          <button 
            onClick={onUpvote}
            className={`text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors relative group ${
              hasUpvoted() ? 'text-green-500 dark:text-green-400' : ''
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Upvote
            </span>
          </button>
          <span className="text-sm font-semibold my-1 text-gray-800 dark:text-gray-100">{getVoteCount()}</span>
          <button 
            onClick={onDownvote}
            className={`text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors relative group ${
              hasDownvoted() ? 'text-red-500 dark:text-red-400' : ''
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
            </svg>
            <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Downvote
            </span>
          </button>
        </div>
        <div className="flex-1">
          <Link to={`/questions/${question._id}`} className="block">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {question.title}
            </h2>
          </Link>
          <p className="mt-2 text-gray-600 dark:text-gray-200 line-clamp-2">{question.content}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to={`/profile/${question.author._id}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                {question.author.username}
              </Link>
              <span className="text-sm text-gray-500 dark:text-gray-300">
                asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {question.answers?.length || 0} answers
              </span>
            </div>
          </div>
          {question.tags && question.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-blue-900 dark:bg-opacity-30 text-gray-600 dark:text-gray-100 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-blue-800 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard; 