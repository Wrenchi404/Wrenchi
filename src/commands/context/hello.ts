import { ContextMenuCommandBuilder } from "@discordjs/builders"
import Wrenchi from "../../lib/Wrenchi"
import { ContextMenuInteraction, CommandInteractionOptionResolver } from "discord.js"

module.exports = {
  command: new ContextMenuCommandBuilder().setName("hello").setType(2),

  run: (client: Wrenchi, interaction: ContextMenuInteraction, options: CommandInteractionOptionResolver) => {
    interaction.reply(`<@${interaction.options.getUser("user")?.id}>, Hello!`);
  },
}