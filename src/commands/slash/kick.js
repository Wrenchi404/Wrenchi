const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
    .setName("kick")
    .setDescription("Kick that idiot.")
    .addMentionableOption((option) => option.setName("user").setDescription("Whom I need to kill sir?").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Why do I need to kick him?").setRequired(true))
    .setRun(async (client, interaction, options) => {
        const mention = interaction.options.getMentionable('user');
        const reason = interaction.options.getString('reason');
        if (!mention) return;
        if (!reason) return;

        const member = interaction.guild.members.cache.get(mention.id);
        if (!member) return;

        if (member.kickable) {
            member.kick(reason);
            interaction.reply({ content: `${member.user.tag} has been kicked for ${reason}` });
        } else {
            interaction.reply({ content: `${member.user.tag} cannot be kicked.` });
        }
    });

module.exports = command;