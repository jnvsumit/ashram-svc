const router = require('express').Router();
const { order } = require('../controllers');

router.post('/create', order.createOrder);
router.post('/webhook', order.razorpayWebhook);
router.post('/verify', order.verifyPayment);

module.exports = router;