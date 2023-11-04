const db = require('../database/db');

function getAllEmployees(req, res) {
    db.query('SELECT * FROM employees', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
}

module.exports = {
    getAllEmployees,
};
