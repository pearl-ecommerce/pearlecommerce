import nodemailer from 'nodemailer';
import config from '../../config/config';
import logger from '../logger/logger';
import { Message } from './email.interfaces';

export const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise<void>}
 */
export const sendEmail = async (to: string, subject: string, text: string, html: string): Promise<void> => {
  const msg: Message = {
    from: config.email.from,
    to,
    subject,
    text,
    html,
  };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
export const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  // const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
   const resetPasswordUrl = `www.reselii.com/v1/auth/reset-password?token=${token}`;
  // const resetPasswordUrl = `http://localhost:3000/v1/auth/reset-password?token=${token}`;
  const text = `Hi,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
  <p>To reset your password, click on this link: ${resetPasswordUrl}</p>
  <p>If you did not request any password resets, please ignore this email.</p>
  <p>Thanks,</p>
  <p><strong>Pearl Ecommerce</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (to: string, token: string, name: string): Promise<void> => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `https://161.35.114.79/v1/auth/verifyEmail?token=${token}`;
  const text = `Hi ${name},
  To verify your email, click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>To verify your email, click on this link: ${verificationEmailUrl}</p>
  <p>If you did not create an account, then ignore this email.</p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send email verification after registration
 * @param {string} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendSuccessfulRegistration = async (to: string, token: string, name: string): Promise<void> => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `https://161.35.114.79/v1/auth/verifyEmail?token=${token}`;
  const text = `Hi ${name},
  Congratulations! Your account has been created. 
  You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created.</p>
  <p>You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send email verification after registration
 * @param {string} to
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendAccountCreated = async (to: string, name: string): Promise<void> => {
  const subject = 'Account Created Successfully';
  // replace this url with the link to the email verification page of your front-end app
  const loginUrl = 'https://161.35.114.79/v1/auth/login';
  const text = `Hi ${name},
  Congratulations! Your account has been created successfully. 
  You can now login at: ${loginUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created successfully.</p>
  <p>You can now login at: ${loginUrl}</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};
/**
 * send email anything a user login 
 */


// export const sendLoginEmail = async (to: string,): Promise<void> => {
//   const subject = 'Welcome! You’ve Successfully Logged In';
//   const text = `Hi ,

// Welcome back! We're glad to see you logged into your account successfully.

// If you have any questions or run into any issues, feel free to reach out to us. We’re here to help!

// Warm regards,
// The Team`;
  
//   const html = `
//     <div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px; font-family: Arial, sans-serif; color: #333;">
//       <h4><strong>Hi </strong></h4>
//       <p>Welcome back! We're glad to see you logged into your account successfully.</p>
//       <p>If you have any questions or run into any issues, feel free to reach out to us. We’re here to help!</p>
//       <p>Warm regards,</p>
//       <p><strong>The Team</strong></p>
//     </div>`;
    
//   await sendEmail(to, subject, text, html);
// };

export const sendLoginEmail = async (to: string, ): Promise<void> => {
    const subject = `Welcome Back, ! You’ve Successfully Logged In`;

    const text = `Hi ,

Welcome back! We're glad to see you logged into your account successfully.

If you have any questions or need assistance, visit our support center.

Warm regards,  
The Reselii Team  

This is an automated email from a no-reply address. Please do not reply.`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; font-family: Arial, sans-serif; color: #333; background-color: #fff;">
          <!-- Logo Section -->
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://media-hosting.imagekit.io//564f5f09d28c4070/logo.jpg?Expires=1832320063&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=JAKt~-ZcMFYdpNg9WKdT5zuEa0hVgIUvukkH8Ta4qPvTqu3Y8co2d8NhZTJoaWMiGrJ80PtFHMzXITbDkTnyUCnssYaXj6E4PyFIrmPYaFmLBvbjv~9P1HDsath0aWOh-EM60OKxzTyktZE7H1YDY8QnvNjx~jIcaC2OdnWlUo6oFUrc4Vm-bLMSOsjFgVw0klGHd-8cLccH1l8IZ4lGzDT7xasKRu2ISzaB1rOaHneeVx4RokvazrjG5xbg7sbkhRkZrZXTW8KaFrweA7aEVyDXbdN1M5eWPrBaNF0R11sWRkqc4iUYyB458fxk5HFhreh-hpgaEykEY9vCTWHoKg__" 
                 alt="Logo" style="width: 100px;">
          </div>
  
          <!-- Greeting -->
          <h4 style="font-size: 24px; font-weight: bold; text-align: center; color: #4A00E0;">Hi ,</h4>
  
          <!-- Body Content -->
          <p style="font-size: 16px; line-height: 1.6; text-align: center;">
              Welcome back! We're glad to see you logged into your account successfully.
          </p>
          <p style="font-size: 16px; line-height: 1.6; text-align: center;">
              If you have any questions or need assistance, feel free to reach out to us. We’re here to help!
          </p>
  
          <!-- Call to Action Button -->
          <div style="text-align: center; margin-top: 20px;">
              <a href="https://reselly.com/dashboard"
                 style="display: inline-block; padding: 12px 24px; background-color: #4A00E0; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">
                  Go to Dashboard
              </a>
          </div>
  
          <!-- Closing Remarks -->
          <p style="margin-top: 20px; text-align: left; font-size: 16px;">Warm regards,</p>
          <p style="text-align: left; font-weight: bold;">The Reselii Team</p>
  
          <!-- Additional Information -->
          <p style="font-size: 12px; margin-top: 20px; text-align: center;">You're receiving this email because you recently logged into your account.</p>
          <p style="font-size: 12px; text-align: center;">If this wasn't you, please 
              <a href="https://reselly.com/support" style="color: #4A00E0; text-decoration: none;">contact support</a>.
          </p>
  
          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #777;">
              <p>&copy; ${new Date().getFullYear()} Reselii, All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 12px; color: #999;">
                This is an automated email from a no-reply address. Please do not reply.
              </p>
              <p>
                <a href="https://reselly.com/unsubscribe" style="color: #4A00E0; text-decoration: none;">Unsubscribe</a>
              </p>
          </div>
      </div>`;

    await sendEmail(to, subject, text, html);
};
