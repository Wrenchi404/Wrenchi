const Wrenchi = require("../lib/Wrenchi");
const { MessageEmbed, GuildMember } = require("discord.js");
/**
 *
 * @param {Wrenchi} client
 * @param {GuildMember} member
*/
module.exports = async (client, member) => {
    if (member.guild.id !== client.config.Discord.TestGuildID) return
    const channel = client.channels.cache.get(client.config.Discord.WelcomeChannelID);
    if (!channel) return;

    const welcomeEmbed = new MessageEmbed()
        .setAuthor({ name: `${member.user.username} Joined Our HideOut!!`, iconURL: member.displayAvatarURL() })
        .setColor("BLUE")
        .setThumbnail(member.user.displayAvatarURL())
        .setFields([
            {
                name: "User Name",
                value: member.user.username,
                inline: true
            },
            {
                name: "User ID",
                value: member.user.id,
                inline: true
            },
            {
                name: "User Tag",
                value: member.user.tag,
                inline: true
            },
            {
                name: "User Created At",
                value: `<t:${Math.floor(member.user.createdAt / 1000) + 3600}:F>`,
                inline: true
            },
            {
                name: "User Joined At",
                value: `<t:${Math.floor(member.joinedAt / 1000) + 3600}:F>`,
                inline: true
            },
        ])
        .setDescription("Make sure to check out <#925277549347627029> before doing anything stoopid")
        .setFooter({ text: `Proudly Made by Wrench`, iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

    channel.send({ embeds: [welcomeEmbed] });
}