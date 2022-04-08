import { MessageEmbed, WebhookClient } from "discord.js"
import Wrenchi from "../lib/Wrenchi"

export const HandleError = (client: Wrenchi) => {
    console.log("Started handling errors");
    const webhook = new WebhookClient({ url: client.config.Webhooks.ErrorLogger });

    process.on("unhandledRejection", (reason, promise) => {
        console.error(`❌ | [Error] Unhandled Rejection: `);
        console.error(reason, promise);

        const errorEmbed = new MessageEmbed()
            .setAuthor({ name: `❌ | [Error] Unhandled Rejection` })
            .setColor("DARK_RED")
            .setDescription(`${reason}`)
            .setTimestamp();

        webhook.send({ embeds: [errorEmbed] });
    });

    process.on("uncaughtException", (error, origin) => {
        console.error(`❌ | [Error] Uncaught Exception: `);
        console.error(error, origin);

        const errorEmbed = new MessageEmbed()
            .setAuthor({ name: `❌ | [Error] Uncaught Exception` })
            .setColor("DARK_RED")
            .setDescription(`${error} \n\n ${origin.toString()}`)
            .setTimestamp()

        webhook.send({ embeds: [errorEmbed] });
    });

    process.on("uncaughtExceptionMonitor", (error, origin) => {
        console.error(`❌ | [Error] Uncaught Exception Monitor: `);
        console.error(error, origin);

        const errorEmbed = new MessageEmbed()
            .setAuthor({ name: `❌ | [Error] Uncaught Exception Monitor` })
            .setColor("DARK_RED")
            .setDescription(`${error} \n\n ${origin.toString()}`)
            .setTimestamp()

        webhook.send({ embeds: [errorEmbed] });
    });
}