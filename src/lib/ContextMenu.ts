import { ContextMenuCommandBuilder } from "@discordjs/builders"
import { ContextMenuInteraction } from "discord.js"
import Wrenchi from "./Wrenchi"

class ContextMenu extends ContextMenuCommandBuilder {
    public run: (client: Wrenchi, menu: ContextMenuInteraction) => Promise<any>
    constructor() {
        super()
        return this
    }

    setRun(callback: (client: Wrenchi, menu: ContextMenuInteraction) => Promise<any>) {
        this.run = callback
        return this
    }
}


export default ContextMenu