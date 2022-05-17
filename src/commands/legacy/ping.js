const { Message } = require("discord.js")
const Wrenchi = require("../lib/Wrenchi.js");

const Command = {
    info: {
        name: "ping",
        description: "Pong!",
        aliases: ["pong"],
    },

    /**
     * 
     * @param {Wrenchi} client 
     * @param {Message} message 
     * @param {Array<string>} args 
     */
    run: async function (client, message, args) {
       await message.reply("Pong!");
    },
}

module.exports = Command