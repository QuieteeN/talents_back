const express = require('express');
const router = express.Router();
const cvController = require('./../controllers/cv.controller')
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create-cv', authMiddleware, cvController.createCV);
router.get('/get-my-all-cvies', authMiddleware, cvController.getMyAllCvies);
router.get('/get-all-cvies', cvController.getAllCvies);
router.get('/get-my-cv/:id', authMiddleware, cvController.getMyCvById);
router.get('/get-cv/:id', authMiddleware, cvController.getCvById);
router.put('/update-data-for-employer/:id', authMiddleware, cvController.updateDataForEmployer);
router.put('/update-main-info/:id', authMiddleware, cvController.updateMainInfo);
router.put('/update-skills/:id', authMiddleware, cvController.updateKeySkills);
router.put('/update-license-categories/:id', authMiddleware, cvController.updateLicenseCategories);
router.put('/update-description/:id', authMiddleware, cvController.updateDescription);
router.put('/update-institute/:id', authMiddleware, cvController.updateInstitute);
router.put('/update-languages/:id', authMiddleware, cvController.updateLanguages);
// router.put('/update-main-info', authMiddleware, employerInfoController.updateMainInfo);
// router.put('/update-contact-info', authMiddleware, employerInfoController.updateContactInfo);
// router.put('/change-password', authMiddleware, employerInfoController.changePassword);
// router.post('/update-address-info', authMiddleware, employerInfoController.updateAddressInfo);

module.exports = router;