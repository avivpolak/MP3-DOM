/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 *
 * @param {Number} songId - the ID of the song to play
 */
async function playSong(songId) {
    setZero("songs")
    playingNow = document.getElementById(songId)
    playingNow.classList.add("playing")
    await sleep( songById(parseInt(songId)).duration * 10);
        playingNow.classList.remove("playing")

}

function setZero(Id) {
    //sets all the childrens backgrounds to ""
    let child = document.getElementById(Id).firstElementChild
    for (child.firstElementChild; child; child = child.nextElementSibling) {
        child.classList.remove("playing")
    }
}

function songById(id) {
    //Parameters: SONG ID
    //Returns: THE MATCHING SONG.
    for (let song of player.songs) {
        if (song.id === id) return song
    }
    return undefined
}

//playing functions
// function play(Id) {
//     setZero("songs")
//     setZero("playlists")
//     if (Id[0] === "p") {
//         playingNow = document.getElementById(Id)
//         playingNow.style.backgroundColor = "orange"
//         setTimeout(function () {
//             playingNow.style.backgroundColor = ""
//             console.log(Id.slice(1, Id.length))
//         }, playlistDuration(parseInt(Id.slice(2, Id.length))) * 10)
//     } else {
//         playingNow = document.getElementById(Id)
//         playingNow.style.backgroundColor = "orange"

//         setTimeout(function () {
//             playingNow.style.backgroundColor = ""
//         }, songById(Id).duration * 10)
//     }
// }

/**
 * Removes a song from the player, and updates the DOM to match.
 *
 * @param {Number} songId - the ID of the song to remove
 */
function removeSong(id) {
    //Parameters: SONG ID
    //--> REMOVING THE SONG, FROM PLAYER & PLAYLIST (activatie remove-from-playilist function).

    if (songIndexById(id) === -1) {
        throw new Error("non-existent ID")
    }
    player.songs.splice(songIndexById(id), 1)
    removeFromPlayLists(id)
}

/**
 * Adds a song to the player, and updates the DOM to match.
 */
function addSong({ title, album, artist, duration, coverArt, id = 0 }) {
    //Parameters: NEW SONG CHARACTERIZATION
    //--> ADDS IN TO PLAYER
    //Returns: NEW SONGS ID.

    const newSong = { title, album, artist, duration: mmssTOs(duration), coverArt }
    if (!isIdExsistInSongs(id)) newSong.id = id
    else {
        for (let i = 0; i < player.songs.length + 1; i++) {
            if (!isIdExsistInSongs(i)) {
                newSong.id = i
            }
        }
        // throw new Error(`existent ID,the chosen id is ${newSong.id}`)
    }
    player.songs.push(newSong)
    console.log(newSong.id)
}

function isIdExsistInSongs(id) {
    //Parameters: SONG ID
    //Returns: IS SONG ID EXSIST.

    for (let i = 0; i < player.songs.length; i++) {
        if (player.songs[i]["id"] === id) return true
    }
    return false
}
function mmssTOs(mmss) {
    //Parameters: "MINUTES:SECONDS"
    //Returns: SECONDS.

    return parseInt(mmss.slice(0, 2)) * 60 + parseInt(mmss.slice(3, 5))
}

/**
 * Acts on a click event on an element inside the songs list.
 * Should handle clicks on play buttons and remove buttons of songs.
 *
 * @param {MouseEvent} event - the click event
 */
function handleSongClickEvent(event) {
    // Your code here
}

/**
 * Handles a click event on the button that adds songs.
 *
 * @param {MouseEvent} event - the click event
 */
let add = document.getElementById("add-button")
add.addEventListener("click", handleAddSongEvent)

function handleAddSongEvent(event) {
    let newsong = {}
    newsong.title = document.getElementById("title").value
    newsong.album = document.getElementById("album").value
    newsong.artist = document.getElementById("artist").value
    newsong.duration = document.getElementById("duration").value
    newsong["cover-art"] = document.getElementById("cover-art").value
    addSong(newsong)
    generateSongs()
}

function createElement(tagname, children = [], classes = [], attributes, events) {
    //the most generic element builder.we will build all the elements here.
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

    //attrubutes

    for (const event in events) {
        el.addEventListener(event, events[event])
    }

    return el
}

//get color from duration
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

//CREATE A SONG ELEMENT

function createASongElement({ id, title, album, artist, duration, coverArt }) {
    let artistEl = createElement("p", [artist])
    let durationEl = createElement("div", [sTOmmss(duration)], ["duration"], {
        style: `color:${colorDuration(duration)};`,
    })
    let coverArtEl = createElement("img", [], ["album-art"], { src: coverArt })
    let albumEl = createElement("p", [album])
    let titleEl = createElement("p", [title], ["bold"])
    let playBtn = createElement("button", ["▶"], [], { name: "play" })
    let removeBtn = createElement("button", ["❌"], [], { name: "remove" })
    return createElement("div", [coverArtEl, titleEl, albumEl, artistEl, durationEl, removeBtn, playBtn], ["song"], {
        id: id,
    })
}

//CREATING PLAYLIST  ELEMENT
function createAPlaylistElement({ id, name, songs }) {
    let nameEl = createElement("p", [name])
    let durationEl = createElement("p", ["duration: " + sTOmmss(playlistDuration(id))])
    let numOfSongsEl = createElement("p", [songs.length + " songs."])
    let playBtn = createElement("button", ["▶"], [], { name: "play" })
    let removeBtn = createElement("button", ["❌"], [], { name: "remove" })
    return createElement("div", [nameEl, numOfSongsEl, durationEl, playBtn, removeBtn], ["playlist"], {id: id })
}

/**
 * Inserts all songs in the player as DOM elements into the songs list.
 */
function generateSongs() {
    removeAllChildNodes(document.getElementById("songs")) //remove all ther songs that maybe there
    document.getElementById("songs")
    for (let song of player.songs) {
        //building songs elements
        document.getElementById("songs").appendChild(createASongElement(song))
    }
}

//removeing the exsisting chileds from element
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

/**
 * Inserts all playlists in the player as DOM elements into the playlists list.
 */
function generatePlaylists() {
    for (let playlist of player.playlists) {
        //building playlists elements
        document.getElementById("playlists").appendChild(createAPlaylistElement(playlist))
    }
}

// Creating the page structure
generateSongs()
generatePlaylists()

// Making the add-song-button actually do something
document.getElementById("add-button").addEventListener("click", handleAddSongEvent)

//making the play button actually work
document.getElementById("songs").addEventListener("click", handleSongEvent)

document.getElementById("playlists").addEventListener("click", handlePlayListEvent)

function handleRemoveSong(songId) {
    if (confirm("are you sure?")) {
        removeSong(songId)
        generateSongs()
    }
}

function handlePlayListEvent(event) {
    const target = event.target.parentElement
    if (event.target.name === "play") playPlaylist(target.id) //activate play funcion only if the BUTTON is clicked
    if (event.target.name === "remove") handleRemoveSong(target.id)
}

function handleSongEvent(event) {
    const target = event.target.parentElement
    if (event.target.name === "play") playSong(target.id) //activate play funcion only if the BUTTON is clicked
    if (event.target.name === "remove") handleRemoveSong(target.id)
}

function removeSong(id) {
    //Parameters: SONG ID
    //--> REMOVING THE SONG, FROM PLAYER & PLAYLIST (activatie remove-from-playilist function).

    if (songIndexById(id) === -1) {
        throw new Error("non-existent ID")
    }
    console.log(songIndexById(id))
    player.songs.splice(songIndexById(id), 1)
    removeFromPlayLists(id)
}

function removeFromPlayLists(songId) {
    //Parameters: SONG ID
    //--> REMOVES IT FROM *ALL* PLAYLISTS.

    for (let i = 0; i < player.playlists.length; i++) {
        for (let j = 0; j < player.playlists[i].songs.length; j++) {
            if (player.playlists[i].songs[j] === songId) {
                player.playlists[i].songs.splice(j, 1)
            }
        }
    }
}

function songIndexById(id) {
    //Parameters: SONG ID
    //Returns: SONG INDEX.
    for (let i = 0; i < player.songs.length; i++) {
        if (player.songs[i]["id"] === parseInt(id)) return parseInt(i)
    }
    return -1
}

function playListIndexById(id) {
    //Parameters: PLAYLIST ID 
    //Returns: PLAYLIST INDEX.

    for (let i = 0; i < player.playlists.length; i++) {
      if (player.playlists[i]["id"] === parseInt(id)) return parseInt(i)
    }
    return -1
  }
  

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

 async function playPlaylist(id) {
    //Parameters: PLAYLIST ID
    //--> PLAYS ALL SONGS IN PLAYLIST.

    if (playListIndexById(id) === -1) {
        throw new Error("non-existent ID")
    }
    let playlist = playListById(id)
    console.log(playlist)
    for (let i = 0; i < playlist.songs.length; i++) {
        playSong(playlist.songs[i])
        await sleep(songById(parseInt(playlist.songs[i])).duration * 10);
    }
}

function playListById(id) {
    //Parameters: PLAYLIST ID 
    //Returns: THE MATCHING PLAYLIST.

    for (let i = 0; i < player.playlists.length; i++) {
      if (player.playlists[i]['id'] === parseInt(id)) return player.playlists[i]
    }
    return undefined
  }
  
