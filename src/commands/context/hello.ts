import ContextMenu from "../../lib/ContextMenu"

const Command = new ContextMenu()
    .setName("Hello")
    .setType(2)
    .setRun(async (client, interaction) => {
        await interaction.reply({ content: "Sup bro" });
    })

export { Command }