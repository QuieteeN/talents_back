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
db.LicenseCategory = require('./licenseCategory.model')(sequelize, DataTypes);
db.Experience = require('./experience.model')(sequelize, DataTypes);
db.Salary = require('./salary.model')(sequelize, DataTypes);
db.KeySkill = require('./keySkill.model')(sequelize, DataTypes);
db.EmploymentType = require('./employmentType.model')(sequelize, DataTypes);
db.Schedule = require('./schedule.model')(sequelize, DataTypes);
db.Language = require('./language.model')(sequelize, DataTypes);
db.Vacancy = require('./vacancy.model')(sequelize, DataTypes);
db.Institute = require('./institute.model')(sequelize, DataTypes);
db.MovingType = require('./movingType.model')(sequelize, DataTypes);
db.BusinessTripType = require('./businessTripType.model')(sequelize, DataTypes);
db.CV = require('./cv.model')(sequelize, DataTypes);
db.Response = require('./response.model')(sequelize, DataTypes);

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

// Vacancy
db.Vacancy.belongsTo(db.Employer, { foreignKey: 'employerId', as: 'employer' });
db.Employer.hasMany(db.Vacancy, { foreignKey: 'employerId', as: 'vacancies' });

db.Vacancy.belongsTo(db.Experience, { foreignKey: 'experienceId', as: 'experience' });
db.Experience.hasMany(db.Vacancy, { foreignKey: 'experienceId', as: 'vacancies' });

db.Vacancy.belongsTo(db.EmploymentType, { foreignKey: 'employment_typeId', as: 'employmentType' });
db.EmploymentType.hasMany(db.Vacancy, { foreignKey: 'employment_typeId', as: 'vacancies' });

db.Vacancy.belongsTo(db.Schedule, { foreignKey: 'scheduleId', as: 'schedule' });
db.Schedule.hasMany(db.Vacancy, { foreignKey: 'scheduleId', as: 'vacancies' });

db.Vacancy.belongsTo(db.Salary, { foreignKey: 'salaryId', as: 'salary' });
db.Salary.hasMany(db.Vacancy, { foreignKey: 'salaryId', as: 'vacancies' });

db.Vacancy.belongsTo(db.Address, { foreignKey: 'addressId', as: 'address' });
db.Address.hasMany(db.Vacancy, { foreignKey: 'addressId', as: 'vacancies' });

db.Vacancy.belongsToMany(db.KeySkill, { through: 'VacancyKeySkills', as: 'keySkills', foreignKey: 'vacancyId' });
db.KeySkill.belongsToMany(db.Vacancy, { through: 'VacancyKeySkills', as: 'vacancies', foreignKey: 'keySkillId' });

db.Vacancy.belongsToMany(db.Language, { through: 'VacancyLanguages', as: 'languages', foreignKey: 'vacancyId' });
db.Language.belongsToMany(db.Vacancy, { through: 'VacancyLanguages', as: 'vacancies', foreignKey: 'languageId' });

db.Vacancy.belongsToMany(db.LicenseCategory, { through: 'VacancyLicenseCategories', as: 'licenseCategories', foreignKey: 'vacancyId' });
db.LicenseCategory.belongsToMany(db.Vacancy, { through: 'VacancyLicenseCategories', as: 'vacancies', foreignKey: 'licenseCategoryId' });

// CV
db.CV.belongsTo(db.MovingType, { foreignKey: 'movingTypeId', as: 'movingType' });
db.MovingType.hasMany(db.CV, { foreignKey: 'movingTypeId', as: 'cvs' });

db.CV.belongsTo(db.Experience, { foreignKey: 'experienceId', as: 'experience' });
db.Experience.hasMany(db.CV, { foreignKey: 'experienceId', as: 'cvs' });

db.CV.belongsTo(db.BusinessTripType, { foreignKey: 'businessTripTypeId', as: 'businessTripType' });
db.BusinessTripType.hasMany(db.CV, { foreignKey: 'businessTripTypeId', as: 'cvs' });

db.CV.belongsTo(db.Salary, { foreignKey: 'salaryId', as: 'salary' });
db.Salary.hasMany(db.CV, { foreignKey: 'salaryId', as: 'cvs' });

db.CV.belongsTo(db.Institute, { foreignKey: 'instituteId', as: 'institute' });
db.Institute.hasMany(db.CV, { foreignKey: 'instituteId', as: 'cvs' });

db.CV.belongsTo(db.Student, { foreignKey: 'studentId', as: 'student' });
db.Student.hasMany(db.CV, { foreignKey: 'studentId', as: 'cvs' });

db.CV.belongsToMany(db.EmploymentType, { through: 'CVEmploymentTypes', as: 'employmentTypes', foreignKey: 'cvId' });
db.EmploymentType.belongsToMany(db.CV, { through: 'CVEmploymentTypes', as: 'cvs', foreignKey: 'employmentTypeId' });

db.CV.belongsToMany(db.Schedule, { through: 'CVSchedules', as: 'schedules', foreignKey: 'cvId' });
db.Schedule.belongsToMany(db.CV, { through: 'CVSchedules', as: 'cvs', foreignKey: 'scheduleId' });

db.CV.belongsToMany(db.KeySkill, { through: 'CVKeySkills', as: 'keySkills', foreignKey: 'cvId' });
db.KeySkill.belongsToMany(db.CV, { through: 'CVKeySkills', as: 'cvs', foreignKey: 'keySkillId' });

db.CV.belongsToMany(db.Language, { through: 'CVLanguages', as: 'languages', foreignKey: 'cvId' });
db.Language.belongsToMany(db.CV, { through: 'CVLanguages', as: 'cvs', foreignKey: 'languageId' });

db.CV.belongsToMany(db.LicenseCategory, { through: 'CVLicenseCategories', as: 'licenseCategories', foreignKey: 'cvId' });
db.LicenseCategory.belongsToMany(db.CV, { through: 'CVLicenseCategories', as: 'cvs', foreignKey: 'licenseCategoryId' });

// Response
db.Response.belongsTo(db.Vacancy, { foreignKey: 'vacancyId', as: 'vacancy' });
db.Vacancy.hasMany(db.Response, { foreignKey: 'vacancyId', as: 'responses' });

db.Response.belongsTo(db.CV, { foreignKey: 'cvId', as: 'cv' });
db.CV.hasMany(db.Response, { foreignKey: 'cvId', as: 'responses' });


db.sequelize.sync().then(async () => {
    console.log('Database synchronized');

    // Initialize categories and experiences
    const { initialize } = require('./initializers');
    await initialize();
});

module.exports = db;
