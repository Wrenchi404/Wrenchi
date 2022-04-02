import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import readline from "readline"
import config from "../../data/config.json"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

(async () => {
    const rest = new REST({ version: "9" }).setToken(config.Bot.Token);

    rl.question(
        "Enter the guild id you wanted to delete commands: ",
        async (guild) => {
            console.log("Started Deleting Commands...");
            let commands: any = await rest.get(
                Routes.applicationGuildCommands(config.Bot.ClientID, guild)
            );
            for (let i = 0; i < commands.length; i++) {
                const cmd = commands[i];
                await rest
                    .delete(
                        Routes.applicationGuildCommand(config.Bot.ClientID, guild, cmd.id)
                    )
                    .catch(console.log);
                console.log("Deleted command: " + cmd.name);
            }
            if (commands.length === 0)
                console.log("No Commands.");
        }
    );
})();