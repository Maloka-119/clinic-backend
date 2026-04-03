const router = require('express').Router();
const controller = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.post('/clinic', auth, role('ADMIN'), controller.createClinic);
router.post('/activate-owner', auth, role('ADMIN'), controller.activateOwner);
router.put('/deactivate/:clinicId', auth, role('ADMIN'), controller.deactivateClinic);

module.exports = router;