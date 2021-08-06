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