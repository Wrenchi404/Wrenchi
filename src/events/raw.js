const Wrenchi = require("../lib/Wrenchi.js");

/**@param {Wrenchi} client */
module.exports = async (client, payload) => {
    client.Manager.updateVoiceState(payload);
}