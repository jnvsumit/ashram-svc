const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { user } = require('../controllers');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get user
 *     description: Returns a user
 *     responses:
 *       200:
 *         description: user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, user.getUser);

module.exports = router;