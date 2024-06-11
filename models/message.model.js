module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        responseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Responses',
                key: 'id'
            }
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            values: ['прочитано', 'не прочитано'],
            allowNull: false,
            defaultValue: 'не прочитано'
        }
    });

    return Message;
};
