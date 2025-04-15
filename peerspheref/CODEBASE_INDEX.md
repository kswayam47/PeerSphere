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
│   ├── node_modules/   # Dependencies
│   ├── package.json    # Project dependencies and scripts
│   ├── package-lock.json # Dependency lock file
│   ├── tsconfig.json   # TypeScript configuration
│   ├── tsconfig.node.json # Node-specific TypeScript config
│   ├── tsconfig.app.json # App-specific TypeScript config
│   ├── vite.config.ts  # Vite bundler configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── postcss.config.js # PostCSS configuration
│   ├── eslint.config.js # ESLint configuration
│   ├── index.html      # HTML entry point
│   ├── README.md       # Frontend documentation
│   ├── .env           # Environment variables
│   ├── .env.example   # Example environment variables
│   └── .gitignore     # Git ignore rules
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
    ├── node_modules/   # Dependencies
    ├── package.json    # Project dependencies and scripts
    ├── package-lock.json # Dependency lock file
    ├── tsconfig.json   # TypeScript configuration
    ├── README.md       # Backend documentation
    └── .gitignore     # Git ignore rules
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
- `tsconfig.json` - Base TypeScript configuration
- `tsconfig.node.json` - Node-specific TypeScript configuration
- `tsconfig.app.json` - Application-specific TypeScript configuration
- `vite.config.ts` - Vite bundler configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `eslint.config.js` - ESLint configuration
- `index.html` - HTML entry point
- `.env` - Environment variables (not tracked in git)
- `.env.example` - Example environment variables

### Key Dependencies
- React
- TypeScript
- Vite
- Tailwind CSS
- ESLint
- React Router
- Axios
- React Query
- React Hook Form
- React Icons

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
- `.env` - Environment variables
- `.env.example` - Example environment variables

### Key Dependencies
- Node.js
- TypeScript
- Express
- CORS
- dotenv
- MongoDB
- Mongoose
- JWT
- bcrypt
- Nodemon (for development)

## API Endpoints
### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- POST `/api/auth/logout` - User logout
- GET `/api/auth/me` - Get current user

### Users
- GET `/api/users/:id` - Get user profile
- PUT `/api/users/:id` - Update user profile
- GET `/api/users/leaderboard` - Get leaderboard data
- GET `/api/users/search` - Search users

### Questions
- GET `/api/questions` - Get all questions
- POST `/api/questions` - Create a question
- GET `/api/questions/:id` - Get question details
- PUT `/api/questions/:id` - Update question
- DELETE `/api/questions/:id` - Delete question
- POST `/api/questions/:id/answers` - Add answer
- PUT `/api/questions/:id/answers/:answerId` - Update answer
- DELETE `/api/questions/:id/answers/:answerId` - Delete answer

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
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

### Backend
Required environment variables:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key for authentication
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed CORS origins

## Testing
### Frontend Testing
- Jest for unit testing
- React Testing Library for component testing
- Cypress for E2E testing

### Backend Testing
- Jest for unit testing
- Supertest for API testing
- MongoDB Memory Server for database testing

## Deployment
### Frontend Deployment
- Vercel for production deployment
- GitHub Actions for CI/CD
- Environment-specific builds

### Backend Deployment
- Heroku for production deployment
- GitHub Actions for CI/CD
- PM2 for process management
- MongoDB Atlas for database hosting

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Code Style
- Follow ESLint rules
- Use TypeScript for type safety
- Write meaningful commit messages
- Include tests for new features

## License
MIT License - See LICENSE file for details

---
*Last updated: April 15, 2024* 