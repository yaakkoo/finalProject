const mongoose = require("mongoose");
const bcryptjs = require('bcryptjs');



const friendSchema = new mongoose.Schema(
    {
        friend_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        status: String,
    },
    { _id: 0 } // try without this line if any error , it just to prevent DB from adding (_id) field by defalut beacause it is not important here)
);

const notificationSchema = new mongoose.Schema(
    {
        friend_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        noti_text: String,
    },
    { _id: 0 }
);

const UserSchema = new mongoose.Schema({
    name: String,

    email: String,

    profile_pic: String,

    password: {
        type: String,
        required: true,
        trim: true,
        set: (val) => (val ? bcryptjs.hashSync(val, 10) : undefined)
    },

    rate: Number,

    win: Number,

    lose: Number,

    numOfSub: Number,

    online: Boolean,

    admin: Boolean,

    friend: [friendSchema],

    received_friend: [friendSchema],

    inFight: Boolean,

    notification: [notificationSchema],

    sent_notification: [String],

    uuid: String,

})

const User = mongoose.model(
    "Users",
    UserSchema)

module.exports = User;
