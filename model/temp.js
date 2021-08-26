const mongoose = require("mongoose");

const temp = new mongoose.Schema({
    code: Number,
    user: String
})

exports.Temp = mongoose.model('temp' , temp)