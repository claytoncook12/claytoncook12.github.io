const musicContainer = document.querySelector('.music-container')
const playBtn = document.querySelector('#play')
const prevBtn = document.querySelector('#prev')
const nextBtn = document.querySelector('#next')
const audio = document.querySelector('#audio')
const progress = document.querySelector('.progress')
const progressContainer = document.querySelector('.progress-container')
const title = document.querySelector('#title')
const cd_set_number = document.querySelector('#set-number')
const cover = document.querySelector('#cover')
const tempo_beat = document.querySelector('#count-in-note')
const tempo = document.querySelector('#count-in-tempo')
const sliderSpeed = document.getElementById("speedRange");
const outputSpeed = document.getElementById("speed-display");
const sliderWait = document.getElementById("waitRange");
const outputWait = document.getElementById("wait-display");
const loop = document.getElementById("loop");
const shuffle = document.getElementById("shuffle"); 

// Sleep Function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Load First Song into DOM
songIndex = 0;

// Update Song Details
loadSong(sets_data[songIndex]);
function loadSong(song) {
    title.innerText = song['fields']['title'];
    cd_set_number.innerText = song['fields']['cd_set_number'];
    tempo_beat.innerText = song['fields']['count_in_note'];
    tempo.innerText = song['fields']['count_in_tempo'];
    audio.src = song['fields']["audio_file"];
}

function updateTempoReading() {
    // Update Tempo Reading
    tempo.innerHTML = parseFloat(parseFloat(sliderSpeed.value) * sets_data[songIndex]['fields']['count_in_tempo']).toFixed(0);
};

function playSong() {
    // Update Buttons
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');

    // Wait Then Play Audio
    sleep(parseFloat(outputWait.innerHTML)*1000).then(() => { audio.play(); });
}

function pauseSong() {
    // Update Buttons
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    playBtn.querySelector('i.fas').classList.add('fa-play');

    // Play Audio
    audio.pause();
}

function prevSong() {
    if (audio.currentTime > 0) {
        pauseSong();
        audio.currentTime = 0;
    } else {
        songIndex--

        if(songIndex < 0) {
            songIndex = sets_data.length - 1
        }

        loadSong(sets_data[songIndex])

        // Set Speed From Slider
        audio.playbackRate = sliderSpeed.value;

        // Update Tempo Reading
        updateTempoReading()
    }
}

function nextSong() {
    if (loop.classList.contains('action-btn-on')) {
        audio.currentTime = 0;

        playSong()
    } else {
        songIndex++

        if(songIndex > sets_data.length - 1) {
            songIndex = 0
        }

        loadSong(sets_data[songIndex])

        // Set Speed From Slider
        audio.playbackRate = sliderSpeed.value;

        // Update Tempo Reading
        updateTempoReading()

        playSong()
    }
}

function loopSong() {
    if (loop.classList.contains('action-btn-on')) {
        console.log("contains action-btn-on")
        loop.classList.remove('action-btn-on');
    } else {
        loop.classList.add('action-btn-on');
        console.log("remove action-btn-on")
    }
}

function shuffleSongs() {
    pauseSong();

    sets_data = sets_data.sort(() => Math.random() - 0.5);

    loadSong(sets_data[songIndex]);

    playSong();
}

function updateProgress(e) {
    const {duration, currentTime} = e.srcElement
    const progressPercent = (currentTime / duration) * 100
    progress.style.width = `${progressPercent}%`
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Event Listeners
// Play Button
playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');

    if(isPlaying) {
        pauseSong()
    } else {
        playSong()
    }
})

// Previous and Next Buttons
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Progress Bar
audio.addEventListener('timeupdate', updateProgress)

// Progress Container Click
progressContainer.addEventListener('click', setProgress)

// Speed Slider Update
outputSpeed.innerHTML = parseFloat(sliderSpeed.value).toFixed(2);
audio.playbackRate = sliderSpeed.value;
sliderSpeed.oninput = function() {
    outputSpeed.innerHTML = parseFloat(this.value).toFixed(2);
    audio.playbackRate = this.value;
    tempo.innerHTML = parseFloat(parseFloat(this.value) * sets_data[songIndex]['fields']['count_in_tempo']).toFixed(0);
}

// Next Song on Audio End
audio.addEventListener('ended', nextSong)

// Wait Update
outputWait.innerHTML = sliderWait.value;
// Set Wait
sliderWait.oninput = function() {
    outputWait.innerHTML = this.value;
}

// Loop function
loop.addEventListener('click', loopSong)

// Shuffle Function
shuffle.addEventListener('click', shuffleSongs)