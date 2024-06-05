module.exports = (sequelize, DataTypes) => {
    const StudentInfo = sequelize.define('StudentInfo', {
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        photoUrl: {
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
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Students',
                key: 'id',
            },
        },
    });
    return StudentInfo;
};
