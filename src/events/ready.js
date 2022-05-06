import Wrenchi from "../lib/Wrenchi.js"

/**@param {Wrenchi} client */
export default async (client) => {
    console.log(`Wrenchi started running`);
    client.user.setPresence({ activities: [{ name: `Wrench HideOut`, type: "WATCHING" }], status: "dnd" });

    // Erela.js
    client.Manager.init(client.user.id);
}