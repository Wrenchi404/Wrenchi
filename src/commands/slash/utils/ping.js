const SlashCommand = require("../../../lib/SlashCommand");

const command = new SlashCommand()
    .setName("ping")
    .setDescription("Pong!")
    .setRun(async (client, interation, options) => {
        interation.reply("Pong");
});

module.exports = command