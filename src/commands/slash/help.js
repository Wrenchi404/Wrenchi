const SlashCommand = require("../../lib/SlashCommand");
const { MessageActionRow, MessageButton } = require('discord.js');
const { economyEmbed, funEmbed, modEmbed, musicEmbed } = require("../../utils/helpEmbeds")

const command = new SlashCommand()
    .setName("help")
    .setDescription("How may I help you sir?")
    .setRun(async (client, interaction, options) => {
        let funButton = new MessageButton()
            .setCustomId("fun")
            .setLabel("Fun Commands")
            .setStyle("PRIMARY");

        let modButton = new MessageButton()
            .setCustomId("mod")
            .setLabel("Moderation Commands")
            .setStyle("PRIMARY");

        let musicButton = new MessageButton()
            .setCustomId("music")
            .setLabel("Music Commands")
            .setStyle("PRIMARY");

        let ecoButton = new MessageButton()
            .setCustomId("eco")
            .setLabel("Economy Commands")
            .setStyle("PRIMARY");

        let actionRow = new MessageActionRow().addComponents(funButton, modButton, musicButton, ecoButton);
        let butArray = [funButton, modButton, musicButton, ecoButton]

        interaction.reply({
            content: "Select a category to see more commands. My prefix is `!`. Better use `/` command",
            components: [actionRow]
        });

        const filter = (butInt) => {
            return butInt.user.id === interaction.user.id;
        }

        const collector = await interaction.channel.createMessageComponentCollector({
            filter: filter,
            time: 1000 * 60 * 5,
        })

        collector.on("collect", (inter) => {
            if (inter.customId === "fun") {
                butArray.forEach(button => {
                    if (button.customId === "fun") {
                        button.setDisabled(true)
                    } else {
                        button.setDisabled(false)
                    }
                })

                inter.update({
                    content: null,
                    embeds: [funEmbed],
                    components: [actionRow]
                });
            }

            if (inter.customId === "mod") {
                butArray.forEach(button => {
                    if (button.customId === "mod") {
                        button.setDisabled(true)
                    } else {
                        button.setDisabled(false)
                    }
                })

                inter.update({
                    content: null,
                    embeds: [modEmbed],
                    components: [actionRow]
                });
            }

            if (inter.customId === "music") {
                butArray.forEach(button => {
                    if (button.customId === "music") {
                        button.setDisabled(true)
                    } else {
                        button.setDisabled(false)
                    }
                })

                inter.update({
                    content: null,
                    embeds: [musicEmbed],
                    components: [actionRow]
                });
            }

            if (inter.customId === "eco") {
                butArray.forEach(button => {
                    if (button.customId === "eco") {
                        button.setDisabled(true)
                    } else {
                        button.setDisabled(false)
                    }
                })

                inter.update({
                    content: null,
                    embeds: [economyEmbed],
                    components: [actionRow]
                });
            }
        })
    });

module.exports = command;