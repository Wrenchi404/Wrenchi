import Wrenchi from "../lib/Wrenchi"
import {
    CommandInteractionOptionResolver,
    Interaction,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} from "discord.js"

interface ITickets {
    guildID: string,
    channelID: string,
    username: string,
    userID: string,
    state: string,
    createdAt: Date,
    deletedAt: Date
}

export default async (client: Wrenchi, interaction: Interaction) => {
    const mysql = await client.mysql;

    if (interaction.isCommand()) {
        let command = client.SlashCommands.find(
            (x) => x.name == interaction.commandName
        );

        command.run(client, interaction, interaction.options as CommandInteractionOptionResolver);
    } else if (interaction.isContextMenu()) {
        let command = client.ContextCommands.find((x) => x.name === interaction.commandName);
        if (!command || !command.run) return interaction.reply("Command doesn't exists");

        command.run(client, interaction);
    } else if (interaction.isButton()) {
        if (interaction.customId === "ticket_open") {
            const getTickets = "SELECT * FROM tickets WHERE userID = ?"
            const query = mysql.query(getTickets, [interaction.user.id]);
            await interaction.reply({ content: "Getting ready to open a ticket...." });
            // await interaction.deferReply({ ephemeral: true });

            query.on("result", async (res: any, index) => {
                if (res.userID === interaction.user.id) {
                    await interaction.editReply({ content: "You already have an open ticket" });
                    return
                }

                await interaction.deferReply({ ephemeral: true, fetchReply: true });

                const ticketChannel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
                    permissionOverwrites: [
                        {
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ADD_REACTIONS", "ATTACH_FILES"],
                            id: interaction.user.id
                        },
                        {
                            deny: ["VIEW_CHANNEL"],
                            id: interaction.guild.id
                        }
                    ]
                });

                await interaction.followUp({ content: `Ticket has been created: <#${ticketChannel.id}>`, ephemeral: true, fetchReply: true });
                if (ticketChannel.type === "GUILD_TEXT") {
                    const closeButton = new MessageButton()
                        .setCustomId("ticket_close")
                        .setLabel("🔒")
                        .setStyle("DANGER")

                    const embed = new MessageEmbed()
                        .setAuthor({ name: `Hello ${interaction.user.username}` })
                        .addFields([
                            {
                                name: "How to close the ticket?",
                                value: "Click 🔒 to close the ticket"
                            }
                        ])
                        .setFooter({ text: `Ticket opened at ${new Date().toLocaleString()}` });

                    await ticketChannel.send({ embeds: [embed], components: [new MessageActionRow().addComponents(closeButton)] });
                    const query = "INSERT INTO tickets (guildID, channelID, username, userID, state, createdAt) VALUES (?)"
                    const values = [interaction.guild.id, ticketChannel.id, interaction.user.username, interaction.user.id, "Opened", new Date()]

                    mysql.query(query, [values], (err, result: any) => {
                        if (err) throw err;
                        console.log("Number of records inserted: " + result.affectedRows);
                    });
                }
            });
        }
    }
}