const router = require('express').Router();
const controller = require('../controllers/Visit.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.post('/', auth, role('OWNER', 'EMPLOYEE'), controller.createVisit);

module.exports = router;