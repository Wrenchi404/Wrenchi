const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, CommandInteractionOptionResolver } = require("discord.js");
const Wrenchi = require("./Wrenchi");
/**
    * 
    * @param {Wrenchi} client 
    * @param {CommandInteraction} interaction 
    * @param {CommandInteractionOptionResolver} options 
*/
const IRun = (client, interaction, options) => Promise.resolve()

class SlashCommand extends SlashCommandBuilder {
    type = new Number;

    /**
     * 
     * @param {Wrenchi} client 
     * @param {CommandInteraction} interaction 
     * @param {CommandInteractionOptionResolver} options 
     */
    run = (client, interaction, options) => Promise.resolve();

    constructor() {
        super()
        this.type = 1
        return this
    }

    /**
     * 
     * @param {IRun} callback 
     */
    setRun(callback) {
        this.run = callback
        return this
    }
}

module.exports = SlashCommand