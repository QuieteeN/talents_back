module.exports = (sequelize, DataTypes) => {
    const Response = sequelize.define('Response', {
        vacancyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Vacancies',
                key: 'id'
            }
        },
        cvId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'CVs',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM,
            values: ['не посмотрено', 'отклонено', 'приглашение'],
            allowNull: false,
            defaultValue: 'не посмотрено'
        }
    });

    return Response;
};
