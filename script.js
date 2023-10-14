const RANDOM_SENTENCE_URL_API = 'https://api.quotable.io/random';
const typeDisplay = document.getElementById('type-display');
const typeInput = document.getElementById('type-input');
const timer = document.getElementById('timer');

const typeSound = new Audio('./audio/audio_typing-sound.mp3');
const typeWrongSound = new Audio('./audio/audio_wrong.mp3');
const correctSound = new Audio('./audio/audio_correct.mp3');



typeInput.addEventListener('input', () => {
    typeSound.play();
    typeSound.currentTime = 0;
    const sentenseArray = typeDisplay.querySelectorAll('span');
    const inputArray = typeInput.value.split('');

    let correct = true;
    sentenseArray.forEach((characterSpan, index) => {
        if (inputArray[index] == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        } else if (characterSpan.innerText === inputArray[index]) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        } else {
            characterSpan.classList.add('incorrect');
            characterSpan.classList.remove('correct');

            typeWrongSound.volume = 0.4;
            typeWrongSound.play();
            typeWrongSound.currentTime = 0;
            correct = false;
        }
    });
    if (correct == true) {
        correctSound.play();
        correctSound.currentTime = 0;
        RenderNextSentence();
    }
})




function GetRandomSentence() {
    return fetch(RANDOM_SENTENCE_URL_API)
        .then(response => response.json())
        .then(data => data.content);
}

async function RenderNextSentence() { 
    const sentense = await GetRandomSentence();
    typeDisplay.innerText = '';

    sentense.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        console.log(characterSpan);
        typeDisplay.appendChild(characterSpan);
    });
    typeInput.value = '';

    StartTimer();
}

let startTIme;
let originTime = 30
function StartTimer() {
    timer.innerText = originTime;
    startTIme = new Date();
    setInterval(() => {
        timer.innerText = originTime - GetTimerTime();
        if (timer.innerText <= 0) {
            RenderNextSentence();
        }
    }, 1000);
}

function GetTimerTime() {
    return Math.floor((new Date() - startTIme)/1000);
}


RenderNextSentence();
