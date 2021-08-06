const mongoose = require('mongoose')

const problemSchema = new mongoose.Schema({
    code : {
        type : String,
        required : true
    },
    text : {
        type : String,
        required : true
    },
    rate : {
        type : Number,
        required : true
    },
    input : {
        type : [[String]],
        required : true
    },
    output : {
        type : [String],
        required : true
    },
    note : String
})

module.exports = mongoose.model('problem' , problemSchema)