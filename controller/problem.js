const Problem = require("../model/problem")


exports.addProblem = async (req, res) => {
    try {
        const p_ = await Problem.findOne({ code: req.body.code })
        if (p_) {
            return res.status(200).json({
                msg: 'Problem already exsited'
            })
        }
        const p = new Problem({
            code: req.body.code,
            text: req.body.text,
            rate: req.body.rate,
            input: req.body.input,
            output: req.body.output
        })

        problem = await Problem.create(req.body)
        return res.status(200).json({
            msg: 'Problem added'
        })

    } catch (error) {
        return res.status(404).json({
            Error: error.message
        })
    }
}

exports.getProblem = async (req, res) => {
    try {
        const problem = await Problem.find().select('-_id -__v')
        res.status(200).json({
            problem: problem
        })
    } catch (error) {
        return res.status(404).json({
            Error: error.message
        })
    }
}

exports.getProblemCode = async (req, res) => {
    try {
        const problem = await Problem.findOne({code : req.body.code}).select('-_id -__v')
        res.status(200).json({
            problem: problem
        })
    } catch (error) {
        return res.status(404).json({
            Error: error.message
        })
    }
}