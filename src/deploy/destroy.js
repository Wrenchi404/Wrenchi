const readline = require("readline");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const LoadCommands = require("../utils/loadCommands");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

(async () => {
    const config = require("../Data/config")
    const rest = new REST({ version: "9" }).setToken(config.Client.Token);

    rl.question(
        "Enter the guild id you wanted to delete commands: ",
        async (guild) => {
            console.log("Started Deleting Commands...");
            let commands = await rest.get(
                Routes.applicationGuildCommands(config.Client.ClientID, guild)
            );
            for (let i = 0; i < commands.length; i++) {
                const cmd = commands[i];
                await rest
                    .delete(
                        Routes.applicationGuildCommand(config.Client.ClientID, guild, cmd.id)
                    )
                    .catch(console.log);
                console.log("Deleted command: " + cmd.name);
            }
            if (commands.length === 0)
                console.log("No Commands.");
        }
    );
})();