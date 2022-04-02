import { Client, Collection } from "discord.js"
import Config from "../../data/config.json"
import fs from "fs"
import path from "path"

class Wrenchi extends Client {
    config: typeof Config;
    LegacyCommands: Collection<string, any> = new Collection();
    constructor(props = {
        intents: 32767,
    }) {
        super(props);

        this.config = Config;
        this.LegacyCommands = new Collection();
        this.loadEvents();
        this.loadCommands();
    }

    build() {
        console.log("Started Bot..........")
        this.login(this.config.Bot.Token);
    }

    loadEvents() {
        let EventsDir = path.join(__dirname, "..", "events");
        fs.readdir(EventsDir, (err, files) => {
            if (!files.length) return console.log("No events found.");
            if (err) throw err;
            else
                files.forEach((file) => {
                    const event: any = require(EventsDir + "/" + file);
                    this.on(file.split(".")[0], event.bind(null, this));
                    console.log("Event Loaded: " + file.split(".")[0]);
                });
        });
    }

    loadCommands() {
        let LegacyDir = path.join(__dirname, "..", "commands", "legacy");

        fs.readdir(LegacyDir, (err, files) => {
            if (!files.length) return console.log("No commands found.");
            if (err) throw err;
            else
                files.forEach((file) => {
                    const command: any = require(LegacyDir + "/" + file);
                    this.LegacyCommands.set(command.info.name, command);
                    console.log("Command Loaded: " + file.split(".")[0]);
                });
        });
    }
}

export default Wrenchi;