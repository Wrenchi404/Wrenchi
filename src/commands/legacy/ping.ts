import { Message } from "discord.js"
import Wrenchi from "../../lib/Wrenchi";

module.exports = {
    info: {
        name: "ping",
        description: "Pong!",
        aliases: ["pong"],
    },

    run: async function (client: Wrenchi, message: Message, args: string[]) {
        message.channel.send("Pong!");
    },
};