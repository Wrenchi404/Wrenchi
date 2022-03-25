const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
    .setName("ban")
    .setDescription("Ban that noob.")
    .addMentionableOption((option) => option.setName("user").setDescription("Whom I need to destroy sir?").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Why do I need to ban him?").setRequired(true))
    .setRun(async (client, interaction, options) => {
        const mention = interaction.options.getMentionable('user');
        const reason = interaction.options.getString('reason');
        if (!mention) return;
        if (!reason) return;

        const member = interaction.guild.members.cache.get(mention.id);
        if (!member) return;

        if (member.bannable) {
            member.ban({
                reason: reason
            });
            interaction.reply({ content: `${member.user.tag} has been banned for ${reason}` });
        } else {
            interaction.reply({ content: `${member.user.tag} cannot be banned.` });
        }
    });

module.exports = command;