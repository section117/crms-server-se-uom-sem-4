const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');

const authMiddleware = require('../middlewares/authMiddlewares');

router.get('/', homeController.viewHome);
router.get('/register', homeController.viewSignupPage);
router.get('/dashboard', authMiddleware.ensureAuthenticated, homeController.viewDashboard);
router.get('/integration', authMiddleware.ensureAuthenticated, homeController.viewChatIntegration);
router.get('/logout', userController.handleLogout);


module.exports = router;