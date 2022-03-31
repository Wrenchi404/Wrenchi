const Wrenchi = require("../lib/Wrenchi");
const { MessageEmbed, WebhookClient, GuildMember } = require("discord.js")
/**
 *
 * @param {Wrenchi} client
 * @param {GuildMember} before
 * @param {GuildMember} after
 */
module.exports = async (client, before, after) => {
    if (before.nickname !== after.nickname) {
        const embed = new MessageEmbed()
            .setTitle("Nickname Changed")
            .addField("Old nickname", before.nickname)
            .addField("New nickname", after.nickname)
            .setColor("RED")
            .setTimestamp()
            .setFooter({ text: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() });

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }

    if (before.roles.cache.size !== after.roles.cache.size) {
        const embed = new MessageEmbed()
            .setTitle("Roles Changed")
            .addField("Old roles", before.roles.cache.map(r => r.name).join(", "))
            .addField("New roles", after.roles.cache.map(r => r.name).join(", "))
            .setColor("RED")
            .setTimestamp()
            .setFooter({ text: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() });

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }

    if (before.user.username !== after.user.username) {
        const embed = new MessageEmbed()
            .setTitle("Username Changed")
            .addField("Old username", before.user.username)
            .addField("New username", after.user.username)
            .setColor("RED")
            .setTimestamp()
            .setFooter({ text: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() });

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }

    if (before.user.avatarURL() !== after.user.avatarURL()) {
        const embed = new MessageEmbed()
            .setAuthor({ name: `Avatar of ${after.user.tag} Changed`, iconURL: after.user.displayAvatarURL() })
            .setImage(after.user.displayAvatarURL())
            .setColor("RED")
            .setTimestamp()
            .setFooter({ text: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() });

        const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
        webhook.send({ embeds: [embed] });
    }
}