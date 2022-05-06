import { Message } from "discord.js"
import Wrenchi from "../lib/Wrenchi.js"

/**
 * @param {Wrenchi} client 
 * @param {Message} message
 */
export default async (client, message) => {
    const prefix = client.Config.Client.Prefix
    if (message.author.bot || message.channel.type === "DM" || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = client.LegacyCommands.get(commandName) || client.LegacyCommands.find(cmd => cmd.info.aliases && cmd.info.aliases.includes(commandName));

    if (!command) return
    else {
        command.run(client, message, args);
    }
}