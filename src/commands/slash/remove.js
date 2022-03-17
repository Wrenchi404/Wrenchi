const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
    .setName("remove")
    .setDescription("I'll remove the song for you sire.")
    .addNumberOption((option) => option.setName("number").setRequired(true).setDescription("The number of the song you want to remove."))
    .setRun(async (client, interaction, options) => {
        const args = interaction.options.getNumber("number");

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
        await interaction.deferReply();

        const position = Number(args) - 1;

        let thing = new MessageEmbed()
            .setColor("RED")
            .setDescription(
                `Current queue has only **${player.queue.size}** track`
            );
        if (position > player.queue.size) return interaction.editReply({ embeds: [thing] });

        const song = player.queue[position]
        player.queue.remove(song);

        const number = position + 1;
        let removedEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`Removed track number **${number}** from queue`);
        return interaction.editReply({ embeds: [removedEmbed] });
    });

module.exports = command;