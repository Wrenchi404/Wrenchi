import Wrenchi from "../lib/Wrenchi"
import { Message, MessageEmbed, Interaction, Client } from "discord.js"
import SlashCommand from "../lib/SlashCommand";

const InteractionCreateEvent = async (client: Wrenchi, interaction: Interaction) => {
    if (interaction.isCommand()) {
        let command = client.slashCommands.find(
            (x: any) => x.name == interaction.commandName
        );
        if (!command || !command.run)
            return interaction.reply(
                "Sorry the command you used doesn't have any run function"
            );
        command.run(client, interaction, interaction.options);
        return;
    }

    if (interaction.isContextMenu()) {
        let command: any = client.contextCommands.find(
            (x: any) => x.command.name == interaction.commandName
        );
        if (!command || !command.run)
            return interaction.reply(
                "Sorry the command you used doesn't have any run function"
            );
        command.run(client, interaction, interaction.options);
        return;
    }
}

export default InteractionCreateEvent;