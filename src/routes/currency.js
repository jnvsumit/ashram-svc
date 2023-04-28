const router = require('express').Router();
const { currency } = require('../controllers');

router.get('/', currency.getAcceptedCurrencies);

module.exports = router;