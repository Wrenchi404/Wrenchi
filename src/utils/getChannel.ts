import Wrenchi from "../lib/Wrenchi"
import { CommandInteraction, VoiceBasedChannel } from "discord.js"

const getChannel = async (client: Wrenchi, interaction: CommandInteraction) => {
    const member = await interaction.guild.members.cache.get(interaction.user.id)
    if (!member) return

    const channel: VoiceBasedChannel = member.voice.channel;
    if (!channel) {
        interaction.reply({ content: "You must be connected in a voice channel to hear song" })
        return
    }
    if (interaction.guild.me.voice.channel && member.voice.channel !== interaction.guild.me.voice.channel) {
        interaction.reply({ content: "You must be connected in the same voice channel as me" })
        return
    }
    if (!channel.joinable) {
        interaction.reply({ content: "I don't have permission to join this channel" })
        return
    }
    
    return channel;
}

export default getChannel