const db = require('../models');
const Student = db.Student;
const Employer = db.Employer;
const StudentVacancy = db.StudentVacancy;
const EmployerCV = db.EmployerCV;
const Vacancy = db.Vacancy;
const CV = db.CV;

const toggleVacancyForStudent = async (req, res) => {
    const studentId = req.userId;
    const { vacancyId } = req.body;

    try {
        const student = await Student.findByPk(studentId);
        const vacancy = await Vacancy.findByPk(vacancyId);


        if (!student || !vacancy) {
            return res.status(404).json({ error: 'Student or Vacancy not found' });
        }

        const all = await StudentVacancy.findAll();
        console.log(all)

        const existingLike = await StudentVacancy.findOne({
            where: {
                studentId: studentId,
                vacancyId: vacancyId
            }
        })

        if (existingLike) {
            await existingLike.destroy();
            res.status(200).json({ message: 'Vacancy removed from student successfully' });
        } else {
            await StudentVacancy.create({
                studentId, vacancyId
            })
            res.status(200).json({ message: 'Vacancy added to student successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while toggling the vacancy for the student' });
    }
};

const toggleCVForEmployer = async (req, res) => {
    const employerId = req.userId;
    const { cvId } = req.body;

    try {
        const employer = await Employer.findByPk(employerId);
        const cv = await CV.findByPk(cvId);

        if (!employer || !cv) {
            return res.status(404).json({ error: 'Employer or CV not found' });
        }

        const existingLike = await EmployerCV.findOne({
            where: {
                employerId, cvId
            }
        })

        if (existingLike) {
            await existingLike.destroy();
            res.status(200).json({ message: 'CV removed from employer successfully' });
        } else {
            await EmployerCV.create({
                employerId, cvId
            })
            res.status(200).json({ message: 'CV added to employer successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while toggling the CV for the employer' });
    }
};

const getAllLikedVacancies = async (req, res) => {
    const studentId = req.userId;

    try {
        const student = await Student.findByPk(studentId);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const allLikes = await student.getLikedVacansies({
            include: [
                { model: db.Salary, as: 'salary' },
            ]
        });

        const likedVacancies = allLikes.map(vacancy => {
            const isLiked = true;

            return {
                ...vacancy.toJSON(),
                isLiked: isLiked,
            };
        });

        res.status(200).json({ data: likedVacancies });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while finding vacancy for the student' });
    }
};

const getAllLikedCvs = async (req, res) => {
    const employerId = req.userId;

    try {
        const employer = await Employer.findByPk(employerId);

        if (!Employer) {
            return res.status(404).json({ error: 'Employer not found' });
        }


        const allLikes = await employer.getLikedCvies({
            include: [
                { model: db.Salary, as: 'salary' },
            ]
        });

        const likedCvs = allLikes.map(cv => {
            const isLiked = true;

            return {
                ...cv.toJSON(),
                isLiked: isLiked,
            };
        });

        res.status(200).json({ data: likedCvs });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while finding CVs for the employer' });
    }
};


module.exports = {
    toggleVacancyForStudent,
    toggleCVForEmployer,
    getAllLikedVacancies,
    getAllLikedCvs
};