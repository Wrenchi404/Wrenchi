import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, CommandInteractionOptionResolver } from "discord.js"
import Wrenchi from "./Wrenchi"

class SlashCommand extends SlashCommandBuilder {
    public type: Number;
    run: (client: Wrenchi, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => Promise<any>;
    constructor() {
        super();
        this.type = 1
        return this;
    }

    setRun(callback: (client: Wrenchi, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => Promise<any>) {
        this.run = callback
        return this;
    }
}

export default SlashCommand