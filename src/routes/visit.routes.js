const router = require('express').Router();
const controller = require('../controllers/Visit.controller.js');
const auth = require('../middleware/auth.middleware.js');
const role = require('../middleware/role.middleware.js');

router.post('/', auth, role('OWNER', 'EMPLOYEE'), controller.createVisit);

module.exports = router;