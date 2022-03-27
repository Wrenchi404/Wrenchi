const Wrenchi = require("../../lib/Wrenchi");
const { Message, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const TicketSetup = require("../../models/ticket/TicketSetupSchema")

module.exports = {
    name: "ts",
    description: "Admin Command",
    /**
     *
     * @param {Wrenchi} client
     * @param {Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        if (message.author.id === client.config.Discord.OwnerID) {
            const ticketButton = new MessageButton()
                .setCustomId("ticket_button")
                .setEmoji("🎫")
                .setLabel("Open Ticket")
                .setStyle("SUCCESS");
            const ticketRow = new MessageActionRow().addComponents(ticketButton);

            const ticketEmbed = new MessageEmbed()
                .setAuthor({ name: "Ticket System", iconURL: client.user.avatarURL() })
                .setColor("AQUA")
                .setDescription("Click the button below to open a ticket.")
                .setFooter({ text: "Ticket System", iconURL: client.user.avatarURL() })
                .setTimestamp();

            const ticketMessage = await message.channel.send({
                embeds: [ticketEmbed],
                components: [ticketRow]
            });

            TicketSetup.create({
                guildID: message.guild.id,
                channelID: message.channel.id,
                messageID: ticketMessage.id
            });
        }
    }
}