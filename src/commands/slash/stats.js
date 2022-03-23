const SlashCommand = require("../../lib/SlashCommand");
const os = require("os");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
    .setName("stats")
    .setDescription("Stats of myself")
    .setRun(async (client, interaction, options) => {
        const msg = await interaction.reply({ content: "Loading...", fetchReply: true});
        // PC Stats
        const cpuName = await os.cpus()[0].model ? os.cpus()[0].model : "Running in mobile, so I don't know"
        const cpuSpeed = await os.cpus()[0].speed / 1000 ? os.cpus()[0].speed : "Running in mobile, so I don't know"
        const hostname = await os.hostname() ? os.hostname() : "Wrench's Mobile"
        const platform = await os.platform() ? os.platform() : "Android"
        const totalMem = await os.totalmem() / 1000000000 ? os.totalmem() / 1000000000 : "Running in mobile, so I don't know"
        const freeMem = await os.freemem() / 1000000000 ? os.freemem() / 1000000000 : "Running in mobile, so I don't know"

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Stats")
            .setThumbnail(client.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setFields([
                { name: "Owner", value: "Wrench#0012" },
                { name: "CPU Name", value: `${cpuName}`, inline: true },
                { name: "CPU Speed", value: `${cpuSpeed}GHz`, inline: true },
                { name: "Host Name", value: `${hostname}`, inline: true },
                { name: "Platform", value: `${platform}`, inline: true },
                { name: "Total Memory", value: `${totalMem.toFixed(1) }GB`, inline: true },
                { name: "Free Memory", value: `${freeMem.toFixed(2)}GB`, inline: true },
                { name: "Interaction Ping", value: `${msg.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
                { name: "Websocket Ping", value: `${client.ws.ping}ms`, inline: true },
                { name: "Client", value: `${client.user}`, inline: true },
                { name: "Client ID", value: `${client.user.id}`, inline: true },
                { name: "Client Avatar", value: `[Avatar URL](${client.user.avatarURL()})`, inline: true },
                { name: "Client Created At", value: `<t:${Math.floor(client.user.createdTimestamp / 1000) + 3600}:F>`, inline: true },
                { name: "Client Guilds", value: `${client.guilds.cache.size}`, inline: true },
                { name: "Client Users", value: `${client.users.cache.size}`, inline: true },
                { name: "Server Members", value: `${interaction.guild.memberCount}`, inline: true },
                { name: "Server Created At", value: `<t:${Math.floor(interaction.guild.createdTimestamp / 1000) + 3600}:F>`, inline: true },
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