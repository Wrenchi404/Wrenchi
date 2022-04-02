import { Client, Collection, MessageEmbed, GuildTextBasedChannel, TextChannel, Message } from "discord.js"
import { Manager, Node } from "erela.js"
import fs from "fs"
import path from "path"
import mongoose from "mongoose"
import Config from "../../data/config.json"
import SlashCommand from "./SlashCommand"
import ICommand from "../interfaces/Command"
import getLavalink from "../utils/getLavalink"

class Wrenchi extends Client {
    config: typeof Config;
    LegacyCommands: Collection<string, ICommand> = new Collection();
    SlashCommands = new Collection<string, SlashCommand>();
    ContextCommands = new Collection();
    Manager: Manager;
    getLavalink: typeof getLavalink;
    constructor(props = {
        intents: 32767,
    }) {
        super(props);

        this.config = Config;
        this.LegacyCommands = new Collection();
        this.SlashCommands = new Collection();
        this.ContextCommands = new Collection();
        this.loadEvents();
        this.loadCommands();
        this.getLavalink = getLavalink;

        this.Manager = new Manager({
            nodes: [
                {
                    identifier: this.config.Lavalink.Identifier,
                    host: this.config.Lavalink.Host,
                    port: this.config.Lavalink.Port,
                    password: this.config.Lavalink.Password,
                    retryAmount: this.config.Lavalink.RetryAmount,
                    retryDelay: this.config.Lavalink.RetryDelay,
                },
            ],
            send: (id, payload) => {
                let guild = this.guilds.cache.get(id);
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
                this.user.setPresence({ activities: [{ name: `To Wrench's Code`, type: "LISTENING" }], status: "dnd" });
            })
            .on("trackStuck", (player, track, threshold) => {
                console.log(`Player: ${player.options.guild} | Track is stuck.`)
                this.user.setPresence({ activities: [{ name: `To Wrench's Code`, type: "LISTENING" }], status: "dnd" });
            })
            .on("trackStart", (player, track) => {
                this.user.setPresence({ activities: [{ name: `To ${track.title}`, type: "LISTENING" }], status: "dnd" });
            })
            .on("playerMove", (player, oldChannel, newChannel) => {
                const guild = this.guilds.cache.get(player.guild);
                if (!guild) return;
                const channel: any = guild.channels.cache.get(player.textChannel);
                if (oldChannel === newChannel) return;
                if (!channel) return;
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
                    } | A wild player has been created in ${this.guilds.cache.get(player.options.guild)
                        ? this.guilds.cache.get(player.options.guild).name
                        : "a guild"
                    }`
                )
            )
            .on("playerDestroy", (player) => {
                console.log(
                    `Player: ${player.options.guild
                    } | A wild player has been destroyed in ${this.guilds.cache.get(player.options.guild)
                        ? this.guilds.cache.get(player.options.guild).name
                        : "a guild"
                    }`
                );

                this.user.setPresence({ activities: [{ name: `To Wrench's Code`, type: "LISTENING" }], status: "dnd" });
            })
            .on("queueEnd", (player) => {
                console.log(`Player: ${player.options.guild} | Queue has been ended`);
                let queueEmbed = new MessageEmbed()
                    .setAuthor({
                        name: "The queue has ended",
                        iconURL: this.user.displayAvatarURL(),
                    })
                    .setFooter({ text: "Queue ended at" })
                    .setTimestamp();
                const channel: any = this.channels.cache.get(player.textChannel)
                channel.send({ embeds: [queueEmbed] });
                this.user.setPresence({ activities: [{ name: `To Wrench's Code`, type: "LISTENING" }], status: "dnd" });

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

                                const channel: any = this.channels.cache.get(player.textChannel)
                                channel.send({ embeds: [DisconnectedEmbed] });
                                player.destroy();

                                this.user.setPresence({ activities: [{ name: `To Wrench's Code`, type: "LISTENING" }], status: "dnd" });
                            } else if (player.playing) {
                                console.log(`Player: ${player.options.guild} | Still playing`);
                                this.user.setPresence({ activities: [{ name: `To ${player.queue.current.title}`, type: "LISTENING" }], status: "dnd" });
                            }
                        }, 1000 * 60 * 2);
                    }
                } catch (err) {
                    console.log(err)
                    this.user.setPresence({ activities: [{ name: `To Wrench's Code`, type: "LISTENING" }], status: "dnd" });
                }
            });
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

    async connectMongo() {
        await mongoose.connect(this.config.Database.Mongo_URI, {
            keepAlive: true,
        }).then((mongo) => {
            console.log("Connected to " + mongo.connection.name + " Database in MongoDB");
        }).catch(err => {
            console.log("Error while connecting to MongoDB " + err);
        });
    }

    Embed(text: String) {
        let embed = new MessageEmbed().setColor("RED");
        if (text) embed.setDescription(text.toString());
        return embed;
    }
}

export default Wrenchi;