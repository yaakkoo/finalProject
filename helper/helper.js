
const Submit = require("../model/submit");
const User = require("../model/user");


exports.editStatus = async (p_code, name, accpet, code) => {
    try {
        if (accpet == 1) {
            let submit = await Submit.findOneAndUpdate({ name: name, p_code: p_code, code: code }, {
                $set: {
                    status: 'Accepted'
                }
            }, { new: true })
            return submit
        } else if (accept == 2) {
            let submit = await Submit.findOneAndUpdate({ name: name, p_code: p_code, code: code }, {
                $set: {
                    status: 'Wrong Answer'
                }
            }, { new: true })
            return submit
        } else if (accept == 3) {
            let submit = await Submit.findOneAndUpdate({ name: name, p_code: p_code, code: code }, {
                $set: {
                    status: 'Compilation Error'
                }
            }, { new: true })
            
            return submit
        }

    } catch (error) {
        console.log(error.message)
    }
}

exports.editNum = async (name) => {
    try {
        const user = await User.findOneAndUpdate({ name: name }, {
            $inc: {
                numOfSub: 1
            }
        }, { new: true })
    } catch (error) {
        console.log(error.message)
    }
}

exports.addSubmit = async (name, p_code, code, match = null) => {
    try {
        let submit = {}
        submit.name = name
        submit.p_code = p_code
        submit.status = "pending"
        submit.code = code
        submit.match = match
        await Submit.create(submit)
        return submit
    } catch (error) {
        console.log("addsubmit   " + error.message)
    }
}

exports.getSubmitUserProblem = async (name, p_code) => {
    try {
        const submit = await Submit.findOne({ name: name, p_code: p_code });
        if (submit) {
            return submit
        }
    } catch (error) {
        console.log("addsubmit   " + error.message)
    }
}