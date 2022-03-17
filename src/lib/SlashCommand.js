const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  CommandInteractionOptionResolver,
} = require("discord.js");
const Wrenchi = require("./Wrenchi");

class SlashCommand extends SlashCommandBuilder {
  constructor() {
    super();
    this.type = 1;
    return this;
  }
  /**
   * @param {(client: Wrenchi, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => Promise<any>} callback
   */
  setRun(callback) {
    this.run = callback;
    return this;
  }
}

module.exports = SlashCommand;