import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { generateVerificationToken, generatePasswordResetToken, generateHash } from '../utils/tokenService';
import { sendVerificationEmail, sendPasswordResetEmail, sendOTPEmail } from '../utils/emailService';
import { generateOTPWithExpiry } from '../utils/otpService';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Generate OTP for email verification
    const { otp, expires } = generateOTPWithExpiry();

    // Create new user with OTP
    const user = await User.create({
      username,
      email,
      password,
      otp,
      otpExpires: expires,
      isVerified: false
    });

    // Send OTP email
    await sendOTPEmail(email, otp, username);

    // Generate JWT token (user can login but will be limited until verified)
    const jwtToken = generateToken(user._id);

    // Return user data without password
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      isVerified: user.isVerified
    };

    res.status(201).json({
      success: true,
      token: jwtToken,
      user: userResponse,
      message: 'Registration successful! Please check your email for verification OTP.'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Error creating user'
    });
  }
};

// @desc    Verify email with OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
    
    // Find user with matching email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    
    // Check if OTP exists and is valid
    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    // Check if OTP is expired
    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ error: 'OTP has expired' });
    }
    
    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    
    // Generate new JWT token
    const token = generateToken(user._id);
    
    // Return user data without password
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      isVerified: user.isVerified
    };
    
    res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
      token,
      user: userResponse
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Error verifying OTP'
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }
    
    // Generate new OTP
    const { otp, expires } = generateOTPWithExpiry();
    
    // Update user with new OTP
    user.otp = otp;
    user.otpExpires = expires;
    await user.save();
    
    // Send OTP email
    await sendOTPEmail(user.email, otp, user.username);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully! Please check your email.'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Error sending OTP'
    });
  }
};

// @desc    Verify email with token
// @route   GET /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }
    
    // Hash the token from the request
    const hashedToken = generateHash(token as string);
    
    // Find user with matching token and check if token is not expired
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: new Date() }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
    
    // Mark user as verified and clear token
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in.'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Error verifying email'
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }
    
    // Generate new verification token
    const { token, hash, expires } = generateVerificationToken();
    
    // Update user with new token
    user.verificationToken = hash;
    user.verificationTokenExpires = expires;
    await user.save();
    
    // Send verification email
    await sendVerificationEmail(user.email, token, user.username);
    
    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully!'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Error sending verification email'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Alert user if email is not verified
    if (!user.isVerified) {
      return res.status(401).json({ 
        error: 'Please verify your email before logging in',
        needsVerification: true
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      isVerified: user.isVerified
    };

    res.status(200).json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Error logging in'
    });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const user = await User.findOne({ email });
    
    // We don't want to reveal if a user exists or not for security reasons
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If your email exists in our system, you will receive a verification code'
      });
    }
    
    // Generate OTP for password reset
    const { otp, expires } = generateOTPWithExpiry();
    
    // Update user with OTP for password reset
    user.otp = otp;
    user.otpExpires = expires;
    await user.save();
    
    // Send OTP email
    await sendOTPEmail(user.email, otp, user.username);
    
    res.status(200).json({
      success: true,
      message: 'A verification code has been sent to your email'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Error requesting password reset'
    });
  }
};

// @desc    Verify reset password OTP
// @route   POST /api/auth/verify-reset-otp
// @access  Public
export const verifyResetOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
    
    // Find user with matching email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    
    // Check if OTP exists and is valid
    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    // Check if OTP is expired
    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ error: 'OTP has expired' });
    }
    
    // Generate reset token for the actual password reset
    const { token, hash, expires } = generatePasswordResetToken();
    
    // Update user with reset token and clear OTP
    user.resetPasswordToken = hash;
    user.resetPasswordExpires = expires;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully!',
      token: token // Send the token to the frontend for the reset password page
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Error verifying OTP'
    });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    // Hash the token from the request
    const hashedToken = generateHash(token);
    
    // Find user with matching token and check if token is not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    
    // Update password and clear token
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Error resetting password'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Error fetching user data'
    });
  }
}; 