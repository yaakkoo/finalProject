const Fight = require("../model/fight")
const Problem = require("../model/problem")
const User = require("../model/user")

exports.getMatchInfo = async (req, res) => {
    try {
        let match = await Fight.findOne({uuid : req.body.uuid}).populate({ path: 'user1', select: 'name rate _id' }).populate(({ path: 'user2', select: 'name rate _id' }))
        if (match)
            return res.status(200).json({
                match_info: match
            })
        else return res.status(404).json({
            msg: 'no such match'
        })
    } catch (error) {
        return res.status(404).json({
            msg: error.message
        })
    }
}

exports.friendMatch = async (req, res) => {
    try {
        let friend = false
        let receiver = await User.findOne({ name: req.body.receiver })
        let sender = await User.findOne({ name: req.body.sender })
        sender.friend.forEach(element => {
            if (element.friend_id.toString() == receiver._id.toString())
                friend = true
        });
        if (!friend)
            return res.status(200).json({
                msg: receiver.name + " is not a friend"
            })
        if (receiver.inFight)
            return res.status(200).json({
                msg: receiver.name + " in fight"
            })

        if (sender.sent_notification.indexOf(receiver.name) != -1)
            return res.status(404).json({
                msg: "notification already sent"
            })
        let noti = await sendNoti(req.body.sender, req.body.receiver, req.body.difficulty)
        if (noti === 'sent') {
            return res.status(200).json({
                msg: "Notification sent to " + receiver.name + " \ndiffeculty : " + req.body.difficulty
            })
        } else {
            return res.status(200).json({
                msg: "Can't send a match request",
                error: noti
            })
        }
    } catch (error) {
        return res.status(404).json({
            msg: error.message
        })
    }
}

exports.decline = async (req, res) => {
    try {
        let sender = await User.findOne({ name: req.body.sender })
        let receiver = await User.findOne({ name: req.body.receiver })
        await User.findOneAndUpdate({ name: req.body.receiver }, {
            $pull: {
                notification: {
                    friend_id: sender._id
                }
            }
        })
        await User.findOneAndUpdate({ name: req.body.sender }, {
            $pull: {
                sent_notification: receiver.name
            }
        })
        return res.status(200).json({
            msg: "Fight declined"
        })
    } catch (error) {
        return res.status(404).json({
            msg: error.message
        })
    }
}

exports.accept = async (req, res) => {
    try {
        let sender = await User.findOne({ name: req.body.sender })
        let receiver = await User.findOne({ name: req.body.receiver })

        await User.findOneAndUpdate({ name: receiver.name }, {
            $set: {
                inFight: true,
                uuid: req.body.uuid
            }, $pull: {
                notification: {
                    friend_id: sender._id
                }
            }
        })

        await User.findOneAndUpdate({ name: sender.name }, {
            $set: {
                inFight: true,
                uuid: req.body.uuid
            }, $pull: {
                sent_notification: receiver.name
            }
        })
        let n_problems = await getProblems(req.body.rate1, req.body.rate2)
        if (n_problems == 'error')
            return res.status(404).json({
                msg: 'error in getting problems'
            })
        let fight = {
            user1: sender._id,
            user2: receiver._id,
            problems: n_problems,
            uuid : req.body.uuid
        }
        await Fight.create(fight)
        return res.status(200).json({
            msg: "Fight accepted",
            fight: fight
        })

    } catch (error) {
        return res.status(404).json({
            msg: error.message
        })
    }
}

exports.randomMatch = async (req, res) => {

    try {
        let receiver = await User.find({ inFight: false, online: true, name: { $ne: req.body.sender } }).select('name -_id')
        let i = Math.floor(Math.random() * receiver.length)
        let sender = await User.findOne({ name: req.body.sender })
        if (sender.sent_notification.indexOf(receiver[i].name) != -1)
            return res.status(200).json({
                msg: "try again"
            })
        else {
            let noti = await sendNoti(req.body.sender, receiver[i].name, req.body.difficulty)
            if (noti === 'sent') {
                let n_problems = await getProblems(req.body.rate1, req.body.rate2)
                if (n_problems == 'error')
                    return res.status(404).json({
                        msg: 'error in getting problems'
                    })
                let fight = {
                    user1: sender._id,
                    user2: receiver[i]._id,
                    problems: n_problems
                }
                await Fight.create(fight)
                return res.status(200).json({
                    msg: "Notification sent to " + receiver[i].name + " \ndiffeculty : " + req.body.difficulty
                })
            } else {
                return res.status(200).json({
                    msg: "Can't send a match request",
                    error: noti
                })
            }
        }
    } catch (error) {
        return res.status(404).json({
            msg: error.message
        })
    }

}

exports.endFight = async (req, res) => {
    try {
        let sender = await User.findOneAndUpdate({ _id: req.body.sender }, {
            $set: {
                inFight: false,
                uuid: ''
            }
        })
        let receiver = await User.findOneAndUpdate({ _id: req.body.receiver }, {
            $set: {
                inFight: false,
                uuid: ''
            }
        })
        await Fight.findOneAndDelete({ $or: [{ user1: sender._id }, { user2: sender._id }] })
        return res.status(200).json({
            msg: "Match ended"
        })
    } catch (error) {
        return res.status(404).json({
            msg: "Error",
            status: error.message
        })
    }
}

async function sendNoti(senderName, receiverName, difficulty) {

    try {
        let sender = await User.findOneAndUpdate({ name: senderName }, {
            $push: {
                sent_notification: receiverName + " \ndiffeculty : " + difficulty
            }
        })

        await User.findOneAndUpdate({ name: receiverName },
            {
                $push: {
                    notification: {
                        friend_id: sender._id,
                        noti_text: sender.name + " asking for a fight !! \ndiffeculty : " + difficulty
                    }
                }
            }
        )
        return 'sent'
    } catch (error) {
        return error.message
    }
}

async function getProblems(rate1, rate2) {
    try {
        let all_problems = await Problem.find({ rate: { $gt: rate1, $lt: rate2 } })
        let problems = []
        let i = Math.floor(Math.random() * all_problems.length)
        for (; problems.length <= 4; i = Math.floor(Math.random() * all_problems.length)) {
            if (problems.indexOf(all_problems[i].code) != -1)
                continue
            problems.push(all_problems[i].code)
        }
        return problems
    } catch (error) {
        return 'error'
    }
}