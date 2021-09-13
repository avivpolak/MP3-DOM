//playing functions
function playSong(songId) {
    playingNow = document.getElementById(songId)
    playingNow.style.backgroundColor = "orange"
    setTimeout(function () {
        playingNow.style.backgroundColor = ""
    }, songById(songId).duration * 10) //that soppuesed to be 1000, althogh its to much time to wait to check it.
}

function playplaylist(playlistId) {
    playingNow = document.getElementById("pl" + playlistId)
    playingNow.style.backgroundColor = "orange"
    setTimeout(function () {
        playingNow.style.backgroundColor = ""
    }, playlistDuration(playlistId) * 10) //that soppuesed to be * 1000, althogh its to much time to wait to check it.
}

//CREATING ELEMENTS FUNCTIONS

//CREATING SONG ELEMENT

function createSongElement(
    tagName,
    id,
    title,
    album,
    artist,
    duration,
    coverArt,
    classes = [],
    attributes = { onclick: `playSong(${id})` }
) {
    // if (type==="song")
    let element = document.createElement("div")
    element.setAttribute("id", id)
    element.setAttribute("role", "button")

    const imgEl = document.createElement("img")
    imgEl.classList.add("art")
    imgEl.setAttribute("src", coverArt)
    element.append(imgEl)

    let titleElement = document.createElement("p")
    titleElement.innerText = title
    titleElement.classList.add("bold")
    element.appendChild(titleElement)

    let albumElement = document.createElement("p")
    albumElement.innerText = album
    element.appendChild(albumElement)

    let artistElement = document.createElement("p")
    artistElement.innerText = artist
    element.appendChild(artistElement)

    let durationElement = document.createElement("p")
    durationElement.innerText = sTOmmss(duration)

    durationElement.style.backgroundColor = colorDuration(duration)
    element.appendChild(durationElement)

    for (let classname of classes) {
        element.classList.add(classname)
    }
    for (let atattribute in attributes) {
        element.setAttribute(atattribute, attributes[atattribute])
    }

    return element
}

//CREATING PLAYLIST  ELEMENT

function createPlaylistElement({ id, name, songs }) {
    playlistEl = document.createElement("div")
    playlistEl.setAttribute("id", "pl" + id) //pl stands fot playlist, to deferent from song id.
    playlistEl.setAttribute("onclick", `playplaylist(${id})`)
    nameEl = document.createElement("p")
    nameEl.innerText = name
    playlistEl.appendChild(nameEl)

    duration = document.createElement("p")
    duration.innerText = songs.length + " songs" + " , " + sTOmmss(playlistDuration(id))
    playlistEl.appendChild(duration)
    return playlistEl
}

//other functions:

function sTOmmss(s) {
    //gets: SECONDS , returns: "MINUTES:SECONDS".
    const mm = Math.floor(s / 60)
    const ss = s % 60
    let mmss = ""
    if (mm > 9 && ss > 9) mmss = `${mm}:${ss}`
    if (mm > 9 && ss <= 9) mmss = `${mm}:0${ss}`
    if (mm <= 9 && ss > 9) mmss = `0${mm}:${ss}`
    if (mm <= 9 && ss <= 9) mmss = `0${mm}:0${ss}`
    return mmss
}

function colorDuration(duration) {
    let red = 0
    let greeg = 0
    let scale = (duration - 120) / 300
    if (scale >= 0 && scale <= 1) {
        red = scale * 255
        green = (1 - scale) * 255
    } else if (scale < 0) {
        red = 0
        green = 255
    } else if (scale > 0) {
        red = 255
        green = 0
    }

    return `rgb(${red},${green},0)`
}

function playlistDuration(id) {
    //Parameters: PLAYLIST ID
    //Returns: PLAYLIST DURATION.

    if (playListById(id) === undefined) {
        throw new Error("non-existent playlistId")
    }
    const playlist = playListById(id)
    let sum = 0
    for (let i = 0; i < playlist.songs.length; i++) {
        let song = songById(playlist.songs[i])
        sum += song.duration
    }
    return sum
}
function songById(id) {
    //Parameters: SONG ID
    //Returns: THE MATCHING SONG.

    for (let i = 0; i < player.songs.length; i++) {
        if (player.songs[i]["id"] === id) return player.songs[i]
    }
    return undefined
}
function playListById(id) {
    //Parameters: PLAYLIST ID
    //Returns: THE MATCHING PLAYLIST.

    for (let i = 0; i < player.playlists.length; i++) {
        if (player.playlists[i]["id"] === id) return player.playlists[i]
    }
    return undefined
}

//END OF FUNCTIOS SECTION

// THWE CODE  ITSELF:
let songElement = document.getElementById("songs") //creating song list
for (let song of player.songs) {
    songElement.appendChild(
        createSongElement("p", song.id, song.title, song.album, song.artist, song.duration, song.coverArt, ["song"], {
            onclick: `playSong(${song.id})`,
        })
    )
}

let playlistElement = document.getElementById("playlists") //creating playlist list
for (let playlist of player.playlists) {
    playlistElement.appendChild(createPlaylistElement(playlist))
}
