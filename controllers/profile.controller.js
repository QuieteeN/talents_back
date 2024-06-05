const db = require('../models');
const Student = db.Student;
const Employer = db.Employer;
const StudentInfo = db.StudentInfo;
const EmployerInfo = db.EmployerInfo;
const Address = db.Address;
const Social = db.Social;

exports.getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findByPk(req.userId, {
            include: [
                {
                    model: StudentInfo,
                    as: 'info',
                    include: [
                        {
                            model: Address,
                            as: 'address',
                        },
                        {
                            model: Social,
                            as: 'socials',
                            through: {
                                attributes: [],
                            }
                        }
                    ]
                },
            ]
        });
        if (!student) {
            return res.status(404).send({
                message: 'Student Not Found.',
                status: 404
            });
        }
        res.status(200).send({
            student,
            status: 200
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message,
            status: 500
        });
    }
};

exports.getEmployerProfile = async (req, res) => {
    try {
        const employer = await Employer.findByPk(req.userId, {
            include: [
                {
                    model: EmployerInfo,
                    as: 'info',
                    include: [
                        {
                            model: Address,
                            as: 'address',
                        },
                        {
                            model: Social,
                            as: 'socials',
                            through: {
                                attributes: [],
                            }
                        }
                    ]
                }
            ]
        });
        if (!employer) {
            return res.status(404).send({
                message: 'Employer Not Found.',
                status: 404
            });
        }
        res.status(200).send({
            employer,
            status: 200
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            status: 500
        });
    }
};
