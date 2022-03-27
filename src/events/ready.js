const Wrenchi = require("../lib/Wrenchi");
/**
 *
 * @param {Wrenchi} client
*/
module.exports = async (client) => {
    console.log("Successfully Logged in as " + client.user.tag);
    client.user.setPresence({ activities: [{ name: `Wrench HideOut`, type: "WATCHING" }], status: "dnd" });

    // Erela.js init stuffs
    client.Manager.init(client.user.id);

    // MongoDB Connection
    client.connectMongoDB();
}