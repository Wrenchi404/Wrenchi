const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed, Permissions } = require("discord.js");

const command = new SlashCommand()
    .setName("deleterole")
    .setDescription("Delete a role from the server.")
    .addRoleOption((option) => option.setName("role").setDescription("Mention the role you want to delete.").setRequired(true))
    .setRun(async (client, interaction, options) => {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            interaction.reply({
                content: "You don't have permission to use this command.",
                ephemeral: true
            });

            return
        }
        const role = interaction.options.getRole("role");
        if (!role) return;

        if (interaction.member.roles.highest.position <= role.position) {
            interaction.reply({
                content: "You don't have permission to use this command.",
                ephemeral: true
            });

            return
        }

        role.delete();

        interaction.reply({
            content: `Deleted ${role.name} role.`
        })
    });

module.exports = command;