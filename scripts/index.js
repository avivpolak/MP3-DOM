
// function setZero(Id){
//     //sets all the childrens backgrounds to ""
//     let child = document.getElementById(Id).firstElementChild
//     for (child.firstElementChild; child; child = child.nextElementSibling) {
//         child.style.backgroundColor = ""
//     }
// }

// //playing functions
// function play(Id) {
//     setZero("songs")
//     setZero("playlists")
//     if(Id[0]==="p")
//     {
//         playingNow = document.getElementById(Id)
//         playingNow.style.backgroundColor = "orange"
//         setTimeout(function () {
//             playingNow.style.backgroundColor = ""
//             console.log(Id.slice(1,Id.length))
//         }, playlistDuration(parseInt(Id.slice(2,Id.length)))*10)
//     }
//     else{
//     playingNow = document.getElementById(Id)
//     playingNow.style.backgroundColor = "orange"

//     setTimeout(function () {
//         playingNow.style.backgroundColor = ""
//     }, songById(Id).duration * 10)
//     }
// }

// //CREATING ELEMENTS FUNCTIONS

// function createElement(tagname, children = [], classes = [], attributes) {
//     //the most generic element builder.we will build all the elements here.
//     const el = document.createElement(tagname)

//     //children

//     for (let child of children) {
//         if (typeof child === "string" || typeof child === "number") {
//             child = document.createTextNode(child)
//         }
//         el.appendChild(child)
//     }

//     //classes

//     for (const cls of classes) {
//         el.classList.add(cls)
//     }

//     //attrubutes

//     for (const attr in attributes) {
//         el.setAttribute(attr, attributes[attr])
//     }

//     return el
// }

// //CREATE A SONG ELEMENT

// function createASongElement({ id, title, album, artist, duration, coverArt }) {
//     let artistEl = createElement("p", [artist])
//     let durationEl = createElement("p", ["duration: " + sTOmmss(duration)], [], {
//         style: `background-color:${colorDuration(duration)};`,
//     })
//     let coverArtEl = createElement("img", [], ["album-art"], { src: coverArt })
//     let albumEl = createElement("p", [album])
//     let titleEl = createElement("p", [title], ["bold"])
//     return createElement("div", [coverArtEl, titleEl, albumEl, artistEl, durationEl], ["song"], {
//         id: id,
//         onclick: `play(${id})`,
//     })
// }

// //CREATING PLAYLIST  ELEMENT
// function createAPlaylistElement({ id, name, songs }) {
//     let nameEl = createElement("p", [name])
//     let durationEl = createElement("p", ["duration: " + sTOmmss(playlistDuration(id))])
//     let numOfSongsEl = createElement("p", [songs.length + " songs."])
//     return createElement("div", [nameEl, numOfSongsEl, durationEl], ["playlist"], {
//         id: "pl" + id, //pl stands for a playlist id.
//         onclick: `play("pl"+${id})`,
//     })
// }

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

// function songById(id) {
//     //Parameters: SONG ID
//     //Returns: THE MATCHING SONG.

//     for (let i = 0; i < player.songs.length; i++) {
//         if (player.songs[i]["id"] === id) return player.songs[i]
//     }
//     return undefined
// }

function playListById(id) {
    //Parameters: PLAYLIST ID
    //Returns: THE MATCHING PLAYLIST.

    for (let i = 0; i < player.playlists.length; i++) {
        if (player.playlists[i]["id"] === id) return player.playlists[i]
    }
    return undefined
}

//END OF FUNCTIONS SECTION

//USING THE FUNCTIONS:


