# PeerSphere Backend

This is the backend for the PeerSphere application, built with Express.js, Node.js, TypeScript, and MongoDB.

## Features

- User authentication with JWT
- User registration and login
- Protected routes
- User profile management

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user (protected)

### Users

- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/peersphere
   JWT_SECRET=your-super-secret-key-change-this-in-production
   JWT_EXPIRE=24h
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server

## Technologies Used

- Express.js
- Node.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcryptjs
- cors
- dotenv 