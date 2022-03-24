const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
    .setName("stats")
    .setDescription("Stats of myself")
    .setRun(async (client, interaction, options) => {
        const msg = await interaction.reply({ content: "Loading...", fetchReply: true});

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Stats")
            .setThumbnail(client.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setFields([
                { name: "Owner", value: "Wrench#0012" },
                { name: "Discord.js Version", value: `v${require("discord.js").version}` },
                { name: "Interaction Ping", value: `${msg.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
                { name: "Websocket Ping", value: `${client.ws.ping}ms`, inline: true },
                { name: "Client Avatar", value: `[Avatar URL](${client.user.avatarURL()})`, inline: true },
                { name: "Client Created At", value: `<t:${Math.floor(client.user.createdTimestamp / 1000) + 3600}:F>`, inline: true },
                { name: "Client Users", value: `${client.users.cache.size}`, inline: true },
            ])
            .setFooter({ text: `Uptime: ${await convertDuration(client.uptime)}`, iconURL: client.user.displayAvatarURL({ format: "png", dynamic: true }) })

        interaction.editReply({ content: null, embeds: [embed] });
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