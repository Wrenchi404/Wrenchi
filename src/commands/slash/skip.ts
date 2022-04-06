import { Player } from "erela.js";
import SlashCommand from "../../lib/SlashCommand"

const Command = new SlashCommand()
    .setName("skip")
    .setDescription("Okay let hear the next song.")
    .setRun(async (client, interaction, options) => {
        const channel = await client.getChannel(client, interaction)
        if (!channel) return

        const player: Player = client.Manager.get(interaction.guild.id)
        if (!player) return interaction.reply({ content: "Nothing is playing right now." });

        player.stop();
        interaction.reply({ content: "Skipped the song." });
    });

export { Command }