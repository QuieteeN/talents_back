const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { toggleVacancyForStudent, toggleCVForEmployer, getAllLikedVacancies, getAllLikedCvs } = require('../controllers/favorite.controller');

router.post("/vacancy", authMiddleware, toggleVacancyForStudent)
router.post("/cv", authMiddleware, toggleCVForEmployer)
router.get("/vacancy/all", authMiddleware, getAllLikedVacancies)
router.get("/cv/all", authMiddleware, getAllLikedCvs)



module.exports = router;
