const jwt = require('jsonwebtoken');
const User = require('../model/user');

exports.getUser = async function (req, res) {
    try {
        let users = await User.find({ online: true }).select('-password -__v').populate({ path: 'friend.friend_id', select: 'name rate -_id' }).populate({ path: 'received_friend.friend_id', select: 'name rate -_id' })

        return res.status(200).json({
            users
        })
    } catch (error) {
        res.status(404).json({
            status: 'Error',
            msg: error.message
        })
    }
}

exports.getUserName = async function (req, res) {
    try {
        let user = await User.findOne({ name: req.body.name }).select('-password -__v').populate({ path: 'friend.friend_id', select: 'name rate -_id' }).populate({ path: 'received_friend.friend_id', select: 'name rate -_id' })
        res.status(200).json({
            user: user
        })
    } catch (error) {
        res.status(404).json({
            status: 'Error',
            msg: error.message
        })
    }
}

exports.getUserId = async function (req, res) {
    try {
        let user = await User.findOne({ _id: req.body.id }).select('-password -__v').populate({ path: 'friend.friend_id', select: 'name rate -_id' }).populate({ path: 'received_friend.friend_id', select: 'name rate -_id' })
        if (!user) {
            return res.status(404).json({
                msg: "No User"
            })
        }
        return res.status(200).json({
            user: user
        })
    } catch (error) {
        return res.status(404).json({
            status: 'Error',
            msg: error.message
        })
    }
}

exports.addUser = async function (req, res) {
    try {
        let user = await User.findOne({ name: req.body.name })
        if (user) {
            return res.status(200).json({
                msg: "Username already existed"
            })
        }
        req.body.rate = 0
        req.body.win = 0
        req.body.lose = 0
        req.body.numOfSub = 0
        req.body.online = true
        req.body.inFight = false
        req.body.notification = []
        req.body.friends = []
        req.body.sent_frined = []
        req.body.sent_noti = []
        req.body.image = ''
        req.body.uuid = ''
        user = await User.create(req.body)

        const token = jwt.sign({ _id: user._id , user_name : user.name  }, process.env.TOKEN);

        res.status(200).json({
            user: user,
            token: token
        })

    } catch (error) {
        res.status(404).json({
            status: 'Error',
            msg: error.message
        })
    }
}

exports.deleteUser = async function (req, res) {
    try {
        const user = await User.findOneAndDelete({ name: req.body.name })
        if (!user) {
            return res.status(404).json({
                msg: 'This user is not Existed'
            })
        }
        return res.status(200).json({
            msg: 'User Deleted Successfully'
        });
    } catch (error) {
        res.status(404).json({
            status: 'Error',
            msg: error.message
        })
    }
}

exports.editRate = async function (req, res) {
    try {
        const user = await User.findOneAndUpdate({ name: req.body.name }, {
            $inc: {
                rate: req.body.rate
            }
        }, { new: true })
        return res.status(200).json({
            user
        });
    } catch (error) {
        return res.status(404).json({
            status: 'Error',
            msg: error.message
        })
    }

}

exports.editWin = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ name: req.body.name }, {
            $inc: {
                win: 1
            }
        }, { new: true })
        return res.status(200).json({
            new_user: user
        })
    } catch (error) {
        return res.status(404).json({
            status: 'Error',
            msg: error.message
        })
    }
}

exports.editLose = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ name: req.body.name }, {
            $inc: {
                lose: 1
            }
        }, { new: true })
        return res.status(200).json({
            new_user: user
        })
    } catch (error) {
        return res.status(404).json({
            status: 'Error',
            msg: error.message
        })
    }
}

exports.online = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ name: req.body.name }, {
            $set: {
                online: req.body.online
            }
        })
        return res.status(200).json({
            user
        })
    } catch (error) {
        return res.status(404).json({
            status: 'Error',
            msg: error.message
        })
    }
}

exports.image = async (req, res) => {
    try {
        console.log(req)
        cloudinary.uploader.upload(req.files.profile.tempFilePath, async (err, result) => {
            if (typeof (err) !== 'undefined') {
                return res.status(404).json({
                    Error: err
                })
            } else {
                await User.findOneAndUpdate({ name: req.body.name }, {
                    $set: {
                        profile_pic: result.url
                    }
                })
                return res.status(200).json({
                    msg: "Image added",
                    url: result.url
                })
            }
        })
    } catch (error) {
        return res.status(404).json({
            status: 'Error',
            msg: error
        })
    }

}

exports.availableFriends = async (req, res) => {
    try {
        let user = await User.findOne({ name: req.body.name })
        let oF = []
        let avFriend = null
        let friends = user.friend;
        for (let i = 0; i < friends.length; i++) {
            if (friends[i].status == "accepted") {
                avFriend = await User.findById({ _id: friends[i].friend_id })
                if (avFriend.online == true && avFriend.inFight == false) {
                    oF.push(avFriend)
                }
            }
        }
        return res.status(200).json({
            available_friends: oF
        })
    } catch (error) {
        return res.status(404).json({
            status: 'Error',
            msg: error.message
        })
    }
}
