import { Player } from "erela.js";
import SlashCommand from "../../../lib/SlashCommand"

const Command = new SlashCommand()
    .setName("skip")
    .setDescription("Okay let hear the next song.")
    .setRun(async (client, interaction, options) => {
        const channel = await client.getChannel(client, interaction)
        if (!channel) return

        const player: Player = client.Manager.get(interaction.guild.id)
        if (!player) return interaction.reply({ content: "Nothing is playing right now." });

        if (!player.queue.size) {
            player.destroy();
            interaction.reply({ content: "Stopped because there is no more songs in the queue." });
            const msg = client.NowPlayingMessage.get(interaction.guild.id)
            if (msg) {
                msg.delete()
                client.NowPlayingMessage.delete(interaction.guild.id)
            }
        }

        player.stop();
        interaction.reply({ content: "Skipped the song." });

        if (player.queue.size >= 0) {
            const msg = client.NowPlayingMessage.get(interaction.guild.id)
            if (msg) {
                let embed = msg.embeds[0]
                embed.setFooter({ text: `Next in queue: ${player.queue[0].title}` });
            }
        } else {
            const msg = client.NowPlayingMessage.get(interaction.guild.id)
            if (msg) {
                let embed = msg.embeds[0]
                embed.setFooter({ text: `Nothing in queue` });
            }
        }
    });

export { Command }