const db = require('../database/db');

function getAllDepartments(req, res) {
    db.query('SELECT * FROM departments', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
}

module.exports = {
    getAllDepartments,
};