const {
    Client,
    MessageEmbed,
    Collection,
} = require("discord.js");
const { Manager } = require("erela.js");
const getLavalink = require("../utils/getLavalink");
const getChannel = require("../utils/getChannel");
const handleError = require("../utils/handleError");
const Spotify = require("erela.js-spotify");
const moongose = require("mongoose");
const prettyMilliseconds = require("pretty-ms");
const fs = require("fs");
const path = require("path");

class Wrenchi extends Client {
    /**
     * @param {import("discord.js").ClientOptions} props
     */
    constructor(
        props = {
            intents: 32767,
        }
    ) {
        super(props);

        this.config = require("../../data/config")
        /**@type {Collection<string, import("./SlashCommand")} */
        this.slashCommands = new Collection();
        this.contextCommands = new Collection();
        this.commands = new Collection();
        this.LoadCommands();
        this.LoadEvents();
        this.handlerError = handleError(this);
        this.getLavalink = getLavalink;
        this.getChannel = getChannel;
        this.ms = prettyMilliseconds;
    }

    build() {
        console.log("Started the bot...");
        this.login(this.config.Client.Token);

        let client = this;

        this.Manager = new Manager({
            plugins: [
                new Spotify({
                    clientID: this.config.Spotify.ClientID,
                    clientSecret: this.config.Spotify.ClientSecret
                })
            ],
            nodes: [
                {
                    identifier: this.config.Lavalink.Identifier,
                    host: this.config.Lavalink.Host,
                    port: this.config.Lavalink.Port,
                    password: this.config.Lavalink.Password,
                    retryAmount: this.config.Lavalink.RetryAmount,
                    retryDelay: this.config.Lavalink.RetryDelay
                },
            ],
            send: (id, payload) => {
                let guild = client.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            },
        })
            .on("nodeConnect", (node) =>
                console.log(
                    `Node: ${node.options.identifier} | Lavalink node is connected.`
                )
            )
            .on("nodeReconnect", (node) =>
                console.log(
                    `Node: ${node.options.identifier} | Lavalink node is reconnecting.`
                )
            )
            .on("nodeDestroy", (node) =>
                console.log(
                    `Node: ${node.options.identifier} | Lavalink node is destroyed.`
                )
            )
            .on("nodeDisconnect", (node) =>
                console.log(
                    `Node: ${node.options.identifier} | Lavalink node is disconnected.`
                )
            )
            .on("nodeError", (node, err) =>
                console.log(
                    `Node: ${node.options.identifier} | Lavalink node has an error: ${err.message}`
                )
            )
            .on("trackError", (player, track) => {
                console.log(`Player: ${player.options.guild} | Track had an error.`)
                client.user.setPresence({ activities: [{ name: `To Wrench's Code`, type: "LISTENING" }], status: "dnd" });
            })
            .on("trackStuck", (player, track, threshold) => {
                console.log(`Player: ${player.options.guild} | Track is stuck.`)
                client.user.setPresence({ activities: [{ name: `To Wrench's Code`, type: "LISTENING" }], status: "dnd" });
            })
            .on("trackStart", (player, track) => {
                client.user.setPresence({ activities: [{ name: `To ${track.title}`, type: "LISTENING" }], status: "dnd" });
            })
            .on("playerMove", (player, oldChannel, newChannel) => {
                const guild = client.guilds.cache.get(player.guild);
                if (!guild) return;
                const channel = guild.channels.cache.get(player.textChannel);
                if (oldChannel === newChannel) return;
                if (newChannel === null || !newChannel) {
                    if (!player) return;
                    if (channel)
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
            .on("playerCreate", (player) =>
                console.log(
                    `Player: ${player.options.guild
                    } | A wild player has been created in ${client.guilds.cache.get(player.options.guild)
                        ? client.guilds.cache.get(player.options.guild).name
                        : "a guild"
                    }`
                )
            )
            .on("playerDestroy", (player) => {
                console.log(
                    `Player: ${player.options.guild
                    } | A wild player has been destroyed in ${client.guilds.cache.get(player.options.guild)
                        ? client.guilds.cache.get(player.options.guild).name
                        : "a guild"
                    }`
                );

                client.user.setPresence({ activities: [{ name: `To Wrench's Code`, type: "LISTENING" }], status: "dnd" });
            })
            .on("loadFailed", (node, type, error) =>
                console.log(
                    `Node: ${node.options.identifier} | Failed to load ${type}: ${error.message}`
                )
            )
            .on("queueEnd", (player) => {
                console.log(`Player: ${player.options.guild} | Queue has been ended`);
                let queueEmbed = this.Embed()
                    .setAuthor({
                        name: "The queue has ended",
                        iconURL: this.user.displayAvatarURL(),
                    })
                    .setFooter({ text: "Queue ended at" })
                    .setTimestamp();
                client.channels.cache
                    .get(player.textChannel)
                    .send({ embeds: [queueEmbed] });
                client.user.setPresence({ activities: [{ name: `To Wrench's Code`, type: "LISTENING" }], status: "dnd" });

                try {
                    if (!player.playing) {
                        setTimeout(() => {
                            if (!player.playing && player.state !== "DISCONNECTED") {
                                let DisconnectedEmbed = new MessageEmbed()
                                    .setColor("RED")
                                    .setAuthor({
                                        name: "Disconnected",
                                        iconURL: this.user.displayAvatarURL(),
                                    })
                                    .setDescription(
                                        `The player has been disconnected due to inactivity.`
                                    );
                                client.channels.cache
                                    .get(player.textChannel)
                                    .send({ embeds: [DisconnectedEmbed] });
                                player.destroy();

                                client.user.setPresence({ activities: [{ name: `To Wrench's Code`, type: "LISTENING" }], status: "dnd" });
                            } else if (player.playing) {
                                console.log(`Player: ${player.options.guild} | Still playing`);
                                client.user.setPresence({ activities: [{ name: `To ${player.queue.current.title}`, type: "LISTENING" }], status: "dnd" });
                            }
                        }, 1000 * 60 * 2);
                    }
                } catch (err) {
                    console.log(err)
                    client.user.setPresence({ activities: [{ name: `To Wrench's Code`, type: "LISTENING" }], status: "dnd" });
                }
            });
    }

    /**
     *
     * @param {string} text
     * @returns {MessageEmbed}
     */
    Embed(text) {
        let embed = new MessageEmbed().setColor("RED");
        if (text) embed.setDescription(text);
        return embed;
    }

    /**
     *
     * @param {string} text
     * @returns {MessageEmbed}
     */
    ErrorEmbed(text) {
        let embed = new MessageEmbed()
            .setColor("RED")
            .setDescription("❌ | " + text);

        return embed;
    }

    LoadEvents() {
        let EventsDir = path.join(__dirname, "..", "events");
        fs.readdir(EventsDir, (err, files) => {
            if (!files.length) return console.log("No events found.");
            if (err) throw err;
            else
                files.forEach((file) => {
                    const event = require(EventsDir + "/" + file);
                    this.on(file.split(".")[0], event.bind(null, this));
                    console.log("Event Loaded: " + file.split(".")[0]);
                });
        });
    }

    LoadCommands() {
        let SlashCommandsDirectory = path.join(
            __dirname,
            "..",
            "commands",
            "slash"
        );
        fs.readdir(SlashCommandsDirectory, (err, files) => {
            if (!files.length) return console.log("No slash commands found.");
            if (err) throw err;
            else
                files.forEach((file) => {
                    let cmd = require(SlashCommandsDirectory + "/" + file);

                    if (!cmd || !cmd.run)
                        return console.log(
                            "Unable to load Command: " +
                            file.split(".")[0] +
                            ", File doesn't have an valid command with run function"
                        );
                    this.slashCommands.set(file.split(".")[0].toLowerCase(), cmd);
                    console.log("Slash Command Loaded: " + file.split(".")[0]);
                });
        });

        let ContextCommandsDirectory = path.join(
            __dirname,
            "..",
            "commands",
            "context"
        );
        fs.readdir(ContextCommandsDirectory, (err, files) => {
            if (!files.length) return console.log("No context commands found.");
            if (err) throw err;
            else
                files.forEach((file) => {
                    let cmd = require(ContextCommandsDirectory + "/" + file);
                    if (!cmd.command || !cmd.run)
                        return console.log(
                            "Unable to load Command: " +
                            file.split(".")[0] +
                            ", File doesn't have either command/run"
                        );
                    this.contextCommands.set(file.split(".")[0].toLowerCase(), cmd);
                    console.log("ContextMenu Loaded: " + file.split(".")[0]);
                });
        });

        let CommandsDirectory = path.join(
            __dirname,
            "..",
            "commands",
            "command"
        );
        fs.readdir(CommandsDirectory, (err, files) => {
            if (err) console.log(err);
            else
                files.forEach((file) => {
                    let command = require(CommandsDirectory + "/" + file);
                    if (!command.name || !command.description || !command.run)
                        return console.log(
                            "Unable to load Command: " +
                            file.split(".")[0] +
                            ", Reason: File doesn't had run/name/desciption"
                        );
                    this.commands.set(file.split(".")[0].toLowerCase(), command);
                    console.log("Command Loaded: " + file.split(".")[0]);
                });
        });
    }

    async connectMongoDB() {
        await moongose.connect(this.config.Mongo.MongoURI, {
            keepAlive: true,
        }).then(mongo => {
            console.log("Connected to " + mongo.connection.name + " Database in MongoDB");
        }).catch(err => {
            console.log("Error while connecting to MongoDB " + err);
        });
    }

    /**
     *
     * @param {import("discord.js").TextChannel} textChannel
     * @param {import("discord.js").VoiceChannel} voiceChannel
     */
    createPlayer(textChannel, voiceChannel) {
        return this.Manager.create({
            guild: textChannel.guild.id,
            voiceChannel: voiceChannel.id,
            textChannel: textChannel.id,
            selfDeafen: true,
        });
    }
}

module.exports = Wrenchi;