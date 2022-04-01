import { Client, Collection } from "discord.js"
import Config from "../../data/config.json"
import fs from "fs"
import path from "path"
import SlashCommand from "./SlashCommand";

let SlashCollection = new Collection<String, SlashCommand>();

class Wrenchi extends Client {
    config: typeof Config;
    contextCommands: any;
    slashCommands: typeof SlashCollection;
    legacyCommands: any;
    loadCommands: any;
    loadEvents: any;
    constructor(props = {
        intents: 32767,
    }) {
        super(props);

        this.config = Config;
        this.slashCommands = new Collection<String, SlashCommand>();
        this.contextCommands = new Collection();
        this.legacyCommands = new Collection();
        // this.loadCommands
        this.loadEvents
    }

    build() {
        console.log("Started Bot..........")
        this.login(this.config.Bot.Token);
    }

    LoadEvents() {
        let EventsDir = path.join(__dirname, "..", "events");
        fs.readdir(EventsDir, (err, files) => {
            if (!files.length) return console.log("No events found.");

            if (err) throw err;
            else
                files.forEach(async (file) => {
                    const event = await import(EventsDir + "/" + file);
                    this.on(file.split(".")[0], event.bind(null, this));
                    console.log("Event Loaded: " + file.split(".")[0]);
                });
        });
    }

    // LoadCommands() {
    //     let SlashCommandsDirectory = path.join(
    //         __dirname,
    //         "..",
    //         "commands",
    //         "slash"
    //     );
    //     fs.readdir(SlashCommandsDirectory, async (err, files) => {
    //         if (!files.length) return console.log("No slash commands found.");
    //         if (err) throw err;
    //         else
    //             files.forEach(async (file) => {
    //                 let cmd = await import(SlashCommandsDirectory + "/" + file);

    //                 if (!cmd || !cmd.run)
    //                     return console.log(
    //                         "Unable to load Command: " +
    //                         file.split(".")[0] +
    //                         ", File doesn't have an valid command with run function"
    //                     );
    //                 this.slashCommands.set(file.split(".")[0].toLowerCase(), cmd);
    //                 console.log("Slash Command Loaded: " + file.split(".")[0]);
    //             });
    //     });

    //     let ContextCommandsDirectory = path.join(
    //         __dirname,
    //         "..",
    //         "commands",
    //         "context"
    //     );
    //     fs.readdir(ContextCommandsDirectory, async (err, files) => {
    //         if (!files.length) return console.log("No context commands found.");
    //         if (err) throw err;
    //         else
    //             files.forEach(async (file) => {
    //                 let cmd = await import(ContextCommandsDirectory + "/" + file);
    //                 if (!cmd.command || !cmd.run) return console.log("Unable to load Command: " + file.split(".")[0] + ", File doesn't have either command/run");
    //                 this.contextCommands.set(file.split(".")[0].toLowerCase(), cmd);
    //                 console.log("ContextMenu Loaded: " + file.split(".")[0]);
    //             });
    //     });

    //     let CommandsDirectory = path.join(
    //         __dirname,
    //         "..",
    //         "commands",
    //         "command"
    //     );
    //     fs.readdir(CommandsDirectory, async (err, files) => {
    //         if (!files.length) return console.log("No legacy commands found.");
    //         if (err) console.log(err);
    //         else
    //             files.forEach(async (file) => {
    //                 let command = await import(CommandsDirectory + "/" + file);
    //                 if (!command.name || !command.description || !command.run)
    //                     return console.log(
    //                         "Unable to load Command: " +
    //                         file.split(".")[0] +
    //                         ", Reason: File doesn't had run/name/desciption"
    //                     );
    //                 this.legacyCommands.set(file.split(".")[0].toLowerCase(), command);
    //                 console.log("Command Loaded: " + file.split(".")[0]);
    //             });
    //     });
    // }
}

export default Wrenchi;