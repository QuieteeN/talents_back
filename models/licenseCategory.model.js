module.exports = (sequelize, DataTypes) => {
    const LicenseCategory = sequelize.define('LicenseCategory', {
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
    return LicenseCategory;
};
