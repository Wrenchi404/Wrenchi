import ytdl from "ytdl-core"

export const getSubs = async (url: string) => {
    const subsArr = ["", "K", "M", "B", "T"]
    const video = await ytdl.getInfo(url)
    let subs = video.videoDetails.author.subscriber_count

    for (let x in subsArr) {
        if (subs < 1000) return `${Math.round(subs * 100) / 100}${subsArr[x]}`
        subs /= 1000;
    }
}

export const getLikes = async (uri: string) => {
    const numArr = ["", "K", "M", "B", "T"]
    const video = await ytdl.getInfo(uri)
    let likes = video.videoDetails.likes

    for (let x in numArr) {
        if (likes < 1000) return `${Math.round(likes * 10) / 10}${numArr[x]}`;
        likes /= 1000;
    }
}

export const getDuration = async (duration: any) => {
    let sec = parseInt(duration, 10);
    sec = sec / 1000;

    let hours: number | string = Math.floor(sec / 3600);
    let minutes: number | string = Math.floor((sec - (hours * 3600)) / 60);
    let seconds: number | string = Math.round(sec - (hours * 3600) - (minutes * 60));
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }

    return hours + ':' + minutes + ':' + seconds;
}