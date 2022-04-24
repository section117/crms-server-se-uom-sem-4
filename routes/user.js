const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.post('/login', userController.handleLogin);
router.post('/register', userController.handleRegistration);
router.post('/logout', userController.handleLogout);

//REST Endpoints for React Chat Component
router.get('/users/get', authMiddleware.ensureAuthenticated, userController.getCurrentUser);

module.exports = router;