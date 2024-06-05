// routes/index.js
const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/profile', require('./profile.routes'));
router.use('/employerInfo', require('./employerInfo.routes'));
router.use('/studentInfo', require('./studentInfo.routes'));

module.exports = router;
