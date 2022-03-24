const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
    .setName("disconnect")
    .setDescription("Stops the music and leaves the voice channel")
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

        if (interaction.guild.me.voice.channel &&!interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)) {
            const sameEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(
                    "❌ | **You must be in the same voice channel as me to use this command!**"
                );
            return interaction.reply({ embeds: [sameEmbed], ephemeral: true });
        }

        player.destroy();

        interaction.reply({
            embeds: [client.Embed(`:wave: | **Disconnected!**`)],
        });
    });

module.exports = command;