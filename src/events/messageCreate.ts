import Wrenchi, { ICommand } from "../lib/Wrenchi"
import { Message } from "discord.js"

export default async (client: Wrenchi, message: Message) => {
    const prefix = client.config.prefix
    if (message.author.bot || message.channel.type === "DM" || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = client.LegacyCommands.get(commandName) || client.LegacyCommands.find((x: ICommand) => x.info.aliases && x.info.aliases.includes(commandName));

    if (!command) return
    else {
        command.run(client, message, args);
    }
}