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

function getRandomMessage(killer, victim) {
    if (Math.floor(Math.random() * 10)) {
        return `${victim} ${Messages[Math.floor(Math.random() * Messages.length)]} ${killer}`;
    } else {
        return `${killer} ${Messages[Math.floor(Math.random() * Messages.length)]} ${victim}`;
    }
}

module.exports = getRandomMessage