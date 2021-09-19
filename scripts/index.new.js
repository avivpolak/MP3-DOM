"use strict"

//MAKING THE BUTTONS ACTUALLY DO SOMETHING
document.getElementById("addButton").addEventListener("click", handleAddSongEvent)
document.getElementById("songs").addEventListener("click", handleSongEvent)
document.getElementById("playlists").addEventListener("click", handlePlayListEvent)
document.getElementById("showAddSection").addEventListener("click", toggleAddSection)
document.getElementById("addPlaylistButton").addEventListener("click", handleAddPlaylistEvent)
document.getElementById("addAutoPlaylistButton").addEventListener("click", handleAddAutoPlaylistEvent)
document.getElementById("searchBtn").addEventListener("click", handleSearchBtn)
document.getElementById("reset").addEventListener("click", handleResetBtn)
document.getElementById("showPlaylistSection").addEventListener("click", toggleAddPlaylistSection)


//CREATING ALL THE ELEMENTS
reset()



//FUNCTIONS SECTION:


//HANDLE PLAYLIST EVENTS


    function handlePlayListEvent(event) {
        //MANAGE THE PRESSING ON A PLAYLIST ELEMENT.

        const targetId = event.target.parentElement.id
        let cleanId = targetId.slice(2, targetId.length)
        if (event.target.name === "play") playPlaylist(cleanId) //activate play funcion only if the specific is clicked
        if (event.target.name === "remove") handleRemoveplaylist(cleanId)
        if (event.target.name === "PlaylistName") showRenameBar(cleanId)
        if (event.target.name === "okBtn") handleRenamePlayList(cleanId)
    }

    function handleRemoveplaylist(playlistId) {
        //HANDLE REMOVE PLAYLIST WHEN THE "X" BUTTON IS PRESSED.

        if (confirm("are you sure?")) {
            removePlaylist(playlistId)
            reset()
        }
    }

    function showRenameBar(Id) {
        //HIDING/SHOWING THE RENAME PLAYLIST SECTION WHEN THE "RENAME" BUTTUN IS PRESSED.

        document.getElementById("newName" + Id).classList.toggle("hide")
        document.getElementById("okBtn" + Id).classList.toggle("hide")
        document.getElementById("playlistName"+Id).classList.toggle("hide")
        document.getElementById("showRename"+Id).classList.toggle("hide")
    }

    function handleRenamePlayList(id) {
        //APLYING THE RENAMING FOR THE PLAYLIST WHEN THE "✔" IS PRESSED.

        const newName = document.getElementById("newName" + id).value
        renamePlayList(id, newName)
        reset()
    }

    function handleAddPlaylistEvent() {
        //APLYING ADD PLAYLIST WHEN THE "ADD" BUTTON IS PRESSED.

        const name = document.getElementById("playlistName").value
        createPlaylist(name)
        reset()
    }


//HANDLE SONG EVENTS


    function handleSongEvent(event) {
        //MANAGE THE PRESSING ON A SONG ELEMENT.

        const target = event.target.parentElement
        if (event.target.name === "play") playSong(target.id) //activate play funcion only if the play BUTTON is clicked
        if (event.target.name === "remove") handleRemoveSong(target.id)
        if (event.target.name === "addToPlaylist") showAddToPlaylist(target.id)
        if (event.target.name === "okBtn") handleAddToPlaylist(target.id)
    }

    function handleRemoveSong(songId) {
        //HANDLE REMOVE SONG WHEN THE "X" BUTTON IS PRESSED.

        if (confirm("are you sure?")) {
            removeSong(songId)
            reset()
        }
    }

    function handleAddSongEvent() {
        //APLYING ADD SONG WHEN THE "ADD" BUTTON IS PRESSED.

        let newsong = {}
        newsong.title = document.getElementById("title").value
        newsong.album = document.getElementById("album").value
        newsong.artist = document.getElementById("artist").value
        newsong.duration = document.getElementById("duration").value
        newsong["cover-art"] = document.getElementById("cover-art").value
        addSong(newsong)
        generateSongs()
    }

    function handleAddToPlaylist(id) {
        //APLYING ADDING THE SONG TO THE PLAYLIST THAT NOW IN THE SELECT ELEMENT.

        addToPlayList(parseInt(id), playlistIdByName(document.getElementById("selectPlaylist" + id).value))
        showAddToPlaylist(id)
        generatePlaylists()
    }

    function showAddToPlaylist(id) {
        //HIDING/SHOWING THE ADD PLAYLIST SECTION WHEN THE "+" BUTTUN IS PRESSED

        document.getElementById("selectPlaylist" + id).classList.toggle("hide")
        document.getElementById("okBtnChosePlaylist" + id).classList.toggle("hide")
    }

    function handleAddAutoPlaylistEvent() {
        //APLYING AUTO PLAYLIST CREATION WHEN "ADD AUTO PLAILIST" IS PRESSED.

        const name = document.getElementById("playlistBy").value
        if (document.getElementById("criterion").value === "artist") artistPlaylist(name)
        if (document.getElementById("criterion").value === "album") albumPlaylist(name)
        reset()
    }


//HANDLE OTHER EVENTS


    function handleResetBtn() {
        //APLYING RESET WHEN THE RESET BUTTON IS PRESSED.

        reset()
    }

    function handleSearchBtn() {
        //APLYING THE SEARCH ACORDING TO THE STATE OF THE "SEARCH BY" SELECT ELEMENT.

        const searchQuery = document.getElementById("searchBarInput").value
        if (document.getElementById("searchBy").value === "query") generateQueryResultes(searchByQuery(searchQuery))
        if (document.getElementById("searchBy").value === "duration") generateDurationResult(searchByDuration(searchQuery))
    }


//PLAYLIST FUNCTIONS


    async function playSongInPlaylist(songId) {
        //Parameters: SONG ID
        //--> PLAYS THAT SONG IN PLAYLIST.

        setZero("songs")
        playingNow = document.getElementById(songId)
        playingNow.classList.add("playing")
        await sleep(songById(parseInt(songId)).duration * 10)
        playingNow.classList.remove("playing")
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

    function playlistIdByName(name) {
        //Parameters: PLAYLIST NAME
        //Returns: PLAYLIST ID

        for (let playlist of player.playlists) {
            if (playlist.name === name) return playlist.id
        }
        return "no such name"
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

        let playlistId = createPlaylist(album)
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

        let playlistId = createPlaylist(artist)
        for (let i = 0; i < player.songs.length; i++) {
            if (player.songs[i].artist === artist) {
                addToPlayList(player.songs[i].id, playlistId)
            }
        }
        return playlistId
    }

    function removePlaylist(id) {
        //Parameters: PLAYLIST ID
        //--> REMOVES PLAYLIST FROM PLAYER.

        if (playListIndexById(id) === -1) {
            throw new Error("non-existent ID")
        }
        player.playlists.splice(playListIndexById(id), 1)
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

    function addToPlayList(songId, playlistId) {
        //Parameters: SONG ID & PLAYLIST ID
        //--> ADDS SONG TO PLAYLIST.

        let song = songById(songId)
        player.playlists[playListIndexById(playlistId)].songs.push(song.id)
    }

    function renamePlayList(id, newName) {
        //gets: PLAYLIST ID & NEW NAME
        //--> RENAME THE PLAYLIST

        playListById(id).name = newName
    }

    function playListIndexById(id) {
        //Parameters: PLAYLIST ID
        //Returns: PLAYLIST INDEX.

        for (let i = 0; i < player.playlists.length; i++) {
            if (player.playlists[i]["id"] === parseInt(id)) return parseInt(i)
        }
        return -1
    }

    function isIdExsistInPlayLists(id) {
        //Parameters: PLAYLISTS ID
        //Returns: IS PLAYLIST ID EXSIST.

        for (let i = 0; i < player.playlists.length; i++) {
            if (player.playlists[i]["id"] === id) return true
        }
        return false
    }


//SONG FUNCTIONS


    function songById(id) {
        //Parameters: SONG ID
        //Returns: THE MATCHING SONG.
        for (let song of player.songs) {
            if (song.id === id) return song
        }
        return undefined
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

    async function playSong(songId) {
        //Parameters: songId
        //playing that song (visualy)

        setZero("songs")
        setZero("playlists")
        let playingNow = document.getElementById(songId)
        playingNow.classList.add("playing")
        await sleep(songById(parseInt(songId)).duration * 10)
        playingNow.classList.remove("playing")
        const autoPlay = document.getElementById("autoPlay")
        if (autoPlay.checked && playingNow.nextElementSibling) {
            playSong(playingNow.nextElementSibling.id)
        }
    }


//OTHER FUNCTIONS


    function mmssTOs(mmss) {
        //Parameters: "MINUTES:SECONDS"
        //Returns: SECONDS.

        return parseInt(mmss.slice(0, 2)) * 60 + parseInt(mmss.slice(3, 5))
    }

    function sTOmmss(s) {
        //gets: SECONDS
        //returns: "MINUTES:SECONDS".

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
        //get color from duration

        let red = 0
        let green = 0
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

    function removeAllChildNodes(parent) {
        //removeing the exsisting chileds from element

        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    }

    function sleep(ms) {
        //GETS TIME TO STOP
        //--> STOP FOR THE TIME.

        return new Promise((resolve) => setTimeout(resolve, ms))
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
        //-->FOR SONGS


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

    function toggleAddSection() {
        //SHOW/HIDE ADD SONG SECTION.

        document.getElementById("add-section").classList.toggle("hide")
    }

    function toggleAddPlaylistSection() {
        //SHOW/HIDE ADD PLAYLIST SECTION.

        document.getElementById("addPlaylistSection").classList.toggle("hide")
    }


//CREATING ELEMENTS


    function createElement(tagname, children = [], classes = [], attributes, events) {
        //the most generic element builder.
        //we will build all the elements here.

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

    function createASongElement({ id, title, album, artist, duration, coverArt }) {
        //Parameters: SONG OBJ.
        //Returns: SONG ELEMENT.

        const artistEl = createElement("p", [artist])
        const durationEl = createElement("div", [sTOmmss(duration)], ["duration"], { style: `color:${colorDuration(duration)};` })
        const coverArtEl = createElement("img", [], ["album-art"], { src: coverArt })
        const albumEl = createElement("p", [album])
        const titleEl = createElement("p", [title], ["bold"])
        const playBtn = createElement("button", ["▶"], [], { name: "play" })
        const removeBtn = createElement("button", ["❌"], [], { name: "remove" })
        const okBtn = createElement("button", ["✔"], ["hide"], { name: "okBtn", id: "okBtnChosePlaylist" + id })
        const selectPlaylist = createElement("select", generateArrayOfOptions(player.playlists, "name"), ["hide"], { id: "selectPlaylist" + id })
        const addToPlaylistBtn = createElement("button", ["➕"], [], { name: "addToPlaylist", id: "addToPlaylist" + id })
        return createElement(
            "div",
            [coverArtEl, titleEl, albumEl, artistEl, durationEl, selectPlaylist, okBtn, addToPlaylistBtn, removeBtn, playBtn],
            ["song"],
            {
                id: id,
                name: "song",
            }
        )
    }

    function createAPlaylistElement({ id, name, songs }) {
        //Parameters: PLAYLIST OBJ.
        //Returns: PLAYLIST ELEMENT.

        const nameEl = createElement("p", [name], [],{id:"playlistName"+id})
        const newNameInput = createElement("input", [], ["hide"], { type: "text", id: "newName" + id ,placeholder:name})
        const okBtn = createElement("button", ["✔"], ["hide"], { name: "okBtn", id: "okBtn" + id })
        const durationEl = createElement("p", ["duration: " + sTOmmss(playlistDuration(id))], ["duration"])
        const numOfSongsEl = createElement("p", [songs.length + " songs."])
        const playBtn = createElement("button", ["▶"], [], { name: "play" })
        const removeBtn = createElement("button", ["❌"], [], { name: "remove" })
        const renameBtn = createElement("button", ["rename"], [], { name: "PlaylistName" ,id:"showRename"+id})
        return createElement("div", [nameEl, newNameInput, numOfSongsEl, durationEl, okBtn, playBtn, removeBtn, renameBtn], ["playlist"], {
            id: "pl" + id,
        })
    }    

    function setZero(Id) {
        //sets all the childrens backgrounds to ""
        let child = document.getElementById(Id).firstElementChild
        for (child.firstElementChild; child; child = child.nextElementSibling) {
            child.classList.remove("playing")
        }
    }


//GENERATING THE ELEMENTS


    function reset() {
        //RESET THE SONGS AND PLAYLIST ELEMENTS

        generatePlaylists()
        generateSongs()
    }

    function generateSongs() {
        //INSERTS ALL SONGS IN THE PLAYER AS DOM ELEMENTS INTO THE SONGS LIST.

        removeAllChildNodes(document.getElementById("songs")) //remove all the songs that maybe there
        for (let song of player.songs.sort(compares)) {//building songs elements
            document.getElementById("songs").appendChild(createASongElement(song))
        }
    }


    function generatePlaylists() {
        //INSERTS ALL PLAYLISTS IN THE PLAYER AS DOM ELEMENTS INTO THE PLAYLISTS LIST.

        removeAllChildNodes(document.getElementById("playlists")) //remove all playlists songs that maybe there
        for (let playlist of player.playlists.sort(comparepl)) {//building playlists elements
            document.getElementById("playlists").appendChild(createAPlaylistElement(playlist))
        }
    }


    function generateArrayOfOptions(parent, childProp) {
        //Parameters: PARENT ELEMENT, PROP.
        //Returns: ARRAY OF OPTIONS ELEMENTS CONTAINTIN THE CHILDREN PROPS.

        let arrayOfOptions = []
        for (let chiled of parent) {
            let option = document.createElement("option")
            option.append(chiled[childProp])
            arrayOfOptions.push(option)
        }
        return arrayOfOptions
    }

    function generateDurationResult(result) {
        //Parameters: RESULT OBJECT
        //-->CREATE RESULT ELEMENT
        //-->DISPLAY IT ON SCREEN

        removeAllChildNodes(document.getElementById("songs")) //remove all the songs and playlist that maybe there
        removeAllChildNodes(document.getElementById("playlists"))
        if (result.name) {//chaking if it a song or playlist
            document.getElementById("playlists").appendChild(createAPlaylistElement(result))
        } else {
            document.getElementById("songs").appendChild(createASongElement(result))
        }
    }

    function generateQueryResultes(results) {
        //Parameters: RESULT OBJECTS
        //-->CREATE RESULT ELEMENTS
        //-->DISPLAY IT ON SCREEN

        removeAllChildNodes(document.getElementById("songs")) //remove all the songs and playlist that maybe there
        removeAllChildNodes(document.getElementById("playlists"))
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
        //Parameters:QUERY WORD OR SENTNCE.
        //Returns: CLOSEST PLAYLIST/SONG TO IT.

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


