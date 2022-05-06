import { Message } from "discord.js"
import Wrenchi from "../lib/Wrenchi.js"

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

export default Command