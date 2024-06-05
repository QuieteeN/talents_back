module.exports = (sequelize, DataTypes) => {
    const StudentSocial = sequelize.define('StudentSocial', {
        studentInfoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'StudentInfos',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        socialId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Socials',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    });
    return StudentSocial;
}