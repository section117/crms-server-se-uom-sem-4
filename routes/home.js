const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.get('/', homeController.viewHome);
router.get('/dashboard', authMiddleware.ensureAuthenticated, homeController.viewDashboard);

module.exports = router;