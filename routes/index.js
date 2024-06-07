// routes/index.js
const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/profile', require('./profile.routes'));
router.use('/employerInfo', require('./employerInfo.routes'));
router.use('/studentInfo', require('./studentInfo.routes'));
router.use('/vacancy', require('./vacancy.routes'));
router.use('/cv', require('./cv.routes'));

module.exports = router;
