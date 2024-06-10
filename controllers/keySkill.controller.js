const db = require('../models');

const getAllKeySkills = async (req, res) => {
    try {
        const keySkills = await db.KeySkill.findAll();
        res.json({ keySkills });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllKeySkills };
