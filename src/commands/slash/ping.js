const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
    .setName("ping")
    .setDescription("Pause's the music")
    .setRun(async (client, interaction, options) => {
        await interaction.reply({
            content: `Client Web Socket Ping: ${client.ws.ping}ms`,
        });
    });

module.exports = command;