import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface AnswerCardProps {
  answer: {
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
  };
  onUpvote: () => void;
  onDownvote: () => void;
  onAccept: () => void;
  isQuestionAuthor: boolean;
}

const AnswerCard: React.FC<AnswerCardProps> = ({
  answer,
  onUpvote,
  onDownvote,
  onAccept,
  isQuestionAuthor
}) => {
  const { user } = useAuth();

  const hasUpvoted = user && answer.upvotes.includes(user._id);
  const hasDownvoted = user && answer.downvotes.includes(user._id);

  return (
    <div className="bg-white dark:bg-blue-50 dark:bg-opacity-10 rounded-lg shadow-md p-6 mb-4 transition-all duration-200 hover:shadow-lg hover:transform hover:scale-[1.01] hover:border-blue-200 dark:hover:border-blue-700 border border-transparent">
      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-center">
          <button
            onClick={onUpvote}
            className={`text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors relative group ${
              hasUpvoted ? 'text-green-500 dark:text-green-400' : ''
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Upvote this answer
            </span>
          </button>
          <span className="text-sm font-semibold my-1 text-gray-800 dark:text-gray-100">{answer.upvotes.length - answer.downvotes.length}</span>
          <button
            onClick={onDownvote}
            className={`text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors relative group ${
              hasDownvoted ? 'text-red-500 dark:text-red-400' : ''
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
            </svg>
            <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Downvote this answer
            </span>
          </button>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                {answer.author.username}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-300">
                answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
              </span>
            </div>
            {isQuestionAuthor && !answer.isAccepted && (
              <button
                onClick={onAccept}
                className="text-sm bg-green-100 dark:bg-green-900 dark:bg-opacity-30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors relative group"
              >
                Accept Answer
                <span className="absolute -bottom-9 right-0 bg-gray-800 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Mark as correct answer
                </span>
              </button>
            )}
            {answer.isAccepted && (
              <span className="text-sm bg-green-100 dark:bg-green-900 dark:bg-opacity-30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Accepted
              </span>
            )}
          </div>
          <p className="mt-4 text-gray-700 dark:text-gray-200">{answer.content}</p>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard; 