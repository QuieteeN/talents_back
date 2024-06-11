const db = require('../models');
const { Response, Message, Vacancy, CV, Student, StudentInfo } = db;

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
            ]
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
                    limit: 1
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

module.exports = {
    createInviteEmployer,
    getResponsesAndMessagesForEmployer,
    getMessagesForResponse
};
