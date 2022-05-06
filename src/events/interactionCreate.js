import { Interaction } from "discord.js"
import Wrenchi from "../lib/Wrenchi.js"

/**
 * @param {Wrenchi} client 
 * @param {Interaction} interaction
 */
export default async (client, interaction) => {
    if (interaction.channel.type === "DM") return

    if (interaction.isCommand()) {
        let command = client.SlashCommands.find(
            (x) => x.name == interaction.commandName
        );
        if (!command || !command.run)
            return interaction.reply(
                "Sorry the command you used doesn't have any run function"
            );
        command.run(client, interaction, interaction.options);
    } else if (interaction.isContextMenu()) {
        let command = client.ContextCommands.find((x) => x.name === interaction.commandName);
        if (!command || !command.run) return interaction.reply("Command doesn't exists");

        command.run(client, interaction);
    }
}