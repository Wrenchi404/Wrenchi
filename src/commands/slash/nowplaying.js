const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
const wait = require('node:timers/promises').setTimeout;
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

        if (interaction.guild.me.voice.channel &&!interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)) {
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
                value: song.isStream
                    ? `\`LIVE\``
                    : `\`${prettyMilliseconds(player.position, {
                        secondsDecimalDigits: 0,
                    })} / ${prettyMilliseconds(song.duration, {
                        secondsDecimalDigits: 0,
                    })}\``,
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

        await interaction.deferReply({ ephemeral: true });
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await interaction.editReply({ content: "This is what's playin now my boy", embeds: [embed] });
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

module.exports = command;