const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
    .setName("volume")
    .setDescription("Change da volume")
    .addNumberOption((option) => option.setName("volume").setDescription("The volume to set the player to").setRequired(true))
    .setRun(async (client, interaction, options) => {
        let channel = await client.getChannel(client, interaction);
        if (!channel) return;

        let node = await client.getLavalink(client);
        if (!node) {
            return interaction.reply({
                embeds: [client.ErrorEmbed("Lavalink node is not connected")],
            });
        }

        let player = client.Manager.players.get(interaction.guild.id);
        if (!player)
            return interaction.reply({
                embeds: [client.ErrorEmbed("**Nothing is playing right now...**")],
            });

        if (!interaction.member.voice.channel) {
            const joinEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(
                    "❌ | **You must be in a voice channel to use this command!**"
                );
            return interaction.reply({ embeds: [joinEmbed], ephemeral: true });
        }

        if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)) {
            const sameEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(
                    "❌ | **You must be in the same voice channel as me to use this command!**"
                );
            return interaction.reply({ embeds: [sameEmbed], ephemeral: true });
        }

        if (player.paused) return interaction.reply({ content: "Player is paused now, so can't change da volume" });
        const volume = interaction.options.getNumber("volume");
        if (!volume) return;
        if (volume < 1 || volume > 100) return interaction.reply({ content: "You need to give me a volume between 1 and 100." });

        await player.setVolume(volume);
        interaction.reply({
            content: `Set volume to **${volume}**`,
        })
    });

module.exports = command;