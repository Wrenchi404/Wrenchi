const Wrenchi = require("../lib/Wrenchi");
const DiscordJS = require("discord.js");
const TicketSchema = require("../models/ticket/TicketSchema");
const TicketSetup = require("../models/ticket/TicketMessageSchema");
/**
 *
 * @param {Wrenchi} client
 * @param {DiscordJS.Interaction} interaction
*/
module.exports = async (client, interaction) => {
    if (interaction.isCommand()) {
        let command = client.slashCommands.find(
            (x) => x.name == interaction.commandName
        );
        if (!command || !command.run)
            return interaction.reply(
                "Sorry the command you used doesn't have any run function"
            );
        command.run(client, interaction, interaction.options);
        return;
    }

    if (interaction.isContextMenu()) {
        let command = client.contextCommands.find(
            (x) => x.command.name == interaction.commandName
        );
        if (!command || !command.run)
            return interaction.reply(
                "Sorry the command you used doesn't have any run function"
            );
        command.run(client, interaction, interaction.options);
        return;
    }

    if (!interaction.isButton()) return

    const ticketSetup = TicketSetup.findOne({
        messageID: interaction.message.id
    });

    if (interaction.message.id !== ticketSetup) {
        if (interaction.customId === "open_ticket") {
            const ticket = await TicketSchema.findOne({
                username: interaction.user.username,
                userID: interaction.user.id,
                guildID: interaction.guild.id,
            });

            if (!ticket) {
                const ticketChannel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
                    type: "GUILD_TEXT",
                    topic: `Ticket opened by ${interaction.user.username}`,
                    permissionOverwrites: [
                        {
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
                            id: interaction.user.id
                        },
                        {
                            deny: "VIEW_CHANNEL",
                            id: interaction.guildId
                        }
                    ]
                });

                interaction.reply({
                    content: `Made a ticket <#${ticketChannel.id}>`,
                    ephemeral: true
                });

                const ticketRow = new DiscordJS.MessageActionRow()
                    .addComponents(
                        new DiscordJS.MessageButton()
                            .setCustomId("close_ticket")
                            .setLabel("Close Ticket")
                            .setStyle("PRIMARY")
                    )

                const ticketEmbed = new DiscordJS.MessageEmbed()
                    .setColor("RED")
                    .setTitle(`Ticket System`)
                    .setDescription("Click the Close button to close the ticket!");

                const ticketMessage = await ticketChannel.send({
                    embeds: [ticketEmbed],
                    components: [ticketRow]
                });

                await TicketSchema.create({
                    username: interaction.user.username,
                    userID: interaction.user.id,
                    guildID: interaction.guild.id,
                    channelID: ticketChannel.id,
                    messageID: ticketMessage.id
                });
            } else {
                interaction.reply({
                    content: 'You already have an open ticket',
                    ephemeral: true
                });
            }
        }
    }


    const ticketMessage = await TicketSchema.findOne({
        messageID: interaction.message.id
    });

    if (interaction.message.id !== ticketMessage) {
        if (interaction.customId === "close_ticket") {
            const ticket = await TicketSchema.findOne({
                messageID: interaction.message.id
            })
            ticket.remove();

            interaction.reply({
                content: "Closing"
            });
            interaction.channel.delete()
        }
    }

    // Reaction Roles

    if (interaction.message.id === "956148745769201676") {
        if (interaction.customId === "red_role") {
            const userRoles = interaction.member.roles.cache.find(x =>
                x.name === "Blue" ||
                x.name === "Green" ||
                x.name === "Orange" ||
                x.name === "Black" ||
                x.name === "Violet" ||
                x.name === "Yellow" ||
                x.name === "Cyan"
            );
            const redRole = await interaction.guild.roles.cache.find(x => x.name === "Red");
            const role = await interaction.member.roles.cache.get(redRole.id);

            if (userRoles) {
                interaction.member.roles.remove(userRoles);
                await interaction.member.roles.add(redRole);
                interaction.reply({
                    content: "Added Red Role",
                    ephemeral: true
                });
            } else {
                if (role) {
                    await interaction.member.roles.remove(redRole);
                    interaction.reply({
                        content: "Removed Red Role",
                        ephemeral: true
                    });
                } else {
                    await interaction.member.roles.add(redRole);
                    interaction.reply({
                        content: "Added Red Role",
                        ephemeral: true
                    });
                }
            }

            return
        }

        if (interaction.customId === "blue_role") {
            const userRoles = interaction.member.roles.cache.find(x =>
                x.name === "Red" ||
                x.name === "Green" ||
                x.name === "Orange" ||
                x.name === "Black" ||
                x.name === "Violet" ||
                x.name === "Yellow" ||
                x.name === "Cyan"
            );

            const blueRole = interaction.guild.roles.cache.find(x => x.name === "Blue");
            const role = await interaction.member.roles.cache.get(blueRole.id);

            if (userRoles) {
                interaction.member.roles.remove(userRoles);
                await interaction.member.roles.add(blueRole);
                interaction.reply({
                    content: "Added Blue Role",
                    ephemeral: true
                });
            } else {
                if (role) {
                    await interaction.member.roles.remove(blueRole);
                    interaction.reply({
                        content: "Removed Blue Role",
                        ephemeral: true
                    });
                } else {
                    await interaction.member.roles.add(blueRole);
                    interaction.reply({
                        content: "Added Blue Role",
                        ephemeral: true
                    });
                }
            }

            return
        }

        if (interaction.customId === "green_role") {
            const userRoles = interaction.member.roles.cache.find(x =>
                x.name === "Red" ||
                x.name === "Blue" ||
                x.name === "Orange" ||
                x.name === "Black" ||
                x.name === "Violet" ||
                x.name === "Yellow" ||
                x.name === "Cyan"
            );

            const greenRole = interaction.guild.roles.cache.find(x => x.name === "Green");
            const role = await interaction.member.roles.cache.get(greenRole.id);

            if (userRoles) {
                interaction.member.roles.remove(userRoles);
                await interaction.member.roles.add(greenRole);
                interaction.reply({
                    content: "Added Green Role",
                    ephemeral: true
                });
            } else {
                if (role) {
                    await interaction.member.roles.remove(greenRole);
                    interaction.reply({
                        content: "Removed Green Role",
                        ephemeral: true
                    });
                } else {
                    await interaction.member.roles.add(greenRole);
                    interaction.reply({
                        content: "Added Green Role",
                        ephemeral: true
                    });
                }
            }

            return
        }

        if (interaction.customId === "orange_role") {
            const userRoles = interaction.member.roles.cache.find(x =>
                x.name === "Red" ||
                x.name === "Blue" ||
                x.name === "Green" ||
                x.name === "Black" ||
                x.name === "Violet" ||
                x.name === "Yellow" ||
                x.name === "Cyan"
            );

            const orangeRole = interaction.guild.roles.cache.find(x => x.name === "Orange");
            const role = await interaction.member.roles.cache.get(orangeRole.id);

            if (userRoles) {
                interaction.member.roles.remove(userRoles);
                await interaction.member.roles.add(orangeRole);
                interaction.reply({
                    content: "Added Orange Role",
                    ephemeral: true
                });
            } else {
                if (role) {
                    await interaction.member.roles.remove(orangeRole);
                    interaction.reply({
                        content: "Removed Orange Role",
                        ephemeral: true
                    });
                } else {
                    await interaction.member.roles.add(orangeRole);
                    interaction.reply({
                        content: "Added Orange Role",
                        ephemeral: true
                    });
                }
            }

            return
        }

        if (interaction.customId === "black_role") {
            const userRoles = interaction.member.roles.cache.find(x =>
                x.name === "Red" ||
                x.name === "Blue" ||
                x.name === "Green" ||
                x.name === "Orange" ||
                x.name === "Violet" ||
                x.name === "Yellow" ||
                x.name === "Cyan"
            );
            const blackRole = interaction.guild.roles.cache.find(x => x.name === "Black");
            const role = await interaction.member.roles.cache.get(blackRole.id);

            if (userRoles) {
                interaction.member.roles.remove(userRoles);
                await interaction.member.roles.add(blackRole);
                interaction.reply({
                    content: "Added Black Role",
                    ephemeral: true
                });
            } else {
                if (role) {
                    await interaction.member.roles.remove(blackRole);
                    interaction.reply({
                        content: "Removed Black Role",
                        ephemeral: true
                    });
                } else {
                    await interaction.member.roles.add(blackRole);
                    interaction.reply({
                        content: "Added Black Role",
                        ephemeral: true
                    });
                }
            }

            return
        }

        if (interaction.customId === "cyan_role") {
            const userRoles = interaction.member.roles.cache.find(x =>
                x.name === "Red" ||
                x.name === "Blue" ||
                x.name === "Green" ||
                x.name === "Orange" ||
                x.name === "Violet" ||
                x.name === "Yellow" ||
                x.name === "Black"
            );
            const cyanRole = interaction.guild.roles.cache.find(x => x.name === "Cyan");
            const role = await interaction.member.roles.cache.get(cyanRole.id);

            if (userRoles) {
                interaction.member.roles.remove(userRoles);
                await interaction.member.roles.add(cyanRole);
                interaction.reply({
                    content: "Added Cyan Role",
                    ephemeral: true
                });
            } else {
                if (role) {
                    await interaction.member.roles.remove(cyanRole);
                    interaction.reply({
                        content: "Removed Cyan Role",
                        ephemeral: true
                    });
                } else {
                    await interaction.member.roles.add(cyanRole);
                    interaction.reply({
                        content: "Added Cyan Role",
                        ephemeral: true
                    });
                }
            }

            return
        }

        if (interaction.customId === "violet_role") {
            const userRoles = interaction.member.roles.cache.find(x =>
                x.name === "Red" ||
                x.name === "Blue" ||
                x.name === "Green" ||
                x.name === "Orange" ||
                x.name === "Cyan" ||
                x.name === "Yellow" ||
                x.name === "Black"
            );
            const violetRole = interaction.guild.roles.cache.find(x => x.name === "Violet");
            const role = await interaction.member.roles.cache.get(violetRole.id);

            if (userRoles) {
                interaction.member.roles.remove(userRoles);
                await interaction.member.roles.add(violetRole);
                interaction.reply({
                    content: "Added Violet Role",
                    ephemeral: true
                });
            } else {
                if (role) {
                    await interaction.member.roles.remove(violetRole);
                    interaction.reply({
                        content: "Removed Violet Role",
                        ephemeral: true
                    });
                } else {
                    await interaction.member.roles.add(violetRole);
                    interaction.reply({
                        content: "Added Violet Role",
                        ephemeral: true
                    });
                }
            }

            return
        }

        if (interaction.customId === "yellow_role") {
            const userRoles = interaction.member.roles.cache.find(x =>
                x.name === "Red" ||
                x.name === "Blue" ||
                x.name === "Green" ||
                x.name === "Orange" ||
                x.name === "Cyan" ||
                x.name === "Violet" ||
                x.name === "Black"
            );
            const yellowRole = interaction.guild.roles.cache.find(x => x.name === "Yellow");
            const role = await interaction.member.roles.cache.get(yellowRole.id);

            if (userRoles) {
                interaction.member.roles.remove(userRoles);
                await interaction.member.roles.add(yellowRole);
                interaction.reply({
                    content: "Added Yellow Role",
                    ephemeral: true
                });
            } else {
                if (role) {
                    await interaction.member.roles.remove(yellowRole);
                    interaction.reply({
                        content: "Removed Yellow Role",
                        ephemeral: true
                    });
                } else {
                    await interaction.member.roles.add(yellowRole);
                    interaction.reply({
                        content: "Added Yellow Role",
                        ephemeral: true
                    });
                }
            }

            return
        }
    }
}