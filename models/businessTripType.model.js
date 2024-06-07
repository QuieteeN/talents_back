module.exports = (sequelize, DataTypes) => {
    const BusinessTripType = sequelize.define('BusinessTripType', {
        code: {
            type: DataTypes.ENUM,
            values: ['never', 'ready', 'sometimes'],
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
    return BusinessTripType;
};
