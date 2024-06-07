const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/student', authMiddleware, profileController.getStudentProfile);
router.get('/employer', authMiddleware, profileController.getEmployerProfile);
router.get('/employer/:id', authMiddleware, profileController.getEmployerProfileById);

module.exports = router;
