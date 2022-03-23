const Wrenchi = require("../../lib/Wrenchi");
const { Message, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "rr",
    description: "Admin Command",
    /**
     *
     * @param {Wrenchi} client
     * @param {Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        if (message.author.id === client.config.Discord.OwnerID) {
            const redButton = new MessageButton()
                .setCustomId("red_role")
                .setEmoji("🟥")
                .setLabel("Red Role")
                .setStyle("PRIMARY");
            const blueButton = new MessageButton()
                .setCustomId("blue_role")
                .setEmoji("🟦")
                .setLabel("Blue Role")
                .setStyle("PRIMARY");
            const greenButton = new MessageButton()
                .setCustomId("green_role")
                .setEmoji("🟩")
                .setLabel("Green Role")
                .setStyle("PRIMARY");
            const orangeButton = new MessageButton()
                .setCustomId("orange_role")
                .setEmoji("🟧")
                .setLabel("Orange Role")
                .setStyle("PRIMARY");
            const blackButton = new MessageButton()
                .setCustomId("black_role")
                .setEmoji("◼️")
                .setLabel("Black Role")
                .setStyle("PRIMARY");

            const cyanButton = new MessageButton()
                .setCustomId("cyan_role")
                .setEmoji("956145627346133043")
                .setLabel("Cyan Role")
                .setStyle("PRIMARY");
            const violetButton = new MessageButton()
                .setCustomId("violet_role")
                .setEmoji("🟪")
                .setLabel("Violet Role")
                .setStyle("PRIMARY");
            const yellowButton = new MessageButton()
                .setCustomId("yellow_role")
                .setEmoji("🟨")
                .setLabel("Yellow Role")
                .setStyle("PRIMARY");


            const actionRow = new MessageActionRow().addComponents(redButton, blueButton, greenButton, orangeButton, blackButton);
            const actionRowTwo = new MessageActionRow().addComponents(cyanButton,violetButton, yellowButton);

            const embed = new MessageEmbed()
                .setColor("AQUA")
                .setAuthor({ name: "Colour Roles", iconURL: client.user.displayAvatarURL({ format: "png", dynamic: true }) })
                .setDescription("Click the buttons to get your name painted in colours.")
                .setFields([
                    {
                        name: "Red",
                        value: "🟥 - To get Red colour role",
                    },
                    {
                        name: "Green",
                        value: "🟩 - To get Green colour role",
                    },
                    {
                        name: "Blue",
                        value: "🟦 - To get Blue colour role",
                    },
                    {
                        name: "Cyan",
                        value: "<:cyan:956145627346133043> - To get Cyan colour role",
                    },
                    {
                        name: "Orange",
                        value: "🟧 - To get Orange colour role",
                    },
                    {
                        name: "Black",
                        value: "◼️ - To get Black colour role",
                    },
                    {
                        name: "Violet",
                        value: "🟪 - To get Violet colour role",
                    },
                    {
                        name: "Yellow",
                        value: "🟨 - To get Yellow colour role",
                    }
                ])
                .setFooter({ text: "Have fun bro", iconURL: client.user.displayAvatarURL({ format: "png", dynamic: true }) });

            message.channel.send({
                embeds: [embed],
                components: [actionRow, actionRowTwo]
            });
        }
    }
}