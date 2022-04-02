import Wrenchi from "../lib/Wrenchi"

module.exports = async (client: Wrenchi, payload: any) => {
    client.Manager.updateVoiceState(payload);
}