const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Address = require('./address.model')(sequelize, DataTypes);
db.Social = require('./social.model')(sequelize, DataTypes);
db.Student = require('./student.model')(sequelize, DataTypes);
db.StudentInfo = require('./studentInfo.model')(sequelize, DataTypes);
db.Employer = require('./employer.model')(sequelize, DataTypes);
db.EmployerInfo = require('./employerInfo.model')(sequelize, DataTypes);
db.StudentSocial = require('./studentSocial.model')(sequelize, DataTypes);
db.EmployerSocial = require('./employerSocial.model')(sequelize, DataTypes);

// Define associations
db.Student.hasOne(db.StudentInfo, { as: 'info', foreignKey: 'studentId' });
db.StudentInfo.belongsTo(db.Student, { foreignKey: 'studentId' });

db.Employer.hasOne(db.EmployerInfo, { as: 'info', foreignKey: 'employerId' });
db.EmployerInfo.belongsTo(db.Employer, { foreignKey: 'employerId' });

db.Address.hasMany(db.StudentInfo, { as: 'studentInfos', foreignKey: 'addressId' });
db.StudentInfo.belongsTo(db.Address, { as: 'address', foreignKey: 'addressId' });

db.Address.hasMany(db.EmployerInfo, { as: 'employerInfos', foreignKey: 'addressId' });
db.EmployerInfo.belongsTo(db.Address, { as: 'address', foreignKey: 'addressId' });

db.StudentInfo.belongsToMany(db.Social, { through: db.StudentSocial, as: 'socials', foreignKey: 'studentInfoId' });
db.Social.belongsToMany(db.StudentInfo, { through: db.StudentSocial, as: 'studentInfos', foreignKey: 'socialId' });

db.EmployerInfo.belongsToMany(db.Social, { through: db.EmployerSocial, as: 'socials', foreignKey: 'employerInfoId' });
db.Social.belongsToMany(db.EmployerInfo, { through: db.EmployerSocial, as: 'employerInfos', foreignKey: 'socialId' });

module.exports = db;
