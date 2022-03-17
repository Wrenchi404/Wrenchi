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

        this.config = require("../data/config")

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

    /**
     * @param {string} text
     */
    log(text) {
        console.log(text);
    }

    build() {
        this.log("Started the bot...");
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
                this.log(
                    `Node: ${node.options.identifier} | Lavalink node is connected.`
                )
            )
            .on("nodeReconnect", (node) =>
                this.log(
                    `Node: ${node.options.identifier} | Lavalink node is reconnecting.`
                )
            )
            .on("nodeDestroy", (node) =>
                this.log(
                    `Node: ${node.options.identifier} | Lavalink node is destroyed.`
                )
            )
            .on("nodeDisconnect", (node) =>
                this.log(
                    `Node: ${node.options.identifier} | Lavalink node is disconnected.`
                )
            )
            .on("nodeError", (node, err) =>
                this.log(
                    `Node: ${node.options.identifier} | Lavalink node has an error: ${err.message}`
                )
            )
            .on("trackError", (player, track) =>
                this.log(`Player: ${player.options.guild} | Track had an error.`)
            )
            .on("trackStuck", (player, track, threshold) =>
                this.log(`Player: ${player.options.guild} | Track is stuck.`)
            )
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
                this.log(
                    `Player: ${player.options.guild
                    } | A wild player has been created in ${client.guilds.cache.get(player.options.guild)
                        ? client.guilds.cache.get(player.options.guild).name
                        : "a guild"
                    }`
                )
            )
            .on("playerDestroy", (player) =>
                this.log(
                    `Player: ${player.options.guild
                    } | A wild player has been destroyed in ${client.guilds.cache.get(player.options.guild)
                        ? client.guilds.cache.get(player.options.guild).name
                        : "a guild"
                    }`
                )
            )
            .on("loadFailed", (node, type, error) =>
                this.log(
                    `Node: ${node.options.identifier} | Failed to load ${type}: ${error.message}`
                )
            )
            .on("trackStart", async (player, track) => {
                this.log(
                    `Player: ${player.options.guild
                    } | Track has been started playing [${track.title}]`
                );

                let TrackStartedEmbed = this.Embed()
                    .setAuthor({ name: "Now playing", iconURL: this.user.displayAvatarURL() })
                    .setDescription(`[${track.title}](${track.uri})` || "No Descriptions")
                    .addField("Requested by", `${track.requester}`, true)
                    .addField(
                        "Duration",
                        track.isStream
                            ? `\`LIVE\``
                            : `\`${prettyMilliseconds(track.duration, {
                                colonNotation: true,
                            })}\``,
                        true
                    );

                await client.channels.cache
                    .get(player.textChannel)
                    .send({
                        embeds: [TrackStartedEmbed],
                    })
                    .catch((err) => this.log(err));
            })
            .on("queueEnd", (player) => {
                this.log(`Player: ${player.options.guild} | Queue has been ended`);
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
                try {
                    if (!player.playing && !player.twentyFourSeven) {
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
                            } else if (player.playing) {
                                this.log(`Player: ${player.options.guild} | Still playing`);
                            }
                        }, 1000 * 60 * 2);
                    }
                } catch (err) {
                    console.log(err)
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
                    this.log("Event Loaded: " + file.split(".")[0]);
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
                        return this.log(
                            "Unable to load Command: " +
                            file.split(".")[0] +
                            ", File doesn't have an valid command with run function"
                        );
                    this.slashCommands.set(file.split(".")[0].toLowerCase(), cmd);
                    this.log("Slash Command Loaded: " + file.split(".")[0]);
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
                        return this.log(
                            "Unable to load Command: " +
                            file.split(".")[0] +
                            ", File doesn't have either command/run"
                        );
                    this.contextCommands.set(file.split(".")[0].toLowerCase(), cmd);
                    this.log("ContextMenu Loaded: " + file.split(".")[0]);
                });
        });

        let CommandsDirectory = path.join(
            __dirname,
            "..",
            "commands",
            "command"
        );
        fs.readdir(CommandsDirectory, (err, files) => {
            if (!files.length) return console.log("No legacy commands found.");
            if (err) this.log(err);
            else
                files.forEach((file) => {
                    let command = require(CommandsDirectory + "/" + file);
                    if (!command.name || !command.description || !command.run)
                        return this.log(
                            "Unable to load Command: " +
                            file.split(".")[0] +
                            ", Reason: File doesn't had run/name/desciption"
                        );
                    this.commands.set(file.split(".")[0].toLowerCase(), command);
                    this.log("Command Loaded: " + file.split(".")[0]);
                });
        });
    }

    async connectMongoDB() {
        await moongose.connect(this.config.Mongo.MongoURI, {
            keepAlive: true,
        }).then(mongo => {
            this.log("Connected to " + mongo.connection.name + " Database in MongoDB");
        }).catch(err => {
            this.log("Error while connecting to MongoDB " + err);
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