const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
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
    channelID: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    messageID: {
        type: mongoose.SchemaTypes.String,
        required: true
    }
});

module.exports = mongoose.model("tickets", TicketSchema);