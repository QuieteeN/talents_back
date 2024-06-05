module.exports = (sequelize, DataTypes) => {
    const Social = sequelize.define('Social', {
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Social;
};
