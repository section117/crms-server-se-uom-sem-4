const express = require('express');
const router = express.Router();


const chatsController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.get('/', authMiddleware.ensureAuthenticated, chatsController.viewAllChats);

//REST Endpoints for React Chat Component
router.get('/active-chats-cssa', authMiddleware.ensureAuthenticated, chatsController.getActiveChatsOfCSSA);


module.exports = router;