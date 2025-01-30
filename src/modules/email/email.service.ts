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
   const resetPasswordUrl = `https://reselli-frontend.vercel.app/reset-password?token=${token}`;
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

export const sendResetPasswordEmailAdmin = async (to: string, token: string): Promise<void> => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  // const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
    const resetPasswordUrl = `https://reselli-admin-panel.vercel.app/reset-password?token=${token}`;
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

export const sendAccountVerificationEmail = async (to: string, firstName: string): Promise<void> => {
    const subject = "✅ Verify Your Reselii Account";

    const text = `Hi ${firstName},

Before you dive into Reselii, we need to verify your email address to keep your account secure. Please click the link below to complete your registration.

[Verify My Account]

If you didn’t sign up for Reselii, please ignore this email or let us know.

Best,  
The Reselii Team  
https://Reselii.com  

**Note:** This is an automated email from a no-reply address. Please do not reply.`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; font-family: Arial, sans-serif; color: #333; background-color: #fff;">
          <!-- Logo Section -->
          <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://media-hosting.imagekit.io/564f5f09d28c4070/logo.jpg" alt="Logo" style="width: 100px;">
          </div>

          <!-- Greeting -->
          <h4 style="font-size: 24px; font-weight: bold; text-align: center; color: #28A745;">Just One Step Away from Exploring Reselii!</h4>

          <!-- Body Content -->
          <p style="font-size: 16px; line-height: 1.6; text-align: center;">
              Hi ${firstName}, before you dive into the world of pre-loved fashion, we need to verify your email address to keep your account secure.
          </p>

          <!-- Call to Action Button -->
          <div style="text-align: center; margin-top: 20px;">
              <a href="https://Reselii.com/verify" 
                 style="display: inline-block; padding: 12px 24px; background-color: #28A745; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">
                  Verify My Account
              </a>
              <p style="margin-top: 20px; text-align: center; font-size: 16px;">We can’t wait to see what you bring to the Reselii community!</p>
          </div>

          <!-- Closing Remarks -->
          <p style="margin-top: 20px; text-align: left; font-size: 16px;">Warm regards,</p>
          <p style="text-align: left; font-weight: bold;">The Reselii Team</p>

          <!-- Additional Information -->
          <p style="font-size: 12px; margin-top: 20px; text-align: center;">You're receiving this email because you recently signed up for Reselii.</p>
          <p style="font-size: 12px; text-align: center;">If this wasn't you, please 
              <a href="https://Reselii.com/support" style="color: #28A745; text-decoration: none;">contact support</a>.
          </p>

          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #777;">
              <p>&copy; ${new Date().getFullYear()} Reselii, All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 12px; color: #999;">
                This is an automated email from a no-reply address. Please do not reply.
              </p>
              <p><a href="https://Reselii.com/unsubscribe" style="color: #28A745; text-decoration: none;">Unsubscribe</a></p>
          </div>
      </div>`;

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
    const subject = `Welcome Back, ! You’ve Successfully Logged In.`;

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

export const sendOrderConfirmationEmail = async (
  to: string,
  firstName: string,
  itemName: string,
  sellerName: string,
  amount: string,
  orderDate: string
): Promise<void> => {
  const subject = `🛍️ Order Confirmed! Thank You for Shopping with Reselii`;

  const text = `Hi ${firstName},

Your order has been successfully placed on Reselii!

Order Summary:
- Item: ${itemName}
- Seller: ${sellerName}
- Price: ₦${amount}
- Order Date: ${orderDate}

The seller has been notified and will ship your item soon. You’ll receive an update once your order is shipped.

Review your order here: https://Reselii.com/orders

Warm regards,  
The Reselii Team`;

  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; font-family: Arial, sans-serif; color: #333; background-color: #fff;">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://media-hosting.imagekit.io/564f5f09d28c4070/logo.jpg" alt="Logo" style="width: 100px;">
        </div>

        <!-- Header -->
        <h4 style="text-align: center; color: #28A745;">Your Order is Confirmed, ${firstName}!</h4>

        <!-- Order Details -->
        <p style="font-size: 16px; text-align: left;">
            Thank you for your purchase on Reselii! 🎉 Your order has been successfully placed.
        </p>
        <p style="font-size: 16px; text-align: left;">
            <strong>Order Summary:</strong><br>
            Item: ${itemName}<br>
            Seller: ${sellerName}<br>
            Price: ₦${amount}<br>
            Order Date: ${orderDate}
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin-top: 20px;">
            <a href="https://Reselii.com/orders"
               style="display: inline-block; padding: 12px 24px; background-color: #28A745; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">
                View My Order
            </a>
        </div>

        <!-- Closing remarks -->
        <p style="margin-top: 20px; text-align: left;">Warm regards,</p>
        <p style="text-align: left; font-weight: bold;">The Reselii Team</p>

        <!-- Additional Information -->
        <p style="font-size: 12px; margin-top: 20px; text-align: center;">You're receiving this email because an order was placed on your account.</p>
        <p style="font-size: 12px; text-align: center;">If this wasn't you, please 
            <a href="https://Reselii.com/support" style="color: #28A745; text-decoration: none;">contact support</a>.
        </p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #777;">
    <p>&copy; ${new Date().getFullYear()} Reselii, All rights reserved.</p>
    <p style="margin-top: 10px; font-size: 12px; color: #999;">
        This is an automated email. Please do not reply to this message.
    </p>
</div>`;
 await sendEmail(to, subject, text, html);
}

export const sendOrderShippedEmail = async (
  to: string,
  firstName: string,
  itemName: string,
  sellerName: string,
  shippingMethod: string,
  trackingNumber: string,
  deliveryDate: string
): Promise<void> => {
  const subject = `📦 Your Order Has Been Shipped!`;

  const text = `Hi ${firstName},

Your order has been shipped by the seller and is now on its way to you!

Order Details:

- Item: ${itemName}
- Seller: ${sellerName}
- Shipping Method: ${shippingMethod}
- Tracking Number: ${trackingNumber}
- Estimated Delivery Date: ${deliveryDate}

Track your shipment here: https://Reselii.com/track

What’s Next?
Once your order arrives, you can confirm delivery and share your experience by leaving a review for the seller.
If you have any questions or concerns, feel free to reach out to us at [support email/link].

Warm regards,  
The Reselii Team`;

  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; font-family: Arial, sans-serif; color: #333; background-color: #fff;">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://media-hosting.imagekit.io/564f5f09d28c4070/logo.jpg" alt="Logo" style="width: 100px;">
        </div>

        <!-- Header -->
        <h4 style="text-align: center; color: #28A745;">Great News, ${firstName}! Your Order Is on Its Way</h4>

        <!-- Order Details -->
        <p style="font-size: 16px; text-align: center;">
            Your order has been shipped by the seller and is now on its way to you! 🎉
        </p>

        <p style="text-align: center;">
            <strong>Item:</strong> ${itemName} <br>
            <strong>Seller:</strong> ${sellerName} <br>
            <strong>Shipping Method:</strong> ${shippingMethod} <br>
            <strong>Tracking Number:</strong> ${trackingNumber} <br>
            <strong>Estimated Delivery Date:</strong> ${deliveryDate}
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin-top: 20px;">
            <a href="https://Reselii.com/track"
               style="display: inline-block; padding: 12px 24px; background-color: #28A745; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">
                Track My Order
            </a>
        </div>

        <p style="margin-top: 20px; text-align: center;">
            <strong>What’s Next?</strong><br>
            Once your order arrives, you can confirm delivery and share your experience by leaving a review for the seller.
        </p>

        <!-- Closing Remarks -->
        <p style="margin-top: 20px; text-align: left; font-size: 16px;">Warm regards,</p>
        <p style="text-align: left; font-weight: bold;">The Reselii Team</p>

        <!-- Additional Information -->
        <p style="font-size: 12px; margin-top: 20px; text-align: center;">If you have any questions or concerns, feel free to reach out to us at  
            <a href="https://Reselii.com/support" style="color: #28A745; text-decoration: none;">contact support</a>.
        </p>

        <!-- Footer -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #777;">
            <p>&copy; ${new Date().getFullYear()} Reselii, All rights reserved.</p>
            <p style="margin-top: 10px; font-size: 12px; color: #999;">
                This is an automated email from a no-reply address. Please do not reply.
            </p>
            <p><a href="https://Reselii.com/unsubscribe" style="color: #28A745; text-decoration: none;">Unsubscribe</a></p>
        </div>
    </div>`;

  await sendEmail(to, subject, text, html);
};
export const sendPasswordResetEmail = async (to: string, firstName: string): Promise<void> => {
    const subject = "🔒 Password Reset Request";

    const text = `Hi ${firstName},

We received a request to reset your password for your Reselii account. If you didn’t request a reset, please ignore this email.

To reset your password, click the link below:
[Reset My Password]

For your security, this link will expire in 30 minutes.

Stay secure,  
The Reselii Team  
https://Reselii.com  

**Note:** This is an automated email from a no-reply address. Please do not reply.`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; font-family: Arial, sans-serif; color: #333; background-color: #fff;">
          <!-- Logo Section -->
          <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://media-hosting.imagekit.io/564f5f09d28c4070/logo.jpg" alt="Logo" style="width: 100px;">
          </div>

          <!-- Header -->
          <h4 style="font-size: 24px; font-weight: bold; text-align: center; color: #28A745;">Reset Your Password, ${firstName}</h4>

          <!-- Body Content -->
          <p style="font-size: 16px; line-height: 1.6; text-align: center;">
              We received a request to reset your password for your Reselii account. If you didn’t request a reset, please ignore this email or contact our support team.
          </p>

          <!-- Call to Action Button -->
          <div style="text-align: center; margin-top: 20px;">
              <a href="https://Reselii.com/reset-password" 
                 style="display: inline-block; padding: 12px 24px; background-color: #28A745; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">
                  Reset My Password
              </a>
          </div>

          <!-- Closing Remarks -->
          <p style="margin-top: 20px; text-align: left; font-size: 16px;">Stay secure,</p>
          <p style="text-align: left; font-weight: bold;">The Reselii Team</p>

          <!-- Additional Information -->
          <p style="font-size: 12px; margin-top: 25px; text-align: center;">You're receiving this email because you requested a password reset for your account.</p>
          <p style="font-size: 12px; text-align: center;">If this wasn't you, please 
              <a href="https://Reselii.com/support" style="color: #28A745; text-decoration: none;">contact support</a>.
          </p>

          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #777;">
              <p>&copy; ${new Date().getFullYear()} Reselii, All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 12px; color: #999;">
                This is an automated email from a no-reply address. Please do not reply.
              </p>
              <p><a href="https://Reselii.com/unsubscribe" style="color: #28A745; text-decoration: none;">Unsubscribe</a></p>
          </div>
      </div>`;

    await sendEmail(to, subject, text, html);
};
export const sendPaymentReceiptEmail = async (
  to: string,
  firstName: string,
  orderNumber: string,
  transactionDate: string,
  itemName: string,
  sellerName: string,
  paymentMethod: string,
  itemPrice: string,
  serviceFee: string,
  totalAmount: string
): Promise<void> => {
  const subject = `💳 Payment Receipt for Your Reselii Order`;

  const text = `Hi ${firstName},

Thank you for your payment!

Payment Receipt:
- Order ID: ${orderNumber}
- Date: ${transactionDate}
- Item Name: ${itemName}
- Seller Name: ${sellerName}
- Payment Method: ${paymentMethod}

Payment Summary:
- Item Price: ₦${itemPrice}
- Service Fee: ₦${serviceFee}
- Total Amount Paid: ₦${totalAmount}

View your order here: https://Reselii.com/orders

Warm regards,  
The Reselii Team`;

  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; font-family: Arial, sans-serif; color: #333; background-color: #fff;">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://media-hosting.imagekit.io/564f5f09d28c4070/logo.jpg" alt="Logo" style="width: 100px;">
        </div>

        <!-- Header -->
        <h4 style="text-align: center; color: #28A745;">Here’s Your Payment Receipt, ${firstName}</h4>

        <!-- Payment Details -->
        <p style="font-size: 16px; text-align: left;">
            <strong>Payment Receipt:</strong><br>
            Order ID: ${orderNumber}<br>
            Date: ${transactionDate}<br>
            Item Name: ${itemName}<br>
            Seller Name: ${sellerName}<br>
            Payment Method: ${paymentMethod}
        </p>
        <p style="font-size: 16px; text-align: left;">
            <strong>Payment Summary:</strong><br>
            Item Price: ₦${itemPrice}<br>
            Service Fee: ₦${serviceFee}<br>
            Total Amount Paid: ₦${totalAmount}
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin-top: 20px;">
            <a href="https://Reselii.com/orders"
               style="display: inline-block; padding: 12px 24px; background-color: #28A745; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">
                View My Order
            </a>
        </div>

        <!-- Closing remarks -->
        <p style="margin-top: 20px; text-align: left;">Warm regards,</p>
        <p style="text-align: left; font-weight: bold;">The Reselii Team</p>

        <!-- Footer -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #777;">
            <p>&copy; ${new Date().getFullYear()} Reselii, All rights reserved.</p>
            <p style="margin-top: 10px; font-size: 12px; color: #999;">
                This is an automated email from a no-reply address. Please do not reply.
            </p>
            <p><a href="https://Reselii.com/unsubscribe" style="color: #28A745; text-decoration: none;">Unsubscribe</a></p>
        </div>
    </div>`;

  await sendEmail(to, subject, text, html);
};
export const sendProfileUpdateEmail = async (
    to: string,
    firstName: string,
    updatedFields: Record<string, string>,
    timestamp: string
): Promise<void> => {
    const subject = `🔔 Profile Update Confirmation`;

    const updatedFieldsText = Object.entries(updatedFields)
        .map(([field, value]) => `- ${field}: ${value}`)
        .join("\n");

    const updatedFieldsHTML = Object.entries(updatedFields)
        .map(([field, value]) => `<li><strong>${field}:</strong> ${value}</li>`)
        .join("");

    const text = `Hi ${firstName},

Your Reselii profile has been updated! 

Updated Fields:  
${updatedFieldsText}

Date & Time of Change: ${timestamp}

If you made these changes, no further action is needed. 👍  

Didn’t authorize this update?  
Please secure your account by resetting your password immediately:  
https://Reselii.com/reset-password  

For any assistance, reach out to us at https://Reselii.com/support.  

Keeping your account safe and secure,  
The Reselii Team  

This is an automated email from a no-reply address. Please do not reply.`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; font-family: Arial, sans-serif; color: #333; background-color: #fff;">
          <!-- Logo Section -->
          <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://media-hosting.imagekit.io/564f5f09d28c4070/logo.jpg" alt="Logo" style="width: 100px;">
          </div>

          <!-- Header -->
          <h4 style="font-size: 24px; font-weight: bold; text-align: center; color: #28A745;">Your Profile Has Been Updated Successfully!</h4>

          <!-- Body Content -->
          <p style="font-size: 16px; line-height: 1.6; text-align: center;">
              Hi ${firstName}, we wanted to let you know that the following changes were made to your Reselii profile at: ${timestamp}
          </p>

          <ul style="font-size: 16px; line-height: 1.6; text-align: left; padding: 0 20px;">
              ${updatedFieldsHTML}
          </ul>

          <p style="font-size: 16px; text-align: center;">
              If you made these changes, no further action is needed. 👍
          </p>

          <p style="font-size: 16px; text-align: center; font-weight: bold; color: red;">
              Didn’t authorize this update?
          </p>

          <!-- Reset Password Button -->
          <div style="text-align: center; margin-top: 15px;">
              <a href="https://Reselii.com/reset-password"
                 style="display: inline-block; padding: 12px 24px; background-color: #28A745; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">
                  Reset My Password
              </a>
          </div>

          <p style="margin-top: 20px; text-align: center; font-size: 16px;">
              For any assistance, feel free to reach out to us at 
              <a href="https://Reselii.com/support" style="color: #28A745; text-decoration: none;">our support center</a>.
          </p>

          <!-- Closing Remarks -->
          <p style="margin-top: 20px; text-align: left; font-size: 16px;">Keeping your account safe and secure,</p>
          <p style="text-align: left; font-weight: bold;">The Reselii Team</p>

          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #777;">
              <p>&copy; ${new Date().getFullYear()} Reselii, All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 12px; color: #999;">
                This is an automated email from a no-reply address. Please do not reply.
              </p>
              <p><a href="https://Reselii.com/unsubscribe" style="color: #28A745; text-decoration: none;">Unsubscribe</a></p>
          </div>
      </div>`;

    await sendEmail(to, subject, text, html);
};
export const sendLoginEmails = async (to: string, firstName: string): Promise<void> => {
    const subject = `Welcome Back, ${firstName}! You’ve Successfully Logged In`;

    const text = `Hi ${firstName},

Welcome back! We're glad to see you logged into your account successfully.

If you have any questions or need assistance, visit our support center.

Warm regards,  
The Reselii Team  
https://Reselii.com  

This is an automated email from a no-reply address. Please do not reply.`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; font-family: Arial, sans-serif; color: #333; background-color: #fff;">
          <!-- Logo Section -->
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://media-hosting.imagekit.io/564f5f09d28c4070/logo.jpg" 
                 alt="Logo" style="width: 100px;">
          </div>

          <!-- Greeting -->
          <h4 style="font-size: 24px; font-weight: bold; text-align: center; color: #28A745;">Hi ${firstName},</h4>

          <!-- Body Content -->
          <p style="font-size: 16px; line-height: 1.6; text-align: center;">
              Welcome back! We're glad to see you logged into your account successfully.
          </p>
          <p style="font-size: 16px; line-height: 1.6; text-align: center;">
              If you have any questions or need assistance, feel free to reach out to us. We’re here to help!
          </p>

          <!-- Call to Action Button -->
          <div style="text-align: center; margin-top: 20px;">
              <a href="https://Reselii.com/dashboard"
                 style="display: inline-block; padding: 12px 24px; background-color: #28A745; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">
                  Go to Dashboard
              </a>
          </div>

          <!-- Closing Remarks -->
          <p style="margin-top: 20px; text-align: left; font-size: 16px;">Warm regards,</p>
          <p style="text-align: left; font-weight: bold;">The Reselii Team</p>

          <!-- Additional Information -->
          <p style="font-size: 12px; margin-top: 20px; text-align: center;">You're receiving this email because you recently logged into your account.</p>
          <p style="font-size: 12px; text-align: center;">If this wasn't you, please 
              <a href="https://Reselii.com/support" style="color: #28A745; text-decoration: none;">contact support</a>.
          </p>

          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #777;">
              <p>&copy; ${new Date().getFullYear()} Reselii, All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 12px; color: #999;">
                This is an automated email from a no-reply address. Please do not reply.
              </p>
              <p><a href="https://Reselii.com/unsubscribe" style="color: #28A745; text-decoration: none;">Unsubscribe</a></p>
          </div>
      </div>`;

    await sendEmail(to, subject, text, html);
};
export const sendWelcomeEmail = async (to: string, firstName: string): Promise<void> => {
    const subject = "🎉 Welcome to Reselii – Your Pre-Loved Fashion Marketplace!";

    const text = `Hi ${firstName},

Welcome to Reselii, your trusted platform to buy and sell pre-loved fashion items! We're excited to have you as part of our community of sustainable shoppers and sellers.

Here’s what you can do on Reselii:
- Shop the Trends You Love!
- Sell What You No Longer Need!
- Enjoy Secure Transactions!

Ready to explore? Start your journey now!
Need help? Visit our Help Center.

Warm regards,  
The Reselii Team  
https://Reselii.com  

This is an automated email from a no-reply address. Please do not reply.`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; font-family: Arial, sans-serif; color: #333; background-color: #fff;">
          <!-- Logo Section -->
          <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://media-hosting.imagekit.io/564f5f09d28c4070/logo.jpg" alt="Logo" style="width: 100px;">
          </div>

          <!-- Greeting -->
          <h4 style="font-size: 24px; font-weight: bold; text-align: center; color: #28A745;">Welcome to Reselii, ${firstName}!</h4>

          <!-- Body Content -->
          <p style="font-size: 16px; line-height: 1.6; text-align: center;">
              Thank you for joining Reselii, your trusted platform to buy and sell pre-loved fashion items! We're excited to have you as part of our community of sustainable shoppers and sellers.
          </p>

          <p style="text-align: center;">Here’s what you can do on Reselii:</p>

          <ul style="font-size: 16px; line-height: 1.6; text-align: center; padding-left: 0; list-style: none;">
              <li>✔ Shop the Trends You Love!</li>
              <li>✔ Sell What You No Longer Need!</li>
              <li>✔ Enjoy Secure Transactions!</li>
          </ul>

          <!-- Call to Action Button -->
          <div style="text-align: center; margin-top: 20px;">
              <a href="https://Reselii.com/start" style="display: inline-block; padding: 12px 24px; background-color: #28A745; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">
                  Start Exploring Now
              </a>
          </div>

          <!-- Closing Remarks -->
          <p style="margin-top: 20px; text-align: left; font-size: 16px;">Warm regards,</p>
          <p style="text-align: left; font-weight: bold;">The Reselii Team</p>

          <!-- Additional Information -->
          <p style="font-size: 12px; margin-top: 20px; text-align: center;">You're receiving this email because you recently joined Reselii.</p>
          <p style="font-size: 12px; text-align: center;">If this wasn't you, please 
              <a href="https://Reselii.com/support" style="color: #28A745; text-decoration: none;">contact support</a>.
          </p>

          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 14px; color: #777;">
              <p>&copy; ${new Date().getFullYear()} Reselii, All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 12px; color: #999;">
                This is an automated email from a no-reply address. Please do not reply.
              </p>
              <p><a href="https://Reselii.com/unsubscribe" style="color: #28A745; text-decoration: none;">Unsubscribe</a></p>
          </div>
      </div>`;

    await sendEmail(to, subject, text, html);
};

