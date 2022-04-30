import { Message, MessageEmbed } from "discord.js"
import Wrenchi from "../../lib/Wrenchi"
import User from "../../models/User"

const Command = {
    info: {
        name: "user",
        description: "Sup Bro"
    },

    run: async function (client: Wrenchi, message: Message, args: string[]) {
        const user = await User.findOne({ _id: message.author.id });

        let status: string
        let activity: [string]

        // Activities
        const CustomStatus = message.member.presence.activities.find(a => a.type === "CUSTOM");
        if (!CustomStatus) status = "None"
        else if (CustomStatus.emoji) status = `${CustomStatus.emoji.name} ${CustomStatus.state}`
        else status = CustomStatus.state

        // const Activity = message.member.presence.activities
        // if (!Activity.length) activity.push("None")
        // for (const acts of Activity) {
        //     if (acts.type === "PLAYING") {
        //         activity.push(acts.name.toString())
        //     }

        //     if (acts.type === "LISTENING") {
        //         activity.push(acts.name.toString())
        //     }

        //     if (acts.type === "WATCHING") {
        //         activity.push(acts.name.toString())
        //     }

        //     if (acts.type === "STREAMING") {
        //         activity.push(acts.name.toString())
        //     }
        // }
        // console.log(activity)

        if (!user) {
            const role = message.member.roles.cache.map((role) => role.name).slice(0, -1);
            const newUser = await new User({
                _id: message.author.id,
                username: message.author.username,
                avatar: message.author.avatarURL(),
                roles: role
            }).save();

            const embed = new MessageEmbed()
                .setTitle(`${message.author.username}'s Profile`)
                .setColor("RANDOM")
                .setThumbnail(message.author.avatarURL())
                .setFields([
                    {
                        name: "Username",
                        value: `${newUser.username}`,
                        inline: true
                    },
                    {
                        name: "Roles",
                        value: `${newUser.roles.join(", ")}`,
                        inline: true
                    },
                    {
                        name: "Status",
                        value: `${status}`,
                        inline: true
                    },
                    {
                        name: "Activity",
                        value: `${activity.forEach(a => a.split(" ").join(","))}`,
                        inline: true
                    }
                ]);

            return message.channel.send({ embeds: [embed] });
        } else {
            const embed = new MessageEmbed()
                .setTitle(`${message.author.username}'s Profile`)
                .setColor("RANDOM")
                .setThumbnail(message.author.avatarURL())
                .setFields([
                    {
                        name: "Username",
                        value: `${user.username}`,
                        inline: true
                    },
                    {
                        name: "Roles",
                        value: `${user.roles.join(", ")}`,
                        inline: true
                    },
                    {
                        name: "Status",
                        value: `${status}`,
                        inline: true
                    },
                    {
                        name: "Activity",
                        value: `${activity.forEach(a => a.split(" ").join(","))}`,
                        inline: true
                    }
                ]);

            message.channel.send({ embeds: [embed] });
        }
    },
};

export { Command }