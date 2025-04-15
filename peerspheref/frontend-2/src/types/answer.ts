import { User } from './user';

export interface Answer {
  _id: string;
  content: string;
  author: User | string;
  question: string; // Question ID
  createdAt: string;
  updatedAt: string;
  upvotes: string[]; // Array of user IDs
  downvotes: string[]; // Array of user IDs
  isAccepted: boolean;
}

export interface AnswerWithAuthor extends Omit<Answer, 'author'> {
  author: {
    _id: string;
    username: string;
  };
} 