const express = require('express');
const router = express.Router();
const departmmentsController = require('../controllers/departmentsController');

router.get('/', departmmentsController.getAllDepartments);

module.exports = router;
