// controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const Student = db.Student;
const Employer = db.Employer;
const StudentInfo = db.StudentInfo;
const EmployerInfo = db.EmployerInfo;

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 86400 // 24 hours
    });

};

exports.registerStudent = async (req, res) => {
    try {
        const { name, surname, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = await Student.create({ name, surname, email, password: hashedPassword });
        const studentInfo = await StudentInfo.create({ studentId: student.id });
        res.status(201).send({
            message: 'Вы успешно зарегестрировались!',
            status: 201
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message,
            status: 500,
        });
    }
};

exports.registerEmployer = async (req, res) => {
    try {
        const { name, surname, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const employer = await Employer.create({ name, surname, email, password: hashedPassword });
        const employerInfo = await EmployerInfo.create({ employerId: employer.id });
        res.status(201).send({
            message: 'Вы успешно зарегистрировались!',
            status: 201,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            status: 500,
        });
    }
};

exports.loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ where: { email } });
        if (!student) {
            return res.status(404).send({
                message: 'Student Not found.',
                status: 404,
            });
        }
        const passwordIsValid = await bcrypt.compare(password, student.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                message: 'Invalid Password!',
                status: 401,
            });
        }
        const token = generateToken(student.id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Использование secure cookies в production
            sameSite: 'Strict', // Предотвращает отправку cookie при кросс-сайтовых запросах
            maxAge: 86400000
        });
        res.status(200).send({
            message: 'Вы успешно вошли',
            status: 200,
            accessToken: token
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            status: 500,
        });
    }
};

exports.loginEmployer = async (req, res) => {
    try {
        const { email, password } = req.body;
        const employer = await Employer.findOne({ where: { email } });
        if (!employer) {
            return res.status(404).send({
                message: 'Employer Not found.',
                status: 404,
            });
        }
        const passwordIsValid = await bcrypt.compare(password, employer.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                message: 'Invalid Password!',
                status: 401,
            });
        }
        const token = generateToken(employer.id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Использование secure cookies в production
            sameSite: 'Strict', // Предотвращает отправку cookie при кросс-сайтовых запросах
            maxAge: 86400000
        });
        res.status(200).send({
            message: 'Вы успешно вошли',
            status: 200,
            accessToken: token
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            status: 500,
        });
    }
};

exports.logout = (req, res) => {
    res.cookie('token', '', { maxAge: 0, httpOnly: true });
    res.status(200).send({
        message: 'Вы вышли',
        status: 200
    });
};
