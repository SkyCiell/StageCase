const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"StageCase" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: 'Inter', sans-serif; background: #151617; color: #EEE9DF; padding: 40px; border-radius: 16px; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2D6F73; font-size: 28px; margin-bottom: 8px;">Welcome to StageCase</h1>
      <p style="color: #A8AFB4; font-size: 14px; margin-bottom: 24px;">Every Stage Begins Here.</p>
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your account has been created successfully. Start exploring upcoming Crayon Case concerts and book your seat now.</p>
      <a href="${process.env.FRONTEND_URL}/concerts" 
         style="display: inline-block; background: #2D6F73; color: #F8F8F8; padding: 12px 28px; border-radius: 10px; text-decoration: none; margin-top: 20px; font-weight: 600;">
        Browse Concerts
      </a>
      <p style="margin-top: 32px; color: #A8AFB4; font-size: 12px;">© 2024 StageCase. All rights reserved.</p>
    </div>
  `;
  return sendMail({ to: user.email, subject: 'Welcome to StageCase 🎶', html });
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const html = `
    <div style="font-family: 'Inter', sans-serif; background: #151617; color: #EEE9DF; padding: 40px; border-radius: 16px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2D6F73;">Reset Your Password</h2>
      <p>Hi <strong>${user.name}</strong>, we received a request to reset your password.</p>
      <p>This link expires in <strong>1 hour</strong>.</p>
      <a href="${resetUrl}" 
         style="display: inline-block; background: #2D6F73; color: #F8F8F8; padding: 12px 28px; border-radius: 10px; text-decoration: none; margin-top: 20px; font-weight: 600;">
        Reset Password
      </a>
      <p style="margin-top: 32px; color: #A8AFB4; font-size: 12px;">If you didn't request this, please ignore this email.</p>
    </div>
  `;
  return sendMail({ to: user.email, subject: 'Reset Your StageCase Password', html });
};

const sendBookingConfirmationEmail = async (user, booking) => {
  const html = `
    <div style="font-family: 'Inter', sans-serif; background: #151617; color: #EEE9DF; padding: 40px; border-radius: 16px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2D6F73;">Booking Confirmed! 🎉</h2>
      <p>Hi <strong>${user.name}</strong>, your booking has been confirmed.</p>
      <div style="background: #1E2022; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <p><strong>Booking Code:</strong> ${booking.booking_code}</p>
        <p><strong>Concert:</strong> ${booking.concert?.title}</p>
        <p><strong>Total:</strong> Rp ${Number(booking.total_price).toLocaleString('id-ID')}</p>
      </div>
      <a href="${process.env.FRONTEND_URL}/my-tickets/${booking.id}" 
         style="display: inline-block; background: #2D6F73; color: #F8F8F8; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 600;">
        View E-Ticket
      </a>
    </div>
  `;
  return sendMail({ to: user.email, subject: `Booking Confirmed — ${booking.booking_code}`, html });
};

module.exports = { sendMail, sendWelcomeEmail, sendPasswordResetEmail, sendBookingConfirmationEmail };
