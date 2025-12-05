// src/authController.js
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { sendVerificationEmail } = require('../emailService');

dotenv.config();

// KONEKSI DATABASE
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// =================================
// REGISTER USER + EMAIL VERIFICATION
// =================================
async function register(req, res) {
  try {
    const { fullname, username, email, password } = req.body;

    // VALIDASI
    if (!fullname || !username || !email || !password) {
      return res.status(400).json({
        message: 'fullname, username, email, and password are required',
      });
    }

    // EMAIL SUDAH TERDAFTAR?
    const [existingUser] = await db.query(
      'SELECT user_id FROM user WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: 'Email already registered',
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // GENERATE TOKEN VERIFIKASI
    const verificationToken = uuidv4();

    // INSERT USER BARU
    // kolom: fullname, username, email, password, verify_token, is_verified, status_akun
    const insertQuery = `
      INSERT INTO user 
        (fullname, username, email, password, verify_token, is_verified, status_akun)
      VALUES (?, ?, ?, ?, ?, 0, 'PENDING')
    `;

    await db.query(insertQuery, [
      fullname,
      username,
      email,
      hashedPassword,
      verificationToken,
    ]);

    // KIRIM EMAIL VERIFIKASI
    await sendVerificationEmail(email, verificationToken);

    return res.status(201).json({
      message:
        'Register success. Please check your email to verify your account.',
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}

// =============================
// VERIFIKASI EMAIL USER
// =============================
async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: 'Token is required',
      });
    }

    // CARI TOKEN DI DATABASE (pakai kolom verify_token & status_akun)
    const [rows] = await db.query(
      'SELECT user_id, status_akun FROM user WHERE verify_token = ?',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: 'Invalid Verification Token',
      });
    }

    const user = rows[0];

    // JIKA AKUN DIBLOKIR ADMIN
    if (user.status_akun === 'SUSPENDED') {
      return res.status(403).json({
        message: 'Your account has been suspended',
      });
    }

    // AKTIFKAN AKUN
    const updateQuery = `
      UPDATE user
      SET is_verified = 1,
          verify_token = NULL,
          status_akun = 'ACTIVE'
      WHERE user_id = ?
    `;

    await db.query(updateQuery, [user.user_id]);

    return res.status(200).json({
      message: 'Email Verified Successfully. Account is now ACTIVE.',
    });
  } catch (err) {
    console.error('VERIFY EMAIL ERROR:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}

// =============================
// LOGIN USER (WITH STATUS CHECK)
// =============================
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // VALIDASI
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    // CARI USER
    const [rows] = await db.query(
      `SELECT user_id, password, is_verified, status_akun 
       FROM user WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid login credentials',
      });
    }

    const user = rows[0];

    // CEK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid login credentials',
      });
    }

    // CEK VERIFIKASI
    if (!user.is_verified) {
      return res.status(403).json({
        message: 'Account not verified, please check your email',
      });
    }

    // CEK STATUS
    if (user.status_akun === 'SUSPENDED') {
      return res.status(403).json({
        message: 'Account suspended, contact admin',
      });
    }

    return res.status(200).json({
      message: 'Login success',
      user_id: user.user_id,
      status_akun: user.status_akun,
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}

module.exports = {
  register,
  verifyEmail,
  login,
};
