const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
    .setName("unban")
    .setDescription("Have mercy my boy.")
    .setRun(async (client, interaction, options) => {
        interaction.reply("Coming soon............")
    });

module.exports = command;