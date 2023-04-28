const router = require('express').Router();

const { donor } = require('../controllers');

router.post('/', donor.postDonor);
router.get('/:donorId', donor.getDonor);

module.exports = router;