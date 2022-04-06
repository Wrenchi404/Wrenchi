import Wrenchi from "../lib/Wrenchi"

export default async (client: Wrenchi, payload: any) => {
    client.Manager.updateVoiceState(payload)
}