const mongoose = require("mongoose");


const fight = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    problems: {
        type: [String]
    }
})

const Fight = mongoose.model(
    "Matches",
    fight)

module.exports = Fight