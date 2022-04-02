import { MessageEmbed, TextChannel, DMChannel, NewsChannel } from "discord.js"

const sendError = async (text: String, channel: TextChannel | DMChannel | NewsChannel) => {
    const embed = new MessageEmbed()
        .setTitle("Error ;-;")
        .setDescription(text.toString())
        .setFooter({ text: "Report this to Wrench#0012" })

    await channel.send({ embeds: [embed] });
}

export default sendError