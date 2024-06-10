const db = require('../models');

const getAllLanguages = async (req, res) => {
    try {
        const languages = await db.Language.findAll({
            attributes: ['name'],
            group: ['name']
        });
        res.json({ languages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllLanguages };
