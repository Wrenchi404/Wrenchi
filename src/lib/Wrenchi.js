const { Client, Collection, Message } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { join } = require("path");
const Config = require("../../data/config");
const SlashCommand = require("./SlashCommand");
const fs = require("fs");

const ICommand = {
    info: {
        name: new String,
        description: new String,
        aliases: new Array(new String),
    },

    /** 
     * @param {Client} client 
     * @param {Message} message
     * @param {Array<String>} args
    */
    run: (client, message, args) => Promise.resolve()
}

class Wrenchi extends Client {
    // Config
    Config = Config

    // REST
    devMode = process.argv.includes("--dev");
    prodMode = process.argv.includes("--prod");
    devRest = new REST({ version: "9" }).setToken(this.Config.Client.Token);

    // Commands
    SlashDir = join(__dirname, "..", "commands", "slash");
    LegacyDir = join(__dirname, "..", "commands", "legacy");
    EventsDir = join(__dirname, "..", "events");

    // Collections
    /**@type Collection<string, ICommand> */
    LegacyCommands = new Collection();

    /**@type Collection<string, SlashCommand> */
    SlashCommands = new Collection();

    /**@param  {import("discord.js").ClientOptions} props */
    constructor(props = {
        intents: 32767
    }) {
        super(props);
    }

    async loadCommands() {
        return new Promise(async (resolve, reject) => {
            const SlashCategories = fs.readdirSync(this.SlashDir);
            for (const SlashCategory of SlashCategories) {
                const SlashFiles = fs.readdirSync(join(this.SlashDir, SlashCategory));
                for (const SlashFile of SlashFiles) {
                    const Command = await require(join(this.SlashDir, SlashCategory, SlashFile));
                    Command.category = SlashCategory;
                    this.SlashCommands.set(Command.name, Command);
                    console.log(`Loaded Slash Command: ${Command.name}`);
                }
            }
            resolve(this.loadCommands);
        });
    }

    async loadLegacy() {
        return new Promise(async (resolve, reject) => {
            const LegacyFiles = fs.readdirSync(this.LegacyDir);
            for (const LegacyFile of LegacyFiles) {
                const Command = await require(join(this.LegacyDir, LegacyFile));
                this.LegacyCommands.set(Command.info.name, Command);
                console.log(`Loaded Legacy Command: ${Command.info.name}`);
            }
            resolve(this.loadLegacyCommands);
        });
    }

    async loadEvents() {
        return new Promise(async (resolve) => {
            const EventFiles = fs.readdirSync(this.EventsDir);
            if (!EventFiles) return console.error("No Events Founded");
            for (const EventFile of EventFiles) {
                const event = await require(join(this.EventsDir, EventFile));
                this.on(EventFile.split(".")[0], event.bind(null, this));
                console.log(`Loaded Event: ${EventFile.split(".")[0]}`);
            }
        });
    }

    async registerCommands(global = false) {
        let commands = [...this.SlashCommands];
        let cmdz = []

        for (const command of commands) {
            cmdz.push(command[1].toJSON());
        }

        if (global) {
            console.warn("Registering global commands...");
            await this.devRest.put(Routes.applicationCommands(this.Config.Client.ClientID), {
                body: cmdz,
            }).catch(console.error);
            console.log("Successfully registered global commands!");
        } else {
            console.warn("Deploying commands to guild...");
            await this.devRest
                .put(
                    Routes.applicationGuildCommands(
                        this.Config.Client.ClientID,
                        this.Config.Discord.GuildID
                    ),
                    {
                        body: cmdz,
                    }
                )
                .catch(console.error);
            console.log("Successfully deployed commands!");
        }
    }

    async start() {
        if (this.devMode) console.warn("Starting in dev mode...");
        console.log("Starting Wrenchi...");
        await this.loadCommands().then(async () => await this.registerCommands());
        this.loadLegacy();
        this.loadEvents();
        await this.login(this.Config.Client.Token);
    }
}

module.exports = Wrenchi