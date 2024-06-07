module.exports = (sequelize, DataTypes) => {
    const Experience = sequelize.define('Experience', {
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
    return Experience;
};