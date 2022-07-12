import Wrenchi from "../lib/Wrenchi"
import {
    CommandInteractionOptionResolver,
    Interaction,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} from "discord.js"
const wait = require('node:timers/promises').setTimeout;

interface ITickets {
    guildID: string,
    channelID: string,
    username: string,
    userID: string,
    state: string,
    createdAt: Date,
    deletedAt: Date
}

export default async (client: Wrenchi, interaction: Interaction) => {
    const mysql = await client.mysql;

    if (interaction.isCommand()) {
        let command = client.SlashCommands.find(
            (x) => x.name == interaction.commandName
        );

        command.run(client, interaction, interaction.options as CommandInteractionOptionResolver);
    } else if (interaction.isContextMenu()) {
        let command = client.ContextCommands.find((x) => x.name === interaction.commandName);
        if (!command || !command.run) return interaction.reply("Command doesn't exists");

        command.run(client, interaction);
    } else if (interaction.isButton()) {
        // Forget MySQL please
    }
}