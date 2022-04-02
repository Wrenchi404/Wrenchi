import { ContextMenuCommandBuilder } from "@discordjs/builders"
import { ContextMenuInteraction } from "discord.js"
import Wrenchi from "../../lib/Wrenchi"

module.exports = {
    command: new ContextMenuCommandBuilder().setName("Say Hello").setType(2),

    run: (client: Wrenchi, interaction: ContextMenuInteraction, options: any) => {
        interaction.reply(`<@${interaction.options.getUser("user").id}>, Hello!`);
    },
}