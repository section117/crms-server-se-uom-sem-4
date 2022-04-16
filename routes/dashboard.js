const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');


router.get('/logout', userController.handleLogout);

module.exports = router;