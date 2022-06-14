const SlashCommand = require("../../../lib/SlashCommand");
const ytdl = require("ytdl-core");

const command = new SlashCommand()
    .setName("play")
    .setDescription("Play a song")
    .addStringOption((option) => option.setName("name").setDescription("What song are we going to play?").setRequired(true))
    .setRun(async (client, interaction, options) => {
        console.log("Ok");
    });

module.exports = command