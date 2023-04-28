const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    thumbnail: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    url: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;