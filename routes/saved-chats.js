const express = require('express');
const router = express.Router();


const chatsController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.get('/', authMiddleware.ensureAuthenticated, chatsController.viewSavedChats);



module.exports = router;