const express = require('express');
const router = express.Router();
const cvController = require('./../controllers/cv.controller')
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create-cv', authMiddleware, cvController.createCV);
router.get('/get-my-all-cvies', authMiddleware, cvController.getMyAllCvies);
// router.put('/update-main-info', authMiddleware, employerInfoController.updateMainInfo);
// router.put('/update-contact-info', authMiddleware, employerInfoController.updateContactInfo);
// router.put('/change-password', authMiddleware, employerInfoController.changePassword);
// router.post('/update-address-info', authMiddleware, employerInfoController.updateAddressInfo);

module.exports = router;