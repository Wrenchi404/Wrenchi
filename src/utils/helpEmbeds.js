const { MessageEmbed } = require("discord.js");

const funEmbed = new MessageEmbed()
    .setTitle("Fun Commands")
    .setColor("RANDOM")
    .setDescription("`hello` Says hello to you \n\n \
    `kill` Kill da person you hate \
")

const modEmbed = new MessageEmbed()
    .setTitle("Moderation Commands")
    .setColor("RANDOM")
    .setDescription("`kick` Kicks a user \n\n \
    `ban` Bans a user \n\n \
    `unban` Unban a guy \n\n \
    `addrole` Adds a role to a user \n\n \
    `deleterole` Deletes a role in the guild \n\n \
")

const musicEmbed = new MessageEmbed()
    .setTitle("Music Commands")
    .setColor("RANDOM")
    .setDescription("`play` Plays a song \n\n \
    `search` Searches for a song \n\n \
    `pause` Pauses the current song \n\n \
    `resume` Resumes the current song \n\n \
    `skip` Skips the current song \n\n \
    `queue` Shows the current queue \n\n \
    `volume` Sets the volume of the current song \n\n \
    `nowplaying` Shows the current song \n\n \
    `filters` Let's filter the song \
")

const economyEmbed = new MessageEmbed()
    .setTitle("Economy Commands")
    .setColor("RANDOM")
    .setDescription("Coming soon...")

module.exports = {
    funEmbed,
    modEmbed,
    musicEmbed,
    economyEmbed
}

/* 
`profile` Show's yours or someone else's profile | If you don't have a profile you can create one with this command \n\n \
    `withdraw` Withdraws money from your account \n\n \
    `deposit` Deposits money into your account \n\n \
    `pay` Pays someone else \
*/