import ContextMenu from "../../lib/ContextMenu"
import Wrenchi from "../../lib/Wrenchi"

const Command = new ContextMenu()
    .setName("Hello")
    .setType(2)
    .setRun(async (client, menu) => {
        console.log("Workin")
    })

export default Command
// module.exports = {
//     command: new ContextMenuCommandBuilder().setName("Say Hello").setType(2),
//     run: (client: Wrenchi, interaction: ContextMenuInteraction, options: any) => {
//         interaction.reply(`<@${interaction.options.getUser("user").id}>, Hello!`);
//     },
// }