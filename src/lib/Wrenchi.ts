import { Client, ClientOptions, Collection, Message } from "discord.js"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import fs from "fs"
import path from "path"
import Config from "../../data/config"
import SlashCommand from "./SlashCommand"

export interface ICommand {
    info: {
        name: string,
        description: string,
        aliases: string[]
    },

    run: (client: Client, message: Message, args: string[]) => Promise<void>
}

class Wrenchi extends Client {
    public readonly config = Config;
    public readonly devMode: boolean = process.argv.includes("--dev");
    public readonly prodMode: boolean = process.argv.includes("--prod");
    public readonly devRest = new REST({ version: "9" }).setToken(
        this.config.token
    );

    public LegacyCommands = new Collection<string, ICommand>();
    public SlashCommands = new Collection<string, SlashCommand>();
    public ContextCommands = new Collection<string, any>();

    private readonly SlashDir = path.join(__dirname, "..", "commands", "slash");
    private readonly ContextDir = path.join(__dirname, "..", "commands", "context");
    private readonly EventsDir = path.join(__dirname, "..", "events");

    constructor(props: ClientOptions = {
        intents: 32767,
    }) {
        super(props);
    }

    public async loadSlashCommands() {
        return new Promise(async (resolve, reject) => {
            const SlashFiles = fs.readdirSync(this.SlashDir);
            for (const SlashFile of SlashFiles) {
                const { Command } = await import(path.join(this.SlashDir, SlashFile));
                this.SlashCommands.set(Command.name, Command);
                console.log(`Loaded Slash Command: ${Command.name}`);
            }
            resolve(this.loadSlashCommands);
        });
    }

    public async loadContextCommands() {
        return new Promise(async (resolve, reject) => {
            const ContextFiles = fs.readdirSync(this.ContextDir);
            for (const ContextFile of ContextFiles) {
                const { Context } = await import(path.join(this.ContextDir, ContextFile));
                this.ContextCommands.set(Context.name, Context);
                console.log(`Loaded Context: ${Context.name}`);
            }
            resolve(this.ContextCommands);
        });
    }

    public async loadEvents() {
        return new Promise(async (resolve) => {
            const EventFiles = fs.readdirSync(this.EventsDir);
            for (const EventFile of EventFiles) {
                const { default: event } = await import(path.join(this.EventsDir, EventFile));
                this.on(EventFile.split(".")[0], event.bind(this));
                console.log(`Loaded Event: ${EventFile.split(".")[0]}`);
            }
        })
    }

    private async registerCommands(global = false) {
        let commands: any[] = [...this.SlashCommands, ...this.ContextCommands];
        let cmdz: any[] = []

        for (const command of commands) {
            cmdz.push(command.toJSON());
        }

        if (global) {
            console.warn("Registering global commands...");
            await this.devRest.put(Routes.applicationCommands(this.config.clientID), {
                body: cmdz,
            });
            console.log("Successfully registered global commands!");
        } else {
            console.warn("Deploying commands to guild...");
            await this.devRest
                .put(
                    Routes.applicationGuildCommands(
                        this.config.clientID,
                        this.config.dev.guild
                    ),
                    {
                        body: cmdz,
                    }
                )
                .catch(console.error);
            console.log("Successfully deployed commands!");
        }
    }

    public async start() {
        if (this.devMode) console.warn("Starting in dev mode");
        if (this.devMode) this.registerCommands();
        if (this.prodMode) this.registerCommands(true);
        await this.login(this.config.token);
        console.log("Wrenchi is starting.....");

        await this.loadEvents();
        await this.loadSlashCommands();
        await this.loadContextCommands();
    }
}

export default Wrenchi;