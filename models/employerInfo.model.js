module.exports = (sequelize, DataTypes) => {
    const EmployerInfo = sequelize.define('EmployerInfo', {
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        employerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Employers',
                key: 'id',
            },
        },
        companyName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        companyDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        logoUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        addressId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Addresses',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    });
    return EmployerInfo;
};
