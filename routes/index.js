// routes/index.js
const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/profile', require('./profile.routes'));
router.use('/employerInfo', require('./employerInfo.routes'));
router.use('/studentInfo', require('./studentInfo.routes'));
router.use('/vacancy', require('./vacancy.routes'));
router.use('/cv', require('./cv.routes'));
router.use('/search', require('./search.routes'));
router.use('/keySkills', require('./keySkill.routes'))
router.use('/languages', require('./language.routes'))
router.use('/response', require('./response.routes'))
router.use('/favorite', require('./favorite.routes'))

module.exports = router;
