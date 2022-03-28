const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed, Permissions } = require("discord.js");

const command = new SlashCommand()
    .setName("unban")
    .setDescription("Have mercy my boy.")
    .addStringOption((option) => option.setName("id").setDescription("Id of da member").setRequired(true))
    .setRun(async (client, interaction, options) => {
        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS) ||
            !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply({ content: "Please die without permissions!" })
        }

        let id = interaction.options.getString("id");

        const { guild } = interaction;
        const member = guild.bans.cache.get(id)
        if (!member) return interaction.reply({ content: "Please ban that user first! ;-;" })
        guild.members.unban(id).catch(err => console.log(err.message));
        return interaction.reply({ content: "Thanks for showing mercy!" })
    });

module.exports = command;