import Wrenchi from "../lib/Wrenchi";

const ReadyEvent = async (client: Wrenchi) => {
    client.user?.setPresence({ activities: [{ name: `To Wrench's Code`, type: "LISTENING" }], status: "dnd" });
}

export default ReadyEvent;