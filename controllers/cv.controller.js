const db = require('../models')

exports.getAllCvies = async (req, res) => {
    try {

        const cvies = await db.CV.findAll({
            include: [
                {
                    model: db.Student, as: 'student', include: [
                        {
                            model: db.StudentInfo,
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
                { model: db.MovingType, as: 'movingType' },
                { model: db.BusinessTripType, as: 'businessTripType' },
                {
                    model: db.EmploymentType, as: 'employmentTypes', through: {
                        attributes: [],
                    }
                },
                {
                    model: db.Schedule, as: 'schedules', through: {
                        attributes: [],
                    }
                },
                { model: db.Salary, as: 'salary' },
                { model: db.Institute, as: 'institute' },
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

        res.status(200).json({ cvies });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
};

// Функция для создания CV
exports.createCV = async (req, res) => {
    try {
        // Получаем данные из запроса
        const studentId = req.userId;
        const {
            name,
            city,
            experience,
            movingType,
            businessTripType,
            salary,
            employmentTypes,
            schedules,
            description,
            institute,
            skills,
            languages,
            licenseCategories
        } = req.body;
        // Проверяем обязательные поля
        if (!name || !city || !movingType || !businessTripType || !description) {
            return res.status(400).json({ message: 'Не все обязательные поля заполнены' });
        }

        // Поиск или создание MovingType
        const foundMovingType = await db.MovingType.findOne({ where: { code: movingType } });
        if (!foundMovingType) {
            return res.status(400).json({ message: 'Указан неверный тип переезда' });
        }

        // Поиск опыта работы по коду
        const foundExperience = await db.Experience.findOne({ where: { code: experience } });
        if (!foundExperience) {
            return res.status(400).json({ message: 'Неправильный код опыта работы' });
        }

        // Поиск или создание BusinessTripType
        const foundBusinessTripType = await db.BusinessTripType.findOne({ where: { code: businessTripType } });
        if (!foundBusinessTripType) {
            return res.status(400).json({ message: 'Указан неверный тип командировки' });
        }

        const cv = await db.CV.create({
            name,
            city,
            experienceId: foundExperience.id,
            movingTypeId: foundMovingType.id,
            businessTripTypeId: foundBusinessTripType.id,
            description,
            studentId: studentId,
        });

        let salaryId = null;

        if (salary.salaryFrom || salary.salaryTo) {
            const createdSalary = await db.Salary.create({
                salaryFrom: salary.salaryFrom || null,
                salaryTo: salary.salaryTo || null,
                type: salary.type
            });
            salaryId = createdSalary.id;
        }

        let instituteId = null;
        // Создание или поиск Institute
        if (institute.instituteName && institute.facultyName && institute.specialization && institute.educationLevel) {

            // Поиск или создание Institute
            const foundInstitute = await db.Institute.findOne(
                {
                    where: {
                        facultyName: institute.facultyName,
                        specialization: institute.specialization,
                        instituteName: institute.instituteName,
                        educationLevel: institute.educationLevel
                    }
                });
            if (foundInstitute) {
                instituteId = foundInstitute.id;
            } else {
                const newInstitute = await db.Institute.create({
                    instituteName: institute.instituteName,
                    facultyName: institute.facultyName,
                    specialization: institute.specialization,
                    educationLevel: institute.educationLevel,
                });
                instituteId = newInstitute.id;
            }
        }

        // Если указаны навыки, создаем записи о навыках и связываем их с вакансией
        if (skills && skills.length > 0) {
            for (const keySkill of skills) {
                let skill = await db.KeySkill.findOne({ where: { name: keySkill } });
                if (!skill) {
                    skill = await db.KeySkill.create({ name: keySkill });
                }
                await cv.addKeySkill(skill);
            }
        }

        if (employmentTypes && employmentTypes.length > 0) {
            for (const employmentTypeCode of employmentTypes) {
                let employmentType = await db.EmploymentType.findOne({ where: { code: employmentTypeCode } });
                if (employmentType) {
                    await cv.addEmploymentType(employmentType);
                } else {
                    return res.status(400).json({ message: 'Указан неверный тип занятости' });
                }
            }
        }

        if (schedules && schedules.length > 0) {
            for (const scheduleCode of schedules) {
                let schedule = await db.Schedule.findOne({ where: { code: scheduleCode } });
                if (schedule) {
                    await cv.addSchedule(schedule);
                } else {
                    return res.status(400).json({ message: 'Указано неверное расписание' });
                }
            }
        }

        if (languages && languages.length > 0) {
            for (const language of languages) {
                let lang = await db.Language.findOne({ where: { name: language.name, level: language.level } });
                if (!lang) {
                    lang = await db.Language.create(language);
                }
                await cv.addLanguage(lang);
            }
        }

        // Если указаны категории лицензий, создаем записи о категориях лицензий и связываем их с вакансией
        if (licenseCategories && licenseCategories.length > 0) {
            for (const category of licenseCategories) {
                let licCat = await db.LicenseCategory.findOne({ where: { code: category } });
                if (!licCat) {
                    licCat = await db.LicenseCategory.create({ code: category });
                }
                await cv.addLicenseCategory(licCat);
            }
        }

        // Обновляем запись о зарплате и адресе в вакансии, если они были созданы
        if (salaryId) {
            cv.salaryId = salaryId;
            await cv.save();
        }

        if (instituteId) {
            cv.instituteId = instituteId;
            await cv.save();
        }

        return res.status(201).json({ message: 'CV успешно создан', data: cv });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Произошла ошибка при создании CV' });
    }
};

exports.getMyAllCvies = async (req, res) => {
    try {
        const studentId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req

        const cvies = await db.CV.findAll({
            where: { studentId },
            include: [
                {
                    model: db.Student, as: 'student', include: [
                        {
                            model: db.StudentInfo,
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
                { model: db.MovingType, as: 'movingType' },
                { model: db.BusinessTripType, as: 'businessTripType' },
                {
                    model: db.EmploymentType, as: 'employmentTypes', through: {
                        attributes: [],
                    }
                },
                {
                    model: db.Schedule, as: 'schedules', through: {
                        attributes: [],
                    }
                },
                { model: db.Salary, as: 'salary' },
                { model: db.Institute, as: 'institute' },
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

        res.status(200).json({ cvies });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
};

exports.getMyCvById = async (req, res) => {
    try {
        const studentId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const cvId = req.params.id;

        const cv = await db.CV.findOne({
            where: { id: cvId, studentId },
            include: [
                {
                    model: db.Student, as: 'student', include: [
                        {
                            model: db.StudentInfo,
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
                { model: db.MovingType, as: 'movingType' },
                { model: db.BusinessTripType, as: 'businessTripType' },
                {
                    model: db.EmploymentType, as: 'employmentTypes', through: {
                        attributes: [],
                    }
                },
                {
                    model: db.Schedule, as: 'schedules', through: {
                        attributes: [],
                    }
                },
                { model: db.Salary, as: 'salary' },
                { model: db.Institute, as: 'institute' },
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

        res.status(200).json({ cv });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
};

exports.getCvById = async (req, res) => {
    try {
        const cvId = req.params.id;

        const cv = await db.CV.findOne({
            where: { id: cvId },
            include: [
                {
                    model: db.Student, as: 'student', include: [
                        {
                            model: db.StudentInfo,
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
                { model: db.MovingType, as: 'movingType' },
                { model: db.BusinessTripType, as: 'businessTripType' },
                {
                    model: db.EmploymentType, as: 'employmentTypes', through: {
                        attributes: [],
                    }
                },
                {
                    model: db.Schedule, as: 'schedules', through: {
                        attributes: [],
                    }
                },
                { model: db.Salary, as: 'salary' },
                { model: db.Institute, as: 'institute' },
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

        res.status(200).json({ cv });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
};


exports.updateDataForEmployer = async (req, res) => {
    try {
        const studentId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const cvId = req.params.id;
        const { city, movingType, businessTripType, } = req.body;

        // Проверяем, что поле experience не пустое
        if (!city) {
            return res.status(400).json({ message: 'Поле города не должен быть пустым' });
        }

        if (!movingType) {
            return res.status(400).json({ message: 'Поле переезда не должен быть пустым' });
        }

        if (!businessTripType) {
            return res.status(400).json({ message: 'Поле командировки не должен быть пустым' });
        }

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const cv = await db.CV.findOne({
            where: { id: cvId, studentId }
        });

        if (!cv) {
            return res.status(404).json({ message: 'Резюме не найдена' });
        }

        // Находим соответствующее значение опыта в таблице Experience
        const movingEntry = await db.MovingType.findOne({ where: { code: movingType } });

        if (!movingEntry) {
            return res.status(404).json({ message: 'Переезд не найден в базе данных' });
        }

        // Находим соответствующее значение опыта в таблице Experience
        const businessTrip = await db.BusinessTripType.findOne({ where: { code: businessTripType } });

        if (!businessTrip) {
            return res.status(404).json({ message: 'Переезд не найден в базе данных' });
        }

        // Обновляем поле experienceId в вакансии
        cv.movingTypeId = movingEntry.id;
        cv.businessTripTypeId = businessTrip.id;
        cv.city = city;
        await cv.save();

        res.status(200).json({ message: 'Резюме обновлен', cv });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

exports.updateMainInfo = async (req, res) => {
    try {
        const studentId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const cvId = req.params.id;
        const { name, experience, salary, employmentTypes, schedules } = req.body;

        // Проверяем, что поле experience не пустое
        if (!name) {
            return res.status(400).json({ message: 'Поле должности не должен быть пустым' });
        }

        if (!experience) {
            return res.status(400).json({ message: 'Поле опыта работы не должен быть пустым' });
        }

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const cv = await db.CV.findOne({
            where: { id: cvId, studentId }
        });

        if (!cv) {
            return res.status(404).json({ message: 'Резюме не найдена' });
        }

        // Находим соответствующее значение опыта в таблице Experience
        const experienceEntry = await db.Experience.findOne({ where: { code: experience } });

        if (!experienceEntry) {
            return res.status(404).json({ message: 'Опыт работы не найден в базе данных' });
        }

        // Удаляем существующие связи с лицензиями
        await cv.setEmploymentTypes([]);

        // Обрабатываем каждую лицензию
        for (const code of employmentTypes) {
            let employmentType = await db.EmploymentType.findOne({ where: { code } });

            if (!employmentType) {
                return res.status(404).json({ message: 'Указан неверный тип занятости' });
            }
            await cv.addEmploymentType(employmentType);
        }

        // Удаляем существующие связи с лицензиями
        await cv.setSchedules([]);

        // Обрабатываем каждую лицензию
        for (const code of schedules) {
            let schedule = await db.Schedule.findOne({ where: { code } });

            if (!schedule) {
                return res.status(404).json({ message: 'Указан неверный график работы' });
            }
            await cv.addSchedule(schedule);
        }

        let salaryId = null;

        if (salary.salaryFrom || salary.salaryTo) {
            const createdSalary = await db.Salary.create({
                salaryFrom: salary.salaryFrom || null,
                salaryTo: salary.salaryTo || null,
                type: salary.type
            });
            salaryId = createdSalary.id;
        }
        if (salaryId) {
            cv.salaryId = salaryId;
            await cv.save();
        }

        // Обновляем поле experienceId в вакансии
        cv.name = name;
        cv.experienceId = experienceEntry.id;
        await cv.save();

        res.status(200).json({ message: 'Резюме обновлен', cv });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

exports.updateKeySkills = async (req, res) => {
    try {
        const studentId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const cvId = req.params.id;
        const { keySkills } = req.body;

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const cv = await db.CV.findOne({
            where: { id: cvId, studentId }
        });

        if (!cv) {
            return res.status(404).json({ message: 'Резюме не найдена' });
        }

        // Если массив навыков пустой, удаляем все связи ключевых навыков с вакансией
        if (keySkills.length === 0) {
            await cv.setKeySkills([]);
            return res.status(200).json({ message: 'Ключевые навыки удалены' });
        }

        // Массив для хранения KeySkill объектов
        const keySkillObjects = [];

        for (const skillName of keySkills) {
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
        await cv.setKeySkills(keySkillObjects);

        res.status(200).json({ message: 'Резюме обновлен', cv });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

exports.updateLicenseCategories = async (req, res) => {
    try {
        const studentId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const cvId = req.params.id;
        const { selectedCategories } = req.body;

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const cv = await db.CV.findOne({
            where: { id: cvId, studentId }
        });

        if (!cv) {
            return res.status(404).json({ message: 'Резюме не найдена' });
        }

        // Удаляем существующие связи с лицензиями
        await cv.setLicenseCategories([]);

        // Если массив лицензий пустой, возвращаем успешный ответ
        if (selectedCategories.length === 0) {
            return res.status(200).json({ message: 'Категории прав удалены', cv });
        }

        // Обрабатываем каждую лицензию
        for (const code of selectedCategories) {
            let licenseCategory = await db.LicenseCategory.findOne({ where: { code } });

            if (!licenseCategory) {
                licenseCategory = await db.LicenseCategory.create({ code });
            }

            await cv.addLicenseCategory(licenseCategory);
        }

        res.status(200).json({ message: 'Категории прав обновлены', cv });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateDescription = async (req, res) => {
    try {
        const studentId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const cvId = req.params.id;
        const { description } = req.body;

        // Проверяем, что поле description не пустое
        if (!description) {
            return res.status(400).json({ message: 'Описание не должно быть пустым' });
        }

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const cv = await db.CV.findOne({
            where: { id: cvId, studentId }
        });

        if (!cv) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        // Обновляем описание вакансии
        cv.description = description;
        await cv.save();

        res.status(200).json({ message: 'Описание вакансии обновлено', cv });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateInstitute = async (req, res) => {
    try {
        const studentId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const cvId = req.params.id;
        const { instituteName, facultyName, specialization, educationLevel } = req.body;

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const cv = await db.CV.findOne({
            where: { id: cvId, studentId }
        });

        if (!cv) {
            return res.status(404).json({ message: 'Резюме не найдена' });
        }

        // Если все поля country, state, city, street, houseNumber пустые, удаляем связь с адресом
        if (!instituteName && !facultyName && !specialization) {
            if (cv.instituteId) {
                cv.instituteId = null;
                await cv.save();
            }
            return res.status(200).json({ message: 'Институт удален' });
        }

        // Проверяем, что поле pos не пустое
        if (!educationLevel) {
            return res.status(400).json({ message: 'educationLevel не должно быть пустым' });
        }

        let institute = await db.Institute.findOne({
            where: { instituteName, facultyName, specialization, educationLevel }
        });
        if (institute) {
            cv.instituteId = institute.id;
            await cv.save();
            return res.status(200).json({ message: 'Институт обновлен', institute });
        }

        // Если вакансия не связана с адресом, создаем новый адрес и связываем его с вакансией
        const newInstitute = await db.Institute.create({
            instituteName, facultyName, specialization, educationLevel
        });

        cv.instituteId = newInstitute.id;
        await cv.save();

        res.status(200).json({ message: 'Институт создан и обновлен', institute: newInstitute });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateLanguages = async (req, res) => {
    try {
        const studentId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const cvId = req.params.id;
        const { languages } = req.body;

        // Проверяем, что вакансия существует и принадлежит текущему работодателю
        const cv = await db.CV.findOne({
            where: { id: cvId, studentId }
        });

        if (!cv) {
            return res.status(404).json({ message: 'Резюме не найдено' });
        }

        // Удаляем существующие связи с языками
        await cv.setLanguages([]);

        // Если массив языков пустой, возвращаем успешный ответ
        if (languages.length === 0) {
            return res.status(200).json({ message: 'Языки удалены успешно', cv });
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

            await cv.addLanguage(language);
        }

        res.status(200).json({ message: 'Языки обновлены', cv });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};