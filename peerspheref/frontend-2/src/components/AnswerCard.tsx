import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface AnswerCardProps {
  answer: {
    _id: string;
    content: string;
    author: {
      username: string;
    };
    createdAt: string;
    upvotes: number;
    downvotes: number;
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
          <span className="text-sm font-semibold">{answer.upvotes - answer.downvotes}</span>
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
                className="text-sm text-green-600 hover:text-green-700"
              >
                Accept Answer
              </button>
            )}
            {answer.isAccepted && (
              <span className="text-sm text-green-600 font-semibold">
                ✓ Accepted Answer
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