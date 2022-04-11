import { MessageEmbed, MessageButton, MessageActionRow, Interaction, Message } from "discord.js"
import { Player } from "erela.js"
import SlashCommand from "../../lib/SlashCommand"
import ytdl from "ytdl-core"

// Basic Row
const SeekLeftButton = new MessageButton()
    .setCustomId("seek_left_button")
    .setEmoji("⏪")
    .setStyle("SECONDARY");

const PauseButton = new MessageButton()
    .setCustomId("pause_button")
    .setEmoji("⏸")
    .setStyle("SECONDARY");

const ResumeButton = new MessageButton()
    .setCustomId("resume_button")
    .setEmoji("▶️")
    .setStyle("PRIMARY");

const StopButton = new MessageButton()
    .setCustomId("stop_button")
    .setEmoji("⏹️")
    .setStyle("DANGER");

const SeekRghtButton = new MessageButton()
    .setCustomId("seek_right_button")
    .setEmoji("⏩")
    .setStyle("SECONDARY");

const FirstRow = new MessageActionRow().addComponents(SeekLeftButton, PauseButton, StopButton, SeekRghtButton);
const AgainFirstRow = new MessageActionRow().addComponents(SeekLeftButton, ResumeButton, StopButton, SeekRghtButton);

// Volume Row
const MinusButton = new MessageButton()
    .setCustomId("minus_button")
    .setEmoji("➖")
    .setStyle("SECONDARY");

const PlusButton = new MessageButton()
    .setCustomId("plus_button")
    .setEmoji("➕")
    .setStyle("SECONDARY");

const Command = new SlashCommand()
    .setName("nowplaying")
    .setDescription("What's going on?")
    .setRun(async (client, interaction, options) => {
        const channel = await client.getChannel(client, interaction);
        if (!channel) return

        const player: Player = client.Manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply({ content: "Nothing is playing right now." });

        interaction.deferReply({ fetchReply: true });

        let VolumeButton = new MessageButton()
            .setCustomId("volume_button")
            .setLabel(`${player.volume}%`)
            .setDisabled(true)
            .setStyle("SECONDARY");
        const SecondRow = new MessageActionRow().addComponents(MinusButton, VolumeButton, PlusButton);

        const duration = await client.getDuration(player.queue.current.duration);
        const song = await ytdl.getInfo(player.queue.current.uri);
        const likes = await client.getLikes(song.videoDetails.video_url);
        const subs = await client.getSubs(song.videoDetails.video_url);

        let embed = new MessageEmbed()
            .setAuthor({ name: "Now Playing", iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setColor("AQUA")
            .setDescription(`**Current Song:** [${player.queue.current.title}](${player.queue.current.uri})`)
            .setThumbnail(player.queue.current.thumbnail)
            .setFields([
                {
                    name: "Author",
                    value: `[${player.queue.current.author}](${song.videoDetails.ownerProfileUrl})`,
                    inline: true
                },
                {
                    name: "Subscriber Count",
                    value: `${subs}`,
                    inline: true
                },
                {
                    name: "Category",
                    value: `${song.videoDetails.category}`,
                    inline: true
                },
                {
                    name: "Duration",
                    value: `${duration}`,
                    inline: true
                },
                {
                    name: "Likes",
                    value: `${likes}`,
                    inline: true
                },
                {
                    name: "Released On",
                    value: `${song.videoDetails.publishDate}`,
                    inline: true
                },
                {
                    name: "Status",
                    value: `${player.playing ? "Playing" : "Paused"}`,
                    inline: true
                }
            ])
            .setFooter({ text: `${player.queue.size ? player.queue[0].title : "Nothing in queue"}` });

        const npMsg = await interaction.editReply({ embeds: [embed], components: [FirstRow, SecondRow] });
        
        const filter = (inter: Interaction) => inter.user.id === interaction.user.id;
        const collector = await interaction.channel.createMessageComponentCollector({
            filter: filter,
            time: 1000 * 60 * 30,
        });

        collector.on("collect", async (inter) => {
            if (inter.customId === "seek_left_button") {
                if (player.position > 10000) {
                    await player.seek(player.position - 10000);
                    inter.reply({
                        content: "Seeked left",
                        ephemeral: true
                    });
                    return
                }

                await player.seek(0);
                return inter.reply({
                    content: "Seeked left",
                    ephemeral: true
                });
            }

            if (inter.customId === "pause_button") {
                player.pause(true);
                const msg = await inter.channel.messages.fetch(npMsg.id);
                if (msg) {
                    embed.fields[6].value = player.playing ? "Playing" : "Paused";
                    msg.edit({
                        embeds: [embed],
                        components: [AgainFirstRow, SecondRow]
                    });

                    inter.reply({ content: "Paused", ephemeral: true });
                }
            }

            if (inter.customId === "resume_button") {
                player.pause(false);
                const msg = await inter.channel.messages.fetch(npMsg.id);
                if (msg) {
                    embed.fields[6].value = player.playing ? "Playing" : "Paused";
                    msg.edit({
                        embeds: [embed],
                        components: [FirstRow, SecondRow]
                    });

                    inter.reply({ content: "Resumed", ephemeral: true });
                }
            }

            if (inter.customId === "stop_button") {
                player.stop();
                const msg = await inter.channel.messages.fetch(npMsg.id);
                if (msg) msg.delete()

                inter.channel.send({ content: "Stopped the music" });
            }

            if (inter.customId === "seek_right_button") {
                if (player.position < player.queue.current.duration - 10000) {
                    await player.seek(player.position + 10000);
                    inter.reply({
                        content: "Seeked right",
                        ephemeral: true
                    });
                    return
                }

                await player.seek(player.queue.current.duration);
                return inter.reply({
                    content: "Seeked right",
                    ephemeral: true
                });
            }

            if (inter.customId === "plus_button") {
                if (player.volume === 100) return inter.reply({ content: "Maximum value reached.", ephemeral: true });
                player.setVolume(player.volume + 10)
                VolumeButton.setLabel(`${player.volume}%`);
                
                const msg = await inter.channel.messages.fetch(npMsg.id);
                if (msg) {
                    msg.edit({
                        embeds: [embed],
                        components: [FirstRow, SecondRow]
                    });

                    inter.reply({ content: "Increased", ephemeral: true });
                }
            }

            if (inter.customId === "minus_button") {
                if (player.volume === 0) return inter.reply({ content: "Minimum value reached.", ephemeral: true });
                player.setVolume(player.volume - 10)
                VolumeButton.setLabel(`${player.volume}%`);

                const msg = await inter.channel.messages.fetch(npMsg.id);
                if (msg) {
                    msg.edit({
                        embeds: [embed],
                        components: [FirstRow, SecondRow]
                    });

                    inter.reply({ content: "Decreased", ephemeral: true });
                }
            }
        });
    });

export { Command }