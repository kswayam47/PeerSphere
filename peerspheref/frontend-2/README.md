# PeerSphere Frontend

This is the frontend for the PeerSphere application, built with React, TypeScript, and Vite.

## Features

- User authentication with JWT
- User registration and login
- Protected routes
- User profile management
- Post creation and interaction
- User connections
- Notifications
- Messaging

## Authentication

The application uses JWT (JSON Web Token) for authentication. The authentication flow is as follows:

1. User registers with email, password, and username
2. Backend validates the input and creates a new user
3. Backend returns a JWT token and user data
4. Frontend stores the token in localStorage
5. Frontend includes the token in the Authorization header for all API requests
6. Backend validates the token for protected routes

## API Integration

The frontend communicates with the backend API using Axios. The API base URL is configured in the `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build

## Technologies Used

- React
- TypeScript
- Vite
- Axios
- React Router
- Tailwind CSS
- Lucide Icons 