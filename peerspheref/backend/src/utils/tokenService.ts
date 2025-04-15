import crypto from 'crypto';

// Generate a random token
export const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate a hash from a token
export const generateHash = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Generate verification token that expires in 24 hours
export const generateVerificationToken = (): { token: string, hash: string, expires: Date } => {
  const token = generateRandomToken();
  const hash = generateHash(token);
  
  // Token expires in 24 hours
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);
  
  return { token, hash, expires };
};

// Generate password reset token that expires in 1 hour
export const generatePasswordResetToken = (): { token: string, hash: string, expires: Date } => {
  const token = generateRandomToken();
  const hash = generateHash(token);
  
  // Token expires in 1 hour
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);
  
  return { token, hash, expires };
}; 