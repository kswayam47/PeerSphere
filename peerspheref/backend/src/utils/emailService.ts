import nodemailer from 'nodemailer';

// Configure nodemailer with the provided credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'rtipugade27@gmail.com',
    pass: process.env.EMAIL_PASS || 'tbmpkgopbmlmxsyo'
  }
});

/**
 * Send a verification email to the user
 * @param to - Recipient email address
 * @param verificationToken - Token to verify the email
 * @param username - Username of the recipient
 */
export const sendVerificationEmail = async (to: string, verificationToken: string, username: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
  
  const mailOptions = {
    from: `"PeerSphere" <${process.env.EMAIL_USER || 'rtipugade27@gmail.com'}>`,
    to,
    subject: 'Verify Your PeerSphere Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Welcome to PeerSphere!</h2>
        <p>Hi ${username},</p>
        <p>Thank you for registering with PeerSphere. To complete your registration and verify your email address, please click the button below:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't register for a PeerSphere account, please ignore this email.</p>
        <p>Best regards,<br>The PeerSphere Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

/**
 * Send OTP verification email to the user
 * @param to - Recipient email address
 * @param otp - One-time password for verification
 * @param username - Username of the recipient
 */
export const sendOTPEmail = async (to: string, otp: string, username: string) => {
  const mailOptions = {
    from: `"PeerSphere" <${process.env.EMAIL_USER || 'rtipugade27@gmail.com'}>`,
    to,
    subject: 'Your PeerSphere Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Verify Your Email</h2>
        <p>Hi ${username || 'there'},</p>
        <p>Your verification code for PeerSphere is:</p>
        <div style="text-align: center; margin: 20px 0;">
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background-color: #f0f4f8; padding: 15px; border-radius: 5px;">${otp}</div>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, you can safely ignore this email.</p>
        <p>Best regards,<br>The PeerSphere Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

/**
 * Send a password reset email to the user
 * @param to - Recipient email address
 * @param resetToken - Token to reset the password
 * @param username - Username of the recipient
 */
export const sendPasswordResetEmail = async (to: string, resetToken: string, username: string) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: `"PeerSphere" <${process.env.EMAIL_USER || 'rtipugade27@gmail.com'}>`,
    to,
    subject: 'Reset Your PeerSphere Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Reset Your Password</h2>
        <p>Hi ${username},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        <p>Best regards,<br>The PeerSphere Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

/**
 * Send a notification email when a question receives a new answer
 * @param to - Recipient email address (question author)
 * @param username - Username of the recipient
 * @param questionTitle - Title of the question
 * @param answerContent - Content of the answer
 * @param answerAuthorName - Username of the answer author
 * @param questionId - ID of the question
 */
export const sendNewAnswerNotification = async (
  to: string,
  username: string,
  questionTitle: string, 
  answerContent: string,
  answerAuthorName: string,
  questionId: string
) => {
  const questionUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/questions/${questionId}`;
  
  // Truncate answer content if it's too long
  const truncatedAnswer = answerContent.length > 300 
    ? answerContent.substring(0, 297) + '...' 
    : answerContent;
  
  const mailOptions = {
    from: `"PeerSphere" <${process.env.EMAIL_USER || 'rtipugade27@gmail.com'}>`,
    to,
    subject: `New Answer to Your Question: ${questionTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">New Answer to Your Question</h2>
        <p>Hi ${username},</p>
        <p>Your question <strong>"${questionTitle}"</strong> has received a new answer from <strong>${answerAuthorName}</strong>:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
          ${truncatedAnswer}
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${questionUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Full Answer</a>
        </div>
        
        <p>We hope this answer helps you!</p>
        <p>Best regards,<br>The PeerSphere Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Answer notification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending answer notification email:', error);
    return false;
  }
};

/**
 * Send a notification email when a user's answer is accepted
 * @param to - Recipient email address (answer author)
 * @param username - Username of the recipient
 * @param questionTitle - Title of the question
 * @param questionAuthorName - Username of the question author
 * @param questionId - ID of the question
 */
export const sendAnswerAcceptedNotification = async (
  to: string,
  username: string,
  questionTitle: string,
  questionAuthorName: string,
  questionId: string
) => {
  const questionUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/questions/${questionId}`;
  
  const mailOptions = {
    from: `"PeerSphere" <${process.env.EMAIL_USER || 'rtipugade27@gmail.com'}>`,
    to,
    subject: `Your Answer was Accepted: ${questionTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Your Answer was Accepted!</h2>
        <p>Hi ${username},</p>
        <p>Great news! <strong>${questionAuthorName}</strong> has accepted your answer to the question:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
          <strong>"${questionTitle}"</strong>
        </div>
        
        <p>Your reputation has increased by 15 points for having your answer accepted.</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${questionUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Question</a>
        </div>
        
        <p>Keep up the great work!</p>
        <p>Best regards,<br>The PeerSphere Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Answer accepted notification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending answer accepted notification email:', error);
    return false;
  }
}; 