const db = require('../models');
const { Response, Message, Vacancy, CV, Student, StudentInfo } = db;
const { Sequelize } = require('sequelize');

const createResponseStudent = async (req, res) => {
    const { vacancyId, cvId, content } = req.body;
    const studentId = req.userId; // предполагаем, что authMiddleware добавляет user в req

    try {
        const existingResponse = await Response.findOne({
            where: {
                vacancyId,
                cvId
            }
        });

        if (existingResponse) {
            return res.status(400).json({
                message: 'Отклик с такими значениями уже существует'
            });
        }

        // Проверка на существование вакансии и резюме
        const vacancy = await Vacancy.findByPk(vacancyId);
        const cv = await CV.findByPk(cvId);

        if (!vacancy) {
            return res.status(404).json({
                message: 'Вакансия не найдена'
            });
        }

        if (!cv) {
            return res.status(404).json({
                message: 'Резюме не найдено'
            });
        }
        // Создание отклика
        const response = await Response.create({
            vacancyId,
            cvId,
            status: 'не посмотрено'
        });

        // Создание сообщения
        const messageContent = `Отклик\n${content || ''}`;
        await Message.create({
            senderId: studentId,
            responseId: response.id,
            content: messageContent,
            status: 'не прочитано'
        });

        res.status(201).json({
            message: 'Отклик отправлено',
            response
        });
    } catch (error) {
        console.error('Ошибка в отправке приглашения', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getMessagesForResponseStudent = async (req, res) => {
    const { responseId } = req.params;

    try {

        // Найти все сообщения, связанные с этим откликом
        const response = await Response.findOne({
            where: { id: responseId },
            include: [
                {
                    model: CV,
                    as: 'cv',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: Student,
                            as: 'student',
                            attributes: ['id', 'name', 'surname'],
                        }
                    ]
                },
                {
                    model: Vacancy,
                    as: 'vacancy',
                    attributes: ['id', 'name'], // Предположим, что у CV есть поле 'name'
                    include: [
                        {
                            model: db.Employer,
                            as: 'employer',
                            attributes: ['name', 'surname'],
                            include: [
                                {
                                    model: db.EmployerInfo,
                                    as: 'info',
                                    attributes: ['logoUrl', 'companyName'],

                                }
                            ]
                        }
                    ]
                },
                {
                    model: Message,
                    as: 'messages',
                    attributes: ['id', 'senderId', 'responseId', 'content', 'status', 'createdAt'],
                    order: [['createdAt', 'DESC']],
                }
            ]
        });

        if (!response) {
            return res.status(404).json({ error: 'Response не найден' });
        }

        res.status(200).json({ response });
    } catch (error) {
        console.error('Ошибка при получении сообщений', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getResponsesAndMessagesForStudent = async (req, res) => {
    const studentId = req.userId; // предполагаем, что authMiddleware добавляет userId в req

    try {
        // Найти все вакансии, принадлежащие данному работодателю
        const cvies = await CV.findAll({
            where: { studentId },
            attributes: ['id']
        });

        const cvIds = cvies.map(cv => cv.id);

        if (cvIds.length === 0) {
            return res.status(200).json({ responses: [], messages: [] });
        }

        // Найти все отклики, связанные с этими вакансиями
        const responses = await Response.findAll({
            where: { cvId: cvIds },
            include: [
                {
                    model: Vacancy,
                    as: 'vacancy',
                    attributes: ['id', 'name'], // Предположим, что у CV есть поле 'name'
                    include: [
                        {
                            model: db.Employer,
                            as: 'employer',
                            attributes: ['name', 'surname'],
                            include: [
                                {
                                    model: db.EmployerInfo,
                                    as: 'info',
                                    attributes: ['logoUrl', 'companyName'],

                                }
                            ]
                        }
                    ]
                },
                {
                    model: Message,
                    as: 'messages',
                    attributes: ['id', 'senderId', 'responseId', 'content', 'status', 'createdAt'],
                    order: [['createdAt', 'DESC']],
                    limit: 1
                }
            ]
        });

        res.status(200).json({ responses });
    } catch (error) {
        console.error('Ошибка при получении откликов и сообщений', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createInviteEmployer = async (req, res) => {
    const { vacancyId, cvId, content } = req.body;
    const employerId = req.userId; // предполагаем, что authMiddleware добавляет user в req

    try {
        const existingResponse = await Response.findOne({
            where: {
                vacancyId,
                cvId
            }
        });

        if (existingResponse) {
            return res.status(400).json({
                message: 'Отклик с такими значениями уже существует'
            });
        }

        // Проверка на существование вакансии и резюме
        const vacancy = await Vacancy.findByPk(vacancyId);
        const cv = await CV.findByPk(cvId);

        if (!vacancy) {
            return res.status(404).json({
                message: 'Вакансия не найдена'
            });
        }

        if (!cv) {
            return res.status(404).json({
                message: 'Резюме не найдено'
            });
        }
        // Создание отклика
        const response = await Response.create({
            vacancyId,
            cvId,
            status: 'приглашение'
        });

        // Создание сообщения
        const messageContent = `Приглашение\n${content || ''}`;
        await Message.create({
            senderId: employerId,
            responseId: response.id,
            content: messageContent,
            status: 'не прочитано'
        });

        res.status(201).json({
            message: 'Приглашение отправлено',
            response
        });
    } catch (error) {
        console.error('Ошибка в отправке приглашения', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getResponsesAndMessagesForEmployer = async (req, res) => {
    const employerId = req.userId; // предполагаем, что authMiddleware добавляет userId в req

    try {
        // Найти все вакансии, принадлежащие данному работодателю
        const vacancies = await Vacancy.findAll({
            where: { employerId },
            attributes: ['id']
        });

        const vacancyIds = vacancies.map(vacancy => vacancy.id);

        if (vacancyIds.length === 0) {
            return res.status(200).json({ responses: [], messages: [] });
        }

        // Найти все отклики, связанные с этими вакансиями
        const responses = await Response.findAll({
            where: { vacancyId: vacancyIds },
            include: [
                {
                    model: CV,
                    as: 'cv',
                    attributes: ['id', 'name'], // Предположим, что у CV есть поле 'name'
                    include: [
                        {
                            model: Student,
                            as: 'student',
                            attributes: ['name', 'surname'],
                            include: [
                                {
                                    model: StudentInfo,
                                    as: 'info',
                                    attributes: ['photoUrl'],

                                }
                            ]
                        }
                    ]
                },
                {
                    model: Message,
                    as: 'messages',
                    attributes: ['id', 'senderId', 'responseId', 'content', 'status', 'createdAt'],
                    order: [['createdAt', 'DESC']],
                    limit: 1
                }
            ],
        });

        res.status(200).json({ responses });
    } catch (error) {
        console.error('Ошибка при получении откликов и сообщений', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getMessagesForResponse = async (req, res) => {
    const { responseId } = req.params;

    try {

        // Найти все сообщения, связанные с этим откликом
        const response = await Response.findOne({
            where: { id: responseId },
            include: [
                {
                    model: CV,
                    as: 'cv',
                    attributes: ['id', 'name'], // Предположим, что у CV есть поле 'name'
                    include: [
                        {
                            model: Student,
                            as: 'student',
                            attributes: ['name', 'surname'],
                            include: [
                                {
                                    model: StudentInfo,
                                    as: 'info',
                                    attributes: ['photoUrl'],

                                }
                            ]
                        }
                    ]
                },
                {
                    model: Vacancy,
                    as: 'vacancy',
                    attributes: ['id', 'name'], // Предположим, что у CV есть поле 'name'
                    include: [
                        {
                            model: db.Employer,
                            as: 'employer',
                            attributes: ['id', 'name', 'surname'],
                        }
                    ]
                },
                {
                    model: Message,
                    as: 'messages',
                    attributes: ['id', 'senderId', 'responseId', 'content', 'status', 'createdAt'],
                    order: [['createdAt', 'DESC']],
                }
            ]
        });

        if (!response) {
            return res.status(404).json({ error: 'Response не найден' });
        }

        res.status(200).json({ response });
    } catch (error) {
        console.error('Ошибка при получении сообщений', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createMessage = async (req, res) => {
    const senderId = req.userId;
    const { content, responseId } = req.body;

    try {
        // Проверить, существует ли отклик с данным responseId
        const response = await Response.findByPk(responseId);

        if (!response) {
            return res.status(404).json({ error: 'Response не найден' });
        }

        // Создать новое сообщение
        const message = await Message.create({
            senderId,
            responseId,
            content,
            status: 'не прочитано' // Устанавливаем статус по умолчанию
        });

        res.status(201).json({
            message: 'Message created successfully',
            messageDetails: message
        });
    } catch (error) {
        console.error('Ошибка при создании сообщения', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createMessageEmployer = async (req, res) => {
    const senderId = req.userId;
    const { content, responseId, status } = req.body;

    try {
        const response = await Response.update(
            { status: status }, // Значение для обновления
            {
                where: {
                    id: responseId,
                }
            }
        );;

        if (!response) {
            return res.status(404).json({ error: 'Response не найден' });
        }

        // Создать новое сообщение
        const message = await Message.create({
            senderId,
            responseId,
            content,
            status: 'не прочитано' // Устанавливаем статус по умолчанию
        });

        res.status(201).json({
            message: 'Message created successfully',
            messageDetails: message
        });
    } catch (error) {
        console.error('Ошибка при создании сообщения', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const markMessagesAsRead = async (req, res) => {
    const { responseId } = req.params;
    const userId = req.userId; // предполагаем, что authMiddleware добавляет userId в req

    try {
        // Обновление статуса сообщений
        const [updatedCount] = await Message.update(
            { status: 'прочитано' }, // Значение для обновления
            {
                where: {
                    responseId,
                    status: 'не прочитано',
                    senderId: { [Sequelize.Op.ne]: userId } // senderId должен быть отличным от userId
                }
            }
        );

        if (updatedCount === 0) {
            return res.status(200).json({ message: 'No unread messages found for the provided responseId and senderId' });
        }

        res.status(200).json({
            message: 'Messages marked as read',
            updatedCount
        });
    } catch (error) {
        console.error('Ошибка при обновлении статуса сообщений', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createInviteEmployer,
    getResponsesAndMessagesForEmployer,
    getMessagesForResponse,
    createMessage,
    getMessagesForResponseStudent,
    getResponsesAndMessagesForStudent,
    markMessagesAsRead,
    createResponseStudent,
    createMessageEmployer
};
