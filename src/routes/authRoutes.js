// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// REGISTER
router.post('/register', authController.register);

// VERIFIKASI EMAIL
router.get('/verifikasi-email', authController.verifyEmail);

// LOGIN
router.post('/login', authController.login);

module.exports = router;
