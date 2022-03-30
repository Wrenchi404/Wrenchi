const Wrenchi = require("../lib/Wrenchi");
const { MessageEmbed, Message, WebhookClient } = require("discord.js");

/**
 *
 * @param {Wrenchi} client
 * @param {Message} before
 * @param {Message} after
 */
module.exports = async (client, before, after) => {
    if (before.guild.id !== client.config.Discord.TestGuildID) return
    if (before.author.bot) return
    if (before.cleanContent === after.cleanContent) return
    if (before.content === after.content) return

    const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });

    const embed = new MessageEmbed()
        .setAuthor({ name: `${before.author.tag} Edited a message`, iconURL: before.author.displayAvatarURL() })
        .setColor("RED")
        .addField("Original Message", before.cleanContent)
        .addField("Edited Message", after.cleanContent)
        .setTimestamp()

    webhook.send({
        embeds: [embed]
    });
}