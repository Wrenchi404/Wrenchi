import Wrenchi from "../lib/Wrenchi"
import { CommandInteractionOptionResolver, Interaction, CommandInteraction } from "discord.js"
import ContextMenu from "../lib/ContextMenu"

export default async (client: Wrenchi, interaction: Interaction) => {
    if (interaction.channel.type === "DM") return
    
    if (!interaction.isCommand()) return
    else {
        let command = client.SlashCommands.find(
            (x) => x.name == interaction.commandName
        );
        if (!command || !command.run)
            return interaction.reply(
                "Sorry the command you used doesn't have any run function"
            );
        command.run(client, interaction, interaction.options as CommandInteractionOptionResolver);
    }

    if (!interaction.isContextMenu()) return
    else {
        let command = client.ContextCommands.find(
            (x) => x.name == interaction.commandName
        );
        if (!command || !command.run)
            return interaction.reply(
                "Sorry the command you used doesn't have any run function"
            );
        command.run(client, interaction);
    }
}