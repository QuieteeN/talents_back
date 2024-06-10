const express = require('express');
const router = express.Router();
const { getAllLanguages } = require('../controllers/language.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.get('/languages', authMiddleware, getAllLanguages);

module.exports = router;
