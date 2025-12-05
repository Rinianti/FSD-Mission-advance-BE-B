// src/routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// Ambil fungsi verifyToken dari file middleware
const { verifyToken } = require('../middleware/authMiddleware');

// Route tanpa auth
router.get('/movies', movieController.getAllMovies);

// Route dengan auth
router.post('/movies', verifyToken, movieController.addMovie);
router.patch('/movies/:id', verifyToken, movieController.updateMovie);
router.delete('/movies/:id', verifyToken, movieController.deleteMovie);

module.exports = router;
