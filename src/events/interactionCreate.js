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
}