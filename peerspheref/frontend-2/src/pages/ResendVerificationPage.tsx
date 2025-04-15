import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const ResendVerificationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Get email from query parameters if available
    const query = new URLSearchParams(location.search);
    const emailParam = query.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }
    
    try {
      setStatus('loading');
      setMessage('Sending verification email...');
      
      const response = await axios.post(
        'http://localhost:5000/api/auth/resend-verification',
        { email }
      );
      
      setStatus('success');
      setMessage(response.data.message || 'Verification email sent successfully!');
      setEmail('');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Failed to send verification email. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Resend Verification Email</h1>
        
        {status === 'success' ? (
          <div className="flex flex-col items-center">
            <div className="bg-green-100 text-green-800 p-4 rounded-full mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-600 text-center mb-6">{message}</p>
            <div className="flex flex-col space-y-4 w-full">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center"
              >
                Go to Login
              </Link>
              <button
                onClick={() => setStatus('idle')}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Resend to Another Email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-gray-600 mb-6 text-center">
              Enter your email address below to receive a new verification link.
            </p>
            
            {status === 'error' && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                {message}
              </div>
            )}
            
            {status === 'loading' && (
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              >
                Resend Verification Email
              </button>
              <Link
                to="/login"
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 text-center"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResendVerificationPage; 