module.exports = (sequelize, DataTypes) => {
    const EmploymentType = sequelize.define('EmploymentType', {
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
    return EmploymentType;
};
