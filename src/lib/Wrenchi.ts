import { Client, ClientOptions, Collection, Message } from "discord.js"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import fs from "fs"
import { join } from "path"
import mongoose from "mongoose"
import { Manager } from "erela.js"
import Config from "../../data/config"
import SlashCommand from "./SlashCommand"
import connectMongo from "../utils/connectMongo"

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
        this.config.Token
    );
    public db: mongoose.Mongoose;

    public Manager = new Manager({
        nodes: [
            {
                host: this.config.Erela.Host,
                port: this.config.Erela.Port,
                password: this.config.Erela.Password,
                identifier: this.config.Erela.Identifier,
            }
        ],
        send: (id, payload) => {
            let guild = this.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        }
    })
    // Node Events
    .on("nodeCreate", (node) => console.log(`Node Created: ${node.options.identifier}`))
    .on("nodeConnect", (node) => console.log(`Connected to Node: ${node.options.identifier}`))
    .on("nodeDestroy", (node) => console.warn(`Node: ${node.options.identifier} has been destroyed.`))
    .on("nodeDisconnect", (node, reason) => console.warn(`Node: ${node.options.identifier} disconnected. Code: ${reason.code}, Reason: ${reason.reason}`))
    .on("nodeError", (node, err) => console.error(`Error on Node: ${node.options.identifier}`, err))
    .on("nodeReconnect", (node) => console.warn(`Reconnecting to Node: ${node.options.identifier}`))

    public LegacyCommands = new Collection<string, ICommand>();
    public SlashCommands = new Collection<string, SlashCommand>();
    public ContextCommands = new Collection<string, any>();

    private readonly LegacyDir = join(__dirname, "..", "commands", "legacy");
    private readonly SlashDir = join(__dirname, "..", "commands", "slash");
    private readonly ContextDir = join(__dirname, "..", "commands", "context");
    private readonly EventsDir = join(__dirname, "..", "events");

    constructor(props: ClientOptions = {
        intents: 32767,
    }) {
        super(props);
    }

    public async loadCommands() {
        console.warn(`Loading "/" Commands`)
        return new Promise(async (resolve, reject) => {
            const SlashFiles = fs.readdirSync(this.SlashDir);
            if (!SlashFiles) return console.error(`No "/" Commands Founded`);
            for (const SlashFile of SlashFiles) {
                const { Command } = await import(join(this.SlashDir, SlashFile));
                this.SlashCommands.set(Command.name, Command);
                console.log(`Loaded Slash Command: ${Command.name}`);
            }
            resolve(this.loadCommands);
        });
    }

    public async loadLegacyCommands() {
        console.warn(`Loading Legacy Commands`)
        return new Promise(async (resolve, reject) => {
            const LegacyFiles = fs.readdirSync(this.LegacyDir);
            if (!LegacyFiles.length) return console.error("No Legacy Commands Founded");
            for (const LegacyFile of LegacyFiles) {
                const { Command } = await import(join(this.LegacyDir, LegacyFile));
                this.LegacyCommands.set(Command.info.name, Command);
                console.log(`Loaded Legacy Command: ${Command.info.name}`);
            }
            resolve(this.loadLegacyCommands);
        });
    }

    public async loadContext() {
        return new Promise(async (resolve, reject) => {
            const ContextFiles = fs.readdirSync(this.ContextDir);
            if (!ContextFiles) return console.error("No Context Commands Founded");
            for (const ContextFile of ContextFiles) {
                const { Context } = await import(join(this.ContextDir, ContextFile));
                this.ContextCommands.set(Context.name, Context);
                console.log(`Loaded Context: ${Context.name}`);
            }
            resolve(this.ContextCommands);
        });
    }

    public async loadEvents() {
        console.warn("Loading Events...");
        return new Promise(async (resolve) => {
            const EventFiles = fs.readdirSync(this.EventsDir);
            if (!EventFiles) return console.error("No Events Founded");
            for (const EventFile of EventFiles) {
                const { default: event } = await import(join(this.EventsDir, EventFile));
                this.on(EventFile.split(".")[0], event.bind(null, this));
                console.log(`Loaded Event: ${EventFile.split(".")[0]}`);
            }
        });
    }

    private async registerCommands(global = false) {
        let commands: any[] = [...this.SlashCommands, ...this.ContextCommands];
        let cmdz: any[] = []

        for (const command of commands) {
            cmdz.push(command[1].toJSON());
        }

        if (global) {
            console.warn("Registering global commands...");
            await this.devRest.put(Routes.applicationCommands(this.config.ClientID), {
                body: cmdz,
            }).catch(console.error);
            console.log("Successfully registered global commands!");
        } else {
            console.warn("Deploying commands to guild...");
            await this.devRest
                .put(
                    Routes.applicationGuildCommands(
                        this.config.ClientID,
                        this.config.Dev.Guild
                    ),
                    {
                        body: cmdz,
                    }
                )
                .catch(console.error);
            console.log("Successfully deployed commands!");
        }
    }

    public async connectDatabase() {
        await connectMongo(this);
    }

    public async start() {
        if (this.devMode) console.warn("Starting in dev mode");
        console.log("Wrenchi is starting.....");
        await this.loadCommands().then(async () => await this.registerCommands());
        this.loadLegacyCommands();
        this.loadEvents();
        await this.login(this.config.Token);
    }
}

export default Wrenchi;