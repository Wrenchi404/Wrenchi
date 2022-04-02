const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
    .setName("play")
    .setDescription("Play music in the voice channel")
    .addStringOption((option) =>
        option
            .setName("query")
            .setDescription("Search string to search the music")
            .setRequired(true)
    )
    .setRun(async (client, interaction, options) => {
        let channel = await client.getChannel(client, interaction);
        if (!channel) return;

        let node = await client.getLavalink(client);
        if (!node) {
            return interaction.reply({
                embeds: [client.ErrorEmbed("Lavalink node is not connected")],
            });
        }
        let query = options.getString("query", true);
        let player = client.createPlayer(interaction.channel, channel);
        if (player.state !== "CONNECTED") {
            player.connect();
        }
        if (channel.type == "GUILD_STAGE_VOICE") {
            setTimeout(() => {
                if (interaction.guild.me.voice.suppress == true) {
                    try {
                        interaction.guild.me.voice.setSuppressed(false);
                    } catch (e) {
                        interaction.guild.me.voice.setRequestToSpeak(true);
                    }
                }
            }, 2000);
        }

        await interaction.reply({
            embeds: [client.Embed(":mag_right: **Searching...**")],
        });

        let res = await player.search(query, interaction.user).catch((err) => {
            client.error(err);
            return {
                loadType: "LOAD_FAILED",
            };
        });

        if (res.loadType === "LOAD_FAILED") {
            if (!player.queue.current) player.destroy();
            return interaction
                .editReply({
                    embeds: [client.ErrorEmbed("There was an error while searching")],
                })
                .catch(console.log("Rip"));
        }

        if (res.loadType === "NO_MATCHES") {
            if (!player.queue.current) player.destroy();
            return interaction
                .editReply({
                    embeds: [client.ErrorEmbed("No results were found")],
                })
                .catch(console.log("Rip"));
        }

        if (res.loadType === "TRACK_LOADED" || res.loadType === "SEARCH_RESULT") {
            player.queue.add(res.tracks[0]);
            if (!player.playing && !player.paused && !player.queue.size) player.play();

            let embed = client.Embed()
                .setAuthor({ name: "Added song to queue", iconURL: client.user.displayAvatarURL() })
                .setDescription(
                    `[${res.tracks[0].title}](${res.tracks[0].uri})` || "No Title"
                )
                .setURL(res.tracks[0].uri)
                .addField("Author", res.tracks[0].author, true)
                .addField("Duration", await convertDuration(res.tracks[0].duration), true);
            try {
                embed.setThumbnail(res.tracks[0].displayThumbnail("maxresdefault"));
            } catch (err) {
                embed.setThumbnail(res.tracks[0].thumbnail);
            }
            if (player.queue.totalSize > 1) embed.addField("Position in queue", `${player.queue.size - 0}`, true);
            return interaction.editReply({ embeds: [embed] }).catch((err) => client.log(err));
        }

        if (res.loadType === "PLAYLIST_LOADED") {
            player.queue.add(res.tracks);
            if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();

            let embed = client.Embed()
                .setAuthor({
                    name: "Playlist added to queue",
                    iconURL: client.user.displayAvatarURL(),
                })
                .setThumbnail(res.tracks[0].thumbnail)
                .setDescription(`[${res.playlist.name}](${query})`)
                .addField("Enqueued", `\`${res.tracks.length}\` songs`, false)
                .addField(
                    "Playlist duration",
                    await convertDuration(res.playlist.duration),
                    false
                );
            return interaction.editReply({ embeds: [embed] }).catch((err) => client.log(err));
        }
    });

async function convertDuration(value) {
    var sec = parseInt(value, 10);
    sec = sec / 1000;
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = Math.round(sec - (hours * 3600) - (minutes * 60));
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}

module.exports = command;