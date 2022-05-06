import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, CommandInteractionOptionResolver } from "discord.js"
import Wrenchi from "./Wrenchi.js"

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

export default SlashCommand