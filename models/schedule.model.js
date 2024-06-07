module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('Schedule', {
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
    return Schedule;
};
