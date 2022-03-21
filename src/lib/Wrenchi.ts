import { Client, Collection } from "discord.js"
import Config from "../data/config"

class Wrenchi extends Client {
    config: any;
    contextCommands: any;
    slashCommands: any;
    legacyCommands: any;
    loadCommands: any;
    constructor(props = { 
        intents: 32767,
    }) {
        super(props);

        this.config = Config;
        this.contextCommands = new Collection();
        this.slashCommands = new Collection();
        this.legacyCommands = new Collection()
        this.loadCommands;
    }
}