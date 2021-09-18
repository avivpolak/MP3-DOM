/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 *
 * @param {Number} songId - the ID of the song to play
 */

async function playSong(songId) {
    setZero("songs")
    setZero("playlists")
    playingNow = document.getElementById(songId)
    playingNow.classList.add("playing")
    await sleep(songById(parseInt(songId)).duration * 10)
    playingNow.classList.remove("playing")
    const autoPlay = document.getElementById("autoPlay")
    if (autoPlay.checked && playingNow.nextElementSibling) {
        playSong(playingNow.nextElementSibling.id)
    }
}

async function playSongInPlaylist(songId) {
    setZero("songs")
    playingNow = document.getElementById(songId)
    playingNow.classList.add("playing")
    await sleep(songById(parseInt(songId)).duration * 10)
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
//gets parent element and child prop, generates an array of options element , and returns it.
function generateArrayOfOptions(parent,childProp){
    let arrayOfOptions=[]
    for(let chiled of parent){
        let option =document.createElement("option")
        option.append(chiled[childProp])
        arrayOfOptions.push(option)
    }
    return arrayOfOptions
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
    let okBtn = createElement("button", ["✔"], ["hide"], { name: "okBtn", id: "okBtnChosePlaylist" + id })
    let selectPlaylist = createElement("select",generateArrayOfOptions(player.playlists,"name") , ["hide"], {id: "selectPlaylist" + id })
    let addToPlaylistBtn = createElement("button", ["add to playlist"], [], { name: "addToPlaylist" })
    return createElement("div", [coverArtEl, titleEl, albumEl, artistEl, durationEl,selectPlaylist,okBtn ,addToPlaylistBtn, removeBtn, playBtn], ["song"], {
        id: id, "name":"song"
    })
}

//CREATING PLAYLIST  ELEMENT
function createAPlaylistElement({ id, name, songs }) {
    let nameEl = createElement("p", [name], [])
    let newNameInput = createElement("input", [], ["hide"], { type: "text", id: "newName" + id })
    let okBtn = createElement("button", ["✔"], ["hide"], { name: "okBtn", id: "okBtn" + id })
    let durationEl = createElement("p", ["duration: " + sTOmmss(playlistDuration(id))], ["duration"])
    let numOfSongsEl = createElement("p", [songs.length + " songs."])
    let playBtn = createElement("button", ["▶"], [], { name: "play" })
    let removeBtn = createElement("button", ["❌"], [], { name: "remove" })
    let renameBtn = createElement("button", ["rename"], [], { name: "PlaylistName" })
    return createElement(
        "div",
        [nameEl, newNameInput, okBtn, numOfSongsEl, durationEl, playBtn, removeBtn, renameBtn],
        ["playlist"],
        {
            id: "pl" + id,
        }
    )
}

/**
 * Inserts all songs in the player as DOM elements into the songs list.
 */
function generateSongs() {
    removeAllChildNodes(document.getElementById("songs")) //remove all the songs that maybe there
    document.getElementById("songs")
    let sorted = player.songs.sort(compares)
    for (let song of sorted) {
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
    removeAllChildNodes(document.getElementById("playlists")) //remove all playlists songs that maybe there
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
        generatePlaylists()
    }
}
function handleRemoveplaylist(playlistId) {
    if (confirm("are you sure?")) {
        removePlaylist(playlistId)
        generatePlaylists()
    }
}

function removePlaylist(id) {
    //Parameters: PLAYLIST ID
    //--> REMOVES PLAYLIST FROM PLAYER.

    if (playListIndexById(id) === -1) {
        throw new Error("non-existent ID")
    }
    player.playlists.splice(playListIndexById(id), 1)
}

function handlePlayListEvent(event) {
    const targetid = event.target.parentElement.id
    let cleanId = targetid.slice(2, targetid.length)
    if (event.target.name === "play") playPlaylist(cleanId) //activate play funcion only if the BUTTON is clicked
    if (event.target.name === "remove") handleRemoveplaylist(cleanId)
    if (event.target.name === "PlaylistName") showRenameBar(cleanId)
    if (event.target.name === "okBtn") handleRenamePlayList(cleanId)
}
function showRenameBar(Id) {
    let renameTextBox = document.getElementById("newName" + Id)
    renameTextBox.classList.toggle("hide")
    let okBtn = document.getElementById("okBtn" + Id)
    okBtn.classList.toggle("hide")
}
function handleRenamePlayList(id) {
    let newName = document.getElementById("newName" + id).value
    renamePlayList(id, newName)
    generatePlaylists()
}

function handleSongEvent(event) {
    const target = event.target.parentElement
    if (event.target.name === "play") playSong(target.id) //activate play funcion only if the play BUTTON is clicked
    if (event.target.name === "remove") handleRemoveSong(target.id)
    if (event.target.name === "addToPlaylist") showAddToPlaylist(target.id)
    if (event.target.name === "okBtn") handleAddToPlaylist(target.id)
    
}
//gets name, return the playlists id

function playlistIdByName(name){
    for (let playlist of player.playlists){
        if (playlist.name ===name) return playlist.id
    }
    return "no such name";
} 


function handleAddToPlaylist(id) {
    const playlistName = document.getElementById("selectPlaylist" + id).value
    const playlistId = playlistIdByName(playlistName)
    addToPlayList(parseInt(id),playlistId)
    generatePlaylists()
}

function showAddToPlaylist(id) {
    let selectPlaylist = document.getElementById("selectPlaylist" + id )
    selectPlaylist.classList.toggle("hide")
    let okBtn = document.getElementById("okBtnChosePlaylist" + id)
    okBtn.classList.toggle("hide")
}

function removeSong(id) {
    //Parameters: SONG ID
    //--> REMOVING THE SONG, FROM PLAYER & PLAYLIST (activatie remove-from-playilist function).

    if (songIndexById(id) === -1) {
        throw new Error("non-existent ID")
    }
    player.songs.splice(songIndexById(id), 1)
    removeFromPlayLists(id)
}

function removeFromPlayLists(songId) {
    //Parameters: SONG ID
    //--> REMOVES IT FROM *ALL* PLAYLISTS.

    for (let i = 0; i < player.playlists.length; i++) {
        for (let j = 0; j < player.playlists[i].songs.length; j++) {
            if (player.playlists[i].songs[j] === parseInt(songId)) {
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
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function playPlaylist(id) {
    //Parameters: PLAYLIST ID
    //--> PLAYS ALL SONGS IN PLAYLIST.
    setZero("playlists")
    if (playListIndexById(id) === -1) {
        throw new Error("non-existent ID")
    }
    let playlist = playListById(id)
    const playlistElement = document.getElementById("pl" + id)
    playlistElement.classList.add("playing") //for css to show the playing playlist

    for (let i = 0; i < playlist.songs.length && playlistElement.matches(".playing"); i++) {
        // continue only if this playlist is still is in requiered to play
        playSongInPlaylist(playlist.songs[i])
        await sleep(songById(parseInt(playlist.songs[i])).duration * 10)
    }
    playlistElement.classList.remove("playing") //for css to stop show the playing playlist
}

function playListById(id) {
    //Parameters: PLAYLIST ID
    //Returns: THE MATCHING PLAYLIST.

    for (let i = 0; i < player.playlists.length; i++) {
        if (player.playlists[i]["id"] === parseInt(id)) return player.playlists[i]
    }
    return undefined
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
        let song = songById(parseInt(playlist.songs[i]))
        sum += song.duration
    }
    return sum
}
function comparepl(a, b) {
    //defining how .SORT function works- for alpha-betic sorting.
    //-->FOR PLAYLIST

    let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase()
    if (fa < fb) {
        return -1
    }
    if (fa > fb) {
        return 1
    }
    return 0
}

function compares(a, b) {
    //defining how .SORT function works- for alpha-betic sorting.
    //-->FOR SONGS criterion ="title"
    //-->FOR PLAYLISTS criterion ="name"

    let fa = a["title"].toLowerCase(),
        fb = b["title"].toLowerCase()
    if (fa < fb) {
        return -1
    }
    if (fa > fb) {
        return 1
    }
    return 0
}

const addSectionBtn = document.getElementById("showAddSection")
addSectionBtn.addEventListener("click", toggleAddSection)
function toggleAddSection() {
    let addsection = document.getElementById("add-section")
    addsection.classList.toggle("hide")
}

//add new playlist
function isIdExsistInPlayLists(id) {
    //Parameters: PLAYLISTS ID
    //Returns: IS PLAYLIST ID EXSIST.

    for (let i = 0; i < player.playlists.length; i++) {
        if (player.playlists[i]["id"] === id) return true
    }
    return false
}

function createPlaylist(name, id = 0) {
    //Parameters: NEW PLAYLIST'S NAME
    //--> ADDS NEW EMPTY PLAYLIST TO PLAYER
    //Returns: NEW PLAYLIST ID.

    let newPlayList = { name, songs: [] }
    if (!playListById(id)) newPlayList.id = id
    else {
        for (let i = 0; i < player.playlists.length + 1; i++) {
            if (!isIdExsistInPlayLists(i)) {
                newPlayList.id = i
            }
        }
    }
    player.playlists.push(newPlayList)
    return newPlayList.id
}

function albumPlaylist(album) {
    //gets: ALBUM NAME
    //--> CEATE A PLAYLIST FOR ALL THE SONGS FROM THAT ALBUM
    //returns: NEW PLAYLIST ID.

    playlistId = createPlaylist(album)
    for (let i = 0; i < player.songs.length; i++) {
        if (player.songs[i].album === album) {
            addToPlayList(player.songs[i].id, playlistId)
        }
    }
    return playlistId
}

function artistPlaylist(artist) {
    //gets: ARTIST NAME
    //--> CEATE A PLAYLIST FOR ALL THE SONGS OF THAT ARTIST.
    //returns: NEW PLAYLIST ID.

    playlistId = createPlaylist(artist)
    for (let i = 0; i < player.songs.length; i++) {
        if (player.songs[i].artist === artist) {
            addToPlayList(player.songs[i].id, playlistId)
        }
    }
    return playlistId
}
function addToPlayList(songId, playlistId) {
    //Parameters: SONG ID & PLAYLIST ID
    //--> ADDS SONG TO PLAYLIST.

    let song = songById(songId)
    player.playlists[playListIndexById(playlistId)].songs.push(song.id)
}

const addPlaylistBtn = document.getElementById("addPlaylistButton")
addPlaylistBtn.addEventListener("click", handleAddPlaylistEvent)

function handleAddPlaylistEvent() {
    const name = document.getElementById("playlistName").value
    createPlaylist(name)
    generatePlaylists()
}

const addAutoPlaylistBtn = document.getElementById("addAutoPlaylistButton")
addAutoPlaylistBtn.addEventListener("click", handleAddAutoPlaylistEvent)

function handleAddAutoPlaylistEvent() {
    const name = document.getElementById("playlistBy").value
    if (document.getElementById("criterion").value === "artist") artistPlaylist(name)
    if (document.getElementById("criterion").value === "album") albumPlaylist(name)
    generatePlaylists()
}

function renamePlayList(id, newName) {
    //gets: PLAYLIST ID & NEW NAME
    //--> RENAME THE PLAYLIST

    playListById(id).name = newName
}

let searchBtn = document.getElementById("searchBtn")
searchBtn.addEventListener("click", handleSearchBtn)
let resetBtn = document.getElementById("reset")
resetBtn.addEventListener("click", handleResetBtn)

function handleResetBtn() {
    generatePlaylists()
    generateSongs()
}

function handleSearchBtn() {
    const searchQuery = document.getElementById("searchBarInput").value
    if (document.getElementById("searchBy").value === "query") generateResultes(searchByQuery(searchQuery))
    if (document.getElementById("searchBy").value === "duration") generateResult(searchByDuration(searchQuery))
}

function generateResult(result) {
    console.log(result)
    removeAllChildNodes(document.getElementById("songs")) //remove all the songs and playlist that maybe there
    removeAllChildNodes(document.getElementById("playlists"))
    if (result.name) {
        //chaking if it a song or playlist
        document.getElementById("playlists").appendChild(createAPlaylistElement(result))
    } else {
        document.getElementById("songs").appendChild(createASongElement(result))
    }
}

function generateResultes(results) {
    removeAllChildNodes(document.getElementById("songs")) //remove all the songs and playlist that maybe there
    removeAllChildNodes(document.getElementById("playlists"))
    console.log(results)

    for (let song of results.songs) {
        //building songs elements
        document.getElementById("songs").appendChild(createASongElement(song))
    }

    for (let playlist of results.playlists) {
        //building playlist elements
        document.getElementById("playlists").appendChild(createAPlaylistElement(playlist))
    }
}

//SEARCHING

/*
      //Parameters: QUERY STRING ,
  
      Returns: OBJECT THAT HAVE:
  
      ALPHA-BETIC SORTED ARRAYS OF MATCHING:
  
      SONGS (titles,albums,artists) &  PLAYLIST (names).
      */
function searchByQuery(query) {
    let lowerCasedQuery = query.toLowerCase()
    let found = {}
    let playlists = []
    let songs = []
    for (let i = 0; i < player.playlists.length; i++) {
        //searching for matching playlists.
        if (player.playlists[i].name.toLowerCase().includes(lowerCasedQuery)) {
            playlists.push(player.playlists[i])
        }
    }
    for (let i = 0; i < player.songs.length; i++) {
        //searching for matching songs.
        const song = player.songs[i]
        if (
            song.title.toLowerCase().includes(lowerCasedQuery) ||
            song.album.toLowerCase().includes(lowerCasedQuery) ||
            song.artist.toLowerCase().includes(lowerCasedQuery)
        ) {
            songs.push(song)
        }
    }
    found.playlists = playlists.sort(comparepl) //adds sorted playlist array to returned object
    found.songs = songs.sort(compares) //adds sorted songs array to returned object
    return found
}

function searchByDuration(duration) {
    //Parameters: DURATION ("mm:ss").
    //Returns: CLOSEST PLAYLIST/SONG TO IT.

    duration = mmssTOs(duration)
    let closestPlayList = player.playlists[0]
    let closestsong = player.songs[0]
    for (let i = 0; i < player.playlists.length; i++) {
        //searching for closest playlists.
        let a = playlistDuration(player.playlists[i].id)
        let b = playlistDuration(closestPlayList.id)
        if ((a - duration) ** 2 < (b - duration) ** 2) {
            //a and b named sorting clearing the equation- gettin the absulute destace.
            closestPlayList = player.playlists[i]
        }
    }
    for (let i = 0; i < player.songs.length; i++) {
        //searching for closest song.
        let a = player.songs[i].duration
        let b = closestsong.duration
        if ((a - duration) ** 2 < (b - duration) ** 2) {
            //the same for a and b here
            closestsong = player.songs[i]
        }
    }
    let a = closestsong.duration
    let b = playlistDuration(closestPlayList.id)
    if ((a - duration) ** 2 < (b - duration) ** 2) return closestsong //the same for a and b here
    return closestPlayList
}
