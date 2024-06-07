module.exports = (sequelize, DataTypes) => {
    const Vacancy = sequelize.define('Vacancy', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        specialization: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        experienceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Experiences',
                key: 'id',
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isVisibleContacts: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        employment_typeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'EmploymentTypes',
                key: 'id',
            },
        },
        scheduleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Schedules',
                key: 'id',
            },
        },
        salaryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Salaries',
                key: 'id',
            },
        },
        addressId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Addresses',
                key: 'id',
            },
        },
        employerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Employers',
                key: 'id',
            },
        },
    });

    return Vacancy;
};
