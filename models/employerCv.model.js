module.exports = (sequelize, DataTypes) => {
    const EmployerCV = sequelize.define('EmployerCV', {
        EmployerId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Employers',
                key: 'id',
            },
        },
        CVId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'CVs',
                key: 'id',
            },
        },
    });

    return EmployerCV;
};
