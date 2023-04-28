const { Video } = require('../persistence/models');
const { v4: uuidv4 } = require('uuid');
const { uploadVideoToS3 } = require("../libs/S3");

const getVideos = async (req, res) => {
    try {
        const {pageNumber, pageSize} = req.query;
        const pn = pageNumber ? parseInt(pageNumber) : 1;
        const ps = pageSize ? parseInt(pageSize) : 10;
        const skip = (pn - 1) * ps;
        const limit = ps > 20 ? 20 : ps;

        const videos = await Video.find().skip(skip).limit(limit);

        return res.status(200).json({
            message: 'Videos fetched',
            messageCode: 'SUCCESS',
            status: 200,
            data: videos.map(video => ({
                videoId: video.videoId,
                title: video.title,
                description: video.description,
                thumbnail: video.thumbnail,
                url: video.url,
                userId: video.userId
            })),
            success: true
        });
    } catch (error) {
        console.log("Error getting videos:", error);
        return res.status(500).json({
            message: 'Internal server error',
            messageCode: 'InternalServerError',
            status: 500,
            success: false,
        });
    }
}

const getVideo = async (req, res) => {
    const { videoId } = req.params;

    try {
        const video = await Video.findOne({ videoId });

        if (!video) {
            return res.status(404).json({
                message: 'Video not found',
                messageCode: 'NotFoundError',
                status: 404,
                success: false
            });
        }

        return res.status(200).json({
            message: 'Video fetched',
            messageCode: 'SUCCESS',
            status: 200,
            data: {
                videoId: video.videoId,
                title: video.title,
                description: video.description,
                thumbnail: video.thumbnail,
                url: video.url,
                userId: video.userId
            },
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            messageCode: 'InternalServerError',
            status: 500,
            success: false,
        });
    }
}

const postVideo = async (req, res) => {
    const { title, description } = req.body;
    const { userId } = req.user;

    try {
        const url = req.file ? await uploadVideoToS3(req.file, uuidv4()) : null;

        const video = new Video({
            title,
            description,
            thumbnail: "https://via.placeholder.com/150",
            url,
            userId,
            videoId: uuidv4()
        });

        await video.save();

        return res.status(201).json({
            message: 'Video created',
            messageCode: 'SUCCESS',
            status: 201,
            data: {
                videoId: video.videoId,
                title: video.title,
                description: video.description,
                thumbnail: video.thumbnail,
                url: video.url,
                userId: video.userId
            },
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            messageCode: 'InternalServerError',
            status: 500,
            success: false,
        });
    }
}

const updateVideo = async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    const { userId } = req.user;

    try {
        const updateObj = {};

        if (title) {
            updateObj.title = title;
        }

        if (description) {
            updateObj.description = description;
        }

        const video = await Video.findOneAndUpdate({ videoId, userId }, updateObj, { new: true });

        if (!video) {
            return res.status(404).json({
                message: 'Video not found',
                messageCode: 'NotFoundError',
                status: 404,
                success: false
            });
        }

        return res.status(200).json({
            message: 'Video updated',
            messageCode: 'SUCCESS',
            status: 200,
            data: {
                videoId: video.videoId,
                title: video.title,
                description: video.description,
                thumbnail: video.thumbnail,
                url: video.url,
                userId: video.userId
            },
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            messageCode: 'InternalServerError',
            status: 500,
            success: false,
        });
    }
}

const deleteVideo = async (req, res) => {
    const { videoId } = req.params;
    const { userId } = req.user;

    try {
        const video = await Video.findOneAndDelete({ videoId });

        if (!video) {
            return res.status(404).json({
                message: 'Video not found',
                messageCode: 'NotFoundError',
                status: 404,
                success: false
            });
        }

        return res.status(200).json({
            message: 'Video deleted',
            messageCode: 'SUCCESS',
            status: 200,
            data: {
                videoId: video.videoId,
                title: video.title,
                description: video.description,
                thumbnail: video.thumbnail,
                url: video.url,
                userId: video.userId
            },
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            messageCode: 'InternalServerError',
            status: 500,
            success: false,
        });
    }
}

const getYoutubeVideos = async (req, res) => {
    const { q } = req.query;

    try {
        const videos = await Video.find({ title: { $regex: q, $options: 'i' } });

        return res.status(200).json({
            message: 'Videos fetched',
            messageCode: 'SUCCESS',
            status: 200,
            data: videos.map(video => ({
                videoId: video.videoId,
                title: video.title,
                description: video.description,
                thumbnail: video.thumbnail,
                url: video.url,
                userId: video.userId
            })),
            success: true
        });
    } catch (error) {
        console.log("Error getting videos:", error);
        return res.status(500).json({
            message: 'Internal server error',
            messageCode: 'InternalServerError',
            status: 500,
            success: false,
        });
    }
}

module.exports = {
    getVideos,
    getVideo,
    postVideo,
    updateVideo,
    deleteVideo,
    getYoutubeVideos
};