import { ContextMenuCommandBuilder } from "@discordjs/builders"
import { ContextMenuInteraction } from "discord.js"
import Wrenchi from "../../lib/Wrenchi"

const command = {
    command: new ContextMenuCommandBuilder().setName("Hello").setType(2),
    run: async (client: Wrenchi, interaction: ContextMenuInteraction, options: any) => {
        await interaction.reply(`Hello man!`);
    }
}

export default command;