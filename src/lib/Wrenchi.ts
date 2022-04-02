import { Client, Collection } from "discord.js"
import Config from "../../data/config.json"
import fs from "fs"
import path from "path"
import SlashCommand from "./SlashCommand"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import LoadCommands from "../utils/loadCommands"

class Wrenchi extends Client {
    config: typeof Config;
    LegacyCommands: Collection<string, any> = new Collection();
    SlashCommands = new Collection<string, SlashCommand>();
    ContextCommands = new Collection();
    constructor(props = {
        intents: 32767,
    }) {
        super(props);

        this.config = Config;
        this.LegacyCommands = new Collection();
        this.SlashCommands = new Collection();
        this.ContextCommands = new Collection();
        this.deployCommands();
        this.loadEvents();
        this.loadCommands();
    }

    build() {
        console.log("Started Bot..........")
        this.login(this.config.Bot.Token);
    }

    async deployCommands() {
        const rest = new REST({ version: "9" }).setToken(Config.Bot.Token);
        const commands: any[] = await LoadCommands().then((cmds: any) => {
            return [].concat(cmds.slash).concat(cmds.context);
        });

        console.log("Deploying commands to guild...");
        await rest
            .put(Routes.applicationGuildCommands(Config.Bot.ClientID, Config.Discord.TestGuildID), {
                body: commands,
            })
            .catch(console.log);
        console.log("Successfully deployed commands!");
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
            if (!files.length) return console.log("No legacy commands found.");
            if (err) throw err;
            else
                files.forEach((file) => {
                    const command: any = require(LegacyDir + "/" + file);
                    this.LegacyCommands.set(command.info.name, command);
                    console.log("Legacy Command Loaded: " + file.split(".")[0]);
                });
        });

        let SlashDir = path.join(__dirname, "..", "commands", "slash");
        fs.readdir(SlashDir, (err, files) => {
            if (!files.length) return console.log("No slash commands found.");
            if (err) console.log(err);
            else
                files.forEach((file) => {
                    let command = require(SlashDir + "/" + file);
                    if (!command.name || !command.description || !command.run)
                        return console.log(
                            "Unable to load Command: " +
                            file.split(".")[0] +
                            ", Reason: File doesn't had run/name/desciption"
                        );

                    this.SlashCommands.set(file.split(".")[0].toLowerCase(), command);
                    console.log("Slash Command Loaded: " + file.split(".")[0]);
                });
        });

        let ContextDir = path.join(__dirname, "..", "commands", "context");
        fs.readdir(ContextDir, (err, files) => {
            if (!files.length) return console.log("No context commands found.");
            if (err) throw err;
            else
                files.forEach((file) => {
                    let cmd = require(ContextDir + "/" + file);
                    if (!cmd.command || !cmd.run)
                        return console.log(
                            "Unable to load Command: " +
                            file.split(".")[0] +
                            ", File doesn't have either command/run"
                        );
                    this.ContextCommands.set(file.split(".")[0].toLowerCase(), cmd);
                    console.log("ContextMenu Loaded: " + file.split(".")[0]);
                });
        });
    }
}

export default Wrenchi;