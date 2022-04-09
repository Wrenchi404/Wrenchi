import { MessageEmbed, MessageButton, MessageActionRow, Interaction } from "discord.js";
import { Player } from "erela.js";
import SlashCommand from "../../lib/SlashCommand"
import ytdl from "ytdl-core"

const StopButton = new MessageButton()
    .setCustomId("stop_button")
    .setEmoji("⏹️")
    .setLabel("Stop")
    .setStyle("DANGER");

const FirstRow = new MessageActionRow().addComponents(StopButton);

const Command = new SlashCommand()
    .setName("nowplaying")
    .setDescription("What's going on?")
    .setRun(async (client, interaction, options) => {
        const channel = await client.getChannel(client, interaction);
        if (!channel) return

        const player: Player = client.Manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply({ content: "Nothing is playing right now." });

        interaction.deferReply({ fetchReply: true });

        const duration = await client.getDuration(player.queue.current.duration);
        const song = await ytdl.getInfo(player.queue.current.uri);
        const likes = await client.getLikes(song.videoDetails.video_url);
        const subs = await client.getSubs(song.videoDetails.video_url);

        const embed = new MessageEmbed()
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
                    value: `${player.paused ? "Paused" : "Playing"}`,
                    inline: true
                },
                {
                    name: "Volume",
                    value: `${player.volume}%`,
                    inline: true
                },
                {
                    name: "Queue Repeat",
                    value: `${player.queueRepeat ? "Enabled" : "Disabled"}`,
                    inline: true
                },
                {
                    name: "Track Repeat",
                    value: `${player.trackRepeat ? "Enabled" : "Disabled"}`,
                    inline: true
                }
            ])
            .setFooter({ text: `Proudly Made by Wrench` });

        interaction.editReply({ embeds: [embed], components: [FirstRow] });

        const filter = (inter: Interaction) => inter.user.id === interaction.user.id;
        const collector = await interaction.channel.createMessageComponentCollector({
            filter: filter,
            time: 1000 * 60 * 30,
        });

        collector.on("collect", async (inter) => {
            if (inter.customId === "stop_button") {
                player.stop();
                inter.reply({ content: "Stopped the music" });
            }
        });
    });

export { Command }