const express = require('express');
const responseController = require('../controllers/response.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/response-invite', authMiddleware, responseController.createInviteEmployer);
router.get('/get-employer-responses', authMiddleware, responseController.getResponsesAndMessagesForEmployer);
router.get('/get-messages/:responseId', authMiddleware, responseController.getMessagesForResponse);

module.exports = router;
