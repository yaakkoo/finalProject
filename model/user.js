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
    name: {
        type: String,
    },
    profile_pic: {
        type: String
    },
    password: {
        type: String,
    },
    rate: {
        type: Number,
        default: 0,
    },
    win: {
        type: Number,
        default: 0,
    },
    lose: {
        type: Number,
        default: 0,
    },
    numOfSub: {
        type: Number,
        default: 0,
    },
    online: {
        type: Boolean,
        default: true,
    },
    admin: Boolean,

    friend: [friendSchema],

    received_friend: [friendSchema],

    inFight: Boolean,

    notification: [notificationSchema],

    sent_notification: [String],

    uuid: String

})


UserSchema.pre('save', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt
    bcryptjs.genSalt(5, function (err, salt) {
        if (err) return next(err);
        user.salt = salt;
        // hash the password using our new salt
        bcryptjs.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

const User = mongoose.model(
    "Users",
    UserSchema)

module.exports = User;
