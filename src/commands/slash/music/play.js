const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../../lib/SlashCommand");
const ytdl = require("ytdl-core");

const command = new SlashCommand()
    .setName("play")
    .setDescription("Play a song")
    .addStringOption((option) => option.setName("name").setDescription("What song are we going to play?").setRequired(true))
    .setRun(async (client, interation, options) => {
        const query = interation.options.getString("name");
        if (!query) return
    });

module.exports = command