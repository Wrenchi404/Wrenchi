import Wrenchi from "../lib/Wrenchi"
import { Message } from "discord.js"

interface ICommand {
    info: {
        name: String,
        description: String,
        aliases: String[]
    },
    run: (client: Wrenchi, message: Message, args: String[]) => Promise<void>
}

export default ICommand