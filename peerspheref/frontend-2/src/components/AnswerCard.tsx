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
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-center">
          <button
            onClick={onUpvote}
            className={`text-gray-500 hover:text-green-500 ${
              hasUpvoted ? 'text-green-500' : ''
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </button>
          <span className="text-sm font-semibold my-1">{answer.upvotes.length - answer.downvotes.length}</span>
          <button
            onClick={onDownvote}
            className={`text-gray-500 hover:text-red-500 ${
              hasDownvoted ? 'text-red-500' : ''
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-blue-600">
                {answer.author.username}
              </span>
              <span className="text-sm text-gray-500">
                answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
              </span>
            </div>
            {isQuestionAuthor && !answer.isAccepted && (
              <button
                onClick={onAccept}
                className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200"
              >
                Accept Answer
              </button>
            )}
            {answer.isAccepted && (
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Accepted
              </span>
            )}
          </div>
          <p className="mt-4 text-gray-700">{answer.content}</p>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard; 