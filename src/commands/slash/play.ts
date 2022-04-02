import SlashCommand from "../../lib/SlashCommand";

const command = new SlashCommand()
    .setName("play")
    .setDescription("Let's hear some music together!")
    .setRun(async (client, interaction, options) => {
        await interaction.reply({
            content: `Coming soon....`,
        });
    });

module.exports = command