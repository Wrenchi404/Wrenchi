const { MessageEmbed } = require("discord.js");

/**
    * @param {import("../lib/Wrenchi")} client 
*/

const HandlerError = (client) => {
    console.log("Started handling errors");

    process.on("unhandledRejection", (reason, promise) => {
        console.log(`❌ | [Error] Unhandled Rejection: `);
        console.log(reason, promise);

        const errorEmbed = new MessageEmbed()
            .setAuthor({ name: `❌ | [Error] Unhandled Rejection` })
            .setColor("DARK_RED")
            .setDescription(`${reason}`)
            .setTimestamp();

        client.channels.cache.get("944242282834559086").send({ embeds: [errorEmbed] });
    });

    process.on("uncaughtException", (error, origin) => {
        console.log(`❌ | [Error] Uncaught Exception: `);
        console.log(error, origin);

        const errorEmbed = new MessageEmbed()
            .setAuthor({ name: `❌ | [Error] Uncaught Exception` })
            .setColor("DARK_RED")
            .setDescription(`${error} \n\n ${origin.toString()}`)
            .setTimestamp()

        client.channels.cache.get("944242282834559086").send({ embeds: [errorEmbed] })
    });

    process.on("uncaughtExceptionMonitor", (error, origin) => {
        console.log(`❌ | [Error] Uncaught Exception Monitor: `);
        console.log(error, origin);

        const errorEmbed = new MessageEmbed()
            .setAuthor({ name: `❌ | [Error] Uncaught Exception Monitor` })
            .setColor("DARK_RED")
            .setDescription(`${error} \n\n ${origin.toString()}`)
            .setTimestamp()

        client.channels.cache.get("944242282834559086").send({ embeds: [errorEmbed] })
    });
}

module.exports = HandlerError;