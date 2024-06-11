const express = require('express');
const responseController = require('../controllers/response.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/response-invite', authMiddleware, responseController.createInviteEmployer);
router.post('/response', authMiddleware, responseController.createResponseStudent);
router.get('/get-employer-responses', authMiddleware, responseController.getResponsesAndMessagesForEmployer);
router.get('/get-messages/:responseId', authMiddleware, responseController.getMessagesForResponse);
router.get('/get-student-responses', authMiddleware, responseController.getResponsesAndMessagesForStudent);
router.get('/get-student-messages/:responseId', authMiddleware, responseController.getMessagesForResponseStudent);
router.post('/create-message', authMiddleware, responseController.createMessage);
router.post('/create-invation', authMiddleware, responseController.createMessageEmployer);
router.put('/messages/read/:responseId', authMiddleware, responseController.markMessagesAsRead);

module.exports = router;
