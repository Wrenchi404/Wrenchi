const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    userID: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    guildID: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    money: {
        type: mongoose.SchemaTypes.Number,
        default: 1000
    },
    bank: {
        type: mongoose.SchemaTypes.Number,
        default: 5000
    }
});

module.exports = mongoose.model("profile", ProfileSchema);