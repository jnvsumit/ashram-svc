const router = require('express').Router();
const { auth : authController } = require('../controllers');

router.get('/token', authController.token);
router.post('/login', authController.login);

module.exports = router;