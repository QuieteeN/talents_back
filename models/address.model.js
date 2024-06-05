module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
        houseNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        street: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        pos: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return Address;
};
