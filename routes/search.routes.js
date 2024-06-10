const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller')
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/search-vacancies', authMiddleware, searchController.searchVacancies);
router.get('/search-cvs', authMiddleware, searchController.searchCVs);
// router.put('/update-main-info', authMiddleware, employerInfoController.updateMainInfo);
// router.put('/update-contact-info', authMiddleware, employerInfoController.updateContactInfo);
// router.put('/change-password', authMiddleware, employerInfoController.changePassword);
// router.post('/update-address-info', authMiddleware, employerInfoController.updateAddressInfo);

module.exports = router;