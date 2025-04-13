# PeerSphere Codebase Index

## Project Overview
PeerSphere is a full-stack application with a modern frontend and backend architecture. This document serves as a comprehensive index of the entire codebase.

## Project Structure
```
peerspheref/
├── frontend-2/           # Frontend React/TypeScript application
│   ├── src/             # Source code
│   │   ├── components/  # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/      # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── QuestionPage.tsx
│   │   │   ├── AskQuestionPage.tsx
│   │   │   ├── LeaderboardPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── services/   # API services
│   │   ├── types/      # TypeScript type definitions
│   │   ├── lib/        # Utility libraries
│   │   ├── context/    # React context providers
│   │   │   └── AuthContext.tsx
│   │   ├── config/     # Configuration files
│   │   ├── App.tsx     # Main application component
│   │   └── main.tsx    # Application entry point
│   ├── public/         # Static assets
│   └── config files    # Various configuration files
└── backend/            # Backend Node.js/TypeScript application
    ├── src/           # Source code
    │   ├── controllers/ # Route controllers
    │   ├── models/     # Data models
    │   ├── routes/     # API routes
    │   │   ├── auth.ts
    │   │   └── users.ts
    │   ├── middleware/ # Custom middleware
    │   ├── config/     # Configuration files
    │   │   └── db.ts
    │   ├── utils/      # Utility functions
    │   └── server.ts   # Application entry point
    └── dist/          # Compiled JavaScript files
```

## Frontend (frontend-2/)
### Key Components
1. **App.tsx**
   - Main application component
   - Sets up routing using React Router
   - Implements protected routes
   - Manages layout structure

2. **Pages**
   - HomePage: Main landing page
   - LoginPage: User authentication
   - RegisterPage: User registration
   - ProfilePage: User profile management
   - QuestionPage: Question details and answers
   - AskQuestionPage: Question creation
   - LeaderboardPage: User rankings
   - NotFoundPage: 404 error page

3. **Components**
   - Navbar: Navigation header
   - Footer: Page footer
   - ProtectedRoute: Route protection wrapper

4. **Context**
   - AuthContext: Authentication state management

### Configuration Files
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite bundler configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `eslint.config.js` - ESLint configuration
- `.env` - Environment variables (not tracked in git)
- `.env.example` - Example environment variables

### Key Dependencies
- React
- TypeScript
- Vite
- Tailwind CSS
- ESLint
- React Router

## Backend (backend/)
### Key Components
1. **server.ts**
   - Main application entry point
   - Express server setup
   - Middleware configuration
   - Route registration
   - Database connection
   - Server startup

2. **Routes**
   - `/api/auth` - Authentication endpoints
   - `/api/users` - User management endpoints
   - `/health` - Health check endpoint

3. **Configuration**
   - Database connection setup
   - Environment variable management
   - CORS configuration

### Configuration Files
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `nodemon.json` - Nodemon configuration for development

### Key Dependencies
- Node.js
- TypeScript
- Express
- CORS
- dotenv
- Nodemon (for development)

## API Endpoints
### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- POST `/api/auth/logout` - User logout

### Users
- GET `/api/users/:id` - Get user profile
- PUT `/api/users/:id` - Update user profile
- GET `/api/users/leaderboard` - Get leaderboard data

## Development Setup
1. Frontend:
   ```bash
   cd frontend-2
   npm install
   npm run dev
   ```

2. Backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

## Environment Variables
### Frontend
Required environment variables:
- `VITE_API_URL` - Backend API URL (e.g., http://localhost:5000)

### Backend
Required environment variables:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key for authentication

## Testing
[Testing information will be added here]

## Deployment
[Deployment information will be added here]

## Contributing
[Contributing guidelines will be added here]

## License
[License information will be added here]

---
*Last updated: April 13, 2024* 