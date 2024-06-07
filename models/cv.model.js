module.exports = (sequelize, DataTypes) => {
    const CV = sequelize.define('CV', {
        name: {
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
        movingTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'MovingTypes',
                key: 'id',
            },
        },
        businessTripTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'BusinessTripTypes',
                key: 'id',
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        salaryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Salaries',
                key: 'id',
            },
        },
        instituteId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Addresses',
                key: 'id',
            },
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Students',
                key: 'id',
            },
        },
    });
    return CV;
};
