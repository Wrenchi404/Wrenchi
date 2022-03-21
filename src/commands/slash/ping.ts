import SlashCommand from "../../lib/SlashCommand"
import { CommandInteraction, CommandInteractionOptionResolver } from "discord.js"
import Wrenchi from "../../lib/Wrenchi"

const command = new SlashCommand()
    .setName("ping")
    .setDescription("Show's the ping of the bot")
    .setRun(async (client: Wrenchi, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => {
        interaction.reply(`Client Web Socket Ping: ${client.ws.ping}ms`);
    });

export default command;