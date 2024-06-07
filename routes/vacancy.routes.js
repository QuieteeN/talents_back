const express = require('express');
const router = express.Router();
const vacancyController = require('./../controllers/vacancy.controller')
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create-vacancy', authMiddleware, vacancyController.createVacancy);
router.get('/vacancies', authMiddleware, vacancyController.getAllVacancies);
router.get('/all-vacancies', vacancyController.getVacancies)
router.get('/vacancies/:id', authMiddleware, vacancyController.getMyVacancyById);
router.get('/vacancies/:id/visitor', vacancyController.getVacancyById);
router.put('/vacancies/:id/update-main-info', authMiddleware, vacancyController.updateVacancyMainData)
router.put('/vacancies/:id/update-salary', authMiddleware, vacancyController.updateSalary)
router.put('/vacancies/:id/update-description', authMiddleware, vacancyController.updateDescription)
router.put('/vacancies/:id/update-address', authMiddleware, vacancyController.updateAddress)
router.put('/vacancies/:id/update-experience', authMiddleware, vacancyController.updateExperience)
router.put('/vacancies/:id/update-skills', authMiddleware, vacancyController.updateKeySkills)
router.put('/vacancies/:id/update-visible-contacts', authMiddleware, vacancyController.updateIsVisibleContacts)
router.put('/vacancies/:id/update-employment-type', authMiddleware, vacancyController.updateEmploymentType)
router.put('/vacancies/:id/update-schedule', authMiddleware, vacancyController.updateSchedule)
router.put('/vacancies/:id/update-languages', authMiddleware, vacancyController.updateLanguages)
router.put('/vacancies/:id/update-license-categories', authMiddleware, vacancyController.updateLicenseCategories)
// router.put('/update-main-info', authMiddleware, employerInfoController.updateMainInfo);
// router.put('/update-contact-info', authMiddleware, employerInfoController.updateContactInfo);
// router.put('/change-password', authMiddleware, employerInfoController.changePassword);
// router.post('/update-address-info', authMiddleware, employerInfoController.updateAddressInfo);

module.exports = router;