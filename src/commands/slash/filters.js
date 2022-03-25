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

const tbButton = new MessageButton()
    .setCustomId("tb_button")
    .setLabel("Treble Bass")
    .setStyle("PRIMARY");

const eightDButton = new MessageButton()
    .setCustomId("8d_button")
    .setLabel("Eight Dimension")
    .setStyle("PRIMARY");

const karaokeButton = new MessageButton()
    .setCustomId("karaoke_button")
    .setLabel("Karaoke")
    .setStyle("PRIMARY");

const vibratoButton = new MessageButton()
    .setCustomId("vibrato_button")
    .setLabel("Vibrato")
    .setStyle("PRIMARY");

const tremoloButton = new MessageButton()
    .setCustomId("tremolo_button")
    .setLabel("Tremolo")
    .setStyle("PRIMARY");

const diableEqButton = new MessageButton()
    .setCustomId("diable_eq_button")
    .setLabel("Disable Filter")
    .setStyle("DANGER");

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
        const secondRow = new MessageActionRow().addComponents(tbButton, eightDButton, karaokeButton, vibratoButton, tremoloButton);
        const disableRow = new MessageActionRow().addComponents(diableEqButton);

        const filterEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Filters")
            .setDescription("Select a filter to apply to the song.")
            .setTimestamp();

        const filterMsg = await interaction.reply({ embeds: [filterEmbed], components: [firstRow, secondRow, disableRow] });

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

            if (inter.customId === "vw_button") {
                if (player.vaporwave) {
                    player.vaporwave = false
                    await inter.reply({ content: "Disabled **Vaporwave** filter.", ephemeral: true });
                } else {
                    player.vaporwave = true
                    await inter.reply({ content: "Enabled **Vaporwave** filter.", ephemeral: true });
                }
            }

            if (inter.customId === "bb_button") {
                if (player.bassboost) {
                    player.bassboost = false
                    await inter.reply({ content: "Disabled **Bass Boost** filter.", ephemeral: true });
                } else {
                    player.bassboost = true
                    await inter.reply({ content: "Enabled **Bass Boost** filter.", ephemeral: true });
                }
            }

            if (inter.customId === "pop_button") {
                if (player.pop) {
                    player.pop = false
                    await inter.reply({ content: "Disabled **Pop** filter.", ephemeral: true });
                } else {
                    player.pop = true
                    await inter.reply({ content: "Enabled **Pop** filter.", ephemeral: true });
                }
            }

            if (inter.customId === "soft_button") {
                if (player.soft) {
                    player.soft = false
                    await inter.reply({ content: "Disabled **Soft** filter.", ephemeral: true });
                } else {
                    player.soft = true
                    await inter.reply({ content: "Enabled **Soft** filter.", ephemeral: true });
                }
            }

            if (inter.customId === "tb_button") {
                if (player.treblebass) {
                    player.treblebass = false
                    await inter.reply({ content: "Disabled **Treble Bass** filter.", ephemeral: true });
                } else {
                    player.treblebass = true
                    await inter.reply({ content: "Enabled **Treble Bass** filter.", ephemeral: true });
                }
            }

            if (inter.customId === "8d_button") {
                if (player.eightD) {
                    player.eightD = false
                    await inter.reply({ content: "Disabled **8D** filter.", ephemeral: true });
                } else {
                    player.eightD = true
                    await inter.reply({ content: "Enabled **8D** filter.", ephemeral: true });
                }
            }

            if (inter.customId === "karaoke_button") {
                if (player.karaoke) {
                    player.karaoke = false
                    await inter.reply({ content: "Disabled **Karaoke** filter.", ephemeral: true });
                } else {
                    player.karaoke = true
                    await inter.reply({ content: "Enabled **Karaoke** filter.", ephemeral: true });
                }
            }

            if (inter.customId === "vibrato_button") {
                if (player.vibrato) {
                    player.vibrato = false
                    await inter.reply({ content: "Disabled **Vibrato** filter.", ephemeral: true });
                } else {
                    player.vibrato = true
                    await inter.reply({ content: "Enabled **Vibrato** filter.", ephemeral: true });
                }
            }

            if (inter.customId === "tremolo_button") {
                if (player.tremolo) {
                    player.tremolo = false
                    await inter.reply({ content: "Disabled **Tremolo** filter.", ephemeral: true });
                } else {
                    player.tremolo = true
                    await inter.reply({ content: "Enabled **Tremolo** filter.", ephemeral: true });
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