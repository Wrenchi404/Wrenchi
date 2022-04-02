import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import LoadCommands from "../utils/loadCommands"
import Config from "../../data/config.json";

(async () => {
    const rest = new REST({ version: "9" }).setToken(Config.Bot.Token);
    const commands: any[] = await LoadCommands().then((cmds: any) => {
        return [].concat(cmds.slash).concat(cmds.context);
    });

    console.log("Deploying commands to guild...");
    await rest
        .put(Routes.applicationGuildCommands(Config.Bot.ClientID, Config.Discord.TestGuildID), {
            body: commands,
        })
        .catch(console.log);
    console.log("Successfully deployed commands!");
})();