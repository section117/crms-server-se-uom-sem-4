const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');

router.get('/', homeController.viewHome);
router.get('/dashboard', homeController.viewDashboard);

module.exports = router;