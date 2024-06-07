module.exports = (sequelize, DataTypes) => {
    const Institute = sequelize.define('Institute', {
        facultyName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        specialization: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        educationLevel: {
            type: DataTypes.ENUM,
            values: ['secondary', 'secondary_high', 'incomplete_high', 'high', 'bachelor'],
            allowNull: false,
        },
        instituteName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Institute;
};
