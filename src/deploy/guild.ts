import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import LoadCommands from "../utils/loadCommands"

(async () => {
    const config = await import("../data/config.json");
    const rest = new REST({ version: "9" }).setToken(config.Bot.Token);
    const commands = await LoadCommands().then((cmds: any) => {
        return [].concat(cmds.slash).concat(cmds.context);
    });

    console.log("Deploying commands to guild...");
    await rest
        .put(Routes.applicationGuildCommands(config.Bot.ClientID, config.Discord.TestGuildID), {
            body: commands,
        })
        .catch(console.log);
    console.log("Successfully deployed commands!");
})();