const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');




router.get('/chat', chatController.viewChat);

module.exports = router;