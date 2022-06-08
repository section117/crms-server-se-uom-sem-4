const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');

const authMiddleware = require('../middlewares/authMiddlewares');
const userRoleMiddleware = require('../middlewares/userRoleMiddlewares');

router.get('/', authMiddleware.guestOnly, homeController.viewHome);
router.get('/register', authMiddleware.guestOnly, homeController.viewSignupPage);
router.get('/dashboard', authMiddleware.ensureAuthenticated, homeController.viewDashboard);
router.get('/integration', authMiddleware.ensureAuthenticated,
	userRoleMiddleware.allowByUserTypes(['COMPANY_OWNER']), homeController.viewChatIntegration);
router.get('/logout', authMiddleware.ensureAuthenticated, userController.handleLogout);
router.get('/404', homeController.render404);

module.exports = router;