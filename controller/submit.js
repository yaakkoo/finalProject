const Submit = require('../model/submit')

exports.getStatusUser = async (req, res) => {
    try {
        const submit = await Submit.find({ name: req.body.name })
        res.status(200).json({
            submit: submit
        })
    } catch (error) {
        return res.status(404).json({
            msg: error.message
        })
    }
}

exports.getStatus = async (req, res) => {
    try {
        const submit = await Submit.find()
        res.status(200).json({
            submit: submit
        })
    } catch (error) {
        return res.status(404).json({
            msg: error.message
        })
    }
}

exports.getMatchStatusPro = async (req,res) => {
    try {
        const submit = await Submit.find({match : req.body.matchId , p_code : req.body.p_code}).populate({ path: 'match', select: 'problems user1 user2' })
        res.status(200).json({
            submit: submit
        })
    } catch (error) {
        return res.status(404).json({
            msg: error.message
        })
    }
}

exports.getMatchStatus = async (req,res) => {
    try {
        const submit = await Submit.find({match : req.body.matchId}).populate({ path: 'match', select: 'problems user1 user2' })
        res.status(200).json({
            submit: submit
        })
    } catch (error) {
        return res.status(404).json({
            msg: error.message
        })
    }
}
