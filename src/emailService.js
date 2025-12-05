// emailService.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// KONFIGURASI SMTP DARI .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Kirim email verifikasi ke user
 */
async function sendVerificationEmail(toEmail, token) {
  const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3001';
  const appName = process.env.APP_NAME || 'Movie App';

  const verifyUrl = `${appBaseUrl}/verifikasi-email?token=${token}`;

  const mailOptions = {
    from: `"${appName}" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `Email Verification - ${appName}`,
    html: `
      <h3>Hi, welcome to ${appName}!</h3>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };
