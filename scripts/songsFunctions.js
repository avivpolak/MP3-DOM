//SONG FUNCTIONS

function songById(id) {
    //Parameters: SONG ID
    //Returns: THE MATCHING SONG.
    for (let song of player.songs) {
        if (song.id === id) return song
    }
    return undefined
}

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

function songIndexById(id) {
    //Parameters: SONG ID
    //Returns: SONG INDEX.
    for (let i = 0; i < player.songs.length; i++) {
        if (player.songs[i]["id"] === parseInt(id)) return parseInt(i)
    }
    return -1
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
