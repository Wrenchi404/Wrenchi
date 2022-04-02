import SlashCommand from "../../lib/SlashCommand";

const command = new SlashCommand()
    .setName("play")
    .setDescription("Let's hear some music together!")
    .setRun(async (client, interaction, options) => {
        const node = await client.getLavalink(client);
        if (!node) return interaction.reply("❌ | Lavalink Not Connected");
    });

module.exports = command