const jwt = require('jsonwebtoken');
const User = require('../model/user');
const nodemailer = require('nodemailer')
const bcryptjs = require('bcryptjs');
const cloudinary = require('cloudinary');
const { Temp } = require('../model/temp');
const redis = require('redis');
let client = redis.createClient()

let transporter = nodemailer.createTransport({
    service: 'gmail',
    tls: true,
    auth: {
        user: 'competitivefightclub@gmail.com',
        pass: '@@@123@@@'
    }
})

exports.getUser = async (req, res) => {
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

exports.getUserName = async (req, res) => {
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

exports.getUserId = async (req, res) => {
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

exports.signUp = async (req, res) => {
    try {

        client.on('connect', () => {
            console.log('connected to redis');
        })

        client.on('error', (err) => {
            console.log(err);
        })

        let user = await User.findOne({ $or: [{ name: req.body.name }, { email: req.body.email }] })
        if (user) {
            return res.status(200).json({
                msg: "Username already existed"
            })
        }
        user = {}
        user.rate = 0
        user.win = 0
        user.lose = 0
        user.numOfSub = 0
        user.online = true
        user.inFight = false
        user.notification = []
        user.friends = []
        user.sent_frined = []
        user.sent_noti = []
        user.image = ''
        user.uuid = ''
        user.name = req.body.name
        user.email = req.body.email
        user.password = req.body.password
        user.admin = req.body.admin
        let code = Math.floor(Math.random() * 99999999)

        const options = {
            from: 'CompetitiveFightClub@gmail.com',
            to: req.body.email,
            subject: 'Confirm your account',
            html: '<div style="text-align: center; margin-top: 7%;color : black"><h1 style =" color : #ab1025">Competitive Fight Club</h1><p  style="margin-top: 2%;"> <h2>Welcome to our fight club </h2> <br><h3>Please use this code to confirm your <strong style="color: red;"> ' + req.body.name + ' </strong> account</h3><br><h2> The Code : </h2><br><div style="width: 10%;height: 5%;margin: 1% auto;"><h2>' + code + '</h2><br></div>and thank you for signing up</p></div>'
        }
        let data = JSON.stringify(user);
        user = {}
        user.code = code
        user.user = data
        client.setex(code, 60, data, (err, reply) => {
            if (err)
                return res.status(404).json({
                    msg: err
                })
        })
        transporter.sendMail(options, (err, result) => {
            if (err) {
                return res.status(404).json({
                    msg: err,
                    err: err.message
                })
            }
        })
        return res.status(200).json({
            msg: 'Please confirm your account'
        })


    } catch (error) {
        res.status(404).json({
            status: 'Error',
            msg: error.message
        })
    }
}

exports.confirm = async (req, res) => {
    try {
        client.get(req.body.code, async (err, reply) => {
            if (err)
                return res.status(404).json({
                    msg: err
                })
            if (reply == null) {
                return res.status(200).json({
                    msg: 'Verification failed \nPlease re-try'
                })
            } else {
                let data = JSON.parse(reply)
                let user = await User.create(data)
                let token = jwt.sign({ _id: data._id, name: data.name }, process.env.TOKEN)
                user = await User.findOne({ name: data.name }).select('-password -__v').populate({ path: 'friend.friend_id', select: 'name rate -_id' }).populate({ path: 'received_friend.friend_id', select: 'name rate -_id' })
                return res.status(200).json({
                    msg: 'Account has been verified',
                    user: user,
                    token: token
                })
            }
        })

    } catch (error) {
        return res.status(404).json({
            status: 'Error',
            msg: error.message
        })
    }
}

exports.editRate = async (req, res) => {
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
        cloudinary.uploader.upload(req.files.profile.tempFilePath, async (result, err) => {

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
            msg: error.message
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

exports.forgetPassword = async (req, res) => {
    try {
        let user = await User.findOne({ $or: [{ name: req.body.user }, { email: req.body.user }] })

        client.on('connect', () => {
            console.log('connected to redis');
        })

        client.on('error', (err) => {
            console.log(err);
        })
        if (!user)
            return res.status(404).json({
                msg: "No such user"
            })
        let code = Math.floor(Math.random() * 9999999999)

        const options = {
            from: 'CompetitiveFightClub@gmail.com',
            to: user.email,
            subject: 'Confirm your account',
            html: '<div style="text-align: center; margin-top: 7%;color : black"><h1 style =" color : #ab1025">Competitive Fight Club</h1><p  style="margin-top: 2%;"> <h2>Welcome to our fight club </h2> <br><h3>Please use this CODE to reset your <strong style="color: red;"> ' + user.name + ' </strong> password</h3><br><h2> The Code : </h2><br><div style="text-align: center; width: 10%;height: 5%;margin: 1% auto;"><h2>' + code + '</h2><br></div>The support team ... <3 </p></div>'
        }
        let data = JSON.stringify(user);
        client.setex(code, 60, user.name, (err, reply) => {
            if (err) {
                return res.status(404).json({
                    msg: err
                })
            }
        })

        data = {}
        data.user = user.name
        data.code = code
        await Temp.create(data)

        transporter.sendMail(options, (err, result) => {
            if (err)
                return res.status(404).json({
                    msg: err
                })
        })

        return res.status(200).json({
            msg: 'Please check your email for a link'
        })
    } catch (error) {
        return res.status(404).json({
            msg: error.message
        })
    }
}

exports.confirmCodePass = async (req, res) => {
    try {
        client.get(req.body.code, (err, reply) => {
            if (err)
                return res.status(200).json({
                    msg: "Verification failed "
                })
        })
        return res.status(200).json({
            msg: "Verification done !!"
        })

    } catch (error) {
        return res.status(404).json({
            msg: error.message
        })
    }
}

exports.setPassword = async (req, res) => {
    try {
        client.get(req.body.code, async (err, reply) => {
            if (err)
                return res.status(404).json({
                    msg: 'This link expired or wrong link'
                })
            let user = await User.findOneAndUpdate({ name: reply }, {
                $set: {
                    password: req.body.password
                }
            })
            return res.status(200).json({
                msg: 'Password changed successfully'
            })
        })
    } catch (error) {
        return res.status(404).json({
            msg: error.message
        })
    }
}

exports.editPassword = async (req, res) => {
    try {
        let user = await User.findOne({ name: req.body.name })
        const check = await bcryptjs.compare(req.body.oldPassword, user.password);
        if (!check) {
            return res.status(404).json({
                msg: 'Wrong Username or Password '
            })
        }
        await User.findOneAndUpdate({ name: req.body.name }, {
            $set: {
                password: req.body.newPassword
            }
        })

        return res.status(200).json({
            msg: 'Password changed successfully'
        })

    } catch (error) {
        return res.status(404).json({
            status: "Error",
            msg: error.message
        })
    }
}

exports.search = async (req, res) => {
    try {
        if (req.body.name != "") {
            let user = await User.find({ name: { $regex: req.body.name } }).select('name')
            if (user)
                return res.status(200).json({
                    user
                })
            else
                return res.status(200).json({
                    msg: "No such user"
                })
        }
        else
            return res.status(200).json({
                msg: "Cant search null"
            })
    } catch (error) {
        return res.status(404).json({
            status: "Error",
            msg: error.message
        })
    }
}