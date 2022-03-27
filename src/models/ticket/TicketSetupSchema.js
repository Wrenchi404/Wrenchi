const mongoose = require("mongoose");

const TicketMessageSchema = new mongoose.Schema({
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

module.exports = mongoose.model("ticketsetup", TicketMessageSchema);