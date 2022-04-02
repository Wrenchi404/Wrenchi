import Wrenchi from "../lib/Wrenchi";
import { CommandInteractionOptionResolver, Interaction } from "discord.js"

module.exports = async (client: Wrenchi, interaction: Interaction) => {
    if (interaction.isCommand()) {
        let command = client.SlashCommands.find(
            (x) => x.name == interaction.commandName
        );
        if (!command || !command.run)
            return interaction.reply(
                "Sorry the command you used doesn't have any run function"
            );
        command.run(client, interaction, interaction.options as CommandInteractionOptionResolver);
        return;
    }
}