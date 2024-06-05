const express = require('express');
const router = express.Router();
const employerInfoController = require('../controllers/employerInfo.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Настройка multer для сохранения файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../images', 'employers');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

router.post('/upload-photo/', [authMiddleware, upload.single('photo')], employerInfoController.uploadPhoto);
router.delete('/delete-photo/', [authMiddleware, upload.single('photo')], employerInfoController.deletePhoto);
router.post('/update-socials', authMiddleware, employerInfoController.updateSocials);
router.put('/update-main-info', authMiddleware, employerInfoController.updateMainInfo);
router.put('/update-contact-info', authMiddleware, employerInfoController.updateContactInfo);
router.put('/change-password', authMiddleware, employerInfoController.changePassword);
router.post('/update-address-info', authMiddleware, employerInfoController.updateAddressInfo);

module.exports = router;