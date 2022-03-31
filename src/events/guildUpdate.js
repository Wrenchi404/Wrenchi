const Wrenchi = require("../lib/Wrenchi");
const { MessageEmbed, WebhookClient, Guild } = require("discord.js");
/**
 *
 * @param {Wrenchi} client
 * @param {Guild} before
 * @param {Guild} after
 */
module.exports = async (client, before, after) => {
    if (before.name !== after.name) {
        const embed = new MessageEmbed()
            .setTitle("Guild Name Changed")
            .addField("Old name", before.name)
            .addField("New name", after.name)
            .setColor("RED")
            .setTimestamp()
            .setFooter({ text: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() });

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }

    if (before.description !== after.description) {
        const embed = new MessageEmbed()
            .setTitle("Guild Description Changed")
            .addField("Old description", `${before.description.toString()}`)
            .addField("New description", `${after.description.toString()}`)
            .setColor("RED")
            .setTimestamp()
            .setFooter({ text: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() });

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }

    if (before.icon !== after.icon) {
        const embed = new MessageEmbed()
            .setTitle("Guild Icon Changed")
            .setImage(before.iconURL())
            .setColor("RED")
            .setTimestamp()
            .setFooter({ text: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() });

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }

    if (before.banner !== after.banner) {
        const embed = new MessageEmbed()
            .setTitle("Guild Banner Changed")
            .setImage(before.bannerURL())
            .setColor("RED")
            .setTimestamp()
            .setFooter({ text: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() });

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }

    if (before.preferredLocale !== after.preferredLocale) {
        const embed = new MessageEmbed()
            .setTitle("Guild Region Changed")
            .addField("Old region", before.preferredLocale)
            .addField("New region", after.preferredLocale)
            .setColor("RED")
            .setTimestamp()
            .setFooter({ text: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() });

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }
}