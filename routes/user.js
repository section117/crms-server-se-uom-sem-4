const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.post('/login', userController.handleLogin);
router.post('/register', userController.handleRegistration);
router.post('/logout', userController.handleLogout);

module.exports = router;