const Wrenchi = require("../lib/Wrenchi");

/**@param {Wrenchi} client */
module.exports = async (client, payload) => {
    client.Manager.updateVoiceState(payload);
}