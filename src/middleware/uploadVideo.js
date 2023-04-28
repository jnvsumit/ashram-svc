const multer = require('multer');

const uploadVideo = multer({
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
        files: 1
    },
    fileFilter: (req, file, cb) => {
        if (!file || file.mimetype === 'video/mp4') {
            cb(null, true);
        } else {
            cb(new Error('Only MP4 videos are allowed'));
        }
    },
}).single('video');

module.exports = uploadVideo;