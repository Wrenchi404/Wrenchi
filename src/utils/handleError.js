const { MessageEmbed, WebhookClient } = require("discord.js");

/**
    * @param {import("../lib/Wrenchi")} client 
*/

const HandlerError = (client) => {
    console.log("Started handling errors");
    const webhook = new WebhookClient({ url: client.config.Webhooks.ErrorLogger });

    process.on("unhandledRejection", (reason, promise) => {
        console.log(`❌ | [Error] Unhandled Rejection: `);
        console.log(reason, promise);

        const errorEmbed = new MessageEmbed()
            .setAuthor({ name: `❌ | [Error] Unhandled Rejection` })
            .setColor("DARK_RED")
            .setDescription(`${reason}`)
            .setTimestamp();

        webhook.send({ embeds: [errorEmbed] });
    });

    process.on("uncaughtException", (error, origin) => {
        console.log(`❌ | [Error] Uncaught Exception: `);
        console.log(error, origin);

        const errorEmbed = new MessageEmbed()
            .setAuthor({ name: `❌ | [Error] Uncaught Exception` })
            .setColor("DARK_RED")
            .setDescription(`${error} \n\n ${origin.toString()}`)
            .setTimestamp()

        webhook.send({ embeds: [errorEmbed] });
    });

    process.on("uncaughtExceptionMonitor", (error, origin) => {
        console.log(`❌ | [Error] Uncaught Exception Monitor: `);
        console.log(error, origin);

        const errorEmbed = new MessageEmbed()
            .setAuthor({ name: `❌ | [Error] Uncaught Exception Monitor` })
            .setColor("DARK_RED")
            .setDescription(`${error} \n\n ${origin.toString()}`)
            .setTimestamp()

        webhook.send({ embeds: [errorEmbed] });
    });
}

module.exports = HandlerError;