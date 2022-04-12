import readline from "readline"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

(async () => {
    const config = await import("../data/config")
    const rest = new REST({ version: "9" }).setToken(config.default.Token);

    rl.question(
        "Enter the guild id you wanted to delete commands: ",
        async (guild) => {
            console.log("Started Deleting Commands...");
            let commands: any = await rest.get(
                Routes.applicationGuildCommands(config.default.ClientID, guild)
            );
            for (let i = 0; i < commands.length; i++) {
                const cmd = commands[i];
                await rest
                    .delete(
                        Routes.applicationGuildCommand(config.default.ClientID, guild, cmd.id)
                    )
                    .catch(console.log);
                console.log("Deleted command: " + cmd.name);
            }
            if (commands.length === 0)
                console.log("No Commands.");
        }
    );
})();