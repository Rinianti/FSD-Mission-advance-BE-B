const express = require('express');
const router = express.Router();
const verifyController = require('../controllers/verifyController');

router.get('/verifikasi-email', verifyController.verifyEmail);

module.exports = router;
