module.exports = (sequelize, DataTypes) => {
    const StudentVacancy = sequelize.define('StudentVacancy', {
        StudentId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Students',
                key: 'id',
            },
        },
        VacancyId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Vacancies',
                key: 'id',
            },
        },
    });

    return StudentVacancy;
};
