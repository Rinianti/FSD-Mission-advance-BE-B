// src/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();

const { uploadSingleImage } = require('../services/uploadService');
const uploadController = require('../controllers/uploadController');

// Endpoint: POST /upload
// menerima payload file (field name: "image")
router.post('/upload', uploadSingleImage, uploadController.uploadImage);

module.exports = router;
