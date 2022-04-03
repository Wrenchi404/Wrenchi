import Wrenchi from "../lib/Wrenchi";
import { CommandInteractionOptionResolver, Interaction, CommandInteraction } from "discord.js"

export default async (client: Wrenchi, interaction: Interaction) => {
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
        let command: any = client.ContextCommands.find(
            (x: any) => x.command.name == interaction.commandName
        );
        if (!command || !command.run)
            return interaction.reply(
                "Sorry the command you used doesn't have any run function"
            );
        command.run(client, interaction, interaction.options);
    }
}