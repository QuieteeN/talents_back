const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller')
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/search-vacancies', searchController.searchVacancies);
router.get('/search-cvs', searchController.searchCVs);

module.exports = router;