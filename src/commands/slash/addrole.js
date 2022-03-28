const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed, Permissions } = require("discord.js");

const command = new SlashCommand()
    .setName("addrole")
    .setDescription("Pause's the music")
    .addRoleOption((option) => option.setName("role").setDescription("Mention the role you want to add.").setRequired(true))
    .addMentionableOption((option) => option.setName("user").setDescription("The user whom you want to add role.").setRequired(false))
    .setRun(async (client, interaction, options) => {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            interaction.reply({
                content: "You don't have permission to use this command.",
                ephemeral: true
            });

            return
        }

        const addedMembers = []
        const role = interaction.options.getRole("role");
        if (!role) return;

        const member = interaction.options.getMentionable("user")
        if (member) {
            member.roles.add(role.id);
            interaction.reply({
                content: `Added ${role.name} to ${member}`
            });

            return
        }

        await interaction.guild.members.fetch({ force: true }).then((members) => {
            members.forEach((member) => {
                if (member.user.bot) return;

                if (!member.roles.cache.has(role.id)) {
                    member.roles.add(role.id);
                    addedMembers.push(member);
                }
            })
        }).then(() => {
            interaction.reply({
                content: `Added ${role.name} to ${addedMembers.length} members.`
            });
        })
    });

module.exports = command;