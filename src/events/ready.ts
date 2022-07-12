import mongoose from "mongoose";
import Wrenchi from "../lib/Wrenchi"

export default async (client: Wrenchi) => {
    console.log("Successfully Logged in as " + client.user?.tag);
    client.user.setPresence({ activities: [{ name: `Wrench HideOut`, type: "WATCHING" }], status: "dnd" });

    await mongoose.connect(client.config.Mongo.Mongo_URI, {
        dbName: "wrenchits",
        user: "Wrench",
        pass: "wrenchidabot"
    });
    console.log("Connected to MongoDB");

    // Erela Manager
    // client.Manager.init(client.user.id);
}