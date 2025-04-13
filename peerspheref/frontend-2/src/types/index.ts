export interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  college?: string;
  graduationYear?: number;
  interests?: string[];
  role?: 'user' | 'admin' | 'verified';
  followers?: string[];
  following?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: User | string;
  upvotes: number;
  downvotes: number;
  answerCount: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  content: string;
  author: User | string;
  questionId: string;
  upvotes: number;
  downvotes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User | string;
  parentId: string; // Can be questionId or answerId
  parentType: 'question' | 'answer';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'answer' | 'upvote' | 'comment' | 'follow' | 'mention';
  sender: User | string;
  recipient: User | string;
  entityId: string; // ID of the related entity (question, answer, etc.)
  read: boolean;
  createdAt: string;
}