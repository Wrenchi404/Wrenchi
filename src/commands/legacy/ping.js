const { Message } = require("discord.js");
const Wrenchi = require("../../lib/Wrenchi");

const Command = {
    info: {
        name: "ping",
        description: "Pong!",
        aliases: ["pong"],
    },

    run: async function (client, message, args) {
        message.reply("Pong!");
    },
}

module.exports = Command