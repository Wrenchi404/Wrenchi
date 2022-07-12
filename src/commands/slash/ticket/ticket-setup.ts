import { Modal, MessageActionRow, TextInputComponent, InteractionCollector } from "discord.js"
import SlashCommand from "../../../lib/SlashCommand"

const Command = new SlashCommand()
    .setName("ticket-setup")
    .setDescription("Ticket system yayyyyy!")
    .addChannelOption((option) => option.setName("channel").setDescription("Select the channel to send the ticket message"))
    .setRun(async (client, interaction, options) => {
        const channel = interaction.options.getChannel("channel");

        const modal = new Modal()
        .setCustomId("ticket_modal")
        .setTitle("Ticket Embed")

        const descriptionInput = new TextInputComponent()
        .setCustomId('descriptionInput')
        .setLabel("Description of the embed")
        .setStyle('PARAGRAPH');

        const firstActionRow = new MessageActionRow<TextInputComponent>().addComponents(descriptionInput);
        modal.addComponents(firstActionRow);
        await interaction.showModal(modal);

        const coll = new InteractionCollector(client, {
            interactionType: "MODAL_SUBMIT",
            guild: interaction.guild.id,
        });

        coll.on("collect", async (int) => {
            if (int.isModalSubmit()) {
                if (int.customId === "ticket_modal") {
                    // bye
                }
            }
        })
    });

export { Command }