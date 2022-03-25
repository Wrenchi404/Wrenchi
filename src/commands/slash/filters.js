const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

const ncButton = new MessageButton()
    .setCustomId("nc_button")
    .setLabel("NightCore")
    .setStyle("PRIMARY");

const vwButton = new MessageButton()
    .setCustomId("vw_button")
    .setLabel("Vaporwave")
    .setStyle("PRIMARY");

const bbButton = new MessageButton()
    .setCustomId("bb_button")
    .setLabel("Bass Boost")
    .setStyle("PRIMARY");

const popButton = new MessageButton()
    .setCustomId("pop_button")
    .setLabel("Pop")
    .setStyle("PRIMARY");

const softButton = new MessageButton()
    .setCustomId("soft_button")
    .setLabel("Soft")
    .setStyle("PRIMARY");

const diableEqButton = new MessageButton()
    .setCustomId("diable_eq_button")
    .setLabel("Disable Filter")
    .setStyle("PRIMARY");

const command = new SlashCommand()
    .setName("filters")
    .setDescription("Let's filter this song.")
    .setRun(async (client, interaction, options) => {
        let channel = await client.getChannel(client, interaction);
        if (!channel) return;

        let node = await client.getLavalink(client);
        if (!node) {
            return interaction.reply({
                embeds: [client.ErrorEmbed("Lavalink node is not connected")],
            });
        }

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

        const firstRow = new MessageActionRow().addComponents(ncButton, vwButton, bbButton, popButton, softButton);
        const disableRow = new MessageActionRow().addComponents(diableEqButton);

        const filterEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Filters")
            .setDescription("Select a filter to apply to the song.")
            .setTimestamp();

        const filterMsg = await interaction.reply({ embeds: [filterEmbed], components: [firstRow, disableRow] });

        const filter = (inter) => inter.user.id === interaction.user.id;
        const collector = await interaction.channel.createMessageComponentCollector({
            filter: filter,
            time: 1000 * 60 * 30,
        });

        collector.on("collect", async (inter) => {
            if (inter.customId === "nc_button") {
                if (player.nightcore) {
                    player.nightcore = false
                    await inter.reply({ content: "Disabled **Nightcore** filter.", ephemeral: true });
                } else {
                    player.nightcore = true
                    await inter.reply({ content: "Enabled **Nightcore** filter.", ephemeral: true });
                }
            }

            if (inter.customId === "diable_eq_button") {
                player.reset();
                inter.reply({ content: "Removed every filters", ephemeral: true });

                setTimeout(async () => {
                    inter.message.delete();
                }, 3000);
            }
        });
    });

module.exports = command;