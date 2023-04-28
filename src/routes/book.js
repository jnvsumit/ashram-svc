const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const { book } = require('../controllers');
const uploadImage = require('../middleware/uploadImage');

router.post('/', auth, uploadImage, book.postBook);

router.patch('/:bookId', auth, uploadImage, [
    body('title')
      .optional()
      .isString()
      .withMessage('Title should be a string'),
    body('authors')
      .optional()
      .isArray()
      .withMessage('Authors should be an array'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description should be a string'),
  ], book.updateBook);
  
  router.delete('/:bookId', auth, book.deleteBook);
  router.get('/', book.getBooks);
  router.get('/:bookId', book.getBook);

module.exports = router;