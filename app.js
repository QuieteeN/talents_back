// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./models');
const app = express();
const path = require('path');
const fs = require('fs');

// Настройка CORS для разрешения всех источников
const corsOptions = {
    origin: 'http://localhost:3000', // Указание точного источника
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Разрешение передачи учетных данных
    optionsSuccessStatus: 204 // Опционально: для успешного ответа на preflight запросы
};

// Проверка и создание папки uploads, если её нет
const uploadDir = path.join(__dirname, 'images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Проверка и создание папки employers внутри папки uploads, если её нет
const employersDir = path.join(uploadDir, 'employers');
if (!fs.existsSync(employersDir)) {
    fs.mkdirSync(employersDir);
}

// Проверка и создание папки employers внутри папки uploads, если её нет
const studentDir = path.join(uploadDir, 'students');
if (!fs.existsSync(studentDir)) {
    fs.mkdirSync(studentDir);
}

app.use(cors(corsOptions)); // Применение CORS middleware

app.options('*', cors(corsOptions)); // Разрешение preflight запросов для всех маршрутов
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Папка для раздачи статических файлов (загруженных фотографий)
app.use('/images', express.static(uploadDir));


// Роуты
app.use('/api', require('./routes'));

// Синхронизация базы данных
db.sequelize.sync().then(() => {
    console.log('Drop and re-sync db.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
