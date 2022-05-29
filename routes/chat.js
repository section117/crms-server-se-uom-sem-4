const express = require('express');
const router = express.Router();


const chatsController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.get('/', authMiddleware.ensureAuthenticated, chatsController.viewAllChats);

router.get('/archives', authMiddleware.ensureAuthenticated, chatsController.viewArchivedChats);

//REST Endpoints for React Chat Component
router.get('/active-chats-cssa', authMiddleware.ensureAuthenticated, chatsController.getActiveChatsOfCSSA);

//REST Endpoints for React Chat plugin
//endpoint for creating new chat
router.post('/init-chat', chatsController.createNewChat);

//endpoint for add chat review
router.patch('/review', chatsController.addChatReview);

//endpoint for close chat
router.patch('/close', chatsController.closeChat);

module.exports = router;