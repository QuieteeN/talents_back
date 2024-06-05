const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register/student', authController.registerStudent);
router.post('/register/employer', authController.registerEmployer);
router.post('/login/student', authController.loginStudent);
router.post('/login/employer', authController.loginEmployer);
router.post('/logout', authController.logout);

module.exports = router;
