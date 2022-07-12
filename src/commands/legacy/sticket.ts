import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js"
import Wrenchi from "../../lib/Wrenchi"

const Command = {
    info: {
        name: "sticket",
        description: "Ticket setup!",
    },

    run: async function (client: Wrenchi, message: Message, args: string[]) {
        const openTicketCategory = message.guild.channels.cache.find(channel => channel.name === "Opened Tickets");
        if (!openTicketCategory) {
            const msg = await message.channel.send("No Opened Tickets category found, making category.....");

            setTimeout(() => {
                message.guild.channels.create("Opened Tickets", {
                    type: "GUILD_CATEGORY",
                    position: 0
                });

                if (msg.deletable) msg.delete();
            }, 5000);
        }

        const closeTicketCategory = message.guild.channels.cache.find(channel => channel.name === "Closed Tickets");
        if (!closeTicketCategory) {
            const msg = await message.channel.send("No Closed Tickets category found, making category.....");

            setTimeout(() => {
                message.guild.channels.create("Closed Tickets", {
                    type: "GUILD_CATEGORY"
                });

                if (msg.deletable) msg.delete();
            }, 5000);
        }

        const ticketButton = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("ticket_open")
                    .setLabel("🎫")
                    .setStyle("SUCCESS")
            );

        const embed = new MessageEmbed()
            .setAuthor({ name: "Wrenchi Ticket System v1.0", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .addFields([
                {
                    name: "How to open a ticket?",
                    value: "Click the 🎫 button to open a ticket"
                },
                {
                    name: "About this system",
                    value: "The current ticket system is in the beta version now, so don't except so much."
                }
            ])
            .setFooter({ text: "Proudly made by Wrench#0012", iconURL: client.user.displayAvatarURL() });
        await message.channel.send({ embeds: [embed], components: [ticketButton] });
    },
};

export { Command }