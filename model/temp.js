const mongoose = require("mongoose");

const temp = new mongoose.Schema({
    code: number,
    user: String
})

exports.Temp = mongoose.model('temp' , temp)