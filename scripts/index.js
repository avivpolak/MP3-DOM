/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 *
 * @param {String} songId - the ID of the song to play
 */
function playSong(songId) {
    // Your code here
}

/**
 * Creates a song DOM element based on a song object.
 */
// function createSongElement({ id, title, album, artist, duration, coverArt }) {
//     const children = []
//     const classes = []
//     const attrs = { onclick: `playSong(${id})` }
//     return createElement("div", children, classes, attrs)
// }


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

    const imgEl = document.createElement("img")
    imgEl.classList.add("art")
    imgEl.setAttribute("src", coverArt)
    element.append(imgEl)
    
    let titleElement = document.createElement("p")
    titleElement.innerText = title
    element.appendChild(titleElement)

    let albumElement = document.createElement("p")
    albumElement.innerText = album
    element.appendChild(albumElement)

    let artistElement = document.createElement("p")
    artistElement.innerText = artist
    element.appendChild(artistElement)

    let durationElement = document.createElement("p")
    durationElement.innerText = sTOmmss(duration) 
    element.appendChild(durationElement)



    for (let classname of classes) {
        element.classList.add(classname)
    }
    for (let atattribute in attributes) {
        element.setAttribute(atattribute, attributes[atattribute])
    }

    return element
}
let songElement=document.getElementById("songs");
for (let song of player.songs){
    songElement.appendChild(createSongElement("p",song.id,song.title,song.album,song.artist,song.duration,song.coverArt,["song"],{ onclick: `playSong(${song.id})` }))
}


function sTOmmss(s) {//gets: SECONDS , returns: "MINUTES:SECONDS".
    const mm = Math.floor(s / 60)
    const ss = s % 60
    let mmss = ''
    if (mm > 9 && ss > 9) mmss = `${mm}:${ss}`
    if (mm > 9 && ss <= 9) mmss = `${mm}:0${ss}`
    if (mm <= 9 && ss > 9) mmss = `0${mm}:${ss}`
    if (mm <= 9 && ss <= 9) mmss = `0${mm}:0${ss}`
    return mmss
  }
/**
 * Creates a playlist DOM element based on a playlist object.
 */
function createPlaylistElement({ id, name, songs }) {
    const children = []
    const classes = []
    const attrs = {}
    playlistEl= document.createElement("div")
    playlistEl.setAttribute("onclick", `playplaylist(${id})`)
    nameEl = document.createElement("p")
    nameEl.innerText=name;
    playlistEl.appendChild(nameEl)

    duration = document.createElement("p")
    duration.innerText=playlistDuration(id);
    playlistEl.appendChild(duration)
    return playlistEl;
}
let playlistElement=document.getElementById("playlists");
for (let playlist of player.playlists){
    playlistElement.appendChild(createPlaylistElement(playlist))
}

function playlistDuration(id) {
    //Parameters: PLAYLIST ID
    //Returns: PLAYLIST DURATION.

    if (playListById(id) === undefined) {
      throw new Error('non-existent playlistId')
    }
    const playlist = playListById(id)
    let sum = 0
    for (let i = 0; i < playlist.songs.length; i++) {
      let song = songById(playlist.songs[i])
      sum += song.duration
    }
    return sTOmmss(sum); 
  }
  function songById(id) {
    //Parameters: SONG ID
    //Returns: THE MATCHING SONG.

   for (let i = 0; i < player.songs.length; i++) {
     if (player.songs[i]['id'] === id) return player.songs[i]
   }
   return undefined
 }
  function playListById(id) {
    //Parameters: PLAYLIST ID 
    //Returns: THE MATCHING PLAYLIST.

    for (let i = 0; i < player.playlists.length; i++) {
      if (player.playlists[i]['id'] === id) return player.playlists[i]
    }
    return undefined
  }
  
  

/**
 * Creates a new DOM element.
 *
 * Example usage:
 * createElement("div", ["just text", createElement(...)], ["nana", "banana"], {id: "bla"})
 *
 * @param {String} tagName - the type of the element
 * @param {Array} children - the child elements for the new element.
 *                           Each child can be a DOM element, or a string (if you just want a text element).
 * @param {Array} classes - the class list of the new element
 * @param {Object} attributes - the attributes for the new element
 */
// function createElement(tagName, children = [], classes = [], attributes = {}) {
//     // Your code here
// }

// You can write more code below this line
