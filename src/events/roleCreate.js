const Wrenchi = require("../lib/Wrenchi");
const { MessageEmbed, WebhookClient, Role } = require("discord.js");
/**
 *
 * @param {Wrenchi} client
 * @param {Role} role
 */
module.exports = async (client, role) => {
    const embed = new MessageEmbed()
        .setTitle("Role Created")
        .addField("Role name", role.name)
        .addField("Role ID", role.id)
        .setColor(role.color)
        .setTimestamp();

    const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
    webhook.send({ embeds: [embed] });
}