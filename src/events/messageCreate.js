const Wrenchi = require("../lib/Wrenchi");
const { Message, MessageEmbed } = require("discord.js");

/**
 *
 * @param {Wrenchi} client
 * @param {Message} message
*/

module.exports = async (client, message) => {
    let prefix = client.config.Client.Prefix;
    if (message.author.bot || message.channel.type === "dm" || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    // Searching a command
    const command = client.commands.get(commandName) || client.commands.find((x) => x.aliases && x.aliases.includes(commandName));

    // Executing the codes when we get the command or aliases
    if (!command) {
        return
    } else {
        command.run(client, message, args);
    }

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

    if (message.content.match(mention)) {
        const mentionEmbed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setDescription(
                `Hi`
            );

        message.channel.send({
            embeds: [mentionEmbed],
        });
    }
}