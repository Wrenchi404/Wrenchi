const { Client, Collection, Message } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Manager } = require("erela.js");
const path = require("path");
const Config = require("../data/config");
const SlashCommand = require("./SlashCommand");
const HandleError = require("../utils/HandleError");
const GetChannel = require("../utils/GetChannel");
const fs = require("fs");
const ytdl = require("ytdl-core");

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

module.exports = class Wrenchi extends Client {
    // Config
    Config = Config

    // REST
    devMode = process.argv.includes("--dev");
    prodMode = process.argv.includes("--prod");
    devRest = new REST({ version: "9" }).setToken(this.Config.Client.Token);

    // Commands
    SlashDir = path.join(__dirname, "..", "commands", "slash");
    LegacyDir = path.join(__dirname, "..", "commands", "legacy");
    EventsDir = path.join(__dirname, "events");
    
    // Collections
    /**@type {Collection<string, ICommand>} LegacyCommands */
    LegacyCommands = new Collection();

    /**@type {Collection<string, SlashCommand>} SlashCommands */
    SlashCommands = new Collection();

    /**@type {Collection<string, Message | import("discord-api-types/v9").APIMessage>} */
    NowPlayingMessage = new Collection();

    // Music
    /**@type {Manager} Manager*/
    Manager = new Manager({
        nodes: [
            {
                host: this.Config.Lavalink.Host,
                port: this.Config.Lavalink.Port,
                password: this.Config.Lavalink.Password,
                identifier: this.Config.Lavalink.Identifier,
                retryAmount: this.Config.Lavalink.RetryAmount,
                retryDelay: this.Config.Lavalink.RetryDelay
            }
        ],
        send: (id, payload) => {
            let guild = this.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        },
        autoPlay: true,
        clientName: "Wrenchi",
        clientId: "404",
    })
        // Node Events
        .on("nodeCreate", (node) => console.log(`Node Created: ${node.options.identifier}`))
        .on("nodeConnect", (node) => console.log(`Connected to Node: ${node.options.identifier}`))
        .on("nodeDestroy", (node) => console.warn(`Node: ${node.options.identifier} has been destroyed.`))
        .on("nodeDisconnect", (node, reason) => console.warn(`Node: ${node.options.identifier} disconnected. Code: ${reason.code}, Reason: ${reason.reason}`))
        .on("nodeError", (node, err) => console.error(`Error on Node: ${node.options.identifier}`, err))
        .on("nodeReconnect", (node) => console.warn(`Reconnecting to Node: ${node.options.identifier}`))

        // Player Events
        .on("playerCreate", (player) => console.log(`Player Created: ${player.guild}`))
        .on("playerDestroy", (player) => console.log(`Player Destroyed: ${player.guild}`))
        .on("playerMove", (player, oldChannel, newChannel) => {
            const guild = this.guilds.cache.get(player.guild);
            if (!guild) return;
            const channel = guild.channels.cache.get(player.textChannel);
            if (oldChannel === newChannel) return;
            if (newChannel === null || !newChannel) {
                if (!player) return;
                if (channel.type === "GUILD_TEXT")
                    channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor("RED")
                                .setDescription(`Disconnected from <#${oldChannel}>`),
                        ],
                    });
                return player.destroy();
            } else {
                player.voiceChannel = newChannel;
                setTimeout(() => player.pause(false), 1000);
                return undefined;
            }
        })

        // Track Events
        .on("trackStart", async (player, track) => {
            this.user.setPresence({ activities: [{ name: `To ${track.title}`, type: "LISTENING" }], status: "dnd" });

            const msg = this.NowPlayingMessage.get(player.guild);
            if (msg === undefined) return;

            if (msg) {
                const song = await ytdl.getInfo(track.uri);

                let embed = msg.embeds[0]
                embed.setDescription(`**Current Song:** [${track.title}](${track.uri})`)
                embed.setThumbnail(player.queue.current.thumbnail)
                embed.fields[0].value = `${track.author}`
                embed.fields[1].value = `${await this.getSubs(track.uri)}`
                embed.fields[2].value = `${song.videoDetails.category}`
                embed.fields[3].value = `${await this.getDuration(track.duration)}`
                embed.fields[4].value = `${await this.getLikes(track.uri)}`
                embed.fields[5].value = `${song.videoDetails.publishDate}`
                embed.fields[6].value = `${player.playing ? "Playing" : "Paused"}`
                embed.setFooter({ text: `Next on queue: ${player.queue.size ? player.queue[0].title : "Nothing in queue"}` })

                msg.edit({ embeds: [embed] })
            }
        })
        .on("trackEnd", async (player, track, payload) => {
            this.user.setPresence({ activities: [{ name: "Wrench's Codes", type: "WATCHING" }], status: "dnd" });
        })
        .on("trackError", (player, track, error) => {
            console.error(`Track Error: ${track.title} in ${player.options.guild}`, error);
            this.user.setPresence({ activities: [{ name: "Wrench's Codes", type: "WATCHING" }], status: "dnd" });
            player.destroy();

            const msg = this.NowPlayingMessage.get(player.guild);
            if (msg === undefined) return;
            if (msg) {
                msg.delete()
            }
        })
        .on("trackStuck", (player, track, payload) => {
            console.warn(`Track Stuck: ${track.title} in ${player.options.guild}. Reason: ${payload.thresholdMs.toFixed()}ms threshold reached.`);
            this.user.setPresence({ activities: [{ name: "Wrench's Codes", type: "WATCHING" }], status: "dnd" });
            player.destroy();
        })

        // Queue Event
        .on("queueEnd", (player, track, payload) => {
            this.user.setPresence({ activities: [{ name: "Wrench's Codes", type: "WATCHING" }], status: "dnd" });
            player.destroy();

            const msg = this.NowPlayingMessage.get(player.guild);
            if (msg === undefined) return;

            if (msg) {
                msg.delete()
                this.NowPlayingMessage.delete(player.guild);
            }
        })

        // Socket Event
        .on("socketClosed", (player, payload) => console.warn(`Socket Closed in ${player.options.guild}. Readon: ${payload.reason}, Code: ${payload.code}`));

        // Utils
        getChannel = GetChannel

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
                const SlashFiles = fs.readdirSync(path.join(this.SlashDir, SlashCategory));
                for (const SlashFile of SlashFiles) {
                    const Command = await import(path.join(this.SlashDir, SlashCategory, SlashFile));
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
                const Command = await import(path.join(this.LegacyDir, LegacyFile));
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
                const event = await import(path.join(this.EventsDir, EventFile));
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
        console.log(this.SlashDir)
        if (this.devMode) console.warn("Starting in dev mode...");
        console.log("Starting Wrenchi...");
        await HandleError(this)
        await this.loadCommands().then(async () => await this.registerCommands());
        this.loadLegacy();
        this.loadEvents();
        await this.login(this.Config.Client.Token);
    }
}