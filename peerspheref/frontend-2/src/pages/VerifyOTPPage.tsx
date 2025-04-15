import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const VerifyOTPPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from query parameters
    const query = new URLSearchParams(location.search);
    const emailParam = query.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location.search]);

  useEffect(() => {
    // Set up countdown timer for resend button
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [timeLeft, resendDisabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Email is required');
      return;
    }
    
    if (!otp.trim()) {
      setStatus('error');
      setMessage('OTP is required');
      return;
    }
    
    try {
      setStatus('loading');
      setMessage('Verifying OTP...');
      
      const response = await axios.post(
        'http://localhost:5000/api/auth/verify-otp',
        { email, otp }
      );
      
      if (response.data.success) {
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
        
        // Store token and user data if provided
        if (response.data.token && response.data.user) {
          localStorage.setItem('token', response.data.token);
          
          // Redirect to home page after 2 seconds
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          // Redirect to login page after 2 seconds
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } else {
        setStatus('error');
        setMessage(response.data.error || 'Failed to verify OTP');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Failed to verify OTP. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Email is required');
      return;
    }
    
    try {
      setStatus('loading');
      setMessage('Sending new OTP...');
      setResendDisabled(true);
      setTimeLeft(60); // 1 minute countdown
      
      const response = await axios.post(
        'http://localhost:5000/api/auth/resend-otp',
        { email }
      );
      
      setStatus('idle');
      setMessage('');
      alert(response.data.message || 'OTP sent successfully! Please check your email.');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Failed to send OTP. Please try again.');
      setResendDisabled(false);
      setTimeLeft(0);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Verify Your Email</h1>
        
        {status === 'success' ? (
          <div className="flex flex-col items-center">
            <div className="bg-green-100 text-green-800 p-4 rounded-full mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-600 text-center mb-6">{message}</p>
            <p className="text-gray-600 text-center">Redirecting you shortly...</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6 text-center">
              We've sent a 6-digit verification code to your email address. Please enter it below to verify your account.
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
            
            <form onSubmit={handleSubmit}>
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
                  placeholder="you@example.com"
                  required
                  readOnly={!!email}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => {
                    // Only allow numbers and limit to 6 digits
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                  placeholder="------"
                  minLength={6}
                  maxLength={6}
                  required
                />
              </div>
              
              <div className="flex flex-col space-y-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {status === 'loading' ? 'Verifying...' : 'Verify Code'}
                </button>
                
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendDisabled}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  {resendDisabled 
                    ? `Resend Code (${timeLeft}s)` 
                    : "Didn't receive a code? Resend"
                  }
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyOTPPage; 