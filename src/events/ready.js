const Wrenchi = require("../lib/Wrenchi");

/**@param {Wrenchi} client */
module.exports = async (client) => {
    console.log(`Wrenchi started running`);
    client.user.setPresence({ activities: [{ name: `Wrench HideOut`, type: "WATCHING" }], status: "dnd" });
}