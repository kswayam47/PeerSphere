import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

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
    upvotes: number;
    downvotes: number;
    answers: any[];
    tags?: string[];
  };
  onUpvote: () => void;
  onDownvote: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onUpvote, onDownvote }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-center">
          <button 
            onClick={onUpvote}
            className="text-gray-500 hover:text-green-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <span className="text-sm font-semibold">{question.upvotes - question.downvotes}</span>
          <button 
            onClick={onDownvote}
            className="text-gray-500 hover:text-red-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <Link to={`/questions/${question._id}`}>
            <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600">
              {question.title}
            </h2>
          </Link>
          <p className="mt-2 text-gray-600 line-clamp-2">{question.content}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to={`/profile/${question.author._id}`} className="text-sm text-blue-600 hover:underline">
                {question.author.username}
              </Link>
              <span className="text-sm text-gray-500">
                asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {question.answers?.length || 0} answers
              </span>
            </div>
          </div>
          {question.tags && question.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
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
  );
};

export default QuestionCard; 