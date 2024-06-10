const { Op } = require('sequelize');
const db = require('../models');

const searchVacancies = async (req, res) => {
    const { name, city, specialization, salaryFrom, employmentType, schedule, keySkills, licenses, languages, orderBy } = req.query;

    let whereClause = {};

    if (name) {
        whereClause.name = { [Op.like]: `%${name}%` };
    }
    if (city) {
        whereClause.city = { [Op.like]: `%${city}%` };
    }
    if (specialization) {
        whereClause.specialization = { [Op.like]: `%${specialization}%` };
    }

    if (salaryFrom) {
        whereClause[Op.or] = [
            { '$salary.salaryFrom$': { [Op.gte]: salaryFrom } },
            { '$salary.salaryTo$': { [Op.gte]: salaryFrom } }
        ];
    }

    let includeClause = [
        { model: db.Salary, as: 'salary' },
        { model: db.EmploymentType, as: 'employmentType' },
        { model: db.Schedule, as: 'schedule' },
        {
            model: db.KeySkill,
            as: 'keySkills',
            through: { attributes: [] }
        },
        {
            model: db.LicenseCategory,
            as: 'licenseCategories',
            through: { attributes: [] }
        },
        {
            model: db.Language,
            as: 'languages',
            through: { attributes: [] }
        }
    ];

    if (employmentType && employmentType !== 'no') {
        includeClause[1].where = { code: employmentType };
    }
    if (schedule && schedule !== 'no') {
        includeClause[2].where = { code: schedule };
    }
    if (keySkills) {
        includeClause[3].where = { name: { [Op.in]: keySkills.split(',') } };
    }
    if (licenses) {
        includeClause[4].where = { name: { [Op.in]: licenses.split(',') } };
    }
    if (languages) {
        includeClause[5].where = { name: { [Op.in]: languages.split(',') } };
    }

    let orderClause = [];
    if (orderBy) {
        if (orderBy === 'date') {
            orderClause.push(['updatedAt', 'DESC']);
        } else if (orderBy === 'salaryAsc') {
            orderClause.push([{ model: db.Salary, as: 'salary' }, 'salaryFrom', 'ASC']);
        } else if (orderBy === 'salaryDesc') {
            orderClause.push([{ model: db.Salary, as: 'salary' }, 'salaryFrom', 'DESC']);
        }
    }

    try {
        const vacancies = await db.Vacancy.findAll({
            where: whereClause,
            include: includeClause,
            order: orderClause
        });
        res.json({ vacancies });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const searchCVs = async (req, res) => {
    const {
        description, city, specialization, employmentType, schedule, keySkills, moving, businessTrip, experience, licenses, languages, orderBy
    } = req.query;

    let whereClause = {};

    if (description) {
        whereClause.description = { [Op.like]: `%${description}%` };
    }

    if (specialization) {
        whereClause.name = { [Op.like]: `%${specialization}%` };
    }
    if (city) {
        whereClause.city = { [Op.like]: `%${city}%` };
    }

    let includeClause = [
        { model: db.Experience, as: 'experience' },
        { model: db.MovingType, as: 'movingType' },
        { model: db.BusinessTripType, as: 'businessTripType' },
        { model: db.Salary, as: 'salary' },
        {
            model: db.EmploymentType,
            as: 'employmentTypes',
            through: { attributes: [] }
        },
        {
            model: db.Schedule,
            as: 'schedules',
            through: { attributes: [] }
        },
        {
            model: db.KeySkill,
            as: 'keySkills',
            through: { attributes: [] }
        },
        {
            model: db.LicenseCategory,
            as: 'licenseCategories',
            through: { attributes: [] }
        },
        {
            model: db.Language,
            as: 'languages',
            through: { attributes: [] }
        }
    ];

    if (employmentType) {
        includeClause[4].where = { code: { [Op.in]: employmentType.split(',') } };
    }
    if (schedule) {
        includeClause[5].where = { code: { [Op.in]: schedule.split(',') } };
    }
    if (keySkills) {
        includeClause[6].where = { name: { [Op.in]: keySkills.split(',') } };
    }
    if (moving) {
        includeClause[1].where = { code: { [Op.in]: moving.split(',') } };
    }
    if (businessTrip) {
        includeClause[2].where = { code: { [Op.in]: businessTrip.split(',') } };
    }
    if (experience) {
        includeClause[0].where = { code: { [Op.in]: experience.split(',') } };
    }
    if (licenses) {
        includeClause[7].where = { name: { [Op.in]: licenses.split(',') } };
    }
    if (languages) {
        includeClause[8].where = { name: { [Op.in]: languages.split(',') } };
    }

    let orderClause = [];
    if (orderBy) {
        if (orderBy === 'date') {
            orderClause.push(['updatedAt', 'DESC']);
        } else if (orderBy === 'salaryAsc') {
            orderClause.push([{ model: db.Salary, as: 'salary' }, 'salaryFrom', 'ASC']);
        } else if (orderBy === 'salaryDesc') {
            orderClause.push([{ model: db.Salary, as: 'salary' }, 'salaryFrom', 'DESC']);
        }
    }

    try {
        const cvs = await db.CV.findAll({
            where: whereClause,
            include: includeClause,
            order: orderClause
        });
        res.json({ cvs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = { searchVacancies, searchCVs };
