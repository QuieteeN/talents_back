const db = require('./index');

const initializeLicenseCategories = async () => {
    const categories = [
        { code: 'A', description: 'Motorcycles' },
        { code: 'B', description: 'Cars' },
        { code: 'C', description: 'Trucks' },
        { code: 'D', description: 'Buses' },
        { code: 'E', description: 'Trailer' },
        { code: 'BE', description: 'Cars with trailers' },
        { code: 'CE', description: 'Trucks with trailers' },
        { code: 'DE', description: 'Buses with trailers' },
        { code: 'TM', description: 'Trams' },
        { code: 'TB', description: 'Trolleybuses' },
    ];

    for (const category of categories) {
        const [cat, created] = await db.LicenseCategory.findOrCreate({
            where: { code: category.code },
            defaults: category,
        });

        if (created) {
            console.log(`Category ${category.code} created.`);
        }
    }
};

const initializeExperience = async () => {
    const experiences = [
        { code: 'havent', description: 'No experience' },
        { code: 'lower_one', description: 'To 1 years' },
        { code: 'one_three', description: '1-3 years' },
        { code: 'three_six', description: '3-6 years' },
        { code: 'upper_six', description: 'More than 6 years' },
    ];

    for (const experience of experiences) {
        const [exp, created] = await db.Experience.findOrCreate({
            where: { code: experience.code },
            defaults: experience,
        });

        if (created) {
            console.log(`Experience ${experience.code} created.`);
        }
    }
};

const initializeEmploymentTypes = async () => {
    const employmentTypes = [
        { code: 'full_employment', description: 'Full employment' },
        { code: 'part_time_employment', description: 'Part-time employment' },
        { code: 'project_work', description: 'Project work' },
        { code: 'internship', description: 'Internship' },
        { code: 'no', description: 'No employment' },
    ];

    for (const employmentType of employmentTypes) {
        const [type, created] = await db.EmploymentType.findOrCreate({
            where: { code: employmentType.code },
            defaults: employmentType,
        });

        if (created) {
            console.log(`Employment Type ${employmentType.code} created.`);
        }
    }
};

const initializeSchedules = async () => {
    const schedules = [
        { code: 'full_day', description: 'Full day' },
        { code: 'shift_work', description: 'Shift work' },
        { code: 'flexible_schedule', description: 'Flexible schedule' },
        { code: 'distant_work', description: 'Distant work' },
        { code: 'no', description: 'No schedule' },
    ];

    for (const schedule of schedules) {
        const [sch, created] = await db.Schedule.findOrCreate({
            where: { code: schedule.code },
            defaults: schedule,
        });

        if (created) {
            console.log(`Schedule ${schedule.code} created.`);
        }
    }
};

const initializeMovingTypes = async () => {
    const movingTypes = [
        { code: 'not_ready', description: 'Not ready to move' },
        { code: 'ready', description: 'Ready to move' },
        { code: 'want', description: 'Wants to move' },
    ];

    for (const movingType of movingTypes) {
        const [type, created] = await db.MovingType.findOrCreate({
            where: { code: movingType.code },
            defaults: movingType,
        });

        if (created) {
            console.log(`Moving Type ${movingType.code} created.`);
        }
    }
};

const initializeBusinessTripTypes = async () => {
    const businessTripTypes = [
        { code: 'never', description: 'Never ready for business trips' },
        { code: 'ready', description: 'Ready for business trips' },
        { code: 'sometimes', description: 'Sometimes ready for business trips' },
    ];

    for (const businessTripType of businessTripTypes) {
        const [type, created] = await db.BusinessTripType.findOrCreate({
            where: { code: businessTripType.code },
            defaults: businessTripType,
        });

        if (created) {
            console.log(`Business Trip Type ${businessTripType.code} created.`);
        }
    }
};

const initialize = async () => {
    await initializeLicenseCategories();
    await initializeExperience();
    await initializeEmploymentTypes();
    await initializeSchedules();
    await initializeMovingTypes();
    await initializeBusinessTripTypes();
};

module.exports = { initialize };
