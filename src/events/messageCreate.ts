import Wrenchi from "../lib/Wrenchi"
import { Message, MessageEmbed } from "discord.js"

const MessageCreateEvent = async (client: Wrenchi, message: Message) => {
    let prefix = client.config.Bot.Prefix;
    if (message.author.bot || message.channel.type === "DM" || !message.content.startsWith(prefix)) return;

    const args: String[] = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift()?.toLowerCase();

    // Searching a command
    const command = client.legacyCommands.get(commandName) || client.legacyCommands.find((x: any) => x.aliases && x.aliases.includes(commandName));

    // Executing the codes when we get the command or aliases
    if (!command) {
        return
    } else {
        command.run(client, message, args);
    }

    const mention = new RegExp(`^<@!?${client.user?.id}>( |)$`);

    if (message.content.match(mention)) {
        const mentionEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(
                `Hi`
            );

        message.channel.send({
            embeds: [mentionEmbed],
        });
    }
}

export default MessageCreateEvent;