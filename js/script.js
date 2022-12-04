import tracks from "../tracks.json" assert { type: "json" };
let obj=Object.values(tracks)
let tracksLength = Object.keys(obj).length;
let currentList = Array.from(Array(tracksLength).keys());
let isPlaying = false;
let isPaused = false;
let isShuffled = false;
let isLooped = false;
let prevNextPressed = false;
let hasLoaded = false;
let isAudioMuted = false;
let currentTrack = "button0";
let originalShuffleList = [];
let prev = document.getElementById("previous");
let nxt = document.getElementById("next");
let shuff = document.getElementById("shuffle");
let loop = document.getElementById("repeat");
let dur = document.getElementById("seek");
let mute = document.getElementById("volume");
let playingTime = document.getElementById("timeStart");
let endingTime = document.getElementById("timeEnd");
let audio = document.getElementById("playingAudio");
audio.addEventListener("ended", function(){
    audio.currentTime = 0;
    trackToPlay(currentList);
});

let slider = document.querySelector('input[type="range"]')
slider.min = 0;
slider.max = 100;
slider.oninput = function () {
audio.volume = slider.value / 100

}
//mousedown event to make sure seek waits for it
let mouseDown = false;
document.getElementById("seek").addEventListener("mousedown", function() {
    mouseDown = true;
});
document.body.addEventListener("mouseup", function() {
    mouseDown = false;
});

//initialising the tracks from the json file
for (let i = 0; i<tracksLength; i++){
    let span = document.createElement("span");
    span.setAttribute("class", "trackContainers");
    document.getElementById("tracks").appendChild(span);
    let image = document.createElement("img");
    image.setAttribute("class", "trackImages");
    image.setAttribute("src", "../images/" + obj[i].thumbnail + "");
    span.appendChild(image);
    let text = document.createElement("span");
    text.setAttribute("class", "trackTitles");
    text.textContent = obj[i].title;
    span.appendChild(text);
    let btn = document.createElement("button");
    btn.setAttribute("class", "trackButtons");
    btn.setAttribute("id", "button" + i);
    span.appendChild(btn);
    let img = document.createElement("img");
    img.setAttribute("id", "img" + i);
    img.setAttribute("class", "greenButtons");
    img.setAttribute("src", "images/play.svg");
    btn.appendChild(img);
}

//initialisation for the two range elements (seek and volume)
for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
    e.style.setProperty('--value', e.value);
    e.style.setProperty('--min', e.min == '' ? '0' : e.min);
    e.style.setProperty('--max', e.max == '' ? '100' : e.max);
    e.addEventListener('input', () => e.style.setProperty('--value', e.value));
  }

  for (dur of document.querySelectorAll('input[type="range"].slider-progress2')) {
    dur.style.setProperty('--value', dur.value);
    dur.style.setProperty('--min', dur.min == '' ? '0' : dur.min);
    dur.style.setProperty('--max', dur.max == '' ? '100' : dur.max);
    dur.addEventListener('input', () => dur.style.setProperty('--value', dur.value));
  }


audio.addEventListener("loadedmetadata", function() {
    hasLoaded=true; //track has loaded
    dur.max= audio.duration;
    dur.style.setProperty('--max', dur.max);
  });

audio.addEventListener("timeupdate", function() {
    //converting durations to mm:ss format
    playingTime.innerHTML= new Date(audio.currentTime*1000).toISOString().slice(14, 19);
    endingTime.innerHTML = new Date((dur.max-audio.currentTime)*1000).toISOString().slice(14, 19);
    if (mouseDown == false) {
        dur.value=audio.currentTime;
        dur.style.setProperty('--value', dur.value);
    }
  });

dur.addEventListener("click", function() {
    //set the time on current track playing
    if (hasLoaded==true) {
        audio.currentTime=dur.value;
    }
  });

mute.addEventListener("click", function() {
    audio.muted = !audio.muted;
    if (isAudioMuted == false) {
        isAudioMuted = true;
        mute.src="../images/volume2.svg";
    }
    else {
        isAudioMuted = false;
        mute.src="../images/volume.svg";
    }
  });

function muteVolume() {
}

//event listener for all buttons to call the play audio function
let btns = document.getElementById("tracks").querySelectorAll("button");
Array.prototype.forEach.call(btns, function addClickListener(btn) {
  btn.addEventListener('click', function() {
    playAudio(btn.id);
    changePlayIcon(btn.id);
  });
});

function changePlayIcon(btnId) {
    resetPauseIcons();
    let num = btnId.substring(6);
    let imgId = "img" + num + "";
    document.getElementById(imgId).src="../images/pause.svg";
}

function resetPauseIcons () {
    let temp = document.querySelectorAll('.greenButtons');
    for (let i = 0; i < temp.length; i++) {
        let current = temp[i];
        current.src = "../images/play.svg";;
    }
}

function playAudio(id) {
    //pause current track playing
    if (isPlaying == true && currentTrack == id) {
        document.getElementById("playButton").src="../images/play.svg";
        audio.pause();
        isPlaying = false;
        isPaused = true;
        return;
    }
    else if (isPaused == true && currentTrack == id) {
        //play currently paused track
        audio.play();
        pauseImage();
        isPlaying = true;
        isPaused = false;
        return;
    }
    else {
        //else load a new track if user has clicked on one
        let trackNumber = id.substring(6);
        trackNumber = Number(trackNumber);
        currentList = Array.from(Array(tracksLength).keys());
        getTrackData(trackNumber);
        audio.play();
        pauseImage();
        isPlaying = true;
        isPaused = false;
        currentTrack = id;
        currentList = currentList.slice(trackNumber+1,tracksLength);
        isShuffled = false;
        shuff.src = "../images/shuffle.svg";
        return currentTrack;
    }
}

function getTrackData(trackId){
    document.getElementById("playingAudio").src="../tracks/" + obj[trackId].filename + "";
    document.getElementById("currentTrackImage").src="../images/" + obj[trackId].thumbnail + "";
    document.getElementById("currentTrackTitle").innerHTML = obj[trackId].title;
    document.getElementById("currentTrackArtist").innerHTML = obj[trackId].artist;
}

document.getElementById("mainButton").addEventListener("click", function() {
    //main play button (bottom)
    if (isPaused == true) {
        document.getElementById("playButton").src="../images/pause.svg";
        audio.play();
        isPlaying = true;
        isPaused = false;
        return;
    }
    if (isPlaying == true) {
        document.getElementById("playButton").src="../images/play.svg";
        audio.pause();
        isPaused = true;
        isPlaying = false;
        return;
    }
  });


function pauseImage() {
    document.getElementById("playButton").src="../images/pause.svg";
}

prev.addEventListener("click", function() {
    let trackPlaying = currentTrack.substring(6);
    trackPlaying = Number(trackPlaying);
    if (trackPlaying == originalShuffleList[0]) {
        //does not go back if the current track is the first one of the list
        return;
    }
    else if (isShuffled == false && trackPlaying == 0 ) {
        //does not go back if the current track is the first one, with shuffle turned off
        return;
    }
    else if (isShuffled == false){
        let previousTrack = "button" + (trackPlaying-1);
        playAudio(previousTrack);
        changePlayIcon(currentTrack);
    }
    else {
        prevNextPressed = true;
        var position = originalShuffleList.indexOf(trackPlaying);
        currentList = originalShuffleList.slice(position-1,tracksLength);
        trackToPlay(currentList);
        prevNextPressed = false;
    }
  });

nxt.addEventListener("click", function() {
    let trackPlaying = currentTrack.substring(6);
    trackPlaying = Number(trackPlaying);
    if (trackPlaying == currentList[-1]) {
        //does not go to next if the current track is the last one of the list
        return;
    }
    else {
        prevNextPressed = true;
        isPlaying = true;
        trackToPlay(currentList);
        prevNextPressed = false;
    }
  });

function randomArrayShuffle(tracksList1) {
    //shuffles the original list
    let currentIndex = tracksList1.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = tracksList1[currentIndex];
      tracksList1[currentIndex] = tracksList1[randomIndex];
      tracksList1[randomIndex] = temporaryValue;
    }
    return tracksList1;
  }

shuff.addEventListener("click", function() {
    if (isShuffled == false) {
        isShuffled = true;
        shuff.src = "../images/shuffle2.svg";
    }
    else {
        isShuffled = false;
        shuff.src = "../images/shuffle.svg";
    }
    if (isShuffled == false) {
        //goes back to the original list if turned off
        currentList = Array.from(Array(tracksLength).keys());
        return;
    }
    else {
        currentList = Array.from(Array(tracksLength).keys());
        originalShuffleList = randomArrayShuffle(currentList);
        let trackPlaying = currentTrack.substring(6);
        trackPlaying = Number(trackPlaying);
        let shuffledList = originalShuffleList.map((x) => x); //cloning arrays in order to maintain the original one created for use in the prevTrack() function
        currentList = shuffledList;
        return;
    }  
});

loop.addEventListener("click", function() {
    if (isLooped == false) {
        isLooped = true;
        loop.src = "../images/repeat2.svg";
    }
    else {
        isLooped = false;
        loop.src = "../images/repeat.svg";
    }
    if (isLooped == false) {
        return;
    }
    else {
        let trackToLoop = currentTrack.substring(6);
        trackToLoop = Number(trackToLoop);
        return;
    }  
  });


function trackToPlay(listToPlay) {
    if (isLooped == true && prevNextPressed == false) {
        audio.play();
        pauseImage();
    }
    else {
        let trackPlayingNext = listToPlay[0]
        if (trackPlayingNext == undefined) {
            return;
           }
        getTrackData(trackPlayingNext);
        currentTrack = "button" + trackPlayingNext;
        audio.play();
        pauseImage();
        listToPlay.shift();
        changePlayIcon(currentTrack);
} }