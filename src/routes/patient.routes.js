const router = require('express').Router();
const controller = require('../controllers/patient.controller.js');
const auth = require('../middleware/auth.middleware.js');
const role = require('../middleware/role.middleware.js');

router.post('/', auth, role('OWNER', 'EMPLOYEE'), controller.createPatient);

module.exports = router;