const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// GET semua user
router.get('/users', userController.getAllUsers);

// GET user by ID
router.get('/users/:id', userController.getUserById);

module.exports = router;
