const mongoose = require('mongoose')

const submitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    p_code: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    match : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Matches"
    }
})

module.exports = mongoose.model('Submit',submitSchema)