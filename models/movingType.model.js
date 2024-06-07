module.exports = (sequelize, DataTypes) => {
    const MovingType = sequelize.define('MovingType', {
        code: {
            type: DataTypes.ENUM,
            values: ['not_ready', 'ready', 'want'],
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
    return MovingType;
};
