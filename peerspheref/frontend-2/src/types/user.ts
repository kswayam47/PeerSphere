export interface User {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  questionsAsked?: number;
  answersGiven?: number;
  reputation?: number;
  createdAt: string;
  updatedAt: string;
} 