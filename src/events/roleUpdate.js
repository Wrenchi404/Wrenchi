const Wrenchi = require("../lib/Wrenchi");
const { MessageEmbed, WebhookClient, Role } = require("discord.js");
/**
 *
 * @param {Wrenchi} client
 * @param {Role} before
 * @param {Role} after
 */
module.exports = async (client, before, after) => {
    if (before.name !== after.name) {
        const embed = new MessageEmbed()
            .setTitle("Role Updated")
            .addField("Before", before.name)
            .addField("After", after.name)
            .setColor(after.color)
            .setTimestamp();

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }

    if (before.color !== after.color) {
        const embed = new MessageEmbed()
            .setTitle("Role Colour Updated")
            .addField("Before", `${before.color}`)
            .addField("After", `${after.color}`)
            .setColor(after.color)
            .setTimestamp();

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }

    if (before.permissions !== after.permissions) {
        const embed = new MessageEmbed()
            .setTitle("Role Permissions Updated")
            .addField("Before", `${before.permissions}`)
            .addField("After", `${after.permissions}`)
            .setColor(after.color)
            .setTimestamp();

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }

    if (before.mentionable !== after.mentionable) {
        const embed = new MessageEmbed()
            .setTitle("Role Mentionable Updated")
            .addField("Before", `${before.mentionable}`)
            .addField("After", `${after.mentionable}`)
            .setColor(after.color)
            .setTimestamp();

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }

    if (before.hoist !== after.hoist) {
        const embed = new MessageEmbed()
            .setTitle("Role Hoist Updated")
            .addField("Before", `${before.hoist}`)
            .addField("After", `${after.hoist}`)
            .setColor(after.color)
            .setTimestamp();

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }

    if (before.managed !== after.managed) {
        const embed = new MessageEmbed()
            .setTitle("Role Managed Updated")
            .addField("Before", `${before.managed}`)
            .addField("After", `${after.managed}`)
            .setColor(after.color)
            .setTimestamp();

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }

    if (before.position !== after.position) {
        const embed = new MessageEmbed()
            .setTitle("Role Position Updated")
            .addField("Before", `${before.position}`)
            .addField("After", `${after.position}`)
            .setColor(after.color)
            .setTimestamp();

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }

    if (before.unicodeEmoji !== after.unicodeEmoji) {
        const embed = new MessageEmbed()
            .setTitle("Role Unicode Emoji Updated")
            .addField("Before", `${before.unicodeEmoji}`)
            .addField("After", `${after.unicodeEmoji}`)
            .setColor(after.color)
            .setTimestamp();

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }
}