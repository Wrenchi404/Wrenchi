import Wrenchi from "../lib/Wrenchi.js"

/**@param {Wrenchi} client */
export default async (client, payload) => {
    client.Manager.updateVoiceState(payload);
}