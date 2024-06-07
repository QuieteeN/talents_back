module.exports = (sequelize, DataTypes) => {
    const Salary = sequelize.define('Salary', {
        salaryFrom: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        salaryTo: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        type: {
            type: DataTypes.ENUM,
            values: ['beforeTaxes', 'afterTaxes'],
            allowNull: false,
        },
    });
    return Salary;
};
