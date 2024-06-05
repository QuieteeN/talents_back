const express = require('express');
const router = express.Router();
const studentInfoController = require('./../controllers/studentInfo.controller')
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Настройка multer для сохранения файлов
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadDir = path.join(__dirname, '../images', 'employers');

//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir, { recursive: true });
//         }
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

// const upload = multer({ storage: storage });

// router.post('/upload-photo/', [authMiddleware, upload.single('photo')], employerInfoController.uploadPhoto);
// router.delete('/delete-photo/', [authMiddleware, upload.single('photo')], employerInfoController.deletePhoto);
router.put('/update-main-info', authMiddleware, studentInfoController.updateMainInfo);
router.put('/update-contact-info', authMiddleware, studentInfoController.updateContactInfo);
router.post('/update-address-info', authMiddleware, studentInfoController.updateAddressInfo);
router.post('/update-socials', authMiddleware, studentInfoController.updateSocials);
router.put('/change-password', authMiddleware, studentInfoController.changePassword);


module.exports = router;