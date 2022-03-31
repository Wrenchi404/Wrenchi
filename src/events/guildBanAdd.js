const Wrenchi = require("../lib/Wrenchi");
const { MessageEmbed, WebhookClient, User, Guild } = require("discord.js");

/**
 *
 * @param {Wrenchi} client
 * @param {Guild} guild
 * @param {User} user
 */
module.exports = async (client, guild, user) => {
    const embed = new MessageEmbed()
        .setTitle("User Banned")
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addField("User", user.tag)
        .addField("User ID", user.id)
        .setTimestamp()
        .setFooter({ text: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() });

    const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
    webhook.send({ embeds: [embed] });
}