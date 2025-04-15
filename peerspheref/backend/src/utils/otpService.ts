import crypto from 'crypto';

// Generate a 6-digit OTP
export const generateOTP = (): string => {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTPs with expiry time (10 minutes)
export const generateOTPWithExpiry = (): { otp: string, expires: Date } => {
  const otp = generateOTP();
  
  // OTP expires in 10 minutes
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 10);
  
  return { otp, expires };
}; 