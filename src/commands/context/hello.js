const { ContextMenuCommandBuilder } = require("@discordjs/builders");
const KKRPClient = require("../../lib/Wrenchi");

module.exports = {
  command: new ContextMenuCommandBuilder().setName("Say Hello").setType(2),

  /**
   * @param {KKRPClient} client
   * @param {import("discord.js").GuildContextMenuInteraction} interaction
   */
  run: (client, interaction, options) => {
    interaction.reply(`<@${interaction.options.getUser("user").id}>, Hello!`);
  },
}