const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const { page } = require('../controllers');

router.post('/:bookId', auth, page.postPage);
router.patch('/:pageId', auth, page.updatePage);
router.get('/page-id/:pageId', page.getPage);
router.get('/book-id/:bookId', page.getPages);
router.delete('/:pageId', auth, page.deletePage);

module.exports = router;