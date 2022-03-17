const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const LoadCommands = require("../utils/loadCommands");

(async () => {
    const config = require("../data/config");
    const rest = new REST({ version: "9" }).setToken(config.Client.Token);
    const commands = await LoadCommands().then((cmds) => {
        return [].concat(cmds.slash).concat(cmds.context);
    });

    console.log("Deploying commands to guild...");
    await rest
        .put(Routes.applicationGuildCommands(config.Client.ClientID, config.Discord.TestGuildID), {
            body: commands,
        })
        .catch(console.log);
    console.log("Successfully deployed commands!");
})();