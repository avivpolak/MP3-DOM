

//CREATING ELEMENTS FUNCTIONS

function cearteLitteElement(name, tagname, parent, id, imgSrc, bold, duration, numberOfSongs, songduration) {
    let element = document.createElement(tagname)
    element.innerText = name
    element.setAttribute("id", name + id)
    if (tagname === "img") {
        element.classList.add("art")
        element.setAttribute("src", imgSrc)
    }
    if (bold) {
        element.classList.add("bold")
    }
    if (duration) {
        element.innerText = numberOfSongs.length + " songs" + " , " + sTOmmss(playlistDuration(id))
    }
    if (songduration) {
        element.innerText = sTOmmss(songduration)
        element.style.backgroundColor = colorDuration(songduration)
    }
    parent.appendChild(element)
}

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
    let element = document.createElement("div")
    element.setAttribute("id", id)
    element.setAttribute("role", "button")
    cearteLitteElement("", "img", element, id, coverArt)
    cearteLitteElement(title, "p", element, id, "", true)
    cearteLitteElement(album, "p", element, id, "", false)
    cearteLitteElement(artist, "p", element, id, "", false)
    cearteLitteElement("", "p", element, id, "", false, "", "", duration)
    for (let classname of classes) {
        element.classList.add(classname)
    }
    for (let atattribute in attributes) {
        element.setAttribute(atattribute, attributes[atattribute])
    }

    return element
}




















//playing functions
function playSong(songId) {
    playingNow = document.getElementById(songId)
    playingNow.style.backgroundColor = "orange"
    setTimeout(function () {
        playingNow.style.backgroundColor = ""
    }, songById(songId).duration * 10) //that soppuesed to be 1000, althogh its to much time to wait to check it.
}

function playplaylist(playlistId) {
 
}





function createElement(tagname, children = [], classes=[], attributes) {
    const el = document.createElement(tagname)

    //children

    for (let child of children) {
        if (typeof child === "string" || typeof child === "number") {
            child = document.createTextNode(child)
        }
        el.appendChild(child)
    }

    //classes

    for (const cls of classes) {
        el.classList.add(cls)
    }

    //attrubutes

    for (const attr in attributes) {
        el.setAttribute(attr, attributes[attr])
    }

    return el
}

function createASongElement({ id, title, album, artist, duration, coverArt }) {
    let artistEl = createElement("p", [artist])
    let durationEl = createElement("p", ["duration: " + sTOmmss(duration)],[],{style: `background-color:${colorDuration(duration)};`})
    let coverArtEl = createElement("img", [], ["album-art"], { src: coverArt })
    let albumEl = createElement("p", [album])
    let titleEl = createElement("p", [title],["bold"])
    return createElement("div", [coverArtEl, titleEl, albumEl, artistEl, durationEl], ["song"], { id: id , "onclick":`playSong(${id})`})
}

function createAPlaylistElement({id,name,songs}){
    let nameEl = createElement("p", [name])
    let durationEl = createElement("p", ["duration: " + sTOmmss(playlistDuration(id))])
    let numOfSongsEl = createElement("p",[songs.length + " songs."])
    return createElement("div", [nameEl, numOfSongsEl, durationEl], ["playlist"], { id: "pl"+id , "onclick":`playplaylist(${id})`})//pl stands for a playlist id.
}


for (let song of player.songs) {
    document.getElementById("songs").appendChild(
        createASongElement(song)
    )
}

for (let playlist of player.playlists) {
    document.getElementById("playlists").appendChild(
        createAPlaylistElement(playlist)
    )
}
















//CREATING PLAYLIST  ELEMENT

function createPlaylistElement({ id, name, songs }) {
    playlistEl = document.createElement("div")
    playlistEl.setAttribute("id", "pl" + id) //pl stands fot playlist, to deferent from song id.
    playlistEl.setAttribute("onclick", `playplaylist(${id})`)
    cearteLitteElement(name, "p", playlistEl, id, "", true)
    cearteLitteElement(name, "p", playlistEl, id, "", false, sTOmmss(playlistDuration(id)), songs)
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
// let songElement = document.getElementById("songs") //creating song list
// for (let song of player.songs) {
//     songElement.appendChild(
//         createSongElement("p", song.id, song.title, song.album, song.artist, song.duration, song.coverArt, ["song"], {
//             onclick: `playSong(${song.id})`,
//         })
//     )
// }

// let playlistElement = document.getElementById("playlists") //creating playlist list
// for (let playlist of player.playlists) {
//     playlistElement.appendChild(createPlaylistElement(playlist))
// }


