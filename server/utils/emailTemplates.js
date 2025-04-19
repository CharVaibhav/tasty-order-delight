const getVerificationEmailTemplate = (name, verificationUrl) => {
  return `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Welcome to Tasty Order Delight!</h2>
      <p style="color: #666; margin-bottom: 20px;">Hi ${name},</p>
      <p style="color: #666; margin-bottom: 20px;">Thank you for registering with Tasty Order Delight. To complete your registration and verify your email address, please click the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
      </div>
      <p style="color: #666; margin-bottom: 20px;">If the button doesn't work, you can also click on the link below:</p>
      <p style="color: #666; margin-bottom: 20px;"><a href="${verificationUrl}" style="color: #007bff;">${verificationUrl}</a></p>
      <p style="color: #666; margin-bottom: 20px;">This link will expire in 24 hours.</p>
      <p style="color: #666; margin-bottom: 20px;">If you didn't create an account with us, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">This is an automated email, please do not reply.</p>
    </div>
  `;
};

const getPasswordResetEmailTemplate = (name, resetUrl) => {
  return `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Password Reset Request</h2>
      <p style="color: #666; margin-bottom: 20px;">Hi ${name},</p>
      <p style="color: #666; margin-bottom: 20px;">You recently requested to reset your password for your Tasty Order Delight account. Click the button below to reset it:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #666; margin-bottom: 20px;">If the button doesn't work, you can also click on the link below:</p>
      <p style="color: #666; margin-bottom: 20px;"><a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a></p>
      <p style="color: #666; margin-bottom: 20px;">This password reset link will expire in 10 minutes.</p>
      <p style="color: #666; margin-bottom: 20px;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">This is an automated email, please do not reply.</p>
    </div>
  `;
};

module.exports = {
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate,
}; 