module.exports = (sequelize, DataTypes) => {
    const Language = sequelize.define('Language', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        level: {
            type: DataTypes.ENUM,
            values: [
                'beginner_a1',
                'beginner_a2',
                'intermediate_b1',
                'intermediate_b2',
                'advanced',
                'native'
            ],
            allowNull: false,
        },
    });
    return Language;
};
