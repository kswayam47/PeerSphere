import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, AlertCircle } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }
    
    try {
      setStatus('loading');
      setMessage('Sending verification code...');
      
      const response = await axios.post(
        'http://localhost:5000/api/auth/forgot-password',
        { email }
      );
      
      setStatus('success');
      setMessage(response.data.message || 'Verification code sent! Please check your email.');
      
      // Redirect to OTP verification page after 2 seconds
      setTimeout(() => {
        navigate(`/verify-reset-otp?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Failed to send verification code. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Your Password</h1>
        
        {status === 'success' ? (
          <div className="flex flex-col items-center">
            <div className="bg-green-100 text-green-800 p-4 rounded-full mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-600 text-center mb-6">{message}</p>
            <p className="text-gray-600 text-center mb-6">
              Redirecting to verification page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-gray-600 mb-6 text-center">
              Enter your email address and we'll send you a verification code to reset your password.
            </p>
            
            {status === 'error' && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-start">
                <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            )}
            
            {status === 'loading' && (
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              >
                {status === 'loading' ? 'Sending...' : 'Send Verification Code'}
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

export default ForgotPasswordPage;