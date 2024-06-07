const db = require('../models')

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
                let skill = await db.KeySkill.findOne({ where: { name: skills } });
                if (!skill) {
                    skill = await db.KeySkill.create({ name: skills });
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
        console.log(cvies)

        res.status(200).json({ cvies });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
};
