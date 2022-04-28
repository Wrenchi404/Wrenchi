import Wrenchi from "../lib/Wrenchi"

export default async (client: Wrenchi) => {
    console.log("Successfully Logged in as " + client.user?.tag);
    client.user.setPresence({ activities: [{ name: `Wrench HideOut`, type: "WATCHING" }], status: "dnd" });

    // Erela Manager
    // client.Manager.init(client.user.id);

    // Database
    await client.connectDatabase();
}