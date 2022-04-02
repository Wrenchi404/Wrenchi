import Wrenchi from "../lib/Wrenchi"
import { Node } from "erela.js"

/**
 * @returns {Node}
*/
const getLavalink = async (client: Wrenchi) => {
    return new Promise<Node>((resolve) => {
        for (let i = 0; i < client.Manager.nodes.size; i++) {
            const node: Node = client.Manager.nodes.array()[i];
            if (node.connected) resolve(node);
        }
        resolve(undefined)
    });
}

export default getLavalink