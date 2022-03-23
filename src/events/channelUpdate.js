const Wrenchi = require("../lib/Wrenchi");
const { GuildChannel, MessageEmbed } = require("discord.js");
/**
 *
 * @param {Wrenchi} client
 * @param {GuildChannel} oldChannel
 *  @param {GuildChannel} newChannel
*/
module.exports = async (client, oldChannel, newChannel) => {
    const channel = client.channels.cache.get(client.config.Discord.LogChannelID);

    console.log(`Channel ${oldChannel.name} was updated to ${newChannel.name}`);
}