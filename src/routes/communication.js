const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { communication } = require('../controllers');

router.post('/', [
    body('name')
        .exists(
            { checkNull: true, checkFalsy: true },
        )
        .isString()
        .withMessage('Name should be a string'),
    body('email')
        .exists(
            { checkNull: true, checkFalsy: true },
        )
        .isEmail()
        .withMessage('Email should be a valid email'),
    body('message')
        .exists(
            { checkNull: true, checkFalsy: true },
        )
        .isString()
        .withMessage('Message should be a string')
], communication.sendCommunication);

module.exports = router;