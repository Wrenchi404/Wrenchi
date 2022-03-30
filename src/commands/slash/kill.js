const SlashCommand = require("../../lib/SlashCommand");
const getRandomMessage = require("../../utils/messages");
const NeverKillRoles = [
    "936219359632842763",
    "787198982807355442",
]

const command = new SlashCommand()
    .setName("kill")
    .setDescription("Delete him")
    .addMentionableOption((option) => option.setName("victim").setDescription("The victim").setRequired(true))
    .setRun(async (client, interaction, options) => {
        const victim = interaction.options.getMentionable("victim");
        if (victim.id === client.user.id) {
            interaction.reply("You can't kill me IDIOT!");
            return
        }
        const killer = interaction.user;

        if (NeverKillRoles.includes(victim.roles.cache.first().id)) {
            interaction.reply("You can't kill my master!");
            return
        }
        if (killer.id === victim.id) {
            interaction.reply("Stop it, get some help.");
            return
        }

        const message = getRandomMessage(killer, victim);
        interaction.reply({ content: message });
    });

module.exports = command;