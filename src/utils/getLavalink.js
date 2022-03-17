/**
 *
 * @param {import("../lib/Wrenchi")} client
 * @returns {import("erela.js").Node | undefined}
 */
module.exports = async (client) => {
    return new Promise((resolve) => {
        for (let i = 0; i < client.Manager.nodes.size; i++) {
            const node = client.Manager.nodes.array()[i];
            if (node.connected) resolve(node);
        }
        resolve(undefined);
    });
}