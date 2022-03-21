import path from "path"
import fs from "fs"

const LoadCommands: Function = () => {
    return new Promise(async (resolve) => {
        let slash = await LoadDirectory("slash");
        let context = await LoadDirectory("context");

        resolve({ slash, context });
    });
}

const LoadDirectory: Function = (dir: any) => {
    return new Promise((resolve) => {
        let commands: any = [];
        let CommandsDir = path.join(__dirname, "..", "commands", dir);
        let i = 0,
            f = 0,
            r = false;

        fs.readdir(CommandsDir, (err, files) => {
            if (err) throw err;
            f = files.length;

            files.forEach((file) => {
                let cmd = require(CommandsDir + "/" + file);
                i++;
                if (i == f) r = true;
                if (!cmd || (dir == "context" && !cmd.command))
                    return console.log(
                        "Unable to load Command: " +
                        file.split(".")[0] +
                        ", File doesn't have either command"
                    );
                if (dir == "context") commands.push(cmd.command);
                else commands.push(cmd);
                if (r) resolve(commands);
            });
        });
    });
}

export default LoadCommands;