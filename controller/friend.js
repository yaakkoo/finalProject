const _ = require('lodash')
const User = require("../model/user")

exports.addFriend = async (req, res) => {
    try {
        let friends = false
        let friend = await User.findOne({ name: req.body.friend })
        let user = await User.findOne({ name: req.body.name })
        user.friend.forEach(element => {
            if (element.friend_id.toString() == friend._id.toString()) {
                friends = true
                if (element.status == "accepted") {
                    return res.status(200).json({
                        msg: "Already friends"
                    })
                }
                else {
                    return res.status(200).json({
                        msg: "friend request already sent"
                    })
                }
            }
        });
        if (friends) {
            return
        }
        user = await User.findOneAndUpdate({ name: req.body.name }, {
            $push: {
                friend: {
                    friend_id: friend._id,
                    status: 'pending'
                }
            }
        })

        await User.findOneAndUpdate({ name: req.body.friend }, {
            $push: {
                received_friend:
                {
                    friend_id: user._id,
                    status: 'pending'
                }
            }
        })
        return res.status(200).json({
            msg: 'friend added'
        })
    } catch (error) {
        return res.status(404).json({
            status: 'Error',
            msg: error.message
        })
    }
}

exports.deleteFriend = async (req, res) => {
    try {
        let user1 = await User.findOne({ name: req.body.user1 })
        let user2 = await User.findOneAndUpdate({ name: req.body.user2 }, {
            $pull: {
                friend: {
                    friend_id: user1._id
                },
                received_friend: {
                    frined_id: user1._id
                }
            }
        })

        await User.findOneAndUpdate({ name: req.body.user1 }, {
            $pull: {
                friend: {
                    friend_id: user2._id
                },
                received_friend: {
                    friend_id: user2._id
                }
            }
        })
        return res.status(200).json({
            msg: 'friend deleted'
        })
    } catch (error) {
        return res.status(404).json({
            status: 'Error',
            msg: error.message
        })
    }
}

exports.acceptFriend = async (req, res) => {
    try {
        let receiver = await User.findOne({ name: req.body.user2 })
        var user = await User.findOneAndUpdate({ 'friend.friend_id': receiver._id, name: req.body.user1 }, {
            $set: {
                'friend.$.status': 'accepted'
            }
        })
        await User.findOneAndUpdate({ name: req.body.user2 }, {
            $push: {
                friend: {
                    friend_id: user._id,
                    status: "accepted"
                }
            },
            $pull: {
                received_friend: {
                    friend_id: user._id
                }
            }
        })
        return res.status(200).json({
            msg: "Accepted"
        })
    } catch (error) {
        return res.status(404).json({
            status: 'Error',
            msg: error.message
        })
    }
}

exports.others = async (req, res) => {
    try {
        let userName = await User.findOne({ name: req.body.name })
        let friends = userName.friend;
        let all = await User.find().select('_id')

        friends = friends.map((element) => {
            return element.friend_id
        })

        friends.push(userName._id)
        all = _.difference(all, friends)
        return res.status(200).json({
            users: all
        })
    } catch (error) {
        return res.status(404).json({
            msg: error.message
        })
    }
}