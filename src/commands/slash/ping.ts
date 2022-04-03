import SlashCommand from "../../lib/SlashCommand";

const Command = new SlashCommand()
    .setName("ping")
    .setDescription("Pong!")
    .setRun(async (client, interaction, options) => {
        await interaction.reply({
            content: `Client Web Socket Ping: ${client.ws.ping}ms`,
        });
    });

export { Command }