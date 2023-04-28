const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const { video } = require('../controllers');
const uploadVideo = require('../middleware/uploadVideo');

router.post('/', auth, uploadVideo, video.postVideo);

router.patch('/:videoId', auth, uploadVideo, [
    body('title')
        .optional()
        .isString()
        .withMessage('Title should be a string'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description should be a string'),
], video.updateVideo);

router.delete('/:videoId', auth, video.deleteVideo);
router.get('/', video.getVideos);
router.get('/:videoId', video.getVideo);
router.get('/youtube', video.getYoutubeVideos);

module.exports = router;