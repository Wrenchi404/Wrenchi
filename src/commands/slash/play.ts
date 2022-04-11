import SlashCommand from "../../lib/SlashCommand"
import { Player, SearchResult } from "erela.js"
import { MessageEmbed } from "discord.js"

const Command = new SlashCommand()
    .setName("play")
    .setDescription("Let's hear some music, shall we?")
    .addStringOption((option) => option.setName("name").setDescription("What song are we going to play?").setRequired(true))
    .setRun(async (client, interaction, options) => {
        const query = interaction.options.getString("name");
        if (!query) return

        const channel = await client.getChannel(client, interaction)
        if (!channel) return

        const res: SearchResult = await client.Manager.search(query, interaction.user);
        await interaction.reply(`Searching for ${query}.....`)

        if (res.loadType === "LOAD_FAILED" || res.loadType === "NO_MATCHES") return interaction.editReply({ content: "❌| No result found or load failed" });

        const player: Player = client.Manager.create({
            guild: interaction.guild.id,
            voiceChannel: channel.id,
            textChannel: interaction.channel.id,
            selfDeafen: true,
            volume: 100,
        });

        if (player.state !== "CONNECTED") player.connect();

        if (res.loadType === "TRACK_LOADED" || res.loadType === "SEARCH_RESULT") {
            player.queue.add(res.tracks[0]);
            if (!player.playing && !player.paused && !player.queue.size) player.play();
            const duration = await client.getDuration(res.tracks[0].duration);

            const embed = new MessageEmbed()
                .setTitle(`🎵 | Now playing: ${res.tracks[0].title}`)
                .setURL(res.tracks[0].uri)
                .setColor("NAVY")
                .setFields([
                    {
                        name: "Song Name",
                        value: `${res.tracks[0].title}`,
                    },
                    {
                        name: "Duration",
                        value: `${duration}`,
                        inline: true
                    },
                    {
                        name: 'Author',
                        value: `${res.tracks[0].author}`,
                        inline: true
                    }
                ])

            try {
                embed.setThumbnail(res.tracks[0].displayThumbnail("maxresdefault"))
            } catch (err) {
                embed.setThumbnail(res.tracks[0].thumbnail)
            }

            interaction.editReply({ content: null, embeds: [embed]});

            if (player.queue.totalSize > 1) {
                embed.addField("Position in queue", `${player.queue.size - 0}`, true);
                interaction.editReply({ content: null, embeds: [embed] }).catch(console.error);

                const msg = client.NowPlayingMessage.get(interaction.guild.id);
                if (msg) {
                    let embed = msg.embeds[0]
                    embed.setFooter({ text: `Next on queue: ${player.queue[0].title}` })

                    msg.edit({ embeds: [embed] });
                }
            }
        }
    });

export { Command }