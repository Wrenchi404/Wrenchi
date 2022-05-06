import SlashCommand from "../../../lib/SlashCommand.js"

const command = new SlashCommand()
    .setName("ping")
    .setDescription("Pong!")
    .setRun(async (client, interation, options) => {
        interation.reply("Pong");
    });

export default command