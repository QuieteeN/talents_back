const express = require('express');
const db = require('../models');

const Experience = db.Experience;
const EmploymentType = db.EmploymentType;
const Schedule = db.Schedule;
const Vacancy = db.Vacancy;
const Salary = db.Salary;
const Address = db.Address;
const KeySkill = db.KeySkill;
const Language = db.Language;
const LicenseCategory = db.LicenseCategory;

exports.createVacancy = async (req, res) => {
    try {
        // Получаем данные из запроса
        const employerId = req.userId;
        const {
            name,
            specialization,
            city,
            experience,
            description,
            isVisibleContacts,
            employment_type,
            schedule,
            salary,
            address,
            keySkills,
            languages,
            licenseCategories
        } = req.body;

        // Поиск опыта работы по коду
        const foundExperience = await Experience.findOne({ where: { code: experience } });
        if (!foundExperience) {
            return res.status(400).json({ message: 'Неправильный код опыта работы' });
        }

        // Поиск типа занятости по коду
        const foundEmploymentType = await EmploymentType.findOne({ where: { code: employment_type } });
        if (!foundEmploymentType) {
            return res.status(400).json({ message: 'Неправильный код типа занятости' });
        }

        // Поиск графика работы по коду
        const foundSchedule = await Schedule.findOne({ where: { code: schedule } });
        if (!foundSchedule) {
            return res.status(400).json({ message: 'Неправильный код графика работы' });
        }

        // Создание вакансии
        const vacancy = await Vacancy.create({
            name,
            specialization,
            city,
            experienceId: foundExperience.id,
            description,
            isVisibleContacts,
            employment_typeId: foundEmploymentType.id,
            scheduleId: foundSchedule.id,
            employerId
        });

        // Если указана зарплата, создаем запись о зарплате
        let salaryId = null;
        if (salary.salaryFrom || salary.salaryTo) {
            const createdSalary = await Salary.create({
                salaryFrom: salary.salaryFrom || null,
                salaryTo: salary.salaryTo || null,
                type: salary.type
            });
            salaryId = createdSalary.id;
        }

        // Если указан адрес, создаем запись об адресе
        let addressId = null;
        if (address) {
            // Проверяем, есть ли уже такой адрес в базе данных
            const existingAddress = await Address.findOne({
                where: { country: address.country, state: address.state, city: address.city, street: address.street, houseNumber: address.houseNumber, pos: address.pos }
            });

            if (existingAddress) {
                addressId = existingAddress.id;
            } else {
                const newAddress = await Address.create({
                    country: address.country,
                    state: address.state,
                    city: address.city,
                    street: address.street,
                    houseNumber: address.houseNumber,
                    pos: address.pos
                });
                addressId = newAddress.id;
            }
        }

        // Если указаны навыки, создаем записи о навыках и связываем их с вакансией
        if (keySkills && keySkills.length > 0) {
            for (const keySkill of keySkills) {
                let skill = await KeySkill.findOne({ where: { name: keySkill } });
                if (!skill) {
                    skill = await KeySkill.create({ name: keySkill });
                }
                await vacancy.addKeySkill(skill);
            }
        }

        // Если указаны языки, создаем записи о языках и связываем их с вакансией
        if (languages && languages.length > 0) {
            for (const language of languages) {
                let lang = await Language.findOne({ where: { name: language.name, level: language.level } });
                if (!lang) {
                    lang = await Language.create(language);
                }
                await vacancy.addLanguage(lang);
            }
        }

        // Если указаны категории лицензий, создаем записи о категориях лицензий и связываем их с вакансией
        if (licenseCategories && licenseCategories.length > 0) {
            for (const category of licenseCategories) {
                let licCat = await LicenseCategory.findOne({ where: { code: category } });
                if (!licCat) {
                    licCat = await LicenseCategory.create({ code: category });
                }
                await vacancy.addLicenseCategory(licCat);
            }
        }

        // Обновляем запись о зарплате и адресе в вакансии, если они были созданы
        if (salaryId) {
            vacancy.salaryId = salaryId;
            await vacancy.save();
        }

        if (addressId) {
            vacancy.addressId = addressId;
            await vacancy.save();
        }

        res.status(201).json({ message: 'Вакансия успешно создана', vacancy });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getVacancies = async (req, res) => {
    try {
        const vacancies = await db.Vacancy.findAll({
            include: [
                {
                    model: db.Employer, as: 'employer', include: [
                        {
                            model: db.EmployerInfo,
                            as: 'info',
                            include: [
                                {
                                    model: db.Address,
                                    as: 'address',
                                },
                                {
                                    model: db.Social,
                                    as: 'socials',
                                    through: {
                                        attributes: [],
                                    }
                                }
                            ]
                        }
                    ]
                },
                { model: db.Experience, as: 'experience' },
                { model: db.EmploymentType, as: 'employmentType' },
                { model: db.Schedule, as: 'schedule' },
                { model: db.Salary, as: 'salary' },
                { model: db.Address, as: 'address' },
                {
                    model: db.KeySkill, as: 'keySkills', through: {
                        attributes: [],
                    }
                },
                {
                    model: db.Language, as: 'languages', through: {
                        attributes: [],
                    }
                },
                {
                    model: db.LicenseCategory, as: 'licenseCategories', through: {
                        attributes: [],
                    }
                }
            ]
        });

        res.status(200).json({ vacancies });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllVacancies = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req

        const vacancies = await db.Vacancy.findAll({
            where: { employerId },
            include: [
                {
                    model: db.Employer, as: 'employer', include: [
                        {
                            model: db.EmployerInfo,
                            as: 'info',
                            include: [
                                {
                                    model: db.Address,
                                    as: 'address',
                                },
                                {
                                    model: db.Social,
                                    as: 'socials',
                                    through: {
                                        attributes: [],
                                    }
                                }
                            ]
                        }
                    ]
                },
                { model: db.Experience, as: 'experience' },
                { model: db.EmploymentType, as: 'employmentType' },
                { model: db.Schedule, as: 'schedule' },
                { model: db.Salary, as: 'salary' },
                { model: db.Address, as: 'address' },
                {
                    model: db.KeySkill, as: 'keySkills', through: {
                        attributes: [],
                    }
                },
                {
                    model: db.Language, as: 'languages', through: {
                        attributes: [],
                    }
                },
                {
                    model: db.LicenseCategory, as: 'licenseCategories', through: {
                        attributes: [],
                    }
                }
            ]
        });

        res.status(200).json({ vacancies });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getVacancyById = async (req, res) => {
    try {
        const vacancyId = req.params.id;

        const vacancy = await db.Vacancy.findOne({
            where: { id: vacancyId },
            include: [
                {
                    model: db.Employer, as: 'employer', include: [
                        {
                            model: db.EmployerInfo,
                            as: 'info',
                            include: [
                                {
                                    model: db.Address,
                                    as: 'address',
                                },
                                {
                                    model: db.Social,
                                    as: 'socials',
                                    through: {
                                        attributes: [],
                                    }
                                }
                            ]
                        }
                    ]
                },
                { model: db.Experience, as: 'experience' },
                { model: db.EmploymentType, as: 'employmentType' },
                { model: db.Schedule, as: 'schedule' },
                { model: db.Salary, as: 'salary' },
                { model: db.Address, as: 'address' },
                {
                    model: db.KeySkill, as: 'keySkills', through: {
                        attributes: [],
                    }
                },
                {
                    model: db.Language, as: 'languages', through: {
                        attributes: [],
                    }
                },
                {
                    model: db.LicenseCategory, as: 'licenseCategories', through: {
                        attributes: [],
                    }
                }
            ]
        });

        if (!vacancy) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        res.status(200).json({ vacancy });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyVacancyById = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const vacancyId = req.params.id;

        const vacancy = await db.Vacancy.findOne({
            where: { id: vacancyId, employerId },
            include: [
                {
                    model: db.Employer, as: 'employer', include: [
                        {
                            model: db.EmployerInfo,
                            as: 'info',
                            include: [
                                {
                                    model: db.Address,
                                    as: 'address',
                                },
                                {
                                    model: db.Social,
                                    as: 'socials',
                                    through: {
                                        attributes: [],
                                    }
                                }
                            ]
                        }
                    ]
                },
                { model: db.Experience, as: 'experience' },
                { model: db.EmploymentType, as: 'employmentType' },
                { model: db.Schedule, as: 'schedule' },
                { model: db.Salary, as: 'salary' },
                { model: db.Address, as: 'address' },
                {
                    model: db.KeySkill, as: 'keySkills', through: {
                        attributes: [],
                    }
                },
                {
                    model: db.Language, as: 'languages', through: {
                        attributes: [],
                    }
                },
                {
                    model: db.LicenseCategory, as: 'licenseCategories', through: {
                        attributes: [],
                    }
                }
            ]
        });

        if (!vacancy) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        res.status(200).json({ vacancy });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateVacancyMainData = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const vacancyId = req.params.id;
        const { name, specialization, city } = req.body;

        // Проверяем, что обязательные поля не пустые
        if (!name || !specialization || !city) {
            return res.status(400).json({ message: 'Поля не должны быть пустыми' });
        }

        // Находим вакансию по id и employerId
        const vacancy = await db.Vacancy.findOne({
            where: { id: vacancyId, employerId }
        });

        if (!vacancy) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        // Обновляем данные вакансии
        vacancy.name = name;
        vacancy.specialization = specialization;
        vacancy.city = city;

        await vacancy.save();

        res.status(200).json({ message: 'Основные данные вакансии обновлены', vacancy });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateSalary = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const vacancyId = req.params.id;
        const { salaryFrom, salaryTo, type } = req.body;

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const vacancy = await db.Vacancy.findOne({
            where: { id: vacancyId, employerId }
        });

        if (!vacancy) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        if (!salaryFrom && !salaryTo) {
            // Если оба поля salaryFrom и salaryTo пустые, удаляем существующую зарплату и связь
            if (vacancy.salaryId) {
                await db.Salary.destroy({ where: { id: vacancy.salaryId } });
                vacancy.salaryId = null;
                await vacancy.save();
            }
            return res.status(200).json({ message: 'Зарплата удалена успешно' });
        }

        // Проверяем, что type не пустой, если salaryFrom или salaryTo указаны
        if (!type) {
            return res.status(400).json({ message: 'Тип зарплаты не должен быть пустым' });
        }

        // Если вакансия уже имеет связанную запись зарплаты, обновляем её
        if (vacancy.salaryId) {
            const salary = await db.Salary.findByPk(vacancy.salaryId);
            if (salary) {
                salary.salaryFrom = salaryFrom;
                salary.salaryTo = salaryTo;
                salary.type = type;
                await salary.save();
                return res.status(200).json({ message: 'Зарплата обновлена', salary });
            }
        }

        // Если связи с зарплатой нет, создаем новую запись зарплаты и связываем её с вакансией
        const newSalary = await db.Salary.create({ salaryFrom, salaryTo, type });
        vacancy.salaryId = newSalary.id;
        await vacancy.save();

        res.status(200).json({ message: 'Зарплата создана и обновлена', salary: newSalary });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateDescription = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const vacancyId = req.params.id;
        const { description } = req.body;

        // Проверяем, что поле description не пустое
        if (!description) {
            return res.status(400).json({ message: 'Описание не должно быть пустым' });
        }

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const vacancy = await db.Vacancy.findOne({
            where: { id: vacancyId, employerId }
        });

        if (!vacancy) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        // Обновляем описание вакансии
        vacancy.description = description;
        await vacancy.save();

        res.status(200).json({ message: 'Описание вакансии обновлено', vacancy });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const vacancyId = req.params.id;
        const { country, state, city, street, houseNumber, pos } = req.body;

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const vacancy = await db.Vacancy.findOne({
            where: { id: vacancyId, employerId }
        });

        if (!vacancy) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        // Если все поля country, state, city, street, houseNumber пустые, удаляем связь с адресом
        if (!country && !state && !city && !street && !houseNumber) {
            if (vacancy.addressId) {
                vacancy.addressId = null;
                await vacancy.save();
            }
            return res.status(200).json({ message: 'Адрес удален' });
        }

        // Проверяем, что поле pos не пустое
        if (!pos) {
            return res.status(400).json({ message: 'Pos не должно быть пустым' });
        }

        let address = await db.Address.findOne({
            where: { pos }
        });
        if (address) {
            address.country = country || address.country;
            address.state = state || address.state;
            address.city = city || address.city;
            address.street = street || address.street;
            address.houseNumber = houseNumber || address.houseNumber;
            address.pos = pos || address.pos;
            await address.save();
            vacancy.addressId = address.id;
            await vacancy.save();
            return res.status(200).json({ message: 'Адрес обновлен', address });
        }

        // Если вакансия не связана с адресом, создаем новый адрес и связываем его с вакансией
        const newAddress = await db.Address.create({
            country,
            state,
            city,
            street,
            houseNumber,
            pos
        });

        vacancy.addressId = newAddress.id;
        await vacancy.save();

        res.status(200).json({ message: 'Адрес создан и обновлен', address: newAddress });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateExperience = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const vacancyId = req.params.id;
        const { experience } = req.body;

        // Проверяем, что поле experience не пустое
        if (!experience) {
            return res.status(400).json({ message: 'Опыт работы не должен быть пустым' });
        }

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const vacancy = await db.Vacancy.findOne({
            where: { id: vacancyId, employerId }
        });

        if (!vacancy) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        // Находим соответствующее значение опыта в таблице Experience
        const experienceEntry = await db.Experience.findOne({ where: { code: experience } });

        if (!experienceEntry) {
            return res.status(404).json({ message: 'Experience level not found.' });
        }

        // Обновляем поле experienceId в вакансии
        vacancy.experienceId = experienceEntry.id;
        await vacancy.save();

        res.status(200).json({ message: 'Опыт работы обновлен', vacancy });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateKeySkills = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const vacancyId = req.params.id;
        const { skills } = req.body;

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const vacancy = await db.Vacancy.findOne({
            where: { id: vacancyId, employerId }
        });

        if (!vacancy) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        // Если массив навыков пустой, удаляем все связи ключевых навыков с вакансией
        if (skills.length === 0) {
            await vacancy.setKeySkills([]);
            return res.status(200).json({ message: 'Ключевые навыки удалены' });
        }

        // Массив для хранения KeySkill объектов
        const keySkillObjects = [];

        for (const skillName of skills) {
            // Находим или создаем навык
            if (skillName.trim() == '') {
                continue;
            }
            let skill = await db.KeySkill.findOne({ where: { name: skillName } });
            if (!skill) {
                skill = await db.KeySkill.create({ name: skillName });
            }
            keySkillObjects.push(skill);
        }

        // Устанавливаем новые связи ключевых навыков с вакансией
        await vacancy.setKeySkills(keySkillObjects);

        res.status(200).json({ message: 'Поле ключевых навыков обновлен', vacancy });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateIsVisibleContacts = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const vacancyId = req.params.id;
        const { isVisibleContacts } = req.body;

        // Проверяем, что значение isVisibleContacts является булевым
        if (typeof isVisibleContacts !== 'boolean') {
            return res.status(400).json({ message: 'Неправильный тип переменной' });
        }

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const vacancy = await db.Vacancy.findOne({
            where: { id: vacancyId, employerId }
        });

        if (!vacancy) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        // Обновляем поле isVisibleContacts
        vacancy.isVisibleContacts = isVisibleContacts;
        await vacancy.save();

        res.status(200).json({ message: 'Данные обновлены', vacancy });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateEmploymentType = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const vacancyId = req.params.id;
        const { employmentType } = req.body;

        // Проверяем, что значение employmentType не пустое
        if (!employmentType) {
            return res.status(400).json({ message: 'Поле не должно быть пустым' });
        }

        // Ищем запись employmentType по переданному значению
        const employmentTypeRecord = await db.EmploymentType.findOne({ where: { code: employmentType } });
        if (!employmentTypeRecord) {
            return res.status(400).json({ message: 'Неправильное значение' });
        }

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const vacancy = await db.Vacancy.findOne({
            where: { id: vacancyId, employerId }
        });

        if (!vacancy) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        // Обновляем поле employmentType
        vacancy.employment_typeId = employmentTypeRecord.id;
        await vacancy.save();

        res.status(200).json({ message: 'Тип занятости обновлен успешно', vacancy });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateSchedule = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const vacancyId = req.params.id;
        const { schedule } = req.body;

        // Проверяем, что значение schedule не пустое
        if (!schedule) {
            return res.status(400).json({ message: 'Значение не может быть пустым' });
        }

        // Ищем запись schedule по переданному значению
        const scheduleRecord = await db.Schedule.findOne({ where: { code: schedule } });
        if (!scheduleRecord) {
            return res.status(400).json({ message: 'Некорректное значение' });
        }

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const vacancy = await db.Vacancy.findOne({
            where: { id: vacancyId, employerId }
        });

        if (!vacancy) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        // Обновляем поле schedule
        vacancy.scheduleId = scheduleRecord.id;
        await vacancy.save();

        res.status(200).json({ message: 'График работы обновлен', vacancy });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateLanguages = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const vacancyId = req.params.id;
        const { languages } = req.body;

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const vacancy = await db.Vacancy.findOne({
            where: { id: vacancyId, employerId }
        });

        if (!vacancy) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        // Удаляем существующие связи с языками
        await vacancy.setLanguages([]);

        // Если массив языков пустой, возвращаем успешный ответ
        if (languages.length === 0) {
            return res.status(200).json({ message: 'Языки удалены успешно', vacancy });
        }

        // Обрабатываем каждый язык
        for (const lang of languages) {
            if (lang.name.trim() === '') {
                continue;
            }
            let language = await db.Language.findOne({ where: { name: lang.name, level: lang.level } });

            if (!language) {
                language = await db.Language.create({ name: lang.name, level: lang.level });
            }

            await vacancy.addLanguage(language);
        }

        res.status(200).json({ message: 'Языки обновлены', vacancy });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateLicenseCategories = async (req, res) => {
    try {
        const employerId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const vacancyId = req.params.id;
        const { selectedCategories } = req.body;

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const vacancy = await db.Vacancy.findOne({
            where: { id: vacancyId, employerId }
        });

        if (!vacancy) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        // Удаляем существующие связи с лицензиями
        await vacancy.setLicenseCategories([]);

        // Если массив лицензий пустой, возвращаем успешный ответ
        if (selectedCategories.length === 0) {
            return res.status(200).json({ message: 'Категории прав удалены', vacancy });
        }

        // Обрабатываем каждую лицензию
        for (const code of selectedCategories) {
            let licenseCategory = await db.LicenseCategory.findOne({ where: { code } });

            if (!licenseCategory) {
                licenseCategory = await db.LicenseCategory.create({ code });
            }

            await vacancy.addLicenseCategory(licenseCategory);
        }

        res.status(200).json({ message: 'Категории прав обновлены', vacancy });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};