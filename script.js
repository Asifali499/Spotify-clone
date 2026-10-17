let songs = [];
let currentSongIndex = 0;

let audio = new Audio();

async function getSongs() {
    let response = await fetch("http://127.0.0.1:5500/songs/");
    let html = await response.text();

    let div = document.createElement("div");
    div.innerHTML = html;

    let links = div.querySelectorAll("#files a");

    songs = [];

    links.forEach(link => {
        let href = link.getAttribute("href");

        if (href && href.toLowerCase().split("?")[0].endsWith(".mp3")) {
            let songURL = new URL(href, response.url).href;

            let songName = decodeURIComponent(
                href.split("/").pop()
            );

            songs.push({
                name: songName,
                url: songURL
            });
        }
    });

    console.log("Songs found:", songs);

    // Display the song names
    displaySongs();
}



function displaySongs() {
    let songUL = document.querySelector(".songlist ul");

    songUL.innerHTML = "";

    for (let i = 0; i < songs.length; i++) {
        songUL.innerHTML += `
            <li class="future" data-index="${i}">

                <div>
                    <img class="futureliImg1" src="music.svg" alt="Music">
                </div>

                <div class="info">
                    <div class="songName">${songs[i].name}</div>
                    <div class="songArtist">Asif</div>
                </div>

                <div>
                    <img class="futureliImg playSongBtn"
                         src="playbutton.svg"
                         alt="Play">
                </div>

            </li>
        `;
    }

    // Play the selected song when its list item is clicked
    songUL.querySelectorAll(".future").forEach(li => {
        li.addEventListener("click", () => {
            let index = Number(li.dataset.index);
            playSong(index);
        });
    });
}






function playSong(index) {
    if (songs.length === 0) return;

    currentSongIndex = (index + songs.length) % songs.length;

    audio.src = songs[currentSongIndex].url;
 
    audio.play().catch(error => {
        console.error("Unable to play song:", error);
    });
}

document.getElementById("play").addEventListener("click", () => {
    if (songs.length === 0) return;

    if (audio.paused) {
        if (!audio.src) {
            playSong(currentSongIndex);
        } else {
            audio.play();
        }
    } else {
        audio.pause();
    }
});

document.getElementById("next").addEventListener("click", () => {
    playSong(currentSongIndex + 1);
});

document.getElementById("prev").addEventListener("click", () => {
    playSong(currentSongIndex - 1);
});






function playSong(index) {
    if (songs.length === 0) return;

    currentSongIndex = (index + songs.length) % songs.length;

    audio.src = songs[currentSongIndex].url;

    // Remove animation from all songs
    document.querySelectorAll(".songlist li").forEach(li => {
        li.classList.remove("playing");
    });

    // Highlight the selected song
    let selectedSong = document.querySelector(
        `.songlist li[data-index="${currentSongIndex}"]`
    );

    if (selectedSong) {
        selectedSong.classList.add("playing");
    }

    audio.play().catch(error => {
        console.error("Unable to play song:", error);
    });
}
audio.addEventListener("pause", () => {
    document.querySelectorAll(".songlist li").forEach(li => {
        li.classList.remove("playing");
    });
});

audio.addEventListener("play", () => {
    let selectedSong = document.querySelector(
        `.songlist li[data-index="${currentSongIndex}"]`
    );

    if (selectedSong) {
        selectedSong.classList.add("playing");
    }
});





async function main() {

    await getSongs();
}

main();


