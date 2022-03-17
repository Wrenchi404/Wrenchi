const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
    .setName("pause")
    .setDescription("Pause's the music")
    .setRun(async (client, interaction, options) => {
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

        const pausedEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(
                "▶️ | **Resuming!**"
            );

        if (player.paused) {
            interaction.reply({ embeds: [pausedEmbed] })
            player.pause(false);
            return
        }

        player.pause(true);

        interaction.reply({
            embeds: [client.Embed(`⏸️ | **Paused!**`)],
        });
    });

module.exports = command;