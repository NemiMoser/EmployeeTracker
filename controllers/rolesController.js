const db = require('../database/db');

function getAllRoles(req, res) {
    db.query('SELECT * FROM roles', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
}

module.exports = {
    getAllRoles,
};