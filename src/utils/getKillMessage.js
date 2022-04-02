const { MessageEmbed } = require("discord.js")

const Messages = [
    "was shot by",
    "died because of",
    "stabbed by",
    "was killed by",
    "was killed while trying to hurt",
    "wasted by",
    "rekted by",
    "tried to walk calm while a fight was going on with",
]

// const WastedGifs = [
//     "https://tenor.com/view/gta-wasted-gif-7290471",
//     "https://tenor.com/view/mark-markiplier-wasted-ded-af-gif-7792651",
//     "https://tenor.com/view/wasted-wastedmidi-wasted-gta-midi-gif-23715969",
//     "https://tenor.com/view/wasted-putther-genghiskh4nyt-killed-assassinated-gif-17968698",
//     "https://tenor.com/view/wasted-gif-4979696",
//     "https://tenor.com/view/wasted-gif-18675592"
// ]

// const getGifs = WastedGifs[Math.floor(Math.random() * WastedGifs.length)];

function getKillMessage(killer, victim) {
    if (Math.floor(Math.random() * 10)) {
        const msg = `${victim} ${Messages[Math.floor(Math.random() * Messages.length)]} ${killer}`;

        const KillEmbed = new MessageEmbed()
            .setDescription(msg)
            .setColor("RED")

        return KillEmbed;
    } else {
        const msg = `${killer} ${Messages[Math.floor(Math.random() * Messages.length)]} ${victim}`;

        const KillEmbed = new MessageEmbed()
            .setDescription(msg)
            .setColor("RED")

        return KillEmbed;
    }
}

module.exports = getKillMessage