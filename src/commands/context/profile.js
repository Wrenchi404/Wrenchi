const { ContextMenuCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Profile = require("../../models/economy/ProfileSchema");

module.exports = {
    command: new ContextMenuCommandBuilder().setName("Profile").setType(2),

    /**
     * @param {import("../../lib/Wrenchi")} client
     * @param {import("discord.js").ContextMenuInteraction} interaction
     */
    run: async (client, interaction, options) => {
        const member = interaction.options.getUser("user");

        const profile = await Profile.findOne({
            userID: member.id
        });
        if (!profile) return interaction.reply({ content: `He don't have a profile...`, ephemeral: true });

        const profileEmbed = new MessageEmbed()
            .setAuthor({ name: profile.profileName, iconURL: member.displayAvatarURL() })
            .setColor("GREEN")
            .setThumbnail(member.displayAvatarURL())
            .addField("Discord Name", member.username)
            .addField("Character Name", profile.profileName, true)
            .addField("Money", `$${profile.money}`, true)
            .addField("Bank", `$${profile.bank}`, true)
            .setTimestamp()

        interaction.reply({ embeds: [profileEmbed] })
    },
}