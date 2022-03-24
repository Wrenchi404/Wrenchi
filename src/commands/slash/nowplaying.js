const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const ytdl = require("ytdl-core");

const command = new SlashCommand()
    .setName("nowplaying")
    .setDescription("Shows what's begin playing now.")
    .setRun(async (client, interaction, options) => {
        let player = client.Manager.players.get(interaction.guild.id);
        if (!player)
            return interaction.reply({
                embeds: [client.ErrorEmbed("**Nothing is playing right now...**")],
            });

        if (!interaction.member.voice.channel) {
            const joinEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(
                    "❌ | **You must be in a voice channel to use this command!**"
                );
            return interaction.reply({ embeds: [joinEmbed], ephemeral: true });
        }

        if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)) {
            const sameEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(
                    "❌ | **You must be in the same voice channel as me to use this command!**"
                );
            return interaction.reply({ embeds: [sameEmbed], ephemeral: true });
        }

        const song = player.queue.current;
        const info = await ytdl.getInfo(song.uri);
        const views = await convertViews(song.uri);
        const likes = await convertLikes(song.uri);
        const subs = await convertSubs(song.uri);
        const category = (await ytdl.getInfo(song.uri)).videoDetails.category;

        const prevButton = new MessageButton()
            .setCustomId("prev_button")
            .setEmoji("⏮️")
            .setStyle("PRIMARY")

        const pauseButton = new MessageButton()
            .setCustomId("pause_button")
            .setEmoji("⏸")
            .setStyle("PRIMARY");

        const stopButton = new MessageButton()
            .setCustomId("stop_button")
            .setEmoji("⏹️")
            .setStyle("DANGER");

        const resumeButton = new MessageButton()
            .setCustomId("resume_button")
            .setEmoji("▶️")
            .setStyle("PRIMARY");

        const nextButton = new MessageButton()
            .setCustomId("next_button")
            .setEmoji("⏭️")
            .setStyle("PRIMARY");

        const basicRow = new MessageActionRow().addComponents(prevButton, pauseButton, stopButton, resumeButton, nextButton);

        const seekLeftButton = new MessageButton()
            .setCustomId("seek_left_button")
            .setEmoji("⏪")
            .setStyle("PRIMARY");

        const trackRepButton = new MessageButton()
            .setCustomId("track_rep_button")
            .setEmoji("🔂")
            .setStyle("PRIMARY");

        const repeatButton = new MessageButton()
            .setCustomId("repeat_button")
            .setLabel("Repeat")
            .setDisabled(true)
            .setStyle("SECONDARY");

        const queueRepButton = new MessageButton()
            .setCustomId("queue_rep_button")
            .setEmoji("🔁")
            .setStyle("PRIMARY");

        const seekRightButton = new MessageButton()
            .setCustomId("seek_right_button")
            .setEmoji("⏩")
            .setStyle("PRIMARY");

        const repeatRow = new MessageActionRow().addComponents(seekLeftButton, trackRepButton, repeatButton, queueRepButton, seekRightButton);

        let embed = new MessageEmbed();
        embed.setColor("RANDOM")
        embed.setTitle("Now playing")
        embed.setFields([
            {
                name: "Requested by",
                value: `${song.requester}`,
                inline: true,
            },
            {
                name: "Channel Name",
                value: `[${info.videoDetails.ownerChannelName}](${info.videoDetails.author.channel_url})`,
                inline: true
            },

            {
                name: "Subscribers",
                value: subs,
                inline: true
            },
            {
                name: "Song Duration",
                value: `${await convertDuration(song.duration)}`,
                inline: true,
            },
            {
                name: "Category",
                value: category,
                inline: true,
            },
            {
                name: "Views",
                value: views,
                inline: true
            },
            {
                name: "Likes",
                value: likes,
                inline: true
            }
        ])
        embed.setThumbnail(song.displayThumbnail("maxresdefault"))
        embed.setDescription(`[${song.title}](${song.uri})`);

        await interaction.deferReply({ fetchReply: true });
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const npMsg = await interaction.editReply({ content: "This is what's playin now my boy", embeds: [embed], components: [basicRow, repeatRow] });
        const filter = (inter) => inter.user.id === interaction.user.id;
        const collector = await interaction.channel.createMessageComponentCollector({
            filter: filter,
            time: 1000 * 60 * 30,
        });

        collector.on("collect", async (inter) => {
            if (inter.customId === "prev_button") {
                try {
                    const nowSong = player.queue.current
                    await player.play(nowSong.uri);

                    await inter.reply({ content: "Done", ephemeral: true }).then(async () => {
                        const info = await ytdl.getInfo(nowSong.uri);
                        const views = await convertViews(nowSong.uri);
                        const likes = await convertLikes(nowSong.uri);
                        const subs = await convertSubs(nowSong.uri);
                        const category = (await ytdl.getInfo(nowSong.uri)).videoDetails.category;

                        let newEmbed = new MessageEmbed();
                        newEmbed.setColor("RANDOM")
                        newEmbed.setTitle("Now playing")
                        newEmbed.setFields([
                            {
                                name: "Requested by",
                                value: `${nowSong.requester}`,
                                inline: true,
                            },
                            {
                                name: "Channel Name",
                                value: `[${info.videoDetails.ownerChannelName}](${info.videoDetails.author.channel_url})`,
                                inline: true
                            },

                            {
                                name: "Subscribers",
                                value: subs,
                                inline: true
                            },
                            {
                                name: "Song Duration",
                                value: `${await convertDuration(nowSong.duration)}`,
                                inline: true,
                            },
                            {
                                name: "Category",
                                value: category,
                                inline: true,
                            },
                            {
                                name: "Views",
                                value: views,
                                inline: true
                            },
                            {
                                name: "Likes",
                                value: likes,
                                inline: true
                            }
                        ])
                        newEmbed.setThumbnail(nowSong.displayThumbnail("maxresdefault"))
                        newEmbed.setDescription(`[${nowSong.title}](${nowSong.uri})`);

                        await npMsg.edit({ embeds: [newEmbed], components: [basicRow, repeatRow] });
                    });
                } catch {
                    inter.reply({
                        content: "Sad",
                        ephemeral: true
                    });
                }
            }

            if (inter.customId === "pause_button") {
                if (player.paused) {
                    inter.reply({
                        content: "Already Paused",
                        ephemeral: true
                    })
                    return
                }

                player.pause(true);

                return inter.reply({
                    content: "Paused",
                    ephemeral: true
                });
            }

            if (inter.customId === "stop_button") {
                player.destroy();

                inter.reply({
                    content: "Stopped",
                    ephemeral: true
                });

                return setTimeout(() => {
                    collector.stop();
                    inter.message.delete()
                }, 3000);
            }

            if (inter.customId === "resume_button") {
                if (!player.paused) {
                    inter.reply({
                        content: "Already Playing",
                        ephemeral: true
                    });
                    return
                }

                player.pause(false);

                return inter.reply({
                    content: "Resumed",
                    ephemeral: true
                });
            }

            if (inter.customId === "next_button") {
                if (player.queue.size === 0) {
                    inter.reply({
                        content: "Queue is empty",
                        ephemeral: true
                    });
                    return
                }
                await player.stop();

                await inter.reply({ content: "Started playing next song.", ephemeral: true }).then(async () => {
                    const nowSong = await player.queue.current;
                    const info = await ytdl.getInfo(nowSong.uri);
                    const views = await convertViews(nowSong.uri);
                    const likes = await convertLikes(nowSong.uri);
                    const subs = await convertSubs(nowSong.uri);
                    const category = (await ytdl.getInfo(nowSong.uri)).videoDetails.category;

                    let nextEmbed = new MessageEmbed();
                    nextEmbed.setColor("RANDOM")
                    nextEmbed.setTitle("Now playing")
                    nextEmbed.setFields([
                        {
                            name: "Requested by",
                            value: `${nowSong.requester}`,
                            inline: true,
                        },
                        {
                            name: "Channel Name",
                            value: `[${info.videoDetails.ownerChannelName}](${info.videoDetails.author.channel_url})`,
                            inline: true
                        },

                        {
                            name: "Subscribers",
                            value: subs,
                            inline: true
                        },
                        {
                            name: "Song Duration",
                            value: `${await convertDuration(nowSong.duration)}`,
                            inline: true,
                        },
                        {
                            name: "Category",
                            value: category,
                            inline: true,
                        },
                        {
                            name: "Views",
                            value: views,
                            inline: true
                        },
                        {
                            name: "Likes",
                            value: likes,
                            inline: true
                        }
                    ])
                    nextEmbed.setThumbnail(nowSong.displayThumbnail("maxresdefault"))
                    nextEmbed.setDescription(`[${nowSong.title}](${nowSong.uri})`);

                    await npMsg.edit({ content: null, embeds: [nextEmbed], components: [basicRow, repeatButton] });
                });
            }

            if (inter.customId === "track_rep_button") {
                if (player.trackRepeat) {
                    player.setTrackRepeat(false);
                    inter.reply({
                        content: "Track Repeat is now off",
                        ephemeral: true
                    });

                    return
                }

                player.setTrackRepeat(true);
                inter.reply({
                    content: "Track Repeat is now on",
                    ephemeral: true
                });
            }

            if (inter.customId === "queue_rep_button") {
                if (player.queueRepeat) {
                    player.setQueueRepeat(false);
                    inter.reply({
                        content: "Queue Repeat is now off",
                        ephemeral: true
                    });

                    return
                }

                player.setQueueRepeat(true)
                inter.reply({
                    content: "Queue Repeat is now on",
                    ephemeral: true
                });
            }

            if (inter.customId === "seek_left_button") {
                if (player.position > 10000) {
                    await player.seek(player.position - 10000);
                    inter.reply({
                        content: "Seeked to da left",
                        ephemeral: true
                    });
                    return
                }

                await player.seek(0);
                return inter.reply({
                    content: "Seeked to da left",
                    ephemeral: true
                });
            }

            if (inter.customId === "seek_right_button") {
                if (player.position < player.queue.current.duration - 10000) {
                    await player.seek(player.position + 10000);
                    inter.reply({
                        content: "Seeked to da right",
                        ephemeral: true
                    });
                    return
                }

                await player.seek(player.queue.current.duration);
                return inter.reply({
                    content: "Seeked to da right",
                    ephemeral: true
                });
            }
        });
    });

async function convertViews(uri) {
    const numArr = ["", "K", "M", "B", "T"]
    const video = await ytdl.getInfo(uri)
    let views = video.videoDetails.viewCount

    for (x in numArr) {
        if (views < 1000) return `${Math.round(views * 10) / 10}${numArr[x]}`;
        views /= 1000;
    }
}

async function convertLikes(uri) {
    const numArr = ["", "K", "M", "B", "T"]
    const video = await ytdl.getInfo(uri)
    let likes = video.videoDetails.likes

    for (x in numArr) {
        if (likes < 1000) return `${Math.round(likes * 10) / 10}${numArr[x]}`;
        likes /= 1000;
    }
}

async function convertSubs(uri) {
    const numArr = ["", "K", "M", "B", "T"]
    const video = await ytdl.getInfo(uri)
    let subs = video.videoDetails.author.subscriber_count

    for (x in numArr) {
        if (subs < 1000) return `${Math.round(subs * 100) / 100}${numArr[x]}`;
        subs /= 1000;
    }
}

async function convertDuration(value) {
    var sec = parseInt(value, 10);
    sec = sec / 1000;
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}

module.exports = command;