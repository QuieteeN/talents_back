module.exports = (sequelize, DataTypes) => {
    const EmployerSocial = sequelize.define('EmployerSocial', {
        employerInfoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'EmployerInfo',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        socialId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Social',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    });
    return EmployerSocial;
}