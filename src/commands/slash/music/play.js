const SlashCommand = require("../../../lib/SlashCommand");
const ytdl = require("ytdl-core");

const command = new SlashCommand()
    .setName("play")
    .setDescription("Play a song")
    .addStringOption((option) => option.setName("name").setDescription("What song are we going to play?").setRequired(true))
    .setRun(async (client, interaction, options) => {
        const query = interaction.options.getString("name");
        if (!query) return

        const channel = await client.getChannel(client, interaction)
        if (!channel) return

        const results = await client.Manager.search(query, interaction.member);

        let player = client.Manager.players.get(interaction.guild.id);

        if (!player) {
            player = client.Manager.create({
                guild: interaction.guild.id,
                textChannel: interaction.channel.id,
                voiceChannel: channel.id,
            });

            player.connect();
            player.queue.add(results.tracks[0]);

            interaction.reply("Adding " + results.tracks[0].title + " to the queue");

            if (!player.playing && !player.paused && !player.queue.size) player.play();

            if (!player.playing && !player.paused && player.queue.totalSize === results.tracks.length) player.play();
        } else {
            player.queue.add(results.tracks[0]);

            interaction.reply("Adding " + results.tracks[0].title + " to the queue");

            if (!player.playing && !player.paused && !player.queue.size) player.play();

            if (!player.playing && !player.paused && player.queue.totalSize === results.tracks.length) player.play();
        }
    });

module.exports = command