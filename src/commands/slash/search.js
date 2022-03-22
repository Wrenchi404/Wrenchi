const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
    .setName("search")
    .setDescription("Search the music and plays in the voice channel")
    .addStringOption((option) =>
        option
            .setName("query")
            .setDescription("Search string to search the music")
            .setRequired(true)
    )
    .setRun(async (client, interaction, options) => {
        let node = await client.getLavalink(client);
        if (!node) {
            return interaction.reply({
                embeds: [client.ErrorEmbed("Lavalink node is not connected")],
            });
        }
        
        const query = interaction.options.getString("query");
        let channel = await client.getChannel(client, interaction);
        if (!channel) return;

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

        let player = client.Manager.players.get(interaction.guild.id);
        if (!player) {
            player = client.createPlayer(interaction.channel, channel);
            const results = await player.search(query, interaction.user);
            if (!results) return interaction.reply("No results found");
            const tracks = results.tracks.slice(0, 10);
            let musicTitles = ""
            let counter = 1

            for (let track of tracks) {
                musicTitles += `${counter}. ${track.title}\n`
                counter++
            }

            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`${musicTitles}`)
                ]
            });

            const filter = (inter) => inter.author.id === interaction.user.id;
            const collector = await interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 });
            collector.on("collect", (inter) => {
                if (!inter.content) return inter.reply({ content: "Bye bye" });
                const answer = parseInt(inter.content);
                if (!answer) return inter.reply("DIE");

                const track = tracks[answer - 1];
                if (!track) return inter.reply({
                    content: "No track found"
                });

                player.connect();
                player.queue.add(track);
                if (!player.playing && !player.paused && player.queue.size === 0) player.play();
                let embed = client.Embed()
                    .setAuthor({ name: "Added to queue", iconURL: client.user.displayAvatarURL() })
                    .setDescription(
                        `[${track.title}](${track.uri})` || "No Title"
                    )
                    .setURL(track.uri)
                    .addField("Author", track.author, true)
                    .addField(
                        "Duration",
                        track.isStream
                            ? `\`LIVE\``
                            : `\`${client.ms(track.duration, {
                                colonNotation: true,
                            })}\``,
                        true
                    );
                try {
                    embed.setThumbnail(track.displayThumbnail("maxresdefault"));
                } catch (err) {
                    embed.setThumbnail(track.thumbnail);
                }

                inter.reply({
                    content: null,
                    embeds: [embed]
                });
            });
        } else {
            const results = await player.search(query, interaction.user);
            if (!results) return interaction.reply("No results found");
            const tracks = results.tracks.slice(0, 10);
            let musicTitles = ""
            let counter = 1

            for (let track of tracks) {
                musicTitles += `${counter}. ${track.title}\n`
                counter++
            }

            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`${musicTitles}`)
                ]
            });

            const filter = (inter) => inter.author.id === interaction.user.id;
            const collector = await interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 });
            collector.on("collect", (inter) => {
                const answer = parseInt(inter.content);
                if (!answer) return inter.reply({
                    content: "DIE"
                });

                const track = tracks[answer - 1];
                if (!track) return inter.reply({
                    content: "No track found"
                });

                player.queue.add(track);

                let embed = client.Embed()
                    .setAuthor({ name: "Added to queue", iconURL: client.user.displayAvatarURL() })
                    .setDescription(
                        `[${track.title}](${track.uri})` || "No Title"
                    )
                    .setURL(track.uri)
                    .addField("Author", track.author, true)
                    .addField(
                        "Duration",
                        track.isStream
                            ? `\`LIVE\``
                            : `\`${client.ms(track.duration, {
                                colonNotation: true,
                            })}\``,
                        true
                    );
                try {
                    embed.setThumbnail(track.displayThumbnail("maxresdefault"));
                } catch (err) {
                    embed.setThumbnail(track.thumbnail);
                }

                inter.reply({
                    content: null,
                    embeds: [embed]
                });
            });
        }
    });

module.exports = command;