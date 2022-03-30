const Wrenchi = require("../lib/Wrenchi");
const { MessageEmbed, Message, WebhookClient } = require("discord.js");

/**
 *
 * @param {Wrenchi} client
 * @param {Message} messages
 */
module.exports = async (client, messages) => {
    if (messages.guild.id !== client.config.Discord.TestGuildID) return
    if (messages.author.bot) return

    const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });

    const embed = new MessageEmbed()
        .setAuthor({ name: `${messages.author.tag} Deleted a message`, iconURL: messages.author.displayAvatarURL() })
        .addField("Deleted message", messages.cleanContent)
        .addField("Channel", messages.channel.name)
        .setTimestamp();

    webhook.send({
        embeds: [embed]
    });
}