const { User } = require("../persistence/models");

const getUser = async (req, res) => {
    const { userId } = req.user;

    const user = await User.findOne({ userId });

    if(!user) {
        return res.status(404).json({
            status: 404,
            message: "User not found",
            messageCode: "NOT_FOUND",
            data: null,
            success: false
        });
    }

    return res.status(200).json({
        status: 200,
        message: "Success",
        messageCode: "SUCCESS",
        data: {
            userId: user.userId,
            fullname: user.fullname,
            username: user.username,
            email: user.email
        },
        success: true
    });
}

module.exports = {
    getUser
};