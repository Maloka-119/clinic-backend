const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');

router.post('/login', controller.login);
router.post('/change-password', auth, controller.changePassword);

module.exports = router;