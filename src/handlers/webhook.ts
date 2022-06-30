import { WebhookClient } from "discord.js"
import Wrenchi from "../lib/Wrenchi"

const MusicWebhook = (client: Wrenchi) => {
    const webhook = new WebhookClient({ url: client.config.Webhooks.Logger });
    return webhook
}

export {
    MusicWebhook
}