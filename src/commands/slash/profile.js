const SlashCommand = require("../../lib/SlashCommand");
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const Profile = require("../../models/utility/ProfileSchema");

const command = new SlashCommand()
    .setName("profile")
    .setDescription("Create's a profile or Show's yours or someone else's profile")
    .addMentionableOption((option) => option.setName("user").setDescription("The user you want to see the profile of").setRequired(false))
    .setRun(async (client, interaction, options) => {
        const user = interaction.options.getMentionable("user");

        if (user) {
            const profile = await Profile.findOne({
                userID: user.id
            });

            if (!profile) {
                interaction.reply({ content: `He don't have a profile...`, ephemeral: true, fetchReply: true });
                return
            }

            const embed = new MessageEmbed()
                .setTitle(`${profile.username}'s Profile`)
                .setColor("RANDOM")
                .setDescription(`
                **Name:** ${profile.username}
                **Money:** ${profile.money}
                **Bank:** ${profile.bank}
                `);

            return interaction.reply({ embeds: [embed] });
        } else {
            const profile = await Profile.findOne({
                userID: interaction.user.id
            });

            if (!profile) {
                await interaction.reply({ content: `Created profile cuz you don't have one :}`, ephemeral: true, fetchReply: true });

                await Profile.create({
                    username: interaction.user.username,
                    userID: interaction.user.id,
                    guildID: interaction.guild.id,
                });
                
                return
            }

            const embed = new MessageEmbed()
                .setTitle(`${profile.username}'s Profile`)
                .setColor("RANDOM")
                .setDescription(`
                **Name:** ${profile.username}
                **Money:** ${profile.money}
                **Bank:** ${profile.bank}
                `);

            return interaction.reply({ embeds: [embed] });
        }
    })

module.exports = command;