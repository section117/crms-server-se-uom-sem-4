const express = require('express');
const router = express.Router();


const chatMessagesController = require('../controllers/chatMessagesController');
const authMiddleware = require('../middlewares/authMiddlewares');


//REST Endpoints for React Chat Component
router.get('/get/:chat_id', authMiddleware.ensureAuthenticated, chatMessagesController.getAllChatMessages);


module.exports = router;