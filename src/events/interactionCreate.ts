import Wrenchi from "../lib/Wrenchi"
import TicketSetupSchema from "../models/TicketSetup"
import Ticket from "../models/Ticket"
import { CommandInteractionOptionResolver, Interaction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js"

export default async (client: Wrenchi, interaction: Interaction) => {
    if (interaction.channel.type === "DM") return

    if (interaction.isCommand()) {
        let command = client.SlashCommands.find(
            (x) => x.name == interaction.commandName
        );
        if (!command || !command.run)
            return interaction.reply(
                "Sorry the command you used doesn't have any run function"
            );
        command.run(client, interaction, interaction.options as CommandInteractionOptionResolver);
    } else if (interaction.isContextMenu()) {
        let command = client.ContextCommands.find((x) => x.name === interaction.commandName);
        if (!command || !command.run) return interaction.reply("Command doesn't exists");

        command.run(client, interaction);
    }

    if (interaction.isButton()) {
        const TicketSetup = TicketSetupSchema.findOne({ ticketGuild: interaction.guild.id });

        if (interaction.message.id === (await TicketSetup).ticketMessage) {
            const TicketChannel = await interaction.guild.channels.create("ticket-" + interaction.user.username, {
                type: "GUILD_TEXT",
                permissionOverwrites: [
                    {
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "ATTACH_FILES"],
                        id: interaction.user.id,
                        type: "member"
                    },
                    {
                        deny: ["VIEW_CHANNEL"],
                        id: interaction.guild.id,
                        type: "role"
                    }
                ]
            });
            interaction.reply({ content: `Made an ticket <#${TicketChannel.id}>`, ephemeral: true });

            const TicketEmbed = new MessageEmbed()
                .setTitle(`${interaction.user.username}'s Ticket`)
                .setDescription(`Click the below button to close the ticket`)
                .setThumbnail(interaction.user.displayAvatarURL())
                .setTimestamp();

            const CloseButton = new MessageButton()
                .setCustomId("close_ticket")
                .setEmoji("🔒")
                .setLabel("Close Ticket")
                .setStyle("DANGER");
            const Row = new MessageActionRow().addComponents(CloseButton);
            const TicketMessage = await TicketChannel.send({ embeds: [TicketEmbed], components: [Row] });

            Ticket.create({
                channel: TicketChannel.id,
                guild: interaction.guild.id,
                user: interaction.user.id,
                welcomeMessage: TicketMessage.id,
                status: "OPENED"
            });
        }

        const ticket = Ticket.findOne({ welcomeMessage: interaction.message.id });
        if (interaction.message.id === (await ticket).welcomeMessage) {
            const TicketSetup = Ticket.findOne({ channel: interaction.channel.id });

            const TicketChannel = (await ticket).channel;
            const channel = interaction.guild.channels.cache.get(TicketChannel)
            if (!channel || channel.type !== "GUILD_TEXT" || channel === undefined) return TicketSetup.remove();

            const TicketMessage = await channel.messages.fetch(interaction.message.id);
            if (TicketMessage === undefined) return TicketSetup.remove();

            if (TicketMessage) {
                interaction.reply("Deleting the ticket");

                setTimeout(() => {
                    channel.delete();
                    TicketSetup.remove();
                });
            }
        }
    }
}