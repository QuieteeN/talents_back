module.exports = (sequelize, DataTypes) => {
    const KeySkill = sequelize.define('KeySkill', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return KeySkill;
};
