const db = require('./../models');
const bcrypt = require('bcryptjs');
const StudentInfo = db.StudentInfo;
const EmployerInfo = db.EmployerInfo;
const Address = db.Address;
const Social = db.Social;
const Student = db.Student;
const StudentSocial = db.StudentSocial;

exports.addStudentInfo = async (req, res) => {
    try {
        const { studentId, phoneNumber, addressId, socials } = req.body;
        const studentInfo = await StudentInfo.create({ studentId, phoneNumber, addressId });

        if (socials && socials.length) {
            for (const social of socials) {
                await Social.create({ studentId, url: social });
            }
        }

        res.status(201).send({ message: 'Student info added successfully!', studentInfo });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.updateMainInfo = async (req, res) => {
    try {
        const studentId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const { name, surname } = req.body;

        if (name === '' || surname === '') {
            return res.status(400).json({ message: 'Имя и фамилия не должны быть пустыми' });
        }

        const student = await Student.findByPk(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Cтудент не найден' });
        }

        student.name = name;
        student.surname = surname;
        await student.save();

        res.status(200).json({ message: 'Основная информация обновлена', student });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.updateContactInfo = async (req, res) => {
    try {
        const studentId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const { email, phoneNumber } = req.body;

        const student = await Student.findByPk(studentId);
        const studentInfo = await StudentInfo.findOne({ where: { studentId } });

        if (!student) {
            return res.status(404).json({ message: 'Студент не найден' });
        }

        if (!studentInfo) {
            return res.status(404).json({ message: 'Информация о студенте не найдена' });
        }

        if (email === '') {
            return res.status(400).json({ message: 'Email не должен быть пустым' });
        }

        // Обновление данных
        student.email = email || student.email;
        await student.save();

        studentInfo.phoneNumber = phoneNumber;
        console.log(email)
        await studentInfo.save();

        res.status(200).json({ message: 'Контактные данные обновлены', student, studentInfo });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateAddressInfo = async (req, res) => {
    try {
        const studentId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const { country, state, city, street, houseNumber, pos } = req.body;

        const studentInfo = await StudentInfo.findOne({ where: { studentId } });

        if (!studentInfo) {
            return res.status(404).json({ message: 'Информация о студенте не найдена' });
        }

        if (!country && !state && !city && !street && !houseNumber) {
            // Если все поля пустые, удаляем связь с адресом, если она есть
            if (studentInfo.addressId) {
                studentInfo.addressId = null;
                await studentInfo.save();
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
        studentInfo.addressId = address.id;
        await studentInfo.save();

        res.status(200).json({ message: 'Адрес обновлён', address });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateSocials = async (req, res) => {
    try {
        const studentId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const { socials } = req.body;

        const studentInfo = await StudentInfo.findOne({ where: { studentId } });

        if (!studentInfo) {
            return res.status(404).json({ message: 'Информация о студенте не найдена' });
        }

        // Получение всех социальных сетей, связанных с данным работодателем
        const existingStudentSocials = await StudentSocial.findAll({ where: { studentInfoId: studentInfo.id } });

        // Удаление записей из EmployerSocial
        await StudentSocial.destroy({ where: { studentInfoId: studentInfo.id } });

        // Проверка и удаление ненужных записей из таблицы Social
        for (const studentSocial of existingStudentSocials) {
            const socialId = studentSocial.socialId;
            const count = await StudentSocial.count({ where: { socialId } });
            if (count === 0) {
                await Social.destroy({ where: { id: socialId } });
            }
        }

        for (const social of socials) {
            let socialEntry = await Social.findOne({ where: { type: social.type, url: social.link } });

            if (!socialEntry) {
                socialEntry = await Social.create({ type: social.type, url: social.link });
            }

            await StudentSocial.create({
                studentInfoId: studentInfo.id,
                socialId: socialEntry.id
            });
        }

        res.status(200).json({ message: 'Социальные сети обновлены' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.changePassword = async (req, res) => {
    try {
        const studentId = req.userId; // Предполагаем, что authMiddleware добавляет userId в req
        const { oldPassword, newPassword } = req.body;

        const student = await Student.findByPk(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Студент не найден' });
        }

        const isMatch = await bcrypt.compare(oldPassword, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неправильный пароль' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        student.password = hashedPassword;
        await student.save();

        res.status(200).json({ message: 'Пароль успешно обновлен' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};