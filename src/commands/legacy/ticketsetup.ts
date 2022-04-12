import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js"
import TicketSetupSchema from "../../models/TicketSetup"
import Wrenchi from "../../lib/Wrenchi"

const Command = {
    info: {
        name: "ticketsetup",
        description: "Ticket setup command",
        aliases: ["tsetup"],
    },

    run: async function (client: Wrenchi, message: Message, args: string[]) {
        if (message.member.permissions.has("ADMINISTRATOR")) {
            const TicketButton = new MessageButton()
                .setCustomId("ticket_setup")
                .setEmoji("🎫")
                .setLabel("Open Ticket")
                .setStyle("SUCCESS");  
            const Row = new MessageActionRow().addComponents(TicketButton);

            const TicketSetupEmbed = new MessageEmbed()
                .setColor("AQUA")
                .setTitle("Ticket System")
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(`Click the button to create a ticket`)
                .setTimestamp();

            const TicketMessage = await message.channel.send({ embeds: [TicketSetupEmbed], components: [Row] });
            
            TicketSetupSchema.create({
                ticketChannel: TicketMessage.channel.id,
                ticketGuild: TicketMessage.guild.id,
                ticketMessage: TicketMessage.id,
            });
        }
    },
};

export { Command }