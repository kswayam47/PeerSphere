import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  verifyEmail, 
  resendVerification, 
  forgotPassword, 
  resetPassword,
  verifyOTP,
  resendOTP,
  verifyResetOTP
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);

export default router; 