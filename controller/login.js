const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

exports.logIn = async (req, res) => {
    try {
        let user = await User.findOne({ name: req.body.name }).select(' -__v').populate({ path: 'friend.friend_id', select: 'name rate _id' }).populate({ path: 'received_friend.friend_id', select: 'name rate _id' })
        if (!user) {
            return res.status(404).json({
                msg: 'Wrong Username or Password '
            })
        }
        const check = await bcryptjs.compare(req.body.password, user.password);
        if (!check) {
            return res.status(404).json({
                msg: 'Wrong Username or Password '
            })
        }
        const token = jwt.sign({ _id: req.body._id }, process.env.TOKEN)
        res.status(200).json({
            token: token,
            user: user
        })
    } catch (error) {
        return res.status(404).json({
            msg: error.message
        })
    }
}