// routes/student.routes.js
const express = require('express');
const db = require('../models');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const EmployerInfo = db.EmployerInfo;
const Employer = db.Employer;
const Social = db.Social;
const EmployerSocial = db.EmployerSocial
const Address = db.Address;

exports.uploadPhoto = async (req, res) => {
    try {

        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const employerInfo = await EmployerInfo.findOne({ where: { employerId } });

        if (!employerInfo) {
            return res.status(404).json({ message: 'Employer info not found' });
        }

        // Удаление старой фотографии, если она существует
        if (employerInfo.logoUrl) {
            const oldPhotoPath = path.join(__dirname, '..', employerInfo.logoUrl);
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
            }
        }

        // Обновление пути к новой фотографии
        const newPhotoPath = `/images/employers/${req.file.filename}`;
        employerInfo.logoUrl = newPhotoPath;
        await employerInfo.save();

        res.status(200).json({ message: 'Фотография успешно загружена', filePath: newPhotoPath });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.deletePhoto = async (req, res) => {
    try {

        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const employerInfo = await EmployerInfo.findOne({ where: { employerId } });

        if (!employerInfo) {
            return res.status(404).json({ message: 'Employer info not found' });
        }

        // Удаление старой фотографии, если она существует
        if (employerInfo.logoUrl) {
            const oldPhotoPath = path.join(__dirname, '../', employerInfo.logoUrl);
            console.log(oldPhotoPath);
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
            }
        }

        employerInfo.logoUrl = null;
        await employerInfo.save();

        res.status(200).json({ message: 'Фотография успешно удалена' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.updateSocials = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const { socials } = req.body;

        const employerInfo = await EmployerInfo.findOne({ where: { employerId } });

        if (!employerInfo) {
            return res.status(404).json({ message: 'Employer info not found' });
        }

        // Получение всех социальных сетей, связанных с данным работодателем
        const existingEmployerSocials = await EmployerSocial.findAll({ where: { employerInfoId: employerInfo.id } });

        // Удаление записей из EmployerSocial
        await EmployerSocial.destroy({ where: { employerInfoId: employerInfo.id } });

        // Проверка и удаление ненужных записей из таблицы Social
        for (const employerSocial of existingEmployerSocials) {
            const socialId = employerSocial.socialId;
            const count = await EmployerSocial.count({ where: { socialId } });
            if (count === 0) {
                await Social.destroy({ where: { id: socialId } });
            }
        }

        for (const social of socials) {
            let socialEntry = await Social.findOne({ where: { type: social.type, url: social.link } });

            if (!socialEntry) {
                socialEntry = await Social.create({ type: social.type, url: social.link });
            }

            await EmployerSocial.create({
                employerInfoId: employerInfo.id,
                socialId: socialEntry.id
            });
        }

        res.status(200).json({ message: 'Социальные сети обновлены' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.updateMainInfo = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const { companyName, companyDescription } = req.body;

        const employerInfo = await EmployerInfo.findOne({ where: { employerId } });

        if (!employerInfo) {
            return res.status(404).json({ message: 'Employer info not found' });
        }

        employerInfo.companyName = companyName;
        employerInfo.companyDescription = companyDescription;
        await employerInfo.save();

        res.status(200).json({ message: 'Основаня информация обновлена', employerInfo });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateContactInfo = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const { name, surname, email, phoneNumber } = req.body;

        const employer = await Employer.findByPk(employerId);
        const employerInfo = await EmployerInfo.findOne({ where: { employerId } });

        if (!employer) {
            return res.status(404).json({ message: 'Employer not found' });
        }

        if (!employerInfo) {
            return res.status(404).json({ message: 'Employer info not found' });
        }

        // Обновление данных
        employer.name = name || employer.name;
        employer.surname = surname || employer.surname;
        employer.email = email || employer.email;
        await employer.save();

        employerInfo.phoneNumber = phoneNumber;
        await employerInfo.save();

        res.status(200).json({ message: 'Контактные данные обновлены', employer, employerInfo });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const { oldPassword, newPassword } = req.body;

        const employer = await Employer.findByPk(employerId);

        if (!employer) {
            return res.status(404).json({ message: 'Работодатель не найден' });
        }

        const isMatch = await bcrypt.compare(oldPassword, employer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неправильный пароль' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        employer.password = hashedPassword;
        await employer.save();

        res.status(200).json({ message: 'Пароль успешно обновлен' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateAddressInfo = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const { country, state, city, street, houseNumber, pos } = req.body;

        const employerInfo = await EmployerInfo.findOne({ where: { employerId } });

        if (!employerInfo) {
            return res.status(404).json({ message: 'Employer info not found' });
        }

        if (!country && !state && !city && !street && !houseNumber) {
            // Если все поля пустые, удаляем связь с адресом, если она есть
            if (employerInfo.addressId) {
                employerInfo.addressId = null;
                await employerInfo.save();
            }
            return res.status(200).json({ message: 'Адрес удалён' });
        }

        // Если указан pos, пытаемся найти существующий адрес
        let address = await Address.findOne({ where: { pos } });

        if (address) {
            // Обновляем существующий адрес
            address.country = country || address.country;
            address.state = state || address.state;
            address.city = city || address.city;
            address.street = street || address.street;
            address.houseNumber = houseNumber || address.houseNumber;
            await address.save();
        } else {
            // Создаем новый адрес
            address = await Address.create({
                country,
                state,
                city,
                street,
                houseNumber,
                pos
            });
        }

        // Привязываем адрес к информации о работодателе
        employerInfo.addressId = address.id;
        await employerInfo.save();

        res.status(200).json({ message: 'Адрес обновлён', address });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};