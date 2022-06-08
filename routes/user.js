const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddlewares');
const userRoleMiddleware = require('../middlewares/userRoleMiddlewares');

router.post('/login', authMiddleware.guestOnly, userController.handleLogin);
router.post('/register', authMiddleware.guestOnly, userController.handleRegistration);
//router.get('/logout', authMiddleware.ensureAuthenticated, userController.handleLogout);

router.get(
	'/profile',
	authMiddleware.ensureAuthenticated,
	userController.userProfile
);
router.post(
	'/profile',
	authMiddleware.ensureAuthenticated,
	userController.handleUpdate
);

router.get(
	'/manage-cssa',
	authMiddleware.ensureAuthenticated,
	userRoleMiddleware.allowByUserTypes(['COMPANY_OWNER']),
	userController.viewCSSAList
);

router.post(
	'/manage-cssa',
	authMiddleware.ensureAuthenticated,
	userRoleMiddleware.allowByUserTypes(['COMPANY_OWNER']),
	userController.handleRegistration
);

router.post(
	'/delete-cssa',
	authMiddleware.ensureAuthenticated,
	userRoleMiddleware.allowByUserTypes(['COMPANY_OWNER']),
	userController.handleDelete
);

//REST Endpoints for React Chat Component
router.get(
	'/users/get',
	authMiddleware.ensureAuthenticated,
	userController.getCurrentUser
);

module.exports = router;
