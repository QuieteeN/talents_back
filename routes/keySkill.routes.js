const express = require('express');
const router = express.Router();
const { getAllKeySkills } = require('../controllers/keySkill.controller');

router.get('/keyskills', getAllKeySkills);

module.exports = router;
