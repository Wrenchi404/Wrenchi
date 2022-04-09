import { ContextMenuCommandBuilder } from "@discordjs/builders"
import { ContextMenuInteraction } from "discord.js"
import Wrenchi from "./Wrenchi"

class ContextCommand extends ContextMenuCommandBuilder {
    public run: (client: Wrenchi, interaction: ContextMenuInteraction) => Promise<any>;

    constructor() {
        super();
        return this;
    }

    public setRun(callback: (client: Wrenchi, interaction: ContextMenuInteraction) => Promise<any>) {
        this.run = callback
        return this;
    }
}

export default ContextCommand