const SlashCommand = require("../../../lib/SlashCommand");

const command = new SlashCommand()
    .setName("play")
    .setDescription("Play a song")
    .setRun(async (client, interation, options) => {
        interation.reply("Coming soon.....")
    });

module.exports = command