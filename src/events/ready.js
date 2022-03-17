const Wrenchi = require("../lib/Wrenchi");
/**
 *
 * @param {Wrenchi} client
*/
module.exports = async (client) => {
    (client.Ready = true),
    client.log("Successfully Logged in as " + client.user.tag);
    client.user.setPresence({ activities: [{ name: `To Wrench's Code`, type: "LISTENING" }], status: "dnd" });

    // Erela.js init stuffs
    client.Manager.init(client.user.id);

    // MongoDB Connection
    client.connectMongoDB();
}