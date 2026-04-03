const router = require('express').Router();
const controller = require('../controllers/Patient.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.post('/', auth, role('OWNER', 'EMPLOYEE'), controller.createPatient);

module.exports = router;