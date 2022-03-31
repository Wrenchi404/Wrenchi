const Wrenchi = require("../lib/Wrenchi");
const { MessageEmbed, WebhookClient } = require("discord.js");
/**
 *
 * @param {Wrenchi} client
 * @param {String} info
 */
module.exports = async (client, info) => {
    const embed = new MessageEmbed()
        .setTitle("Warning")
        .setDescription(info)
        .setColor("RED")
        .setTimestamp()
        .setFooter({ text: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() });

    const webhook = new WebhookClient({ url: client.config.Webhooks.ErrorLogger });
    webhook.send({ embeds: [embed] });
}